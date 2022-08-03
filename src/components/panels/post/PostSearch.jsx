import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { addPostSearchResult } from "../../../redux/actions/workspaceActions";
import { fetchPosts } from "../../../redux/actions/postActions";
import { SvgIconFeather, Loader } from "../../common";
import axios from "axios";

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

const PostSearch = (props) => {
  const { search, placeholder } = props;
  const dispatch = useDispatch();
  const route = useRouteMatch();
  const { params, url } = route;
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const [searchValue, setSearchValue] = useState(search === null ? "" : search);
  const [searching, setSearching] = useState(false);
  const cancelToken = useRef(null);

  let topic_id = parseInt(params.workspaceId);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  const workspaceRef = useRef(null);
  useEffect(() => {
    if (workspace) workspaceRef.current = workspace;
  }, [workspace]);

  const handleClearSearchPosts = () => {
    setSearchValue("");
    dispatch(
      addPostSearchResult({
        topic_id: topic_id,
        search: "",
        search_result: [],
        topicKey: workspaceRef.current && workspaceRef.current.sharedSlug ? workspaceRef.current.key : topic_id,
      })
    );
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() !== "" && searchValue.trim().length >= 3) {
      //Check if there are any previous pending requests
      if (cancelToken.current) {
        cancelToken.current.cancel("Operation canceled due to new request.");
        cancelToken.current = null;
      }

      //Save the cancel token for the current request
      cancelToken.current = axios.CancelToken.source();
      setSearching(true);
      let payload = {
        search: searchValue,
        cancelToken: cancelToken.current.token,
        topic_id: topic_id,
      };
      if (workspaceRef.current && workspaceRef.current.sharedSlug && sharedWs[workspaceRef.current.slug]) {
        const sharedPayload = { slug: workspaceRef.current.slug, token: sharedWs[workspaceRef.current.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      dispatch(
        fetchPosts(payload, (err, res) => {
          setSearching(false);
          if (err) return;
          dispatch(
            addPostSearchResult({
              topic_id: topic_id,
              search: searchValue,
              search_result: res.data.posts,
              topicKey: workspaceRef.current && workspaceRef.current.sharedSlug ? workspaceRef.current.key : topic_id,
            })
          );
        })
      );
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchValue === "") return;
      handleSearch();
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      dispatch(
        addPostSearchResult({
          topic_id: topic_id,
          search: "",
          search_result: [],
          topicKey: workspaceRef.current && workspaceRef.current.sharedSlug ? workspaceRef.current.key : topic_id,
        })
      );
    };
  }, [searchValue]);

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
          <button onClick={handleClearSearchPosts} className="btn-cross" type="button">
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

export default React.memo(PostSearch);
