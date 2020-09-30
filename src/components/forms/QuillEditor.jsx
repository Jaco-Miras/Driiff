import "quill-mention";
import React, { forwardRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import {useTranslation} from "../hooks";

// const { _t } = useTranslation();

// const dictionary = {
//   globalTextInputPlaceholder: _t("PLACEHOLDER.GLOBAL_TEXT_INPUT", "Write great things here..."),
// };

const QuillEditor = forwardRef((props, ref) => {
  return <ReactQuill theme="snow" {...props} ref={ref} placeholder="Write great things here..." />;
});
export default QuillEditor;

const Block = Quill.import("blots/block");
Block.tagName = "div";
Quill.register(Block);

const Clipboard = Quill.import("modules/clipboard");
const Delta = Quill.import("delta");

class QuillPlainClipboard extends Clipboard {
  onPaste(e) {
    e.preventDefault();
    const range = this.quill.getSelection();
    const text = e.clipboardData.getData("text/plain");
    const delta = new Delta().retain(range.index).delete(range.length).insert(text);
    const index = text.length + range.index;
    const length = 0;
    this.quill.updateContents(delta);
    this.quill.setSelection(index, length);
    this.quill.scrollIntoView();
  }
}

Quill.register("modules/clipboard", QuillPlainClipboard, true);
