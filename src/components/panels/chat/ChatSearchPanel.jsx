import React, { useRef, useState, useMemo } from "react";
//import { useSelector } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
//import SearchForm from "../../forms/SearchForm";
import { useTimeFormat, useTranslationActions, useRedirect } from "../../hooks";
//import { getChatMsgsSearch } from "../../../redux/services/chat";
import ChatSearchInput from "./ChatSearchInput";
import { throttle } from "lodash";

const Wrapper = styled.div`
  position: absolute;
  top: 59px;
  bottom: 0;
  right: 0;
  width: 100%;
  height: calc(100% - 59px);
  transform: translateX(100%);
  transition: 0.1s ease-out;
  padding: 0 1em;
  margin-right: -10px;
  z-index: 3;
  background: #fff;
  color: #8b8b8b;
  ${(props) => props.isActive && "transform: translateX(0%);margin:0px;"}
  .dark & {
    background: #191c20;
    color: #c7c7c7;
  }
`;

// const BackIcon = styled(SvgIconFeather)`
//   cursor: pointer;
// `;

const ResultWrapper = styled.ul`
  list-style: none;
  background: transparent;
  margin: 0;
  padding: 0;
  li:last-child {
    border-bottom: none;
  }
`;
const ResultItem = styled.li`
  cursor: pointer;
  background: transparent;
  font-size: 0.835re;
  padding: 5px 20px;
  margin-top: 0;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 1px solid #ebebeb;
  .dark & {
    border-color: rgba(155, 155, 155, 0.1);
    color: #c7c7c7;
  }
  color: #495057;
  .chat-search-header span {
    font-size: smaller;
    margin: 0;
  }
  div.chat-search-body {
    font-size: 0.835re;
  }
  div.chat-search-body span {
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
    .dark & {
      color: #fff;
    }
  }
  :focus {
    background-color: #f0f0f050;
  }
`;
const ResultDivWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 43px);
`;
const EmptyState = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 5rem;
  color: #8b8b8b;
  .dark & {
    color: #c7c7c7;
  }
  svg {
    display: block;
    margin: 0 auto;
  }
  h3 {
    font-size: 16px;
  }
  h5 {
    margin-bottom: 0;
    font-size: 14px;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

// const SearchForm = styled.form`
//   flex-grow: 1;
//   margin: 0 0.5rem 0 0.5em !important;
//   .form-control {
//     border-radius: 8px !important;
//     padding-left: 40px;
//     transition: padding-left 0.4s cubic-bezier(0.275, 0.42, 0, 1);
//     &:focus {
//       padding-left: 12px;
//     }
//   }
//   .not-empty .form-control {
//     padding-left: 12px;
//   }
//   .not-empty .input-group-append {
//     display: none;
//   }
//   .btn-cross {
//     right: 0 !important;
//   }
//   .input-group-append {
//     position: absolute;
//     top: 2px;
//     left: 0;
//     button {
//       border: 0 !important;
//       padding: 10px 14px !important;
//       color: #aaa;
//       pointer-events: none;
//     }
//   }
//   @media (max-width: 480px) {
//     margin: 0 0 0.75rem !important;
//   }
//   &::placeholder {
//     color: #aaa;
//   }
//   .btn-cross {
//     position: absolute;
//     right: 45px;
//     opacity: 0;
//     border: 0;
//     background: transparent;
//     padding: 0;
//     height: 100%;
//     width: 36px;
//     border-radius: 4px;
//     svg {
//       width: 16px;
//       color: #495057;
//     }
//   }
//   .not-empty .btn-cross {
//     z-index: 9;
//     opacity: 1;
//   }
//   .loading {
//     height: 1rem;
//     width: 1rem;
//   }
// `;

const ChatSearchPanel = (props) => {
  const { showSearchPanel, handleSearchChatPanel, selectedChannel, user } = props;
  const firstResult = useRef(null);
  const { localizeChatDate } = useTimeFormat();
  const { _t } = useTranslationActions();
  const [triggerLoadMore, setTriggerLoadMore] = useState(false);
  const [results, setResults] = useState([]);
  const dictionary = {
    noItemsFoundHeader: _t("CHATSEARCH.NO_ITEMS_FOUND_HEADER", "WOO!"),
    noItemsFoundText: _t("CHATSEARCH.NO_ITEMS_FOUND_TEXT", "Nothing here but me… 👻"),
    you: _t("CHATSEARCH.YOU", "You"),
  };

  const handleScroll = useMemo(() => {
    const throttled = throttle((e) => {
      if (e.target.scrollHeight - e.target.scrollTop < 1500) {
        setTriggerLoadMore(true);
      }
    }, 300);
    return (e) => {
      e.persist();
      return throttled(e);
    };
  }, []);

  const redirect = useRedirect();

  const handleRedirect = (topic) => {
    handleSearchChatPanel();
    redirect.toChat(selectedChannel, topic);
  };

  const handleResultKeydown = (e, k, item) => {
    if (e.key === "Enter") {
      handleRedirect(item);
    }
    if (e.key === "ArrowDown") {
      e.currentTarget.nextSibling && e.currentTarget.nextSibling.focus();
    }
    if (e.key === "ArrowUp") {
      if (e.currentTarget.previousSibling && k > 0) {
        e.currentTarget.previousSibling.focus();
      }
    }
  };

  return (
    <Wrapper isActive={showSearchPanel}>
      <div className="d-flex justify-content-between align-items-flex-start align-items-center mb-2">
        {/* <BackIcon icon="chevron-left" onClick={handleSearchChatPanel} /> */}
        <ChatSearchInput placeholder={"Search chat"} results={results} setResults={setResults} selectedChannel={selectedChannel} triggerLoadMore={triggerLoadMore} setTriggerLoadMore={setTriggerLoadMore} />
      </div>
      <ResultDivWrapper className="justify-content-between align-items-center" onScroll={handleScroll}>
        <ResultWrapper>
          {showSearchPanel &&
            results.length > 0 &&
            results.map((item, k) => {
              const isAuthor = item.user && item.user.id === user.id;
              return (
                <ResultItem onClick={(e) => handleRedirect(item)} key={item.id} ref={k === 0 ? firstResult : null} autoFocus={k === 0} onKeyDown={(e) => handleResultKeydown(e, k, item)} tabIndex={k + 1}>
                  <div className="d-flex align-items-center chat-search-header">
                    <div className="d-flex justify-content-between align-items-center text-muted w-100">
                      <div className="d-inline-flex justify-content-center align-items-start">
                        <div>
                          <span>{isAuthor ? dictionary.you : item.user.name}</span>
                        </div>
                      </div>
                      <div className="d-inline-flex">
                        <div>
                          <span>{localizeChatDate(item.created_at.timestamp, "ddd, MMM DD, YYYY")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chat-search-body mb-2" dangerouslySetInnerHTML={{ __html: item.body }}></div>
                </ResultItem>
              );
            })}
          {showSearchPanel && results.length === 0 && (
            <EmptyState>
              {" "}
              <h3>{dictionary.noItemsFoundHeader}</h3>
              <h5>{dictionary.noItemsFoundText} </h5>{" "}
            </EmptyState>
          )}
        </ResultWrapper>
      </ResultDivWrapper>
    </Wrapper>
  );
};
export default ChatSearchPanel;
