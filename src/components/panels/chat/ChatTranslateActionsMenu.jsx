import React, { useCallback } from "react";
import { CustomInput } from "reactstrap";
import styled from "styled-components";
import { useSettings, useToaster, useTranslationActions } from "../../hooks";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setChannelIsTranslate, updateChannelIsTranslate } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div``;

const ChatTranslateActions = (props) => {
  const { className = "", selectedChannel, chatMessageActions, translated_channels } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { setGeneralSetting } = useSettings();

  const { _t } = useTranslationActions();
  const dictionary = {
    chatTranslateOn: _t("SETTINGS.CHAT_TRANSLATE_TITLE_ON", "Turn ON chat translate."),
    chatTranslateOff: _t("SETTINGS.CHAT_TRANSLATE_TITLE_OFF", "Turn OFF chat translate."),
    chatTranslateIsOn: _t("SETTINGS.CHAT_TRANSLATE_TITLE_ON", "You have successfully turned ON chat translate."),
    chatTranslateIsOff: _t("SETTINGS.CHAT_TRANSLATE_TITLE_ON", "You have successfully turned OFF chat translate"),
  };
  const isTranslate = translated_channels.length > 0 && translated_channels.includes(selectedChannel.id) ? true : false;

  const handleTranslate = useCallback((e) => {
    e.persist();

    const checked = !isTranslate ? true : !selectedChannel.is_translate;

    chatMessageActions.saveChannelTranslateState({ ...selectedChannel, is_translate: checked });

    setChannelTrans({
      ...selectedChannel,
      is_translate: checked,
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
    toaster.success(<span>{checked ? dictionary.chatTranslateIsOn : dictionary.chatTranslateIsOff}</span>);
  });

  const setChannelTrans = useCallback((e) => {
    dispatch(
      setChannelIsTranslate(e, () => {
        let payload = { ...e };
        dispatch(updateChannelIsTranslate(payload));
      })
    );
  }); //(selectedChannel && selectedChannel.is_translate) ? selectedChannel.is_translate : false;

  /*
  if (translated_channels.length > 0 && translated_channels.includes(selectedChannel.id) && !selectedChannel.is_translate)
    chatMessageActions.saveChannelTranslateState({ ...selectedChannel, is_translate: true });
*/
  return <Wrapper onClick={handleTranslate}>{!isTranslate ? dictionary.chatTranslateOn : dictionary.chatTranslateOff}</Wrapper>;
};

export default ChatTranslateActions;
