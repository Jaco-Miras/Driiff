import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { useTranslationActions } from "../hooks";

const ModalWrapper = styled(Modal)`
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }
  .btn.btn-outline-secondary {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;
const FolderNoAccessModal = (props) => {
  const { type } = props.data;

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);

  const { _t } = useTranslationActions();

  const dictionary = {
    closeButton: _t("BUTTON.CLOSE", "Close"),
    notAFolderMember: _t("LABEL.NOT_A_WS_FOLDER_MEMBER", "You're not a member of any workspaces under this workspace folder."),
    updateWorkspaceFolder: _t("WORKSPACE.UPDATE_WORKSPACE_FOLDER", "Update folder"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={"m"} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.updateWorkspaceFolder}</ModalHeaderSection>
      <ModalBody>
        <span>{dictionary.notAFolderMember}</span>
      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-primary" color="primary" onClick={toggle}>
          {dictionary.closeButton}
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
};

export default React.memo(FolderNoAccessModal);
