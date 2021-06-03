import React, { useEffect, useState } from "react";
//import { GoogleDriveLink, FancyLink } from "../common";
//import { renderToString } from "react-dom/server";
import { getChatMsgsForFancy } from "../../redux/services/chat";

const useChatFancyLink = (props) => {
  const { message, actions } = props;

  function getMessage(message) {
    getChatMsgsForFancy({ content: message.body }).then((res) => {
      return res;
    }).then((response) => {
      setFancyContent(response.data.body);
    });
    return (fancyContent !== null) ? fancyContent : message.body;
  }
  const [fancyContent, setFancyContent] = useState(null);
  const messageBody = message.body;

  let result = messageBody;
  if ((messageBody.match(/(((https?:\/\/)|(www\.))[^\s]+)/g) || []).length > 0 && !message.is_fancy)
    result = getMessage(message);

  useEffect(() => {
    if (fancyContent !== null) {
      actions.saveFancyContent({ ...message, body: result, is_fancy: true });
    }
  }, [fancyContent]);

};
export default useChatFancyLink;