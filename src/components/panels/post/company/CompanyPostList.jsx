import React, { useCallback } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { usePostActions } from "../../../hooks";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  a {
    cursor: pointer;
  }
`;

const CompanyPostList = (props) => {
    const {className = "", postLists, tag, postListTag, onGoBack, dictionary} = props;
    const {setCompanyFilterPosts} = usePostActions();
    const handleClickFilter = useCallback((e) => {
        e.persist();

        let payload = {
            tag: null,
            postListTag: e.target.dataset.id,
            filter: null,
        };
        if (tag === e.target.dataset.id) {
            payload = {
                ...payload,
                tag: null,
                filter: "all",
            };
        }
        setCompanyFilterPosts(payload);
        onGoBack();
        document.body.classList.remove("mobile-modal-open");
    }, []);
  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      {postLists && postLists.map((list) => {
          return (
            <a className={`list-group-item d-flex align-items-center ${postListTag && parseInt(postListTag) === list.id ? "active" : ""}`} data-value={list.name.toLowerCase()} data-id={list.id} key={list.id} onClick={handleClickFilter}>
                <span className="text-success fa fa-circle mr-2" />
                {list.name}
                <span className="small ml-auto">{list.total_post_connected >0 ? list.total_post_connected : ""}</span>
            </a>
        );
      })}
      
    </Wrapper>
  );
};

export default React.memo(CompanyPostList);
