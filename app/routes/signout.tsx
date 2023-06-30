import { ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getSession, destroySession } from "../sessions";

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/signin", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function SignOut() {
  return (
    <>
      <p>Are you sure you want to log out?</p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </>
  );
}
