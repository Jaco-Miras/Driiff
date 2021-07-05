import React, { useCallback } from "react";
import { CustomInput } from "reactstrap";
import styled from "styled-components";
import { useSettings, useToaster, useTranslation } from "../../hooks/";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setChannelIsTranslate, updateChannelIsTranslate } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  font-size: 13px;
  font-weight: 600;
  .card {
    overflow: visible;
  }
  .custom-switch {
    input {
      cursor: pointer;
    }
  }
`;

const ReleaseLink = styled.span`
  font-weight: 600;
  cursor: pointer;
`;

const ChatTranslateActions = (props) => {
  const { className = "", selectedChannel, chatMessageActions, translated_channels } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { setGeneralSetting } = useSettings();

  const { _t, setLocale, uploadTranslationToServer } = useTranslation();
  const dictionary = {
    chatTranslateTitle: _t("SETTINGS.CHAT_TRANSLATE_TITLE", "Live translation"),
    chatTranslateTitleExtra: _t("SETTINGS.CHAT_TRANSLATE_TITLE_EXTRA", "Talk in your own language"),
  };

  const handleTranslateSwitchToggle = useCallback((e) => {
    e.persist();
    const { name, checked, dataset } = e.target;
    toaster.success(<span>{dataset.successMessage}</span>);
    chatMessageActions.saveChannelTranslateState({ ...selectedChannel, is_translate: checked });
    setChannelTrans({
      ...selectedChannel,
      [name]: checked,
    });
    const id = selectedChannel.id;
    if (checked) {
      setGeneralSetting({
        translated_channels: [...translated_channels, id],
      });
    } else {
      setGeneralSetting({
        translated_channels: translated_channels.filter(function (e) {
          return e !== id;
        }),
      });
    }
  });

  const setChannelTrans = useCallback((e) => {
    dispatch(
      setChannelIsTranslate(e, () => {
        let payload = { ...e };
        dispatch(updateChannelIsTranslate(payload));
      })
    );
  });

  if (translated_channels.length > 0 && translated_channels.includes(selectedChannel.id) && !selectedChannel.is_translate) chatMessageActions.saveChannelTranslateState({ ...selectedChannel, is_translate: true });

  let is_translate = translated_channels.includes(selectedChannel.id); //(selectedChannel && selectedChannel.is_translate) ? selectedChannel.is_translate : false;

  return (
    <Wrapper>
      <div className="d-flex">
        <div className="flex-grow-1 ">
          <span>{dictionary.chatTranslateTitleExtra}</span>
        </div>
        <CustomInput
          className="cursor-pointer text-muted"
          type="switch"
          id="is_translate"
          checked={is_translate}
          name="is_translate"
          onChange={handleTranslateSwitchToggle}
          data-success-message={`You have turn ${is_translate ? "OFF" : "ON"} translate chat messages!`}
        />
      </div>
    </Wrapper>
  );
};

export default ChatTranslateActions;
