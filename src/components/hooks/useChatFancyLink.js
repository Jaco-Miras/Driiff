import { useEffect, useState, useRef } from "react";

import { getChatMsgsForFancy } from "../../redux/services/chat";

const useChatFancyLink = (props) => {
  const { message, actions } = props;
  const componentIsMounted = useRef(true);
  const [fancyContent, setFancyContent] = useState(null);
  function getMessage(message) {
    getChatMsgsForFancy({ content: message.body })
      .then((res) => {
        return res;
      })
      .then((response) => {
        if (componentIsMounted.current) setFancyContent(response.data.body);
      });
  }
  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);
  useEffect(() => {
    !message.flagged && (message.body.match(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g) || []).length > 0 && fancyContent === null && getMessage(message);
    !message.flagged && fancyContent !== null && actions.saveFancyContent({ ...message, body: fancyContent, flagged: true });
  }, [fancyContent]);
};
export default useChatFancyLink;
