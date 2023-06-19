import { redirect } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { signUp } from "~/appsync.server";

export let action = async ({ request }: any) => {
  const formData = await request.formData();
  await signUp({ request, formData });
  return redirect("/signin");
};

export default function SignUp() {
  const fetcher = useFetcher();
  const error = fetcher.data?.error?.name;

  return (
    <>
      <div>
        <Link to="/signin">Sign In</Link> • <span>Sign Up</span>
      </div>

      <fetcher.Form className="loginForm" method="post">
        {error && <span className="error">{error}</span>}
        <fieldset>
          <label>username</label>
          <input autoFocus type="text" name="username" />
        </fieldset>
        <fieldset>
          <label>email</label>
          <input type="text" name="email" />
        </fieldset>
        <fieldset>
          <label>Password</label>
          <input type="password" name="password" />
        </fieldset>
        <button type="submit">Sign Up</button>
      </fetcher.Form>
    </>
  );
}
