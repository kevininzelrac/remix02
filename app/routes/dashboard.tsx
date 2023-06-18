import { redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

export const loader = async ({ context }: any) => {
  const { user } = context;

  if (!user) {
    return redirect("/signin");
  }
  return user;
};

export default function Dashboard() {
  const fetcher = useFetcher();
  const user = useLoaderData();

  return (
    <>
      <h2>Dashboard</h2>
      <section>Bienvenue {user.name}</section>
      <fetcher.Form method="post" action="/signout">
        <button type="submit">Sign Out</button>
      </fetcher.Form>
    </>
  );
}
