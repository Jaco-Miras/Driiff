import React, {useRef, useState} from "react";
import styled from "styled-components";
import {InputGroup, Label} from "reactstrap";
import QuillEditor from "./QuillEditor";
import {useQuillModules} from "../hooks";
import {SvgIconFeather, PickerEmoji} from "../common";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: center;
    margin: 20px 0;
    position: relative;
    label {
        white-space: nowrap;
        margin: 0 20px 0 0;
        min-width: 109px;
    }
    button {
        margin-left: auto;
    }
    .react-select-container {
        width: 100%;
    }
    .react-select__multi-value__label {
        align-self: center;
    }
`;

const StyledQuillEditor = styled(QuillEditor)`
    // flex: 1 0 0;
    // width: 1%;
    height: 80px;

    &.description-input {
        max-height: 130px;
        overflow: auto;
        overflow-x: hidden;
        position: static;
        width: 100%;
    }
    .ql-toolbar {
        position: absolute;
        top: 100%;
        padding: 0;
        border: none;
        .ql-formats {
            margin-right: 10px;
        }
    }
    .ql-container {
        border: none;
    }
    .ql-editor {
        padding: 5px;
    }
`;

const IconButton = styled(SvgIconFeather)`
    cursor: pointer;
    cursor: hand;
    border: 1px solid #afb8bd;
    height: 1.5rem;
    margin: -1px 8px;
    width: 1.5rem;
    padding: 5px;
    border-radius: 8px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        background: #afb8bd;
        color: #ffffff;
    }
    &.feather-send {
        border: 1px solid #7a1b8b;
        background-color: #7a1b8b;
        color: #fff;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        &:hover {
            background-color: #8C3B9B;
        }
    }
`;

const DescriptionInputWrapper = styled.div`
    flex: 1 0 0;
    width: 1%;
    border: 1px solid #afb8bd;
    border-radius: 5px;
`;

const Buttons = styled.div`
    padding: 5px;
    float: right;
`;

const PickerContainer = styled(PickerEmoji)`
    right: 0;
    bottom: 120px;
`;

const DescriptionInput = props => {

    const {onChange, showFileButton = false, onOpenFileDialog} = props;

    const reactQuillRef = useRef();
    const pickerRef = useRef();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    const onSelectEmoji = (e) => {
        const editor = reactQuillRef.current.getEditor();
        reactQuillRef.current.focus();
        const cursorPosition = editor.getSelection().index;
        editor.insertText(cursorPosition, e.native);
        editor.setSelection(cursorPosition + 2);
    };

    const [modules] = useQuillModules("description");

    return (
        <WrapperDiv>
            <Label for="firstMessage">Description</Label>
            <DescriptionInputWrapper>
                <StyledQuillEditor
                    className="description-input"
                    modules={modules}
                    ref={reactQuillRef}
                    onChange={onChange}
                />
                <Buttons>
                    <IconButton onClick={handleShowEmojiPicker} icon="smile"/>
                    { showFileButton && <IconButton onClick={onOpenFileDialog} icon="paperclip"/> }
                </Buttons>
            </DescriptionInputWrapper>
            {
                showEmojiPicker === true &&
                <PickerContainer
                    handleShowEmojiPicker={handleShowEmojiPicker}
                    onSelectEmoji={onSelectEmoji}
                    orientation={"top"}
                    ref={pickerRef}
                />
            }
        </WrapperDiv>
    )
};

export default DescriptionInput;