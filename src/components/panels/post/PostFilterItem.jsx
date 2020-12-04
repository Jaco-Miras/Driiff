import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  > span {
    cursor: pointer;
    cursor: hand;

    &.active {
      border-color: #ebebeb !important;     
      
      &:after {
        content: '';
        width: 3px;
        height: 100%;
        background: #7a1b8b;
        display: block;
        position: absolute;
        top: 0;
        animation: fadeIn 0.15s linear;
        left: 0;
      }
    }

    svg {
      width: 16px;
    }
  }
`;

const PostFilterItem = (props) => {
  const { className = "", workspace, filter = "all", onGoBack, counters, dictionary } = props;

  const dispatch = useDispatch();

  const handleClickFilter = (e) => {
    if (e.target.dataset.value === filter) {
      onGoBack();
    } else {
      let payload = {
        topic_id: workspace.id,
        filter: e.target.dataset.value,
        tag: null,
      };
      dispatch(updateWorkspacePostFilterSort(payload));
      onGoBack();
    }
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`}
            data-value="all" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="inbox"/>
        {dictionary.inbox}
        <span className="small ml-auto">{workspace && workspace.unread_posts > 0 && workspace.unread_posts}</span>
      </span>
      {/* <span className={`list-group-item d-flex align-items-center ${filter && filter === "new_reply" ? "active" : ""}`}
            data-value="new_reply" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="mail"/>
        {dictionary.newReply}
        <span className="small ml-auto">{counters.new_reply > 0 && counters.new_reply}</span>
      </span> */}
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "my_posts" ? "active" : ""}`}
            data-value="my_posts" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="send-post"/>
        {dictionary.myPosts}
        {/* <span className="small ml-auto">{counters.my_posts > 0 && counters.my_posts}</span> */}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "star" ? "active" : ""}`}
            data-value="star" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="star"/>
        {dictionary.starred}
        {/* <span className="small ml-auto">{counters.starred > 0 && counters.starred}</span> */}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "archive" ? "active" : ""}`} data-value="archive" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="archive" />
        {dictionary.archived}
        {/* <span className="small ml-auto">{counters.archived > 0 && counters.archived}</span> */}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "draft" ? "active" : ""}`} data-value="draft" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="edit-3" />
        {dictionary.drafts}
        <span className="small ml-auto">{counters.drafts > 0 && counters.drafts}</span>
      </span>
    </Wrapper>
  );
};

export default React.memo(PostFilterItem);
