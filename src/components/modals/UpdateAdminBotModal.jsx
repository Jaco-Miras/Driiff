import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useToaster, useTranslationActions, useAdminActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { FolderSelect } from "../forms";

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

const UpdateAdminBotModal = (props) => {
  const { item, mode } = props.data;
  const { _t } = useTranslationActions();
  const dictionary = {
    edit: _t("MODAL.HEADER_EDIT", "Edit"),
    webhookUrl: _t("MODAL.WEBHOOK_URL_LABEL", "Webhook URL"),
    botNameLabel: _t("MODAL.BOT_NAME_LABEL", "Bot name"),
    connectedChannelsLabel: _t("MODAL.CONNECTED_CHANNELS_LABEL", "Connected channels"),
    inputPlaceholder: _t("MODAL.BOT_INPUT_PLACEHOLDER", "Bot name"),
    modalHeader: _t("MODAL.BOT_HEADER", "Create new bot"),
    save: _t("MODAL.SAVE", "Save"),
  };

  const channels = useSelector((state) => state.admin.automation.channels);
  const toaster = useToaster();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item.name);
  const [selectedChannels, setSelectedChannels] = useState(
    channels
      .filter((c) => {
        if (item.channel_connected.some((id) => id === c.id)) {
          return true;
        } else {
          return false;
        }
      })
      .map((c) => {
        return {
          ...c,
          value: c.id,
          label: c.title,
          icon: "compass",
        };
      })
  );

  const channelOptions = channels.map((c) => {
    return {
      ...c,
      value: c.id,
      label: c.title,
      icon: "compass",
    };
  });

  const { updateUserBot, updateGrippBot } = useAdminActions();

  const handleSelectChannel = (e) => {
    if (e === null) {
      setSelectedChannels([]);
    } else {
      setSelectedChannels(e);
    }
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: "update_bot" }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleConfirm = () => {
    if (!loading) {
      setLoading(true);
      if (mode === "admin") {
        const payload = {
          id: item.id,
          bot_name: name,
          new_ch_ids: selectedChannels.map((c) => c.id),
          remove_ch_ids: item.channel_connected.filter((id) => {
            return !selectedChannels.some((c) => c.id === id);
          }),
        };
        updateUserBot(payload, (err, res) => {
          setLoading(false);
          if (err) return;
          toaster.success(`${name} successfully updated.`);
          toggle();
        });
      } else if (mode === "gripp") {
        const payload = {
          id: item.id,
          bot_name: name,
          new_ch_ids: selectedChannels.map((c) => c.id),
          remove_ch_ids: item.channel_connected.filter((id) => {
            return !selectedChannels.some((c) => c.id === id);
          }),
        };
        updateGrippBot(payload, (err, res) => {
          setLoading(false);
          if (err) return;
          toaster.success(`${name} successfully updated.`);
          toggle();
        });
      }
    }
  };

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"lg"} onOpened={onOpened} centered>
      <ModalHeaderSection toggle={toggle}>
        {dictionary.edit} {item.name}
      </ModalHeaderSection>
      <ModalBody>
        <WrapperDiv className={"modal-input"}>
          <div>
            {/* <Label className={"modal-info"}>{dictionary.folderInfo}</Label> */}
            <Label className={"modal-label"} for="bot">
              {dictionary.botNameLabel}
            </Label>
          </div>
          <div className="input-container">
            <Input defaultValue={item.name} placeholder={dictionary.inputPlaceholder} onChange={handleNameChange} innerRef={inputRef} />
          </div>
        </WrapperDiv>
        <div className="mt-3">
          <Label className={"modal-label"} for="bot">
            {dictionary.webhookUrl}
          </Label>
          <Label className={"modal-info"}>{item.url_webhook}</Label>
        </div>
        <div className="mt-3">
          <Label className={"modal-label"} for="bot">
            {dictionary.connectedChannelsLabel}
          </Label>
          <FolderSelect options={channelOptions} value={selectedChannels} onChange={handleSelectChannel} isMulti={true} isClearable={true} />
        </div>
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

export default React.memo(UpdateAdminBotModal);
