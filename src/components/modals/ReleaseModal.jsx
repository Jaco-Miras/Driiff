import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal, createReleaseAnnouncement, updateReleaseAnnouncement } from "../../redux/actions/globalActions";
import { useTranslation, useQuillModules } from "../hooks";
import { ModalHeaderSection } from "./index";
// import quillHelper from "../../helpers/quillHelper";
import { FormInput, QuillEditor } from "../forms";
// import moment from "moment";
// import MessageFiles from "../list/chat/Files/MessageFiles";
// import { FileAttachments } from "../common";

const Wrapper = styled(Modal)`
  .modal-body {
    padding-bottom: 3rem !important;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  width: 100%;
  min-height: 300px;
  max-height: 600px;
  border-radius: 6px;
  border: 1px solid #e1e1e1;

  &.description-input {
    overflow: auto;
    overflow-x: hidden;
    position: static;
    width: 100%;
  }
  .ql-toolbar {
    position: absolute;
    bottom: -25px;
    padding: 0;
    border: none;
    .ql-formats {
      margin-right: 10px;
    }
  }
  .ql-container {
    border: none;
    max-height: inherit;
  }
  .ql-editor {
    padding: 5px;
    max-height: inherit;
  }
`;

const ReleaseModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, item } = props.data;

  console.log(props.data);

  const { _t } = useTranslation();
  const dispatch = useDispatch();

  const [modal, setModal] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    textOnly: "",
  });
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    if (textOnly.trim() !== "") {
      setForm((prevState) => ({
        ...prevState,
        description: content,
        textOnly: textOnly,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.currentTarget;
    setForm((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  useEffect(() => {
    if (item) {
      setForm({
        title: item.action_text,
        description: item.body,
        textOnly: item.body,
      });
    }
  }, []);

  const handleSubmit = () => {
    if (item) {
      let payload = {
        id: item.id,
        body: form.description,
        action_text: form.title,
      };
      dispatch(updateReleaseAnnouncement(payload));
      toggle();
    } else {
      let payload = {
        body: form.description,
        action_text: form.title,
      };
      dispatch(createReleaseAnnouncement(payload));
      toggle();
    }
  };

  const quillRef = useRef(null);
  const { modules } = useQuillModules({ mode: "description", mentionOrientation: "top", quillRef: quillRef, disableMention: true });

  return (
    <Wrapper isOpen={modal} toggle={toggle} size={"lg"} className="todo-reminder-modal" centered>
      <ModalHeaderSection toggle={toggle}>Release note</ModalHeaderSection>
      <ModalBody>
        <div className="col-12 modal-label">Title</div>
        <div className="col-12">
          <FormInput
            //innerRef={handleTitleRef}
            name="title"
            defaultValue={form.title}
            placeholder="title"
            onChange={handleInputChange}
            autoFocus
          />
        </div>
        <div className="col-12 modal-label">Description</div>
        <div className="col-12">
          <StyledQuillEditor ref={quillRef} onChange={handleQuillChange} modules={modules} name="description" defaultValue={item ? item.body : ""} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button outline color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {item ? "Update" : "Save"}
        </Button>{" "}
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(ReleaseModal);
