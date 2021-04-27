import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import styled from "styled-components";


const TranslationHtmlContainer = styled.div`
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

const OriginalHtmlShow = styled.div``;

const TranslatedHtml = styled.div``;

const useChatTranslate = (props) => {
  const { message, isAuthor, translate, language, actions } = props;
  
  //const [trans, transSet] = useState("");
  useEffect(() => {
    const fetchTrans = (message) => {
      fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text=" + message.body + "&target_lang=" + language)
        .then((res) => res.json())
        .then((data) => {
          let OriginalHtmlRow = (
            <TranslationHtmlContainer className="TranslationHtmlContainer" dangerouslySetInnerHTML={{ __html: data.translations[0].text + renderToString(<OriginalHtml className="OriginalHtml" dangerouslySetInnerHTML={{ __html: message.body }}></OriginalHtml>) }}></TranslationHtmlContainer>
          );
          //transSet(renderToString(OriginalHtmlRow));
          // update the body in the reducer, no need to return the translated body or set the translated body to state
          // will also update the last reply body so useChatTranslatePreview is not need
          actions.saveTranslationBody({ ...message, translated_body: data.translations[0].text, body: renderToString(OriginalHtmlRow), original_body: message.body, is_translated:translate });
        })
        .catch(console.log);
    };

    //check if message has translated_body value, if translated_body is undefined or null then trigger deepl api
    if (!isAuthor && message.user && message.user.language !== language && translate && !message.translated_body) fetchTrans(message);
    else {
      if(message.original_body && !translate)
        actions.saveTranslationBody({ ...message, body:message.original_body, is_translated:translate});   
      else if(message.original_body){
        let OriginalHtmlRow = (<TranslationHtmlContainer className="TranslationHtmlContainer" dangerouslySetInnerHTML={{ __html: message.translated_body +  renderToString(<OriginalHtml className="OriginalHtml" dangerouslySetInnerHTML={{ __html: message.original_body }}></OriginalHtml>) }}></TranslationHtmlContainer>);
        actions.saveTranslationBody({ ...message, body: renderToString(OriginalHtmlRow), is_translated:translate});   
      }
      //transSet(message);
      //return message.body;
    }
  }, []);
  //return trans;
};
export default useChatTranslate;