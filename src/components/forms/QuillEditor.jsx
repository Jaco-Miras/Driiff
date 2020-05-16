import React, {forwardRef} from 'react';
import "quill-mention";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const QuillEditor = forwardRef((props,ref) => {

    return (
        <ReactQuill 
            theme="snow"
            {...props}
            ref={ref}
            // onBlur={this.handleBlurOnQuill}
            // modules={this.modules}
            // ref={el => (this.quillRef = el)}
            // placeholder={
            //     this.state.draftId
            //         ? "You have unsaved reply"
            //         : this.props.mode === "chat" &&
            //         this.props.status === "initial"
            //         ? "Starting chat..."
            //         : placeholder
            // }
            // value={this.state.text}
            // onChange={this.handleQuillChange}
            // onKeyDown={this.handleQuillKeyDown}
            // onKeyUp={this.handleQuillKeyUp}
            // onFocus={this.loadDraft}
        />
    )
})
export default QuillEditor
