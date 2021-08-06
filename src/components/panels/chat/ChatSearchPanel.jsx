import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import SearchForm from "../../forms/SearchForm";
import { useTimeFormat, useTranslationActions, useRedirect } from "../../hooks";
import { getChatMsgsSearch } from "../../../redux/services/chat";
const Wrapper = styled.div`position: absolute;
top: 0;
bottom: 0;
right: 0;
width: 100%;
height: 100%;
transform: translateX(100%);
transition: .1s ease-out;
color: #eee;
padding: 0 1em;
margin-right:-10px;
background:#FFF;

z-index: 3;
${(props) =>
    props.isActive &&
    `transform: translateX(0%);margin:0px;`}
`
const Search = styled(SearchForm)`
  flex-grow: 1;
  margin:0 0.5rem 0 0.5em !important;
  .form-control {
    border-radius: 8px !important;
    padding-left: 40px;
    transition: padding-left 0.4s cubic-bezier(0.275, 0.42, 0, 1);
    &:focus {
      padding-left: 12px;
    }
  }
  .not-empty .form-control {
    padding-left: 12px;
  }
  .not-empty .input-group-append {
    display: none;
  }
  .btn-cross {
    right: 0 !important;
  }
  .input-group-append {
    position: absolute;
    top: 2px;
    left: 0;
    button {
      border: 0 !important;
      padding: 10px 14px !important;
      color: #aaaaaa;
      pointer-events: none;
    }
  }

  @media (max-width: 480px) {
    margin: 0 0 0.75rem !important;
  }
  &::placeholder {
    color: #aaaaaa;
  }
`;

const BackIcon = styled(SvgIconFeather)`
cursor: pointer; 
`;

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
  }
  color: #495057; 
  p.chat-search-date {
    font-size: smaller;
    margin: 0;
  }
  div.chat-search-body {
    font-size: 0.835re;
  }
  div.chat-search-body span {font-weight:600; color:#7A1B8B}
`;

const ResultDivWrapper = styled.div`
  overflow: auto;
  height: calc(100% - 43px);
`;

const EmptyState = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 5rem;
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
  color: #363636;
`;

const ChatSearchPanel = (props) => {

  const { className = "", setQuery, setSearching, setResults, query, searching, results, chatMessageActions, showSearchPanel, setShowSearchPanel, handleSearchChatPanel, selectedChannel, pP } = props;

  const [skip, setSkip] = useState(0);

  const limit = 20;

  const { todoFormat } = useTimeFormat();
  const { _t } = useTranslationActions();

  const clear = () => {
    setResults([]);
    setQuery("");
    setSearching(false);
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    bottom && setSkip(skip + limit);
  }

  const onSearchChange = (e) => {
    var value = e.target.value;
    setSearching(true);
    setQuery(value);
    if (value.trim() !== "" && value.length > 2 && e.keyCode !== 32)
      getChatMsgs(value, 0, true);
    else {
      setResults([]);
      setSearching(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
    e.keyCode === 27 && clear();
  };

  const redirect = useRedirect();

  const handleRedirect = (topic) => {
    handleSearchChatPanel()
    redirect.toChat(selectedChannel, topic);
  };

  const dictionary = {
    noItemsFoundHeader: _t("CHATSEARCH.NO_ITEMS_FOUND_HEADER", "WOO!"),
    noItemsFoundText: _t("CHATSEARCH.NO_ITEMS_FOUND_TEXT", "Nothing here but me… 👻"),
  };

  const parseResult = (data) => {
    const resp = data.map((i) => {
      return i.map((item) => { return <ResultItem onClick={(e) => handleRedirect(item)} key={item.id}><p className="chat-search-date"> {todoFormat(item.created_at.timestamp)}</p> <div className="chat-search-body mb-2" dangerouslySetInnerHTML={{ __html: item.body }}></div> </ResultItem> });
    });
    return (resp[0] && resp[0].length) ? resp : (<EmptyState> <h3>{dictionary.noItemsFoundHeader}</h3><h5>{dictionary.noItemsFoundText} </h5> </EmptyState>)
  };

  const getChatMsgs = (query, skip, fresh = false) => {
    setTimeout(() => {
      getChatMsgsSearch({ channel_id: selectedChannel.id, is_translate: selectedChannel.is_translate, search: query, skip: skip, limit: limit })
        .then((res) => { return res; }).then((response) => {
          if (fresh) { setResults([response.data.results]); setSkip(0); }
          else setResults([...results, response.data.results]);
        });
    }, 1000);
  }

  useEffect(() => {
    if (selectedChannel !== null && skip > 0) {
      setSearching(true);
      getChatMsgs(query, skip);
    }
  }, [skip]);
  
  useEffect(() => {
    setTimeout(() => {
      searching && setSearching(!searching);
    }, 500);
  }, [results]);

  return (
    <Wrapper isActive={showSearchPanel}>
      <div className="d-flex justify-content-between align-items-flex-start align-items-center mb-2">
        <BackIcon icon="chevron-left" onClick={handleSearchChatPanel} />
        <Search
          onChange={onSearchChange}
          onKeyDown={handleSearchKeyDown}
          value={query}
          onClickEmpty={clear}
          closeButton="true"
          searching={searching}
          className="chat-search-chat" />
      </div>
      <ResultDivWrapper className="justify-content-between align-items-center" onScroll={handleScroll}>
        <ResultWrapper > {showSearchPanel && parseResult(results)} </ResultWrapper >
      </ResultDivWrapper>
    </Wrapper>
  );
};
export default ChatSearchPanel;