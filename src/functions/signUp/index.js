module.exports = {
  handler: `./src/functions/signUp/handler.main`,
  name: '${self:custom.stackName}--sign-up',
  events: [
    {
      http: {
        method: 'post',
        path: '/sign-up',
      },
    },
  ],
};
