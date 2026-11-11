import * as path from 'node:path';
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  aws_budgets as budgets,
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_s3 as s3,
  Validations,
  type StackProps,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export interface PortfolioStackProps extends StackProps {
  /** Apex domain, already registered in Route 53 (its hosted zone exists). */
  readonly domainName: string;
  readonly budgetEmail: string;
  readonly monthlyBudgetUsd: number;
}

/** Security headers sent with every response. The page CSP (script hashes) lives in each HTML file. */
const HEADER_CSP = "frame-ancestors 'none'; base-uri 'self'; form-action 'none'; object-src 'none'";

export class PortfolioStack extends Stack {
  constructor(scope: Construct, id: string, props: PortfolioStackProps) {
    super(scope, id, props);
    const { domainName } = props;
    const wwwName = `www.${domainName}`;

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName });

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(7) }],
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // CloudFront only accepts certificates from us-east-1; the stack is pinned there in bin/.
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName,
      subjectAlternativeNames: [wwwName],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    const viewerRequest = new cloudfront.Function(this, 'ViewerRequest', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, '..', 'functions', 'viewer-request.js'),
      }),
      comment: 'www → apex, language redirect on /, directory index',
    });

    const headers = new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeaders', {
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: Duration.days(730),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
        contentSecurityPolicy: { contentSecurityPolicy: HEADER_CSP, override: true },
      },
      customHeadersBehavior: {
        customHeaders: [
          {
            header: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
            override: true,
          },
        ],
      },
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      domainNames: [domainName, wwwName],
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        responseHeadersPolicy: headers,
        functionAssociations: [
          { function: viewerRequest, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      // Without s3:ListBucket a missing key is a 403; both map to the bilingual 404 page.
      errorResponses: [403, 404].map((httpStatus) => ({
        httpStatus,
        responseHttpStatus: 404,
        responsePagePath: '/404.html',
        ttl: Duration.minutes(5),
      })),
    });

    for (const recordName of [domainName, wwwName]) {
      const target = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
      const idPart = recordName === domainName ? 'Apex' : 'Www';
      new route53.ARecord(this, `${idPart}A`, { zone, recordName, target });
      new route53.AaaaRecord(this, `${idPart}Aaaa`, { zone, recordName, target });
    }

    new budgets.CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'portfolio-monthly',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: props.monthlyBudgetUsd, unit: 'USD' },
      },
      notificationsWithSubscribers: [
        { type: 'ACTUAL', threshold: 80 },
        { type: 'FORECASTED', threshold: 100 },
      ].map(({ type, threshold }) => ({
        notification: {
          notificationType: type,
          comparisonOperator: 'GREATER_THAN',
          threshold,
          thresholdType: 'PERCENTAGE',
        },
        subscribers: [{ subscriptionType: 'EMAIL', address: props.budgetEmail }],
      })),
    });

    new CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new CfnOutput(this, 'SiteUrl', { value: `https://${domainName}` });

    const acknowledgements: readonly [Construct, string, string][] = [
      [bucket, 'AwsSolutions-S1', 'Static public content; access logs not needed (SECURITY.md).'],
      [distribution, 'AwsSolutions-CFR1', 'Portfolio is meant to be reachable worldwide.'],
      [
        distribution,
        'AwsSolutions-CFR2',
        'Static site, no origin compute; WAF cost not justified (SECURITY.md).',
      ],
      [
        distribution,
        'AwsSolutions-CFR3',
        'CloudFront access logs not enabled by decision (SECURITY.md).',
      ],
    ];
    for (const [construct, id, reason] of acknowledgements) {
      Validations.of(construct).acknowledge({ id, reason });
    }
  }
}
