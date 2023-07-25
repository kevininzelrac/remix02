import BlockButton from "./blocks";
import { ToggleLink } from "./links";
import MarkButton from "./marks";
import TextAlign from "./textAlign";
import AddVoid from "./voids";
import { UndoButton, RedoButton } from "./history";

export default function Toolbar() {
  return (
    <div className="toolbar">
      <UndoButton />
      <RedoButton />
      <br />
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="code" />
      <MarkButton type="underline" />
      <br />
      <BlockButton type="h2" />
      <BlockButton type="h3" />
      <BlockButton type="h4" />
      <br />
      <BlockButton type="paragraph" />
      <BlockButton type="blockquote" />
      <BlockButton type="ol" />
      <BlockButton type="ul" />
      <br />
      <TextAlign textAlign="left" />
      <TextAlign textAlign="center" />
      <TextAlign textAlign="right" />
      <TextAlign textAlign="justify" />
      <br />
      <ToggleLink />
      <AddVoid type="image" />
      <AddVoid type="youtube" />
    </div>
  );
}
