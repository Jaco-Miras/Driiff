import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Input, InputGroup, Label, Modal, ModalBody} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import {createWorkspace, updateWorkspace} from "../../redux/actions/workspaceActions";
import {CheckBox, DescriptionInput, InputFeedback} from "../forms";
import {useToaster, useTranslation} from "../hooks";
import {ModalHeaderSection} from "./index";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 20px 0;

  > .form-control:not(:first-child) {
    border-radius: 5px;
  }

  label {
    white-space: nowrap;
    margin: 0 20px 0 0;
    min-width: 109px;
  }

  .input-feedback {
    margin-left: 130px;
    @media all and (max-width: 480px) {
      margin-left: 0;
    }
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

const StyledDescriptionInput = styled(DescriptionInput)`
    height: ${props => props.height}px;
    max-height: 300px;
`;

const CreateWorkspaceFolderModal = (props) => {
  const {type, mode, item = null} = props.data;

  const {_t} = useTranslation();
  const dictionary = {
      createWorkspaceFolder: _t("WORKSPACE.CREATE_WORKSPACE_FOLDER", "Create folder"),
      updateWorkspaceFolder: _t("WORKSPACE.UPDATE_WORKSPACE_FOLDER", "Update folder"),
      folderName: _t("FOLDER_NAME", "Folder name"),
      lockWorkspace: _t("WORKSPACE.WORKSPACE_LOCK", "Lock workspace"),
      description: _t("DESCRIPTION", "Description"),
  };
  const toaster = useToaster();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.workspaces.folders);
  const activeTab = useSelector((state) => state.workspaces.activeTab);
  const [modal, setModal] = useState(true);
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
      console.log(item)
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
      dispatch(
        updateWorkspace(payload, (err, res) => {
          if (err) {
            console.log(err);
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
    } else {
      dispatch(
        createWorkspace(payload, (err, res) => {
          if (err) {
            console.log(err);
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
    }
  }, [dispatch, toggle, activeTab, form.description, form.is_private, form.name, valid.name, setForm, mode]);

  const handleQuillChange = useCallback(
    (content, delta, source, editor) => {
      const textOnly = editor.getText(content);
      setForm((prevState) => ({
        ...prevState,
        description: content,
        textOnly: textOnly,
      }));
    },
    [setForm]
  );

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
          <WrapperDiv>
            <Label for="folder">{dictionary.folderName}</Label>
            <Input defaultValue={mode === "edit" ? item.name : ""} onChange={handleNameChange}
                   onBlur={handleNameBlur} valid={valid.name} invalid={valid.name !== null && !valid.name}
                   innerRef={inputRef}/>
            <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
          </WrapperDiv>
          <StyledDescriptionInput
              height={window.innerHeight - 660}
              onChange={handleQuillChange}
              defaultValue={mode === "edit" && item ? item.description : ""}
              mode={mode}/>
          <WrapperDiv style={{marginTop: "40px"}}>
            <Label/>
            <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>
              {dictionary.lockWorkspace}
            </CheckBox>
            <button className="btn btn-primary" disabled={valid.name === null || valid.name === false}
                    onClick={handleConfirm}>
              {mode === "edit" ? dictionary.updateWorkspaceFolder : dictionary.createWorkspaceFolder}
            </button>
          </WrapperDiv>
        </ModalBody>
      </Modal>
  );
};

export default React.memo(CreateWorkspaceFolderModal);
