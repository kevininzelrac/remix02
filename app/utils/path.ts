export const path = (target: any) => {
  return (
    target
      //.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ +/g, "_")
  );
};
