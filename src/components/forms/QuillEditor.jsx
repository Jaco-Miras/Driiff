import "quill-mention";
import React, { forwardRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslationActions } from "../hooks";
import MagicUrl from "quill-magic-url";
import ImageUploader from "quill-image-uploader";
import QuillPasteSmart from "quill-paste-smart";

const QuillEditor = forwardRef((props, ref) => {
  const { className = "", theme = "snow", placeholder = "", ...otherProps } = props;
  const { _t } = useTranslationActions();

  const appliedPlaceholder = placeholder !== "" ? placeholder : _t("FORM.REACT_QUILL_PLACEHOLDER", "Write great things here...");

  return <ReactQuill className={`quill-editor ${className}`} theme={theme} {...otherProps} ref={ref} placeholder={appliedPlaceholder} />;
});
export default QuillEditor;

const Block = Quill.import("blots/block");
Block.tagName = "div";
Quill.register(Block);

// const Clipboard = Quill.import("modules/clipboard");
// const Delta = Quill.import("delta");

// class QuillPlainClipboard extends Clipboard {
//   onPaste(e) {
//     e.preventDefault();
//     const range = this.quill.getSelection();
//     const text = e.clipboardData.getData("text/plain");
//     const delta = new Delta().retain(range.index).delete(range.length).insert(text);
//     const index = text.length + range.index;
//     const length = 0;
//     this.quill.updateContents(delta);
//     this.quill.setSelection(index, length);
//     this.quill.scrollIntoView();
//   }
// }

Quill.register("modules/magicUrl", MagicUrl);

//Quill.register("modules/clipboard", QuillPlainClipboard, true);
Quill.register("modules/clipboard", QuillPasteSmart);

Quill.register("modules/imageUploader", ImageUploader);
