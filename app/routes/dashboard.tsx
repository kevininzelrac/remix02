import { useFetcher, useLoaderData } from "@remix-run/react";
import { authorize } from "~/services/auth.server";

export const loader = async ({ request }: any) => {
  return await authorize(request);
};

export function ErrorBoundary({ error }: any) {
  return (
    <div>
      <h3 style={{ color: "red" }}>Something went wrong!</h3>
      <p>{error}</p>
    </div>
  );
}

export default function Dashboard() {
  const fetcher = useFetcher();
  const { user } = useLoaderData();

  return (
    <main>
      <h2>Dashboard</h2>
      <section>Bienvenue {user.name}</section>
      <fetcher.Form method="post" action="/signout">
        <button type="submit">Sign Out</button>
      </fetcher.Form>
    </main>
  );
}
