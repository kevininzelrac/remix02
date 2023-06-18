import { useLoaderData, useNavigation } from "@remix-run/react";
import { getPage } from "~/appsync.server";
import styles from "~/styles/page.css";

export let links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = async ({ request, params }: any) => {
  return await getPage({ request, params });
};

export default function Page() {
  const { label, content } = useLoaderData();
  const navigation = useNavigation();
  return (
    <main
      style={{
        animationName: navigation.state === "idle" ? "slideDown" : "slideUp",
      }}
    >
      <h2>{label}</h2>
      <section>{content + " " + label}</section>
    </main>
  );
}
