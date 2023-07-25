import { useLocation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import { RenderElement, RenderLeaf } from "./render";

export default function ReadOnly({ data }: any) {
  const { pathname } = useLocation();
  const path = pathname.replace("/Edit", "");

  const [isDraft, setIsDraft] = useState("");
  useEffect(() => {
    setIsDraft(localStorage.getItem("slate" + path) as string);
  }, []);

  const initialValue = useMemo(() => {
    if (typeof window !== "undefined" && localStorage.getItem("slate" + path))
      return JSON.parse(localStorage.getItem("slate" + path) as string);
    else {
      if (data?.includes("type")) return JSON.parse(data);
      else
        return [
          {
            type: "paragraph",
            textAlign: "left",
            children: [{ text: data }],
          },
        ];
    }
  }, []);

  const [editor] = useState(() => withReact(withHistory(createEditor())));

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        readOnly={true}
        renderElement={RenderElement}
        renderLeaf={RenderLeaf}
        style={isDraft ? { border: "1px dashed red" } : {}}
      />
    </Slate>
  );
}
