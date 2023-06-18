const awsconfig = {
  aws_appsync_region: process.env.AWS_REGION,
  aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQLENDPOINT,
  aws_appsync_apiKey: process.env.AWS_APPSYNC_KEY,
  aws_appsync_authenticationType: "API_KEY",

  Auth: {
    authenticationFlowType: "USER_PASSWORD_AUTH",
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  },
  ssr: true,
};

export default awsconfig;
