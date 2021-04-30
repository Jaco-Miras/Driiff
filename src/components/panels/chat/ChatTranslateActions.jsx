import React, { useCallback} from "react";
import { CustomInput } from "reactstrap";
import styled from "styled-components";
import { useSettings, useToaster, useTranslation } from "../../hooks/";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setChannelIsTranslate, updateChannelIsTranslate } from "../../../redux/actions/workspaceActions";


const Wrapper = styled.div`
font-size:13px;
font-weight:600;
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
    chatTranslateTitle: _t("SETTINGS.CHAT_TRANSLATE_TITLE", "Live translation"),
    chatTranslateTitleExtra: _t("SETTINGS.CHAT_TRANSLATE_TITLE_EXTRA", "Talk in your own language"),
  };

  const handleTranslateSwitchToggle = useCallback(
    (e) => {
      e.persist();
      const { name, checked, dataset } = e.target;
      toaster.success(<span>{dataset.successMessage}</span>);
      chatMessageActions.saveChannelTranslateState({ ...selectedChannel, is_translate: checked, hash: Math.random() });

      setChannelTrans({
        ...selectedChannel,
        [name]: checked,
      });
      /*
       setTimeout(
         function() {
           setChannelTrans({
             ...selectedChannel,
             [name]: checked,
           });
         }
         .bind(this),
         3000
     );*/
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
        label={<span>{dictionary.chatTranslateTitle}</span>}
      />
      </div>
    </Wrapper>
  );
};

export default ChatTranslateActions;