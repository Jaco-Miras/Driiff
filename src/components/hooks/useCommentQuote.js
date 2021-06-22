import React, { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import styled from "styled-components";
import quillHelper from "../../helpers/quillHelper";
import ImageTextLink from "../common/ImageTextLink";

const StyledImageTextLink = styled(ImageTextLink)`
  display: block;
`;

const useCommentQuote = (commentId) => {
  const quotes = useSelector((state) => state.posts.commentQuotes);
  const [quote, setQuote] = useState(null);
  const [quoteBody, setQuoteBody] = useState(null);

  useEffect(() => {
    if (Object.keys(quotes).length > 0) {
      let selectedQuote = Object.values(quotes).filter((q) => q.id === commentId);
      if (selectedQuote.length) {
        setQuote(selectedQuote[0]);
        selectedQuote = selectedQuote[0];
        let selectedQuoteBody = "";
        let div = document.createElement("div");
        div.innerHTML = selectedQuote.body;
        let images = div.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
          selectedQuoteBody += renderToString(
            <StyledImageTextLink className={"image-quote"} target={"_blank"} href={images[0].getAttribute("src")} icon={"image-video"}>
              Photo
            </StyledImageTextLink>
          );
        }

        let videos = div.getElementsByTagName("video");
        for (let i = 0; i < videos.length; i++) {
          selectedQuoteBody += renderToString(
            <StyledImageTextLink className={"video-quote"} target={"_blank"} href={videos[0].getAttribute("player-source")} icon={"image-video"}>
              Video
            </StyledImageTextLink>
          );
        }
        if (selectedQuote.files) {
          selectedQuote.files.forEach((file) => {
            if (file.type === "image") {
              selectedQuoteBody += renderToString(
                <StyledImageTextLink className={"image-quote"} target={"_blank"} href={file.view_link} icon={"image-video"}>
                  Photo
                </StyledImageTextLink>
              );
            } else if (file.type === "video") {
              selectedQuoteBody += renderToString(
                <StyledImageTextLink className={"video-quote"} target={"_blank"} href={file.view_link} icon={"image-video"}>
                  Video
                </StyledImageTextLink>
              );
            } else {
              selectedQuoteBody += renderToString(
                <StyledImageTextLink
                  //className={`video-quote`}
                  target={"_blank"}
                  href={file.view_link}
                  icon={"download"}
                >
                  {file.filename ? `${file.filename} ` : `${file.name} `}
                </StyledImageTextLink>
              );
            }
          });
        }

        selectedQuoteBody += quillHelper.parseEmoji(selectedQuote.body);
        setQuoteBody(selectedQuoteBody);
      } else {
        setQuote(null);
        setQuoteBody(null);
      }
    } else {
      setQuote(null);
      setQuoteBody(null);
    }
  }, [quotes, commentId]);

  return [quote, quoteBody];
};

export default useCommentQuote;
