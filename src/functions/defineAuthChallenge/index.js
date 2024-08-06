module.exports = {
  handler: `./src/functions/defineAuthChallenge/handler.main`,
  name: '${self:custom.stackName}--define-auth-challenge',
  events: [
    {
      cognitoUserPool: {
        pool: '${self:custom.stackName}--EndUserCognitoUserPoolV2',
        trigger: 'DefineAuthChallenge',
        existing: true,
      },
    },
  ],
};

