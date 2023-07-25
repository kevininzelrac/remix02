import {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
  defer,
  json,
} from "@remix-run/node";
import {
  Await,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { Suspense } from "react";
import { API } from "aws-amplify";
import TextEditor from "~/components/slate/editor";
import updatePost from "../graphQL/mutation/updatePost.gql";
import { authorize } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { idToken, user, headers }: any = await authorize(request);
  return defer(
    { user },
    {
      headers,
    }
  );
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const { idToken, user, headers }: any = await authorize(request);
  const formData = await request.formData();

  try {
    await API.graphql({
      query: updatePost,
      variables: Object.fromEntries(formData),
      authMode: "AWS_LAMBDA",
      authToken: idToken,
    });
    return json({ ok: true }, { headers });
  } catch (error) {
    return console.log(error);
  }
};

export default function Edit() {
  const { user } = useLoaderData();
  const { state, pathname } = useLocation();
  const navigation = useNavigation();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div className="loader"></div>}>
      <Await resolve={user} errorElement={<p>Error loading Page !</p>}>
        {({ name }) => (
          <main
            style={{
              animationName:
                navigation.state === "idle" ? "slideDown" : "slideUp",
            }}
          >
            {state?.data && (
              <>
                <h2>{state?.data.label}</h2>
                <button
                  onClick={() => {
                    navigate(state.pathname, {
                      state: { pathname },
                    });
                  }}
                >
                  Exit
                </button>
                <section className="slate">
                  <TextEditor data={state?.data} readOnly={false} />
                </section>
              </>
            )}
          </main>
        )}
      </Await>
    </Suspense>
  );
}
