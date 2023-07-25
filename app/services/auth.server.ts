import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { json, redirect } from "@remix-run/node";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { commitSession, destroySession, getSession } from "~/sessions";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.USER_POOL_REGION,
});

export const SignIn = async ({ request }: any) => {
  const formData = await request.formData();
  const { username, password }: any = Object.fromEntries(formData);
  const params = {
    ClientId: process.env.USER_POOL_WEB_CLIENT_ID,
    UserPoolId: process.env.USER_POOL_ID,
    AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  const command = new AdminInitiateAuthCommand(params);
  try {
    const { AuthenticationResult } = await cognitoClient.send(command);
    const { IdToken, RefreshToken }: any = AuthenticationResult;
    const { name }: any = await verifyToken(IdToken);
    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", { name });
    session.set("idToken", IdToken);
    session.set("refreshToken", RefreshToken);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (err: any) {
    console.log(err);
    return json({ message: err.toString() });
  }
};

export const verifyToken = async (idToken: any) => {
  const verifier = CognitoJwtVerifier.create({
    clientId: process.env.USER_POOL_WEB_CLIENT_ID as string,
    userPoolId: process.env.USER_POOL_ID as string,
    tokenUse: "id",
  });
  try {
    return await verifier.verify(idToken);
  } catch {
    return false;
  }
};

export const RefreshToken = async (refreshToken: any) => {
  const params = {
    ClientId: process.env.USER_POOL_WEB_CLIENT_ID,
    UserPoolId: process.env.USER_POOL_ID,
    AuthFlow: "REFRESH_TOKEN_AUTH",
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };
  const command = new AdminInitiateAuthCommand(params);

  try {
    const { AuthenticationResult } = await cognitoClient.send(command);
    const { IdToken }: any = AuthenticationResult;
    return IdToken;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

export const authorize = async (request: any) => {
  const session = await getSession(request?.headers.get("Cookie"));
  if (!session.has("idToken")) throw redirect("/signin");

  const verifiedToken = await verifyToken(session.get("idToken"));
  if (!verifiedToken) {
    const idToken = await RefreshToken(session.get("refreshToken"));
    session.set("idToken", idToken);

    return {
      idToken,
      user: session.get("user"),
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    };
  }
  return {
    idToken: session.get("idToken"),
    user: session.get("user"),
  };
};
