# Infra Auth

The Cognito resources are created using [CognitoResources](https://github.com/8090-inc/constructs/tree/main/packages/cognito)

In the CDK, this is represnted by this construct in the `./infra/stacks/cognito-stack.ts`:

```typescript
this.cognitoResources = new CognitoResources(this, 'CognitoResources', {
    resourcePrefix: `${props.projectName}-${props.environment}`,
    userPoolName: `${props.projectName}-${props.environment}-user-pool`,
});
```

This will create a [User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html) that will be used as an identity provider.  

Once this is created, a [User Pool Client](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html) is created in `./infra/cdk/constructs/auth-construct.ts` in the main `./infra/cdk/stacks/infra-stack.ts`.

```typescript
this.cognitoUserPoolClient = new CognitoUserPoolClient(this, 'Cognito', {
    resourcePrefix: props.resourcePrefix,
    userPool: props.userPool,
    oauthConfig: {
    callbackUrls: props.callbackUrls,
    logoutUrls: props.logoutUrls,
    },
});
```

The Cognito configuration parameters are included in the static site build and deployed to the S3 bucket as `config.json` as part of the `./infra/cdk/stacks/infra-stack.ts`.  

```typescript
new StaticSiteDeployment(this, 'StaticSiteDeploy', {
    infrastructure,
    cognitoConfiguration: {
    userPoolId: cognitoUserPool.userPoolId,
    userPoolClientId: auth.userPoolClient.userPoolClientId,
    identityPoolId: auth.identityPool.ref,
    domain: infrastructure.distribution.distributionDomainName,
    region: Stack.of(this).region,
    },
    appPath: '../../frontend',
    additionalConfig: {
    apiUrl: api.url,
    },
});
```

