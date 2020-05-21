import "quill-mention";
import React, {forwardRef} from "react";
import ReactQuill, {Quill} from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = forwardRef((props, ref) => {

    return (
        <ReactQuill
            theme="snow"
            {...props}
            ref={ref}
        />
    );
});
export default QuillEditor;

const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block);