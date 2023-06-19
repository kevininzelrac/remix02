import { redirect } from "@remix-run/node";
import { signOut } from "~/appsync.server";

export const action = async ({ request }: any) => {
  const { headers } = await signOut({ request });
  return redirect("/", { headers });
};

export default function SignOut() {
  return <span>vous allez bientôt être redirigé...</span>;
}
