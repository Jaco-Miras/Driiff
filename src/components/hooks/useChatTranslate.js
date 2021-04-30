import { useEffect } from "react";

const useChatTranslate = (props) => {
  const { message, isAuthor, translate, language, actions } = props;

  function fetchTrans(message) {
    return fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text=" + message.body + "&target_lang=" + language)
      .then((res) => res.json())
      .then((data) => { return data; })
      .catch(console.log);
  };
  useEffect(() => {
    if (!isAuthor && message.user.language !== language && translate && !message.is_translated) {
      fetchTrans(message).then(function (result) {
        actions.saveTranslationBody({ ...message, translated_body: result.translations[0].text, original_body: message.body, is_translated: translate });
      });
    }

  }, [translate]);
};
export default useChatTranslate;