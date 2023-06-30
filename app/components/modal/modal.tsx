import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export default function Modal({ children }: any) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    setIsOpen(false);
    /* const timer = setTimeout(() => {
      navigate(-1);
    }, 300);
    return () => {
      clearTimeout(timer);
    }; */
  };

  return (
    <dialog
      style={{
        animationName: isOpen ? "slideRight" : "slideLeft",
      }}
    >
      <div
        style={{
          backgroundColor: "ghostwhite",
          zIndex: 1,
          width: "300px",
          height: "300px",
          borderRadius: "6px",
          padding: "10px",
        }}
      >
        {children}
      </div>
      <div className="opaque" onClick={handleClick}></div>
    </dialog>
  );
}
