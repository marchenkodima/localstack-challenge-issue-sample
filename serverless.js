const functions = require('./src/functions');

const config = {
  service: 'challenge-issue-sample',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-localstack',
  ],
  provider: {
    name: 'aws',
    stage: '${self:custom.stage}',
    region: '${self:custom.region}',
    stackName: '${self:custom.stackName}',
    runtime: 'nodejs18.x',
    timeout: 30,
    environment: {
      STAGE: '${self:custom.stage}',
      END_USER_COGNITO_USER_POOL: {
        Ref: 'EndUserCognitoUserPoolV2',
      },
      END_USER_COGNITO_USER_POOL_CLIENT: {
        Ref: 'EndUserCognitoUserPoolClientV2',
      },
    },
    iam: {
      role: {
        name: '${self:custom.stackName}--execution-role',
        statements: [
          {
            Effect: "Allow",
            Action: "*",
            Resource: "*",
          },
        ],
      },
    },
  },
  custom: {
    stage: "${env:STAGE, 'e2e'}",
    stackName: '${self:custom.stage}--challenge-issue-sample',
    region: "us-west-2",
    localstack: {
      host: 'http://localhost',
      stages: [
          'e2e',
      ],
    },
  },
  resources: {
    Resources: {
      EndUserCognitoUserPoolV2: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: '${self:custom.stackName}--EndUserCognitoUserPoolV2',
          AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: false,
          },
          AliasAttributes: ['email', 'phone_number'],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 8,
              RequireLowercase: false,
              RequireNumbers: true,
              RequireSymbols: true,
              RequireUppercase: false,
            },
          },
          Schema: [
            {
              AttributeDataType: 'String',
              Mutable: true,
              Name: 'email',
              Required: false,
            },
            {
              AttributeDataType: 'String',
              Mutable: true,
              Name: 'name',
              Required: true,
            },
            {
              AttributeDataType: 'String',
              Mutable: true,
              Name: 'phone_number',
              Required: true,
            },
          ],
        },
      },
      EndUserCognitoUserPoolClientV2: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          UserPoolId: {
            Ref: 'EndUserCognitoUserPoolV2',
          },
          ClientName: '${self:custom.stackName}--EndUserCognitoUserPoolClientV2',
          ExplicitAuthFlows: [
            'ALLOW_ADMIN_USER_PASSWORD_AUTH',
            'ALLOW_REFRESH_TOKEN_AUTH',
            'ALLOW_CUSTOM_AUTH',
            'ALLOW_USER_SRP_AUTH',
            'ALLOW_USER_PASSWORD_AUTH',
          ],
          GenerateSecret: false,
          RefreshTokenValidity: '7',
          TokenValidityUnits: { RefreshToken: 'days' },
        },
      },
    },
  },
  functions,
};


module.exports = config;