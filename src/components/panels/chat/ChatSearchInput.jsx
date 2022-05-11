import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather, Loader } from "../../common";
import { getChatMsgsSearch } from "../../../redux/services/chat";

const Wrapper = styled.div`
  .btn-cross {
    position: absolute;
    top: 0;
    right: 45px;
    border: 0;
    background: transparent;
    padding: 0;
    height: 100%;
    width: 36px;
    border-radius: 4px;
    z-index: 9;
    svg {
      width: 16px;
      color: #495057;
    }
  }
  .loading {
    width: 1rem;
    height: 1rem;
  }
`;
const limit = 20;
const ChatSearchInput = (props) => {
  const { placeholder, setResults, selectedChannel, results, triggerLoadMore, setTriggerLoadMore } = props;
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const [skip, setSkip] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [submittedValue, setSubmittedValue] = useState("");

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSubmittedValue("");
    setResults([]);
    setSkip(0);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const loadMore = () => {
    setSearching(true);
    let payload = {
      channel_id: selectedChannel.id,
      is_translate: selectedChannel.is_translate,
      search: submittedValue,
      skip: skip,
      limit: limit,
    };
    if (selectedChannel.slug && sharedWs[selectedChannel.slug]) {
      const sharedPayload = { slug: selectedChannel.slug, token: sharedWs[selectedChannel.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    getChatMsgsSearch(payload)
      .then((res) => {
        return res;
      })
      .then((response) => {
        const allResults = [...results, ...response.data.results];
        setSkip(allResults.length);
        setResults(allResults);
        setSearching(false);
      });
  };

  const handleSearch = () => {
    if (searchValue.trim() !== "" && searchValue.trim().length >= 3) {
      if (searchValue === submittedValue) return;
      setSubmittedValue(searchValue);
      setSearching(true);
      setResults([]);
      let payload = {
        channel_id: selectedChannel.id,
        is_translate: selectedChannel.is_translate,
        search: searchValue,
        skip: skip,
        limit: limit,
      };
      if (selectedChannel.slug && sharedWs[selectedChannel.slug]) {
        const sharedPayload = { slug: selectedChannel.slug, token: sharedWs[selectedChannel.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      getChatMsgsSearch(payload)
        .then((res) => {
          return res;
        })
        .then((response) => {
          if (submittedValue.trim() !== "" && submittedValue !== searchValue) {
            const allResults = response.data.results;
            setResults(allResults);
            setSearching(false);
            setSkip(0);
          } else {
            const allResults = [...results, ...response.data.results];
            setResults(allResults);
            setSearching(false);
            setSkip(allResults.length);
          }
        });
    }
  };

  useEffect(() => {
    if (triggerLoadMore && !searching) {
      loadMore();
      setTriggerLoadMore(false);
    }
  }, [triggerLoadMore, searching]);

  return (
    <Wrapper className="input-group">
      <input type="text" className="form-control" placeholder={placeholder} value={searchValue} aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleInputChange} />
      {searching && (
        <button className="btn-cross" type="button">
          <Loader />
        </button>
      )}
      <div className="input-group-append">
        {!searching && searchValue.trim() !== "" && (
          <button onClick={handleClearSearch} className="btn-cross" type="button">
            <SvgIconFeather icon="x" />
          </button>
        )}
        <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={handleSearch}>
          <i className="ti-search" />
        </button>
      </div>
    </Wrapper>
  );
};

export default React.memo(ChatSearchInput);
