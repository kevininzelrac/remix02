import { NavLink } from "@remix-run/react";
//import { path } from "~/utils/path";

export default function Dropdown({ children, to, label }: any) {
  return (
    <div>
      <NavLink
        //to={path(to)}
        to={to}
        //prefetch="intent"
        className={({ isActive, isPending }) =>
          isActive ? "menu active" : "menu"
        }
      >
        {label}
      </NavLink>
      <span>{children}</span>
    </div>
  );
}
