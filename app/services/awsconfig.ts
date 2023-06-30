function isBrowser() {
  return typeof window !== "undefined";
}

const awsconfig = {
  aws_appsync_region: isBrowser()
    ? window.env.AWS_REGION
    : process.env.AWS_REGION,
  aws_appsync_graphqlEndpoint: isBrowser()
    ? window.env.AWS_APPSYNC_GRAPHQLENDPOINT
    : process.env.AWS_APPSYNC_GRAPHQLENDPOINT,
  aws_appsync_apiKey: isBrowser()
    ? window.env.AWS_APPSYNC_KEY
    : process.env.AWS_APPSYNC_KEY,
  aws_appsync_authenticationType: "API_KEY",

  Auth: {
    authenticationFlowType: "USER_PASSWORD_AUTH",
    region: isBrowser() ? window.env.AWS_REGION : process.env.AWS_REGION,
    userPoolId: isBrowser()
      ? window.env.USER_POOL_ID
      : process.env.USER_POOL_ID,
    userPoolWebClientId: isBrowser()
      ? window.env.USER_POOL_WEB_CLIENT_ID
      : process.env.USER_POOL_WEB_CLIENT_ID,
    //cookieStorage: {
    //  domain: "localhost",
    //  path: "/",
    //  MaxAge: 157680000,
    //  sameSite: "strict",
    //  secure: process.env.NODE_ENV === "production",
    //httpOnly: true,
    //},
  },
  ssr: true,
};

export default awsconfig;
