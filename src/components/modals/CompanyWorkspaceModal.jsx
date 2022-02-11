import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { DescriptionInput } from "../forms";
import { ModalHeaderSection } from "./index";
import { clearModal } from "../../redux/actions/globalActions";
import { putCompanyDescription } from "../../redux/actions/adminActions";
import { useTranslationActions } from "../hooks";

const WrapperDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  label {
    margin: 0 20px 0 0;
    min-width: 530px;
  }

  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }
  input.form-control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__control,
  .react-select__control:hover,
  .react-select__control:active,
  .react-select__control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .custom-control-label:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyledDescriptionInput = styled(DescriptionInput)`
  margin: 0;
  .description-input {
    height: calc(100% - 50px);
  }
  .description-wrapper {
    margin-bottom: 20px;
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }

  .ql-toolbar {
    bottom: 25px;
    left: 35px;
  }

  .invalid-feedback {
    position: absolute;
    bottom: 0;
    top: auto;
  }
  button.ql-image {
    display: none;
  }
`;

const CompanyWorkspaceModal = (props) => {
  const { type, mode } = props.data;

  const dispatch = useDispatch();

  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const recipients = useSelector((state) => state.global.recipients);
  const companyRecipient = recipients.find((r) => r.type === "DEPARTMENT");
  const companyWs = Object.values(workspaces).find((ws) => companyRecipient && companyRecipient.id === ws.id);

  const [form, setForm] = useState({
    is_private: 0,
    has_folder: false,
    icon: null,
    icon_link: null,
    name: "Driff Demo",
    selectedUsers: [],
    selectedFolder: null,
    description: "",
    textOnly: "",
    has_externals: false,
    selectedExternals: [],
  });

  const [loading, setLoading] = useState(false);

  const { _t } = useTranslationActions();

  const refs = {
    container: useRef(null),
    workspace_name: useRef(null),
    dropZone: useRef(null),
    iconDropZone: useRef(null),
    first_name: useRef(null),
  };

  const dictionary = {
    save: _t("MODAL.SAVE", "Save"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    editCompanyDescription: _t("MODAL.EDIT_COMPANY_DESCRIPTION", "Edit company description"),
  };

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    setForm((prevState) => ({
      ...prevState,
      description: content,
      textOnly: textOnly,
    }));
  };

  const onOpened = () => {
    if (refs.workspace_name && refs.workspace_name.current) {
      refs.workspace_name.current.focus();
    }
  };

  const handleSubmit = () => {
    // let payload = {
    //   name: "Driff Demo",
    //   description: form.description,
    //   is_external: 0,
    //   member_ids: companyWs.member_ids,
    //   is_lock: 0,
    //   workspace_id: 0,
    //   file_ids: [],
    //   new_team_member_ids: [],
    //   team_member_ids: [],
    //   topic_id: 4,
    //   remove_member_ids: [],
    //   new_member_ids: [],
    //   remove_team_member_ids: [],
    // };
    // if (companyWs) {
    //   console.log(payload);
    //   dispatch(updateWorkspace(payload));
    // }
    if (companyWs) {
      dispatch(putCompanyDescription({ id: 4, description: form.description }));
      toggle();
    }
  };

  return (
    <Modal isOpen={true} toggle={toggle} centered size="lg" onOpened={onOpened}>
      <ModalHeaderSection toggle={toggle}>{dictionary.editCompanyDescription}</ModalHeaderSection>
      <ModalBody>
        <StyledDescriptionInput
          className="modal-description"
          height={window.innerHeight - 660}
          required
          showFileButton={false}
          onChange={handleQuillChange}
          onOpenFileDialog={() => {}}
          defaultValue={companyWs ? companyWs.description : ""}
          mode={mode}
          disableBodyMention={true}
          modal={"workspace"}
          mentionedUserIds={[]}
          onAddUsers={() => {}}
          onDoNothing={() => {}}
          setInlineImages={() => {}}
        />

        <WrapperDiv>
          <button className="btn btn-outline-secondary mr-2" outline color="secondary" onClick={toggle}>
            {dictionary.cancel}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {dictionary.save}
          </button>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(CompanyWorkspaceModal);
