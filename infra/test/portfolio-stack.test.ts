import { App, Validations } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks } from 'cdk-nag';
import { beforeAll, describe, expect, it } from 'vitest';
import { PortfolioStack } from '../lib/portfolio-stack';

const ACCOUNT = '123456789012';
const DOMAIN = 'saulhernandez.dev';

function buildApp() {
  const app = new App({
    context: {
      [`hosted-zone:account=${ACCOUNT}:domainName=${DOMAIN}:region=us-east-1`]: {
        Id: '/hostedzone/Z0000000TEST',
        Name: `${DOMAIN}.`,
      },
    },
  });
  const stack = new PortfolioStack(app, 'PortfolioStack', {
    env: { account: ACCOUNT, region: 'us-east-1' },
    domainName: DOMAIN,
    budgetEmail: 'alerts@example.com',
    monthlyBudgetUsd: 5,
  });
  return { app, stack };
}

describe('PortfolioStack', () => {
  let template: Template;

  beforeAll(() => {
    template = Template.fromStack(buildApp().stack);
  });

  it('keeps the bucket private, encrypted, versioned and SSL-only', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      VersioningConfiguration: { Status: 'Enabled' },
      BucketEncryption: Match.anyValue(),
      LifecycleConfiguration: {
        Rules: [Match.objectLike({ NoncurrentVersionExpiration: { NoncurrentDays: 7 } })],
      },
    });
    template.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Retain' });
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Deny',
            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
          }),
        ]),
      },
    });
  });

  it('serves through CloudFront with OAC, HTTPS only and modern TLS', () => {
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        Aliases: [DOMAIN, `www.${DOMAIN}`],
        HttpVersion: 'http2and3',
        ViewerCertificate: Match.objectLike({ MinimumProtocolVersion: 'TLSv1.2_2021' }),
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: 'redirect-to-https',
          Compress: true,
          FunctionAssociations: [Match.objectLike({ EventType: 'viewer-request' })],
        }),
        CustomErrorResponses: [
          Match.objectLike({ ErrorCode: 403, ResponseCode: 404, ResponsePagePath: '/404.html' }),
          Match.objectLike({ ErrorCode: 404, ResponseCode: 404, ResponsePagePath: '/404.html' }),
        ],
      }),
    });
  });

  it('sends the security headers', () => {
    template.hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: Match.objectLike({
        SecurityHeadersConfig: Match.objectLike({
          StrictTransportSecurity: Match.objectLike({
            AccessControlMaxAgeSec: 63072000,
            IncludeSubdomains: true,
            Preload: true,
          }),
          ContentTypeOptions: { Override: true },
          FrameOptions: { FrameOption: 'DENY', Override: true },
          ReferrerPolicy: { ReferrerPolicy: 'strict-origin-when-cross-origin', Override: true },
          ContentSecurityPolicy: Match.objectLike({
            ContentSecurityPolicy: Match.stringLikeRegexp("frame-ancestors 'none'"),
          }),
        }),
        CustomHeadersConfig: {
          Items: [Match.objectLike({ Header: 'Permissions-Policy' })],
        },
      }),
    });
  });

  it('uses a DNS-validated certificate for apex and www', () => {
    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: DOMAIN,
      SubjectAlternativeNames: [`www.${DOMAIN}`],
      ValidationMethod: 'DNS',
    });
  });

  it('points apex and www at CloudFront over IPv4 and IPv6', () => {
    template.resourceCountIs('AWS::Route53::RecordSet', 4);
  });

  it('alerts by email past the USD 5 budget', () => {
    template.hasResourceProperties('AWS::Budgets::Budget', {
      Budget: Match.objectLike({ BudgetLimit: { Amount: 5, Unit: 'USD' }, TimeUnit: 'MONTHLY' }),
      NotificationsWithSubscribers: Match.arrayWith([
        Match.objectLike({
          Subscribers: [{ SubscriptionType: 'EMAIL', Address: 'alerts@example.com' }],
        }),
      ]),
    });
  });

  it('exports the outputs the deploy script reads', () => {
    for (const key of ['BucketName', 'DistributionId', 'SiteUrl']) {
      expect(Object.keys(template.findOutputs(key))).toHaveLength(1);
    }
  });

  it('passes cdk-nag AwsSolutions with only acknowledged findings', () => {
    const { app } = buildApp();
    Validations.of(app).addPlugins(new AwsSolutionsChecks(app));
    expect(() => app.synth()).not.toThrow();
  });
});
