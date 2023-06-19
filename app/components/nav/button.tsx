import { NavLink } from "@remix-run/react";
//import { path } from "~/utils/path";

export default function Button({ children, to, state }: any) {
  return (
    <NavLink
      //to={to === "Home" ? "/" : path(to)}
      to={to === "Home" ? "/" : to}
      state={state}
      prefetch="intent"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      {children}
    </NavLink>
  );
}
