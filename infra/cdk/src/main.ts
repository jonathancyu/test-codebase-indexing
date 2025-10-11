#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { getConfig } from './config';
import { env } from 'process';
import { CognitoStack } from './stacks/cognito-stack';
import { InfraStack } from './stacks/infra-stack';

const app = new App();
const config = getConfig();

const environments = ['dev', 'stage', 'prod'];
const currentEnv = env.ENVIRONMENT || 'dev';

if (environments.includes(currentEnv)) {
  const stackEnv = {
    env: {
      account: env.CDK_DEFAULT_ACCOUNT,
      region: config.region,
    },
    environment: currentEnv,
  };

  // Deploy Cognito Stack first
  new CognitoStack(app, `${config.projectName}-cognito-${currentEnv}`, {
    stackName: `${config.projectName}-cognito-${currentEnv}`,
    ...stackEnv,
    ...config,
  });

  // Deploy Infrastructure Stack with Cognito outputs
  new InfraStack(app, `${config.projectName}-infra-${currentEnv}`, {
    stackName: `${config.projectName}-infra-${currentEnv}`,
    ...stackEnv,
    ...config,
  });
}

app.synth();
