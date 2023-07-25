import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor, ImageElement, YoutubeElement } from "../slate";

const isActive = (editor: CustomEditor, type: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
  });
  return !!match;
};

const isVoidUrl = (url: string, type: any) => {
  if (!url) return false;
  const _url = new URL(url);

  switch (type) {
    case "image":
      const image = _url.pathname.split(".").pop();
      return ["jpg", "png"].includes(image as string);
    case "youtube":
      return ["www.youtube.com", "youtu.be"].includes(_url.host);
    default:
      break;
  }
};

const insertVoid = (
  editor: CustomEditor,
  src: string,
  type: "image" | "youtube"
) => {
  /* const CustomElement: ImageElement | YoutubeElement = {
    type,
    src,
    width: 180,
    height: 180,
    float: "none",
    shape: "",
    children: [{ text: "" }],
  }; */
  Transforms.insertNodes(editor, {
    type,
    src,
    width: 180,
    height: 180,
    float: "none",
    shape: "",
    children: [{ text: "" }],
  });
};

export const RemoveVoid = () => {
  const editor = useSlate();
  return <button onClick={() => Transforms.removeNodes(editor)}>delete</button>;
};

export default function AddVoid({ type }: { type: "image" | "youtube" }) {
  const editor = useSlate();

  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === type ? true : isVoid(element);
  };

  return (
    <button
      className={isActive(editor, type) ? "active" : undefined}
      onMouseDown={() => {
        if (isActive(editor, type)) {
          Transforms.removeNodes(editor);
        } else {
          const src = window.prompt("Enter the " + type + " URL");
          if (src && !isVoidUrl(src, type)) {
            return alert("Enter a correct " + type + " url");
          }
          src && insertVoid(editor, src, type);
        }
      }}
    >
      {type.includes("image")
        ? isActive(editor, type)
          ? "deleteImage"
          : type
        : type}
    </button>
  );
}
