import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { clearQuote } from "../../../redux/actions/chatActions";
import { SvgIconFeather } from "../../common";
import { useSelectQuote } from "../../hooks";

const QuoteWrapper = styled.div`
  padding: 0 10px 10px 2.5rem;
  display: block;
  text-align: left;
  position: relative;
  width: 100%;
  margin-top: 8px;
  background: #fafafa;
  border-radius: 4px;

  .dark & {
    background: #25282c;
    color: #fff;
  }

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
    left: 12px;
    top: 12px;
    cursor: pointer;
    svg {
      width: 16px;
    }
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

const ChatQuote = (props) => {
  const [quote, quoteBody] = useSelectQuote();
  const dispatch = useDispatch();

  const handleClearQuote = () => {
    dispatch(clearQuote(quote));
  };

  if (quote) {
    return (
      <QuoteWrapper>
        <span className={"quote-author-name"} dangerouslySetInnerHTML={{ __html: quote.user ? quote.user.name : "" }}></span>
        <span className={"quote-message"} dangerouslySetInnerHTML={{ __html: quote.body ? quoteBody : "" }}></span>
        <span className={"quote-clear-container"} onClick={handleClearQuote}>
          <IconButton icon="x" />
        </span>
      </QuoteWrapper>
    );
  } else {
    return null;
  }
};

export default ChatQuote;
