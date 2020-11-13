import React, { useCallback } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { usePostActions } from "../../../hooks";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  > span {
    cursor: pointer;
    cursor: hand;

    &.active {
      border-color: #ebebeb !important;
    }

    svg {
      width: 16px;
    }
  }
`;

const CompanyPostFilterItem = (props) => {
  const {className = "", filter = "all", onGoBack, counters, dictionary} = props;

  const {setCompanyFilterPosts} = usePostActions();
  const unreadCounter = useSelector((state) => state.global.unreadCounter);

  const handleClickFilter = useCallback((e) => {
    e.persist();
    if (e.target.dataset.value === filter) {
      onGoBack();
    } else {
      let payload = {
        filter: e.target.dataset.value,
        tag: null,
      };
      setCompanyFilterPosts(payload)
      onGoBack();
    }
    document.body.classList.remove("mobile-modal-open");

  }, [filter, onGoBack]);

  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`}
            data-value="all" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="inbox"/>
        {dictionary.inbox}
        <span className="small ml-auto">{unreadCounter.general_post}</span>
      </span>
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
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "archive" ? "active" : ""}`}
            data-value="archive" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="archive"/>
        {dictionary.archived}
        {/* <span className="small ml-auto">{counters.archived > 0 && counters.archived}</span> */}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "draft" ? "active" : ""}`}
            data-value="draft" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="edit-3"/>
        {dictionary.drafts}
        {/* <span className="small ml-auto">{counters.drafts > 0 && counters.drafts}</span> */}
      </span>
    </Wrapper>
  );
};

export default React.memo(CompanyPostFilterItem);
