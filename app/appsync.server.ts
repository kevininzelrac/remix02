import { withSSRContext } from "aws-amplify";

export const getUser = async ({ request }: any) => {
  const req = {
    headers: {
      cookie: request.headers.get("Cookie"),
    },
  };
  const { Auth } = withSSRContext({ req });
  try {
    const {
      idToken: {
        payload: { name, email },
      },
      accessToken: { jwtToken },
    } = await Auth.currentSession();
    return { user: { name, email }, jwtToken };
  } catch (e) {
    console.log(e);
    return { user: "", jwtToken: "" };
  }
};

export const signUp = async ({ request, formData }: any) => {
  const { username, email, password }: any = Object.fromEntries(formData);
  const SSR = withSSRContext({ req: request });
  const { user } = await SSR.Auth.signUp({
    username: email,
    password,
    attributes: {
      name: username,
      email,
    },
  });
  return user;
};

export const signIn = async ({ request, formData }: any) => {
  const { username, password }: any = Object.fromEntries(formData);

  const SSR = withSSRContext({ req: request });
  const {
    pool: {
      storage: { store },
    },
  } = await SSR.Auth.signIn(username, password);

  const headers = new Headers();
  Object.keys(store).forEach((key) =>
    headers.append(
      "Set-Cookie",
      `${key}=${store[key]}; Max-Age=3600; httpOnly; Path=/; SameSite=Strict`
    )
  );
  return { headers };
};

export const signOut = async ({ request }: any) => {
  const SSR = withSSRContext({ req: request });
  /********** PARSE COOKIE *************/
  const cookie: string | null = request.headers.get("Cookie");
  const pairs: any = cookie?.split(";");
  var store: any = {};
  for (var i = 0; i < pairs.length; i++) {
    var key = pairs[i].split("=");
    store[key[0].trim()] = key[1];
  }

  const headers = new Headers();
  Object.keys(store).forEach((key) => {
    headers.append(
      "Set-Cookie",
      `${key}=""; Max-Age=1; httpOnly; Path=/; SameSite=Strict`
    );
  });

  await SSR.Auth.signOut();
  return { headers };
};

const getAllPosts = `
  query MyQuery {
    getAllPosts {
      posts {
        author
        category
        content
        date
        id
        label
        type
      }
    }
  }
`;

export const getNav = async ({ request }: any) => {
  const SSR = withSSRContext({ req: request });
  const {
    data: {
      getAllPosts: { posts },
    },
  } = await SSR.API.graphql({
    query: getAllPosts,
  });
  return posts;
};

const actualPost = `
query getPost ($label: ID!){
  getPost(label: $label) {
    label
    content
  }
}
`;

export const getIndex = async ({ request }: any) => {
  const SSR = withSSRContext({ req: request });
  const {
    data: { getPost },
  } = await SSR.API.graphql({
    query: actualPost,
    variables: { label: "Home" },
  });
  return getPost;
};

export const getPage = async ({ request, params }: any) => {
  const SSR = withSSRContext({ req: request });
  const {
    data: { getPost },
  } = await SSR.API.graphql({
    query: actualPost,
    variables: { label: params.page },
  });
  return getPost;
};

const userMessages = `
  query MyQuery($from: String!) {
    getAllMessages(from: $from) {
      messages {
        id
        date
        from
        to
        message
        status
      }
    }
  }
`;

export const getUserMessages = async ({ request, user, jwtToken }: any) => {
  const SSR = withSSRContext({ req: request });
  const {
    data: {
      getAllMessages: { messages },
    },
  } = await SSR.API.graphql({
    query: userMessages,
    variables: { from: user.name },
    authMode: "AWS_LAMBDA",
    //authToken: (await SSR.Auth.currentSession()).getAccessToken().getJwtToken(),
    authToken: jwtToken,
  });

  /* const {
    data: {
      getAllMessages: { messages },
    },
  } = await client.query({
    query: userMessages,
    variables: { from: user.name },
  }); */

  messages.sort((a: any, b: any) =>
    a.date > b.date ? 1 : b.date > a.date ? -1 : 0
  );

  return {
    messages,
  };
};

const newMessage = `
  mutation AddMessage(
    $from: String!
    $to: String!
    $message: String!
  ) {
    addMessage(
      from: $from
      to: $to
      message: $message
    ) {
      id
      from
      to
      date
      message
      status
    }
  }
`;
export let addMessage = async ({ request, formData, jwtToken }: any) => {
  const SSR = withSSRContext({ req: request });
  const { data } = await SSR.API.graphql({
    query: newMessage,
    variables: Object.fromEntries(formData),
    authMode: "AWS_LAMBDA",
    //authToken: (await SSR.Auth.currentSession()).getAccessToken().getJwtToken(),
    authToken: jwtToken,
  });
  return data;
};
