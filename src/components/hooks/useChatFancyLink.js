import React, { useEffect, useState, useRef } from "react";
import { FancyLink } from "../common";
import { renderToString } from "react-dom/server";
import { getChatMsgsForFancy } from "../../redux/services/chat";

const useChatFancyLink = (props) => {
  const { message, actions } = props;
  const componentIsMounted = useRef(true);
  function getMessage(message) {
    getChatMsgsForFancy({ message_id: message.id, content: message.body })
      .then((res) => {
        return res;
      })
      .then((response) => {
        if (componentIsMounted.current) setFancyContent(response.data.body);
      });
    return fancyContent !== null ? fancyContent : message.body;
  }
  const [fancyContent, setFancyContent] = useState(null);

  const messageBody = message.body;

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let result = messageBody;

    if (!messageBody.includes('<span class="fancied">') && (messageBody.match(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g) || []).length > 0 && !message.is_fancy) result = getMessage(message);
    if (fancyContent !== null)
      actions.saveFancyContent({ ...message, body: result, is_fancy: true });

  }, [fancyContent]);
};
export default useChatFancyLink;