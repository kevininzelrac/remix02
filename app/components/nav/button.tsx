import { NavLink, useLocation } from "@remix-run/react";

export default function Button({ children, to }: any) {
  let { pathname } = useLocation();
  return (
    <NavLink
      to={to === "Home" ? "/" : to}
      state={pathname}
      prefetch="intent"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      {children}
    </NavLink>
  );
}
