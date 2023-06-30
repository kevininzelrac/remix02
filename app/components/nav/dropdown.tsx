import { NavLink } from "@remix-run/react";
//import { path } from "~/utils/path";

export default function Dropdown({ children, to, label, type }: any) {
  return (
    <div>
      <NavLink
        //to={path(to)}
        to={to}
        /* onClick={(e) => {
          if (label === "Blog") return;
          if (type === "category") return;
          if (type === "post") return;
          e.preventDefault();
        }} */
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
