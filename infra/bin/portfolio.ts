#!/usr/bin/env node
import { App, Validations } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { PortfolioStack } from '../lib/portfolio-stack';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
}

const app = new App();

new PortfolioStack(app, 'PortfolioStack', {
  // us-east-1: CloudFront requires its ACM certificate there; one region keeps the stack simple.
  env: { account: required('CDK_DEFAULT_ACCOUNT'), region: 'us-east-1' },
  domainName: process.env.PORTFOLIO_DOMAIN ?? 'saulhernandez.dev',
  budgetEmail: required('BUDGET_ALERT_EMAIL'),
  monthlyBudgetUsd: 5,
  description: 'Saúl Hernández portfolio: S3 + CloudFront + Route 53',
});

Validations.of(app).addPlugins(new AwsSolutionsChecks(app, { verbose: true }));
