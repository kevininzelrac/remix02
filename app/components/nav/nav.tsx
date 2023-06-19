import Button from "./button";
import Dropdown from "./dropdown";

export default function Nav({ data, user }: any) {
  const ImRecursive = (data: any, target: any) =>
    data
      .filter(({ category }: any) => category == target)
      .map(({ label, type }: any) => ({
        label,
        type,
        children: ImRecursive(data, label),
      }));

  const sorted = data.sort((a: any, b: any) =>
    a.date > b.date ? 1 : b.date > a.date ? -1 : 0
  );
  const filtered = ImRecursive(sorted, "");

  return (
    <nav>
      <Recursive data={filtered} />
      {user ? (
        <>
          <Dropdown to={user.name} label={user.name}>
            <Button to="dashboard">Dashboard</Button>
            <Button to="messenger">Messenger</Button>
            <Button to="pay">Pay</Button>
          </Dropdown>
        </>
      ) : (
        <Button to="signin">Sign In</Button>
      )}
    </nav>
  );
}

const Recursive = ({ data, parent = "" }: any) => {
  return data.map(({ label, children }: any) =>
    children.length ? (
      <Dropdown key={label} to={parent + label} label={label}>
        <Recursive data={children} parent={parent + label + "/"} />
      </Dropdown>
    ) : (
      <Button key={label} to={parent + label}>
        {label}
      </Button>
    )
  );
};
