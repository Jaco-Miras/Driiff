import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal, createReleaseAnnouncement, updateReleaseAnnouncement, deleteReleaseAnnouncement, saveDraft, deleteDraft, updateDraft, incomingDeletedAnnouncement } from "../../redux/actions/globalActions";
import { useQuillModules } from "../hooks";
import { ModalHeaderSection } from "./index";
import { FormInput, QuillEditor, CheckBox } from "../forms";

const Wrapper = styled(Modal)`
  .modal-footer {
    justify-content: space-between;
  }
  .margin-left-auto {
    margin-left: auto;
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

const CheckBoxContainer = styled.div`
  text-align: right;
`;

const ReleaseModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, item } = props.data;

  console.log(props.data);

  const dispatch = useDispatch();

  const [modal, setModal] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    textOnly: "",
    major_release: false,
  });
  const [loading, setLoading] = useState(false);
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);
  const [nestedDraft, setNestedDraft] = useState(false);

  const toggle = () => {
    if (!item) {
      if (form.title !== "" && form.description !== "") {
        setNestedDraft(true);
      } else {
        setModal(!modal);
        dispatch(clearModal({ type: type }));
      }
    } else {
      if (item.draft_id && (item.body !== form.description || item.action_text !== form.title)) {
        setNestedDraft(true);
      } else {
        setModal(!modal);
        dispatch(clearModal({ type: type }));
      }
    }
  };

  const toggleDraft = () => {
    setNestedDraft(!nestedDraft);
    setCloseAll(false);
  };

  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setCloseAll(false);
  };

  const toggleAll = (toDelete) => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
    setModal(!modal);
    if (toDelete) {
      handleDelete();
    }
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
        major_release: item.major_release,
      });
    }
  }, []);

  const handleSubmit = () => {
    if (item) {
      let payload = {
        id: item.id,
        body: form.description,
        action_text: form.title,
        major_release: form.major_release,
      };
      if (item.draft_id) {
        delete payload.id;
        dispatch(
          createReleaseAnnouncement(payload, (err, res) => {
            if (err) return;
            handleDeleteDraft();
          })
        );
      } else {
        dispatch(updateReleaseAnnouncement(payload));
      }
      toggle();
    } else {
      let payload = {
        body: form.description,
        action_text: form.title,
        major_release: form.major_release,
      };
      dispatch(createReleaseAnnouncement(payload));
      toggle();
    }
  };

  const handleCheck = () => {
    setForm({
      ...form,
      major_release: !form.major_release,
    });
  };

  const handleUpdateDraft = () => {
    dispatch(
      updateDraft(
        {
          type: "release",
          draft_id: item.draft_id,
          ...form,
          action_text: form.title,
          body: form.description,
        },
        (err, res) => {
          if (err) return;
        }
      )
    );
  };

  const handleDeleteDraft = () => {
    dispatch(
      deleteDraft(
        {
          type: "release",
          draft_id: item.draft_id,
        },
        (err, res) => {
          if (err) return;
          dispatch(incomingDeletedAnnouncement({ id: item.draft_id }));
        }
      )
    );
  };
  const handleDelete = () => {
    if (item && item.draft_id) {
      handleDeleteDraft();
    } else {
      dispatch(deleteReleaseAnnouncement({ id: item.id }));
    }
    toggle();
  };

  const handleSaveDraft = () => {
    if (item && item.draft_id) {
      handleUpdateDraft();
    } else {
      dispatch(
        saveDraft({
          ...form,
          action_text: form.title,
          body: form.description,
          type: "release",
        })
      );
    }

    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const quillRef = useRef(null);
  const { modules } = useQuillModules({ mode: "description", mentionOrientation: "top", quillRef: quillRef, disableMention: true });

  return (
    <Wrapper isOpen={modal} toggle={toggle} size={"lg"} className="todo-reminder-modal" centered>
      <ModalHeaderSection toggle={toggle}>Release note</ModalHeaderSection>
      <ModalBody>
        <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined} centered>
          <ModalHeaderSection toggle={toggleNested}>Delete log</ModalHeaderSection>
          <ModalBody>Are you sure you want to delete this release log?</ModalBody>
          <ModalFooter>
            <Button className="btn-outline-secondary" onClick={() => toggleAll(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={() => toggleAll(true)}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={nestedDraft} toggle={toggleDraft} onClosed={closeAll ? toggle : undefined} centered>
          <ModalHeaderSection toggle={toggleDraft}>Save as draft</ModalHeaderSection>
          <ModalBody>Save entry as draft?</ModalBody>
          <ModalFooter>
            <Button className="btn-outline-secondary" onClick={() => toggleAll(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSaveDraft}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
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
        <br />
        <CheckBoxContainer className="col-12">
          <CheckBox name="must_read" checked={form.major_release} onClick={handleCheck} type="danger">
            Major release
          </CheckBox>
        </CheckBoxContainer>
      </ModalBody>
      <ModalFooter>
        {item && (
          <div>
            <Button className="mr-1" outline color="secondary" onClick={toggleNested}>
              Delete
            </Button>
            {item.draft_id && (
              <Button outline color="secondary" onClick={handleSaveDraft} disabled={form.textOnly === "" || form.title === ""}>
                Update draft
              </Button>
            )}
          </div>
        )}
        {!item && (
          <div>
            <Button outline color="secondary" onClick={toggleDraft} disabled={form.textOnly === "" || form.title === ""}>
              Save as draft
            </Button>
          </div>
        )}
        <div className={item ? "" : "margin-left-auto"}>
          <Button outline color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary ml-2" onClick={handleSubmit} disabled={form.textOnly === "" || form.title === ""}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {item && item.draft_id ? "Save" : item ? "Update" : "Save"}
          </Button>{" "}
        </div>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(ReleaseModal);
