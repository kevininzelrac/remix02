import type { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { SignIn } from "~/services/auth.server";

export const action = async ({ request }: ActionArgs) => {
  return await SignIn({ request });
};

export default function Login() {
  return (
    <>
      <Form method="POST">
        <div>
          <p>Please sign in</p>
        </div>
        <label>
          Username: <input type="text" name="username" />
        </label>
        <label>
          Password: <input type="password" name="password" />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
