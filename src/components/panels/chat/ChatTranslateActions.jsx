import React, { useCallback, useState, useEffect } from "react";
import { CustomInput } from "reactstrap";
import styled from "styled-components";
import { useSettings, useToaster, useTranslation } from "../../hooks/";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setChannelIsTranslate, updateChannelIsTranslate } from "../../../redux/actions/workspaceActions";


const Wrapper = styled.div`
  .card {
    overflow: visible;
  }

  .custom-switch {
    padding: 0;
    justify-content: left;
    align-items: center;
    display: flex;
    min-height: 38px;
    .custom-control-label::after {
      right: -11px;
      left: auto;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 100%;
      top: 2px;
    }

    input[type="checkbox"]:checked + .custom-control-label::after {
      right: -23px;
    }

    .custom-control-label::before {
      right: -2.35rem;
      left: auto;
      width: 3rem;
      height: 1.5rem;
      border-radius: 48px;
      top: 0;
    }

    input {
      cursor: pointer;
    }
    label {
      cursor: pointer;
      width: calc(100% - 40px);
      min-height: 25px;
      display: flex;
      align-items: center;

      span {
        display: block;
        width: calc(100% - 35px);
      }
    }
  }
  .version-number {
    display: flex;
    place-content: center;
    font-size: 13px;
  }
`;

const ReleaseLink = styled.span`
  font-weight: 500;
  cursor: pointer;
`;

const ChatTranslateActions = (props) => {
  const { className = "", selectedChannel, chatMessageActions } = props;
  
  const history = useHistory();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const {
    generalSettings: { language },
    chatSettings: { translate }
  } = useSettings();

  const { _t, setLocale, uploadTranslationToServer } = useTranslation();
  const dictionary = {
    chatTranslateTitle: _t("SETTINGS.CHAT_TRANSLATE", "Talk in your own language (live translation) !BETA!"),
  };

  const handleTranslateSwitchToggle = useCallback(
    (e) => {
      e.persist();
      const { name, checked, dataset } = e.target;
      toaster.success(<span>{dataset.successMessage}</span>);
      chatMessageActions.saveChannelTranslateState({ ...selectedChannel, is_translate: checked });
      setTimeout(
        function() {
          setChannelTrans({
            ...selectedChannel,
            [name]: checked,
          });
        }
        .bind(this),
        3000
    );
    },
  );

  const setChannelTrans = useCallback(
    (e) => {
      dispatch(
        setChannelIsTranslate(e, () => {
          let payload = { ...e };
          dispatch(updateChannelIsTranslate(payload));
        })
      );
    },
  );

  let is_translate = (selectedChannel && selectedChannel.is_translate) ? selectedChannel.is_translate : false;

  return (
    <Wrapper>
      <CustomInput
        className="cursor-pointer text-muted"
        type="switch"
        id="is_translate"
        checked={is_translate}
        name="is_translate"
        onChange={handleTranslateSwitchToggle}
        data-success-message={`You have turn ${is_translate ? "OFF" : "ON"} translate chat messages!`}
        label={<span>{dictionary.chatTranslateTitle}</span>}
      />

    </Wrapper>
  );
};

export default ChatTranslateActions;