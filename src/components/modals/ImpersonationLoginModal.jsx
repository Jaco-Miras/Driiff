import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { SvgIconFeather } from "../common";
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
const ImpersonationLoginModal = (props) => {
  const { type, size = "m" } = props.data;
  const { onSubmit, user } = props.data.actions;
  const { loading } = useSelector((state) => state.users.impersonation);

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);

  const { _t } = useTranslationActions();

  const dictionary = {
    title: _t("IMPERSONATION_MODAL.Title", "Warning"),
    body: _t("IMPERSONATION_MODAL.BODY", "Are you sure you want to login as ::username::? Your login is saved in a log and is not deletable.", { username: user.name }),
    confirmationText: _t("IMPERSONATION_MODAL.CONFIRMATION_TEXT", "Yes"),
    cancelText: _t("IMPERSONATION_MODAL.CANCEL_TEXT", "No"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleConfirm = () => {
    onSubmit({ email: user.email, user_id: user.id }, toggle);
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={size} centered>
      <form>
        <ModalHeaderSection className="bg-danger" toggle={toggle}>
          <SvgIconFeather icon="warning" />
          {dictionary.title}
        </ModalHeaderSection>
        <ModalBody>
          <p>{dictionary.body}</p>
        </ModalBody>
        <ModalFooter>
          <Button disabled={loading} className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
            {dictionary.cancelText}
          </Button>
          <Button disabled={loading} className="btn btn-primary" color="primary" onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            {dictionary.confirmationText}
          </Button>
        </ModalFooter>
      </form>
    </ModalWrapper>
  );
};

export default React.memo(ImpersonationLoginModal);
