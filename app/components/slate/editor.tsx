import { useFetcher, useLocation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import { RenderElement, RenderLeaf } from "./render";
import Toolbar from "./components/toolbar";
import Shortcuts from "./shortcuts";

export default function TextEditor({ data }: any) {
  const { pathname } = useLocation();
  const path = pathname.replace("/Edit", "");
  const fetcher = useFetcher();

  const [isDraft, setIsDraft] = useState("");
  useEffect(() => {
    setIsDraft(localStorage.getItem("slate" + path) as string);
  }, []);

  const initialValue = useMemo(() => {
    if (typeof window !== "undefined" && localStorage.getItem("slate" + path))
      return JSON.parse(localStorage.getItem("slate" + path) as string);
    else {
      if (data?.content?.includes("type")) {
        return JSON.parse(data.content);
      } else {
        return [
          {
            type: "paragraph",
            textAlign: "left",
            children: [{ text: data?.content }],
          },
        ];
      }
    }
  }, []);

  const [editor] = useState(() => withReact(withHistory(createEditor())));

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );

        if (isAstChange) {
          JSON.stringify(value) !== data.content
            ? (localStorage.setItem("slate" + path, JSON.stringify(value)),
              setIsDraft(localStorage.getItem("slate" + path) as string))
            : (localStorage.removeItem("slate" + path), setIsDraft(""));
        }
      }}
    >
      {isDraft && (
        <fetcher.Form method="post">
          <input type="hidden" name="SK" value={data.SK} />
          <input
            type="hidden"
            name="content"
            value={localStorage.getItem("slate" + path) as string}
          />

          {fetcher.state === "idle" && <button type="submit">save</button>}
          {fetcher.state === "submitting" && <p>submitting</p>}
          {fetcher.state === "loading" &&
            fetcher.data?.ok &&
            (localStorage.removeItem("slate" + path),
            setIsDraft(""),
            (<p>loading</p>))}
        </fetcher.Form>
      )}
      <Toolbar />

      <Editable
        autoFocus
        renderElement={RenderElement}
        renderLeaf={RenderLeaf}
        onKeyDown={(e) => {
          Shortcuts(e, editor);
        }}
        style={isDraft ? { border: "1px dashed red" } : {}}
      />
    </Slate>
  );
}
