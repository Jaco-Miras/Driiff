import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import SearchForm from "../../forms/SearchForm";
import { useTimeFormat } from "../../hooks";

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

const ChatSearchPanel = (props) => {

  const { className = "", showSearchPanel, handleSearchChatPanel, chatListRef, scrollComponent, pP, selectedChannel } = props;

  const [query, setQuery] = useState("");

  const [searching, setSearching] = useState(false);
  const initresultState = [];
  const [result, setResult] = useState(initresultState);

  const { todoFormat } = useTimeFormat();

  const clear = () => {
    setResult(initresultState);
    setQuery("");
    setSearching(false);
  };

  useEffect(() => {
    selectedChannel !== null && pP !== selectedChannel.id && clear()
  }, [selectedChannel]);

  const onSearchChange = (e) => {
    var value = e.target.value;
    setSearching(true);
    if (value.trim() !== "" && value.length > 2) {
      setResult(filterByQuery(sortedReplies(), value));
      setSearching(false);
    } else {
      setResult(initresultState);
      setSearching(false);
    }
    setQuery(value);
  };

  const sortedReplies = () => {
    return selectedChannel.replies
      .sort((a, b) => {
        if (a.created_at.timestamp - b.created_at.timestamp === 0) {
          return a.id - b.id;
        } else {
          return a.created_at.timestamp - b.created_at.timestamp;
        }
      });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
    e.keyCode === 27 && clear();
  };

  const filterByQuery = (data, inputValue) => {
    const allTags = new RegExp('(<([^>]+)>)', 'g');
    const keywords = inputValue.split(/\s/);
    const results = data.filter((item) => {
      let resp = false;
      if (item.body.includes("POST_CREATE::")
        || item.body.startsWith("ZAP_SUBMIT::")
        || item.body.includes("JOIN_CHANNEL")
        || item.body.includes("MEMBER_REMOVE_CHANNEL")
        || item.body.includes("ACCOUNT_DEACTIVATED")
        || item.body.includes("NEW_ACCOUNT_ACTIVATED")
        || item.body.includes("CHANNEL_UPDATE::"))
        return resp;
      let body = item.body.replace(allTags, "");
      let respArr = [];
      for (var i = 0; i < keywords.length; i++) {
        if (keywords[i].trim() !== "" && keywords[i].length > 1)
          respArr.push(new RegExp(keywords[i], 'ig').test(body));
      }
      return respArr.includes(true);

    }).map((item) => {
      const pattern = new RegExp(`(${keywords.join('|')})`, 'ig');
      item.body = item.body.replace(allTags, "").replace(pattern, match => `<span>${match}</span>`);
      return item;
    });
    return results;
  };

  const handleRedirect = (id, handleSearchChatPanel, e) => {
    e.preventDefault();
    handleSearchChatPanel();

    scrollComponent.current.scrollTo({
      behavior: "smooth",
      top: chatListRef[id].current.offsetTop - (scrollComponent.current.offsetHeight / 2)
    });
    chatListRef[id].current.className = chatListRef[id].current.className + " pulsating";
  };

  const parseResult = (data) => {
    const array = [];
    const origData = sortedReplies();
    data.map((item) => {
      let index = Object.keys(origData).find(key => origData[key].id === item.id);
      array.push([item.id, todoFormat(item.created_at.timestamp), item.body, index]);
    });

    return (<ResultWrapper >{array.map((item) => {
      return <ResultItem onClick={(e) => handleRedirect(item[3], handleSearchChatPanel, e)} key={item[0]}><p className="chat-search-date"> {item[1]}</p> <div className="chat-search-body mb-2" dangerouslySetInnerHTML={{ __html: item[2] }}></div> </ResultItem>
    })
    }</ResultWrapper>);
  };

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
      <ResultDivWrapper className="justify-content-between align-items-center">
        {query.trim() !== "" && query.length > 2 && parseResult(result)}
      </ResultDivWrapper>
    </Wrapper>
  );
};
export default ChatSearchPanel;