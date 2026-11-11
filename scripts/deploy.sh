#!/usr/bin/env bash
# Deploys the static site to S3 + CloudFront.
# Needs: an active SSO session (aws sso login --profile "$AWS_PROFILE") and the CDK stack already deployed.
set -euo pipefail

readonly STACK_NAME="PortfolioStack"
readonly REGION="us-east-1"
readonly OUT_DIR="site/out"

cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck source=/dev/null
  source .env
  set +a
fi

: "${AWS_PROFILE:?Set AWS_PROFILE (see .env.example)}"
export AWS_PROFILE

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" != "main" ]]; then
  echo "Deploy only from main (current: $branch)." >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash first." >&2
  exit 1
fi

echo "› Checking AWS session"
aws sts get-caller-identity --query Arn --output text

echo "› Running checks"
npm run check
npm audit --omit=dev --audit-level=high

stack_output() {
  aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
bucket="$(stack_output BucketName)"
distribution_id="$(stack_output DistributionId)"
if [[ -z "$bucket" || "$bucket" == "None" || -z "$distribution_id" || "$distribution_id" == "None" ]]; then
  echo "Stack outputs not found. Run: npm run cdk -- deploy" >&2
  exit 1
fi

echo "› Uploading hashed assets (immutable cache)"
aws s3 sync "$OUT_DIR/_next/static" "s3://$bucket/_next/static" \
  --cache-control "public, max-age=31536000, immutable"

echo "› Uploading pages and files (revalidate on every request)"
aws s3 sync "$OUT_DIR" "s3://$bucket" --delete \
  --exclude "_next/static/*" \
  --cache-control "public, max-age=0, must-revalidate"

echo "› Invalidating CloudFront"
aws cloudfront create-invalidation --distribution-id "$distribution_id" --paths "/*" \
  --query Invalidation.Id --output text

echo "✓ Deployed $(git rev-parse --short HEAD) to $(stack_output SiteUrl)"
