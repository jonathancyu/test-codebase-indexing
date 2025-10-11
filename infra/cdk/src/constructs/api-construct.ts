import { Construct } from 'constructs';
import { ApiGatewayConstruct } from '@8090-inc/api-gateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { DockerImageFunction } from 'aws-cdk-lib/aws-lambda';
import { GatewayResponse, ResponseType, AuthorizationType } from 'aws-cdk-lib/aws-apigateway';

export interface ApiConstructProps {
  projectName: string;
  environment: string;
  cognitoUserPool: IUserPool;
  lambdaHandler: DockerImageFunction;
  allowedOrigins: string[];
}

export class ApiConstruct extends Construct {
  public readonly api: ApiGatewayConstruct;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    // Create API Gateway with all endpoints
    this.api = new ApiGatewayConstruct(this, 'Api', {
      apiName: `${props.projectName}-${props.environment}-api`,
      description: `API Gateway for ${props.environment} environment`,
      cognitoUserPool: props.cognitoUserPool,
      defaultAuthorizationType: AuthorizationType.COGNITO,
      enableCors: true,
      corsAllowOrigins: props.allowedOrigins,
      endpoints: [
        {
          path: '{proxy+}',
          method: 'ANY',
          handler: props.lambdaHandler,
          requestParameters: {
            'method.request.path.proxy': true,
          },
        },
      ],
    });

    // Add Gateway Responses for CORS error handling using the first allowed origin
    const corsHeaders = {
      'Access-Control-Allow-Origin': `'${props.allowedOrigins[0]}'`,
      'Access-Control-Allow-Headers':
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
      'Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
    };

    // Handle 4XX errors (including 401 Unauthorized)
    new GatewayResponse(this, 'GatewayResponse4XX', {
      restApi: this.api.api,
      type: ResponseType.DEFAULT_4XX,
      responseHeaders: corsHeaders,
    });
  }

  public get url() {
    return this.api.api.url;
  }
}
