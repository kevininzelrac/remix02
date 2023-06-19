import { redirect } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { signIn } from "~/appsync.server";

export const action = async ({ request }: any) => {
  const formData = await request.formData();

  const { headers }: any = await signIn({ request, formData });
  return redirect("/", { headers });
};

export default function SignIn() {
  const fetcher = useFetcher();
  const error = fetcher.data?.error;
  //const name = fetcher?.data?.attributes?.name;

  return (
    <>
      <div>
        <span>Sign In</span> • <Link to="/signup">Sign Up</Link>
      </div>

      <fetcher.Form method="post">
        {error && <span className="error">{error}</span>}
        <fieldset>
          <label>email</label>
          <input autoFocus type="text" name="username" />
        </fieldset>
        <fieldset>
          <label>Password</label>
          <input type="password" name="password" />
        </fieldset>
        <button type="submit">Sign In</button>
      </fetcher.Form>
    </>
  );
}
