import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Input, InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useToaster, useTranslationActions, useAdminActions } from "../hooks";
import { ModalHeaderSection } from "./index";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 5px 0 20px 0;

  > .form-control:not(:first-child) {
    border-radius: 5px;
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
  }
  .input-container {
    width: 100%;
  }
`;

const CreateAdminBotModal = (props) => {
  const { _t } = useTranslationActions();
  const dictionary = {
    botNameLabel: _t("MODAL.BOT_NAME_LABEL", "Bot name"),
    inputPlaceholder: _t("MODAL.BOT_INPUT_PLACEHOLDER", "Bot name"),
    modalHeader: _t("MODAL.BOT_HEADER", "Create new bot"),
    save: _t("MODAL.SAVE", "Save"),
  };
  const toaster = useToaster();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const { createUserBot } = useAdminActions();

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: "create_bot" }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleConfirm = () => {
    if (!loading) {
      setLoading(true);
      createUserBot({ bot_name: name }, (err, res) => {
        setLoading(false);
        if (err) return;
        toaster.success(`${name} successfully created.`);
        toggle();
      });
    }
  };

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"md"} onOpened={onOpened} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.modalHeader}</ModalHeaderSection>
      <ModalBody>
        <WrapperDiv className={"modal-input"}>
          <div>
            {/* <Label className={"modal-info"}>{dictionary.folderInfo}</Label> */}
            <Label className={"modal-label"} for="bot">
              {dictionary.botNameLabel}
            </Label>
          </div>
          <div className="input-container">
            <Input defaultValue={""} placeholder={dictionary.inputPlaceholder} onChange={handleNameChange} innerRef={inputRef} />
          </div>
        </WrapperDiv>
        <WrapperDiv className="action-wrapper">
          <div className={"ml-auto"}>
            <button className="btn btn-primary" disabled={name.trim() === "" || loading} onClick={handleConfirm}>
              {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
              {dictionary.save}
            </button>
          </div>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(CreateAdminBotModal);
