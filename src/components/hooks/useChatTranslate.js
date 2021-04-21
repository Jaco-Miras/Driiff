import React, { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";
import styled from "styled-components";

const OriginalHtmlContainer = styled.div`
  cursor: pointer;
  &:hover > div {
    transition: opacity 2s ease-out;
    opacity: 1;
    height: auto;
  }
`;

const OriginalHtml = styled.div`
  font-size: small;
  padding-left: 0.5em;
  border-left: gray 2px solid;
  transition: opacity 2s ease-in;
  opacity: 0;
  height: 0;
  overflow: hidden;
`;

const useChatTranslate = (message, isAuthor, user, translate, language) => {
  const [trans, transSet] = useState("");

  useEffect(() => {
    function fetchTrans(message) {
      fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text=" + message + "&target_lang=" + language)
        .then((res) => res.json())
        .then((data) => {
          let OriginalHtmlRow = <OriginalHtmlContainer dangerouslySetInnerHTML={{ __html: data.translations[0].text + renderToString(<OriginalHtml dangerouslySetInnerHTML={{ __html: message }}></OriginalHtml>) }}></OriginalHtmlContainer>;
          transSet(renderToString(OriginalHtmlRow));
        })
        .catch(console.log);
    }
    if (!isAuthor && user.language !== language && translate) fetchTrans(message);
    else {
      transSet(message);
    }
  }, []);

  return trans;
};
export default useChatTranslate;
