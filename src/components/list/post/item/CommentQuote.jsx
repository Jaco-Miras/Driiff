import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { useCommentQuote } from "../../../hooks";

const QuoteWrapper = styled.div`
  padding: 0 10px 10px;
  display: block;
  text-align: left;
  position: relative;
  width: 100%;
  border-left: 2px solid #972c86;
  margin-left: 30px;
  margin-bottom: 10px;

  .quote-author-name,
  .quote-message {
    position: relative;
    display: inline-block;
    width: calc(100% - 20px);
  }
  .quote-author-name {
    font-weight: 600;
    font-size: 12px;
  }
  .quote-message {
    font-size: 12px;
  }
  .quote-clear-container {
    position: absolute;
    left: -35px;
    top: calc(50% - 10px);
    background-color: #fff;
    cursor: pointer;
    cursor: hand;
  }
  img,
  video {
    display: none;
  }
  .video-quote,
  .image-quote {
    img {
      display: inline-block;
    }
  }
`;
const IconButton = styled(SvgIconFeather)``;

const CommentQuote = (props) => {
  const { commentActions, commentId } = props;
  const [quote, quoteBody] = useCommentQuote(commentId);

  const handleClearQuote = () => {
    commentActions.clearQuote(commentId);
  };

  if (quote) {
    return (
      <QuoteWrapper>
        <span className={"quote-author-name"} dangerouslySetInnerHTML={{ __html: quote.user ? quote.user.name : "" }}></span>
        <span className={"quote-message"} dangerouslySetInnerHTML={{ __html: quote.body ? quoteBody.split("</p>")[0] : "" }}></span>
        <span className={"quote-clear-container"} onClick={handleClearQuote}>
          <IconButton icon="x" />
        </span>
      </QuoteWrapper>
    );
  } else {
    return null;
  }
};

export default CommentQuote;
