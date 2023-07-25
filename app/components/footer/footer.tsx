import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer>
      <p>Web & Mobile App - built by Kevin Inzelrac</p>
      <small>
        <Link to="policy">Politique de confidentialité</Link>
      </small>
    </footer>
  );
}
