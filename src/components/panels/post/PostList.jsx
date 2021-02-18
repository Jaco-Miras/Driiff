import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  a {
    cursor: pointer;
  }
`;

const PostList = (props) => {
    const {className = "", workspace, postLists, tag, onGoBack, dictionary} = props;
    const dispatch = useDispatch();
    
    const handleClickFilter = useCallback((e) => {
        e.persist();
        let payload = {
            topic_id: workspace.id,
            tag: e.target.dataset.id,
            filter: null,
        };
        if (tag === e.target.dataset.id) {
            payload = {
                ...payload,
                tag: null,
                filter: "all",
            };
        }
        // setCompanyFilterPosts(payload);
        dispatch(updateWorkspacePostFilterSort(payload));
        onGoBack();
        document.body.classList.remove("mobile-modal-open");
    }, [workspace]);
  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      {postLists && postLists.map((list) => {
          return (
            <a className={`list-group-item d-flex align-items-center ${tag && parseInt(tag) === list.id ? "active" : ""}`} data-value={list.name.toLowerCase()} data-id={list.id} key={list.id} onClick={handleClickFilter}>
                <span className="text-success fa fa-circle mr-2" />
                {list.name}
                <span className="small ml-auto">{list.total_post_connected >0 ? list.total_post_connected : ""}</span>
            </a>
        );
      })}
      
    </Wrapper>
  );
};

export default React.memo(PostList);
