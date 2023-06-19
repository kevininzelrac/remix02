import { useLoaderData } from "@remix-run/react";
import { getIndex } from "~/appsync.server";

export const loader = async ({ request }: any) => {
  return await getIndex(request);
};

export default function Index() {
  const { label, content } = useLoaderData();
  return (
    <main>
      <h2>{label}</h2>
      <section>{content + " " + label}</section>
    </main>
  );
}
