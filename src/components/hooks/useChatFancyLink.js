import React, { useEffect, useState, useRef } from "react";
import { FancyLink } from "../common";
import { renderToString } from "react-dom/server";
import { getChatMsgsForFancy } from "../../redux/services/chat";

const useChatFancyLink = (props) => {
  const { message, actions } = props;
  const componentIsMounted = useRef(true);
  function getMessage(message) {
    getChatMsgsForFancy({ content: message.body })
      .then((res) => {
        return res;
      })
      .then((response) => {
        if (componentIsMounted.current) setFancyContent(response.data.body);
      });
    return fancyContent !== null ? fancyContent : message.body;
  }

  function convertFavis(content) {
    return content.replace(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g, function (fullText, beforeLink, anchorContent, href, lnkUrl, linkText, endAnchor) {
      var div = document.createElement("div");
      div.innerHTML = fullText.trim();
      if (div.getElementsByClassName("fancied").length > 0) return renderToString(<FancyLink link={href} title={lnkUrl} />);
      else return fullText;
    });
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
    const links = messageBody.match(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g);

    let filteredLinks = [];
    if (links) {
      const { REACT_APP_localDNSName } = process.env;
      filteredLinks = links.filter((l) => !l.includes(`${REACT_APP_localDNSName}/profile/`));
    }
    if (filteredLinks.length > 0 && !message.is_fancy) result = getMessage(message);

    if (fancyContent !== null) {
      let body = convertFavis(result);
      //console.log({body, result});
      actions.saveFancyContent({ ...message, body: body, is_fancy: true });
    }
  }, [fancyContent]);
  // useEffect(() => {
  //   let result = messageBody;
  //   if ((messageBody.match(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g) || []).length > 0 && !message.is_fancy) result = getMessage(message);

  //   if (fancyContent !== null) {
  //     let body = convertFavis(result);
  //     //console.log({body, result});
  //     actions.saveFancyContent({ ...message, body: body, is_fancy: true });
  //   }
  // }, [fancyContent]);
};
export default useChatFancyLink;
