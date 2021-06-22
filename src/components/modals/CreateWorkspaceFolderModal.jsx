import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { addToModals, clearModal } from "../../redux/actions/globalActions";
import { createWorkspace, deleteWorkspaceFolder, updateWorkspace } from "../../redux/actions/workspaceActions";
import { CheckBox, InputFeedback } from "../forms";
import { useToaster, useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { replaceChar } from "../../helpers/stringFormatter";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 5px 0 20px 0;

  > .form-control:not(:first-child) {
    border-radius: 5px;
  }

  ${
    "" /* label {
    white-space: wrap;
    margin: 0 20px 0 0;
    min-width: 109px;
  } */
  }

  .input-feedback {
    margin-left: 130px;
    @media all and (max-width: 480px) {
      margin-left: 0;
    }
  }

  p {
    max-width: 530px;
    opacity: 0.8;
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
  &.action-wrapper {
    margin-top: 40px;

    .action-archive-wrapper {
      display: flex;
      width: 100%;

      .btn-archive {
        display: flex;
        margin-left: auto;
        text-decoration: underline;
        color: #a7abc3;
      }
    }
  }
`;

const CreateWorkspaceFolderModal = (props) => {
  const { type, mode, item = null } = props.data;

  const history = useHistory();
  const { _t } = useTranslationActions();
  const dictionary = {
    createWorkspaceFolder: _t("WORKSPACE.CREATE_WORKSPACE_FOLDER", "Create folder"),
    updateWorkspaceFolder: _t("WORKSPACE.UPDATE_WORKSPACE_FOLDER", "Update folder"),
    removeWorkspaceFolder: _t("WORKSPACE.DELETE_WORKSPACE_FOLDER", "Remove folder"),
    folderName: _t("FOLDER_NAME", "Name"),
    folderInfo: _t("FOLDER_INFO", "Folders help to organize your workspaces and are set for everyone who can see them. A workspace can only be connected to one folder."),
    lockWorkspaceFolder: _t("WORKSPACE.WORKSPACE_FOLDER_LOCK", "Make folder private"),
    lockWorkspaceFolderText: _t("WORKSPACE.WORKSPACE_FOLDER_LOCK.DESCRIPTION", "When a folder is private it is only visible to the members of the workspaces inside the folder."),
    description: _t("DESCRIPTION", "Description"),
    remove: _t("WORKSPACE.REMOVE", "Remove"),
    cancel: _t("WORKSPACE.CANCEL", "Cancel"),
    removeFolderText: _t("WORKSPACE.REMOVE_FOLDER_TEXT", "Workspaces in"),
    removeFolderText2: _t("WORKSPACE.REMOVE_FOLDER_TEXT_2", "will move back to the Workspaces sections in your sidebar. <br /><br />The workspaces in this folder will not be removed when you remove this folder."),
    confirm: _t("WORKSPACE.CONFIRM", "Confirm"),
    lockedFolder: _t("WORKSPACE.LOCKED_FOLDER", "Private folder"),
    lockedFolderText: _t("WORKSPACE.LOCKED_FOLDER_TEXT", "Only members can view and search this workspace."),
  };
  const toaster = useToaster();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { activeTopic, folders } = useSelector((state) => state.workspaces);
  const activeTab = useSelector((state) => state.workspaces.activeTab);
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    is_private: false,
    name: "",
    description: "",
    textOnly: "",
    workspace_id: null,
  });
  const [valid, setValid] = useState({
    name: null,
  });
  const [feedback, setFeedback] = useState({
    name: "",
  });
  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const toggleCheck = useCallback(
    (e) => {
      const name = e.target.dataset.name;
      setForm((prevState) => ({
        ...prevState,
        [name]: !prevState[name],
      }));
    },
    [setForm]
  );

  useEffect(() => {
    if (mode === "edit") {
      setForm({
        ...form,
        name: item.name,
        description: item.description,
        textOnly: item.description,
        is_private: item.is_lock === 1,
        workspace_id: item.id,
      });
    }
  }, []);

  const validateName = useCallback(() => {
    setValid({
      ...valid,
      name: form.name !== "",
    });

    if (mode === "edit") {
      if (form.name === "") {
        setFeedback({
          ...feedback,
          name: "Please provide a folder name.",
        });
      } else if (Object.values(folders).filter((f) => f.name.toLowerCase() === form.name.toLowerCase()).length) {
        if (item.name !== form.name) {
          setFeedback({
            ...feedback,
            name: "Folder name already exists.",
          });
        }
      } else {
        setFeedback({
          ...feedback,
          name: "",
        });
      }
    } else {
      if (form.name === "") {
        setFeedback({
          ...feedback,
          name: "Please provide a folder name.",
        });
      } else if (Object.values(folders).filter((f) => f.name.toLowerCase() === form.name.toLowerCase()).length) {
        setFeedback({
          ...feedback,
          name: "Folder name already exists.",
        });
      } else {
        setFeedback({
          ...feedback,
          name: "",
        });
      }
    }
  }, [form.name, valid, setValid, feedback, setFeedback, folders]);

  const handleNameChange = useCallback(
    (e) => {
      e.persist();
      if (valid.name !== null) {
        setValid((prevState) => ({
          ...prevState,
          name: null,
        }));
      }
      setForm((prevState) => ({
        ...prevState,
        name: e.target.value.trim(),
      }));

      validateName();
    },
    [valid.name, setValid, setForm]
  );

  const handleNameBlur = useCallback(() => {
    validateName();
  }, [validateName]);

  const handleConfirm = useCallback(() => {
    if (loading) return;

    let payload = {
      name: form.name,
      description: form.description,
      is_external: activeTab === "extern" ? 1 : 0,
      is_folder: 1,
      is_lock: form.is_private ? 1 : 0,
    };

    if (mode === "edit") {
      payload = {
        ...payload,
        workspace_id: form.workspace_id,
        topic_id: form.workspace_id,
      };

      const handleSubmit = () => {
        setLoading(true);
        dispatch(
          updateWorkspace(payload, (err, res) => {
            setLoading(false);

            if (err) {
              toaster.error(
                <span>
                  Folder update failed.
                  <br />
                  Please try again.
                </span>
              );
            }
            if (res) {
              toaster.success(
                <span>
                  <b>{form.name}</b> folder is updated
                </span>
              );
              toggle();
            }
          })
        );
      };
      const handleShowConfirmation = () => {
        let confirmModal = {
          type: "confirmation",
          headerText: dictionary.lockedFolder,
          submitText: dictionary.confirm,
          cancelText: dictionary.cancel,
          bodyText: dictionary.lockedFolderText,
          actions: {
            onSubmit: handleSubmit,
          },
        };

        dispatch(addToModals(confirmModal));
      };

      if (item.is_lock !== payload.is_lock && payload.is_lock === 1) {
        handleShowConfirmation();
      } else {
        handleSubmit();
      }
    } else {
      const handleSubmit = () => {
        setLoading(true);
        dispatch(
          createWorkspace(payload, (err, res) => {
            setLoading(false);

            if (err) {
              toaster.error(
                <span>
                  Folder creation failed.
                  <br />
                  Please try again.
                </span>
              );
            }
            if (res) {
              toaster.success(
                <span>
                  <b>{form.name}</b> folder is created
                </span>
              );
              toggle();
            }
          })
        );
      };
      const handleShowConfirmation = () => {
        let confirmModal = {
          type: "confirmation",
          headerText: dictionary.lockedFolder,
          submitText: dictionary.confirm,
          cancelText: dictionary.cancel,
          bodyText: dictionary.lockedFolderText,
          actions: {
            onSubmit: handleSubmit,
          },
        };

        dispatch(addToModals(confirmModal));
      };

      if (payload.is_lock === 1) {
        handleShowConfirmation();
      } else {
        handleSubmit();
      }
    }
  }, [dispatch, toggle, activeTab, form.description, form.is_private, form.name, valid.name, setForm, mode]);

  const handleRemoveFolder = () => {
    dispatch(
      deleteWorkspaceFolder(
        {
          topic_id: item.id,
        },
        (err, res) => {
          if (err) return;
          if (activeTopic && activeTopic.folder_id === item.id) {
            history.push(`/workspace/chat/${activeTopic.id}/${replaceChar(activeTopic.name)}`);
          }
        }
      )
    );
    toggle();
  };

  const handleShowRemoveConfirmation = () => {
    let payload = {
      type: "confirmation",
      headerText: dictionary.removeWorkspaceFolder,
      submitText: dictionary.remove,
      cancelText: dictionary.cancel,
      bodyText: `${dictionary.removeFolderText} <b>${item.name}</b> ${dictionary.removeFolderText2}`,
      actions: {
        onSubmit: handleRemoveFolder,
      },
    };

    dispatch(addToModals(payload));
  };

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"lg"} onOpened={onOpened} centered>
      <ModalHeaderSection toggle={toggle} className={"workspace-folder-header"}>
        {mode === "edit" ? "Edit  folder" : "Create new folder"}
        {/* <ActiveTabName className="intern-extern">{activeTabName}</ActiveTabName> */}
      </ModalHeaderSection>
      <ModalBody>
        <WrapperDiv className={"modal-input"}>
          <div>
            <Label className={"modal-info"}>{dictionary.folderInfo}</Label>
            <Label className={"modal-label"} for="folder">
              {dictionary.folderName}
            </Label>
          </div>
          <div className={"folder-searchbar-container"}>
            <Input className={"folder-searchbar"} defaultValue={mode === "edit" ? item.name : ""} onChange={handleNameChange} onBlur={handleNameBlur} valid={valid.name} invalid={valid.name !== null && !valid.name} innerRef={inputRef} />
            <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
          </div>
        </WrapperDiv>
        {/* <StyledDescriptionInput
              height={window.innerHeight - 660}
              onChange={handleQuillChange}
              defaultValue={mode === "edit" && item ? item.description : ""}
              mode={mode}/> */}
        <WrapperDiv className="action-wrapper" style={{ marginTop: "40px" }}>
          <div>
            <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>
              {dictionary.lockWorkspaceFolder}
            </CheckBox>
            <div className={"lock-workspace-folder-text-container"}>
              <Label className={"lock-workspace-text"}>{dictionary.lockWorkspaceFolderText}</Label>
            </div>
          </div>
          <div className={"create-folder-btn ml-auto"}>
            <button className="btn btn-primary" disabled={valid.name === null || valid.name === false} onClick={handleConfirm}>
              {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
              {mode === "edit" ? dictionary.updateWorkspaceFolder : dictionary.createWorkspaceFolder}
            </button>
          </div>
          {mode === "edit" && (
            <div className="action-archive-wrapper">
              <span onClick={handleShowRemoveConfirmation} className="btn-archive text-link mt-2 cursor-pointer">
                {dictionary.removeWorkspaceFolder}
              </span>
            </div>
          )}
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(CreateWorkspaceFolderModal);
