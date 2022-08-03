import { useEffect } from "react";
import { useSelector } from "react-redux";
const useChatTranslate = (props) => {
  const { message, isAuthor, translate, chat_language, actions, channel } = props;
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  let sharedPayload = null;
  if (channel && channel.sharedSlug) {
    sharedPayload = { slug: channel.slug, token: sharedWs[channel.slug].access_token, is_shared: true };
  }
  function fetchTrans(message) {
    return fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text=" + message.body + "&target_lang=" + chat_language)
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch(console.log);
  }
  useEffect(() => {
    //&& message.translated_language !== chat_language
    if (!isAuthor && message.user.chat_language !== chat_language && translate && !message.is_translated && message.translated_language !== chat_language) {
      fetchTrans(message).then(function (result) {
        if (typeof result !== "undefined") {
          let text = result.translations[0].text;
          actions.setTranslationBody({ ...message, translated_body: text, is_translated: translate, translated_language: chat_language, sharedSlug: channel.sharedSlug, channelCode: channel.code });
          actions.saveTranslation({ message_id: message.id, body: text, language: chat_language, sharedSlug: channel.sharedSlug, channelCode: channel.code, sharedPayload: sharedPayload });
        }
      });
    }
  }, [translate]);
};
export default useChatTranslate;
