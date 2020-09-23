import React, {useRef, useState} from "react";
import {InputGroup, Label} from "reactstrap";
import styled from "styled-components";
import {PickerEmoji, SvgIconFeather, CommonPicker, BodyMention} from "../common";
import {useQuillModules} from "../hooks";
import {InputFeedback} from "./index";
import QuillEditor from "./QuillEditor";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: baseline;
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
  .description-wrapper {
    margin-bottom: 25px;
    min-height: 133px;
    &.is-invalid {
      border-color: #dc3545;
      padding-right: calc(1.5em + 0.75rem);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.5rem top 0.5rem;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);

      .action-wrapper {
        margin-right: -32px;
      }
    }
    &.is-valid {
      border-color: #28a745;
      padding-right: calc(1.5em + 0.75rem);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.5rem top 0.5rem;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);

      .action-wrapper {
        margin-right: -32px;
      }
    }
  }
  .invalid-feedback {
    display: block;
    top: 55px;
    position: relative;
    left: 0px;
    @media (max-width: 620px) {
      position: absolute;
      right: 0;
      bottom: -20px;
      left: auto;
      top: auto;
      text-align: right;
    }
  }
  .ql-mention-list-container-top,
  .ql-mention-list-container {
    width: 300px !important;
    max-height: 170px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: rgba(26, 26, 26, 0.4) 0px 2px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 2;

    .ql-mention-list {
      padding: 0;

      .ql-mention-list-item {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 1rem;

        &.selected {
          background: #7a1b8b;
          color: #fff;
          cursor: pointer;
          span.all-pic > img {
            filter: brightness(0) saturate(100%) invert(1);
          }
        }
      }
    }
  }
  .mention {
    color: #7a1b8b;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  height: ${props => props.height}px;

  &.description-input {
    overflow: auto;
    overflow-x: hidden;
    position: static;
    width: 100%;
  }
  .ql-toolbar {
    position: absolute;
    bottom: 0;
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
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:hover {
    background: #afb8bd;
    color: #ffffff;
  }
  &.feather-send {
    border: 1px solid #7a1b8b;
    background-color: #7a1b8b;
    color: #fff;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:hover {
      background-color: #8c3b9b;
    }
  }
`;

const DescriptionInputWrapper = styled.div`
  flex: 1 0 0;
  width: 1%;
  border: 1px solid #afb8bd;
  border-radius: 5px;
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const Buttons = styled.div`
  padding: 5px;
  display: flex;
  justify-content: flex-end;
`;

const PickerContainer = styled(CommonPicker)`
  right: 15px;
  .block {
    text-align: end;
  }
`;

const DescriptionInput = (props) => {
  const {onChange, showFileButton = false, onOpenFileDialog, defaultValue = "", mode = "", valid = null, feedback = "", height = 80, members = [], disableMention = false, disableBodyMention = false, mentionedUserIds, onAddUsers, onDoNothing, modal = "post", ...otherProps} = props;

  const reactQuillRef = useRef();
  const pickerRef = useRef();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onSelectEmoji = (e) => {
    const editor = reactQuillRef.current.getEditor();
    reactQuillRef.current.focus();
    const cursorPosition = editor.getSelection().index;
    editor.insertText(cursorPosition, e.native);
    editor.setSelection(cursorPosition + 2);
  };

  const onSelectGif = (e) => {
    // setSelectedGif(e);
    console.log(e)
    const editor = reactQuillRef.current.getEditor();
    reactQuillRef.current.focus();
    const cursorPosition = editor.getSelection().index;
    editor.insertEmbed(cursorPosition, "image", e.images.downsized.url);
    editor.setSelection(cursorPosition + 5);
  };
  
  /*useEffect(() => {
    if (mode === "edit" && defaultValue) {
      const editor = reactQuillRef.current.getEditor();
      editor.clipboard.dangerouslyPasteHTML(0, defaultValue);
      reactQuillRef.current.blur();
    }
  }, []);*/

  const [modules, formats] = useQuillModules("description", () => {}, "top", reactQuillRef, members, disableMention);

  return (
    <WrapperDiv>
      <Label for="firstMessage">Description</Label>
      <DescriptionInputWrapper
          className={`description-wrapper ${valid === null ? "" : valid ? "is-valid" : "is-invalid"}`}>
        <StyledQuillEditor className="description-input" modules={modules} ref={reactQuillRef} onChange={onChange}
                           height={80} defaultValue={defaultValue} {...otherProps} />
        {mentionedUserIds.length > 0 && !disableBodyMention && <BodyMention onAddUsers={onAddUsers} onDoNothing={onDoNothing} userIds={mentionedUserIds} baseOnId={false} type={modal}/>}
        <Buttons className="action-wrapper">
          <IconButton onClick={handleShowEmojiPicker} icon="smile"/>
          {showFileButton && <IconButton onClick={onOpenFileDialog} icon="paperclip"/>}
        </Buttons>
        <InputFeedback valid={valid}>{feedback}</InputFeedback>
      </DescriptionInputWrapper>
      {showEmojiPicker === true && <PickerContainer handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={pickerRef} />}
    </WrapperDiv>
  );
};

export default React.memo(DescriptionInput);
