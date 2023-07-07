import Button from "./button";
import Dropdown from "./dropdown";

const Recursive = ({ data, parent = "" }: any) => {
  return data?.map(({ label, type, children }: any) =>
    children?.length ? (
      <Dropdown key={label} to={parent + label} label={label} type={type}>
        <Recursive data={children} parent={parent + label + "/"} />
      </Dropdown>
    ) : (
      <Button key={label} to={parent + label}>
        {label}
      </Button>
    )
  );
};

export default function Nav({ data, user }: any) {
  return (
    <nav>
      <Recursive data={data} user={user} />
      {user ? (
        <>
          <Dropdown to={user.name} label={user.name}>
            <Button to="Dashboard">Dashboard</Button>
            <Button to="Messenger">Messenger</Button>
            <Button to="Pay">Pay</Button>
          </Dropdown>
        </>
      ) : (
        <Button to="signin">Sign In</Button>
      )}
    </nav>
  );
}

/* const ImRecursive = (data: any, target: any) =>
  data
    .filter(({ category }: any) => category == target)
    .map(({ label, type }: any) => ({
      label,
      type,
      children: ImRecursive(data, label),
    }));
*/
/* data.sort((a: any, b: any) =>
  a.date > b.date ? 1 : b.date > a.date ? -1 : 0
); */
//const filtered = ImRecursive(sorted, "");
