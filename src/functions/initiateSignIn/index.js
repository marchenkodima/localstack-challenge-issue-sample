module.exports = {
  handler: `./src/functions/initiateSignIn/handler.main`,
  name: '${self:custom.stackName}--initiate-sign-in',
  events: [
    {
      http: {
        method: 'post',
        path: '/initiate-sign-in',
      },
    },
  ],
};
