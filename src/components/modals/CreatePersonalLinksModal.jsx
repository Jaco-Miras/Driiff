import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { FormInput } from "../forms";
import { useDriffActions, useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";

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
    min-width: 125px;
  }

  .form-group {
    width: calc(100% - 145px);
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

// const StyledDescriptionInput = styled(DescriptionInput)`
//     height: ${props => props.height}px;
//     max-height: 300px;
// `;

const CreatePersonalLinksModal = (props) => {
  const { type, mode, item = null, actions } = props.data;

  const driffActions = useDriffActions();
  const { _t } = useTranslationActions();

  let dictionary = {
    linkCreateTitle: _t("SHORTCUT.LINK_CREATE_TITLE", "Add shortcut"),
    linkUpdateTitle: _t("SHORTCUT.LINK_UPDATE_TITLE", "Update shortcut"),
    linkRemoveTitle: _t("SHORTCUT.LINK_REMOVE_TITLE", "Remove shortcut"),
    createLink: _t("SHORTCUT.CREATE_LINK", "Add"),
    updateLink: _t("SHORTCUT.UPDATE_LINK", "Update"),
    removeLink: _t("SHORTCUT.REMOVE_LINK", "Remove"),
    name: _t("SHORTCUT.NAME", "Name"),
    webAddress: _t("SHORTCUT.WEB_ADDRESS", "Web address"),
    remove: _t("SHORTCUT.REMOVE", "Remove"),
    cancel: _t("SHORTCUT.CANCEL", "Cancel"),
  };

  if (item) {
    dictionary = {
      ...dictionary,
      removeLinkBodyText: _t("SHORTCUT.REMOVE_LINK_BODY_TEXT", "Are you sure to remove ::name::?", {
        name: `<a href="${item.web_address}" target="_blank">${item.name}</a>`,
      }),
    };
  }

  const inputRef = useRef();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [form, setForm] = useState({
    name: "",
    web_address: "",
  });

  const [loading, setLoading] = useState(false);

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const handleInputChange = useCallback((e) => {
    e.persist();
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    setFormResponse((prevState) => ({
      ...prevState,
      valid: {
        ...prevState.valid,
        [e.target.name]: undefined,
      },
      message: {
        ...prevState.message,
        [e.target.name]: undefined,
      },
    }));
  }, []);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  useEffect(() => {
    console.log(item);
    console.log(mode);
    if (mode === "edit") {
      setForm({
        ...form,
        name: item.name,
        web_address: item.web_address,
        index: item.index,
      });
    }
  }, []);

  const _formValidate = () => {
    let valid = {};
    let message = {};

    if (form.name === "") {
      valid.name = false;
      message.name = "Name is required.";
    } else {
      valid.name = true;
    }

    if (form.web_address === "") {
      valid.web_address = false;
      message.web_address = "Link is required.";
    } else {
      valid.web_address = true;
    }

    setFormResponse({
      valid: valid,
      message: message,
    });

    return !Object.values(valid).some((v) => v === false);
  };

  const handleConfirm = () => {
    if (!_formValidate() || loading) {
      return;
    }

    setLoading(true);

    switch (mode) {
      case "create": {
        actions.create(form, () => {
          setLoading(false);
          toggle();
        });
        break;
      }
      case "edit": {
        actions.update(form, () => {
          setLoading(false);
          toggle();
        });
        break;
      }
    }
  };

  const handleShowRemoveConfirmation = () => {
    actions.delete(form, {
      dictionary: dictionary,
      callback: () => {
        toggle();
      },
    });
  };

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"lg"} onOpened={onOpened} centered>
      <ModalHeaderSection toggle={toggle} className={"workspace-folder-header"}>
        {mode === "edit" ? dictionary.linkUpdateTitle : dictionary.linkCreateTitle}
      </ModalHeaderSection>
      <ModalBody>
        <WrapperDiv>
          <div>
            <Label for="folder">{dictionary.webAddress}</Label>
          </div>
          <FormInput name="web_address" defaultValue={form.web_address} placeholder={`e.g. ${driffActions.getBaseUrl()}`} onChange={handleInputChange} isValid={formResponse.valid.web_address} feedback={formResponse.message.web_address} />
        </WrapperDiv>
        <WrapperDiv>
          <div>
            <Label for="folder">{dictionary.name}</Label>
          </div>
          <FormInput name="name" defaultValue={form.name} placeholder={`e.g. ${driffActions.getName()} Driff website`} onChange={handleInputChange} isValid={formResponse.valid.name} feedback={formResponse.message.name} />
        </WrapperDiv>
        <WrapperDiv className="action-wrapper" style={{ marginTop: "40px" }}>
          <button className="btn btn-primary" onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {mode === "edit" ? dictionary.updateLink : dictionary.createLink}
          </button>
          {mode === "edit" && (
            <div className="action-archive-wrapper">
              <span onClick={handleShowRemoveConfirmation} className="btn-archive text-link mt-2 cursor-pointer">
                {dictionary.removeLink}
              </span>
            </div>
          )}
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(CreatePersonalLinksModal);
