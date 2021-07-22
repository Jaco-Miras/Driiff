import React, { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";

const useChatTranslatePreview = (message, user, translate, language, basicMessageFlag) => {
  const [trans, transSet] = useState("");
  useEffect(() => {
    function fetchTrans(message) {
      fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text=" + message + "&target_lang=" + language)
        .then((res) => res.json())
        .then((data) => {
          let firstName = user.first_name;
          let spanName = firstName + ":";
          let InnerHTML = <span className="last-reply-name" dangerouslySetInnerHTML={{ __html: spanName }}></span>;
          transSet(renderToString(InnerHTML) + " " + data.translations[0].text);
        });
      //.catch(console.log);
    }
    // if(!isAuthor && user.language !== language && translate)
    if (user && translate && basicMessageFlag) fetchTrans(message);
    else transSet(message);
  }, []);
  return trans;
};
export default useChatTranslatePreview;
