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

  const appliedPlaceholder = placeholder !== "" ? placeholder : _t("FORM.REACT_QUILL_PLACEHOLDER", "sad great things here...");

  return <ReactQuill className={`quill-editor ${className}`} theme={theme} {...otherProps} bounds={".quill-editor"} ref={ref} placeholder={appliedPlaceholder} />;
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

let Embed = Quill.import("blots/embed");

class Breaker extends Embed {
  static tagName = "br";
  static blotName = "breaker";
}

Quill.register(Breaker);
Quill.register("modules/magicUrl", MagicUrl);

//Quill.register("modules/clipboard", QuillPlainClipboard, true);
Quill.register("modules/clipboard", QuillPasteSmart);

Quill.register("modules/imageUploader", ImageUploader);
var Link = Quill.import("formats/link");
var builtInFunc = Link.sanitize;
Link.sanitize = function customSanitizeLinkInput(linkValueInput) {
  var val = linkValueInput;

  // do nothing, since this implies user's already using a custom protocol
  if (/^\w+:/.test(val));
  else if (!/^https?:/.test(val)) val = "https://" + val;

  return builtInFunc.call(this, val); // retain the built-in logic
};
