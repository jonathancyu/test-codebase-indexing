import { Construct } from 'constructs';
import { CognitoUserPoolClient } from '@8090-inc/cognito';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

export interface AuthConstructProps {
  resourcePrefix: string;
  userPool: IUserPool;
  callbackUrls: string[];
  logoutUrls: string[];
}

export class AuthConstruct extends Construct {
  public readonly cognitoUserPoolClient: CognitoUserPoolClient;

  constructor(scope: Construct, id: string, props: AuthConstructProps) {
    super(scope, id);

    this.cognitoUserPoolClient = new CognitoUserPoolClient(this, 'Cognito', {
      resourcePrefix: props.resourcePrefix,
      userPool: props.userPool,
      oauthConfig: {
        callbackUrls: props.callbackUrls,
        logoutUrls: props.logoutUrls,
      },
    });
  }

  public get userPoolClient() {
    return this.cognitoUserPoolClient.userPoolClient;
  }

  public get identityPool() {
    return this.cognitoUserPoolClient.identityPool;
  }
}
