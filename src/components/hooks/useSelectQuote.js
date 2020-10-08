import React, { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import styled from "styled-components";
import quillHelper from "../../helpers/quillHelper";
import ImageTextLink from "../common/ImageTextLink";
import { useParams } from "react-router-dom";

const StyledImageTextLink = styled(ImageTextLink)`
  display: block;
`;

const PushLink = styled.a`  
  display: inline-block;
  position: relative;
  margin-left: 0.5rem;
  
  .dark & {
    background: #25282c;
    color: #fff;
  }
  
  &:before {
    position: absolute;
    left: -14px;
    top: -2px;
    bottom: 0;
    width: 6px;
    height: 100%;
    background: #ffa341;
    content: "";
    border-radius: 6px 0 0 6px;
  }
  
  .card-body {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 1rem;
  }
`;

const useSelectQuote = (props) => {

  const params = useParams();

  const quotes = useSelector((state) => state.chat.chatQuotes);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const [quote, setQuote] = useState(null);
  const [quoteBody, setQuoteBody] = useState(null);

  useEffect(() => {
    if (Object.keys(quotes).length > 0) {
      let selectedQuote = Object.values(quotes).filter((q) => q.channel_id === selectedChannel.id);
      if (selectedQuote.length) {
        setQuote(selectedQuote[0]);
        selectedQuote = selectedQuote[0];
        let selectedQuoteBody = "";
        if (selectedQuote.user) {
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
        } else {

          if (selectedQuote.body.startsWith("CHANNEL_UPDATE")) {
            selectedQuoteBody = document.getElementById(`bot-${selectedQuote.id}`).outerHTML;

          } else if (selectedQuote.body.startsWith("POST_CREATE::")) {
            let item = JSON.parse(selectedQuote.body.replace("POST_CREATE::", ""));
            let link = "";
            if (params && params.workspaceId) {
              if (params.folderId) {
                link = `/workspace/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`;
              } else {
                link = `/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`;
              }
            } else {
              link = `/posts/${item.post.id}/${item.post.title}`;
            }

            let description = quillHelper.parseToText(item.post.description);
            selectedQuoteBody = renderToString(<PushLink href={link} className="push-link" data-href={link}
                                                         data-has-link="0" data-ctrl="0">
              <b>{item.author.first_name}</b> created the post <b>"{item.post.title}"</b>
              {
                description.trim() !== "" &&
                <span className="card card-body"
                      dangerouslySetInnerHTML={{ __html: description }}/>
              }
            </PushLink>);
          } else {
            selectedQuoteBody = selectedQuote.body;
          }
        }
        setQuoteBody(selectedQuoteBody);
      } else {
        setQuote(null);
        setQuoteBody(null);
      }
    } else {
      setQuote(null);
      setQuoteBody(null);
    }
  }, [quotes, selectedChannel]);

  return [quote, quoteBody];
};

export default useSelectQuote;
