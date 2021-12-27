import React, { useState } from "react";
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

      &:after {
        content: "";
        width: 3px;
        height: 100%;
        background: ${(props) => props.theme.colors.primary};
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

const CompanyPostFilterItem = (props) => {
  const { className = "", filter = "inbox", onGoBack, counters, dictionary } = props;

  const { setCompanyFilterPosts, fetchCompanyPosts } = usePostActions();
  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const archived = useSelector((state) => state.posts.archived);

  const [fetching, setFetching] = useState(false);

  const handleClickFilter = (e) => {
    e.persist();
    if (e.target.dataset.value === "archive" && archived.skip === 0 && !fetching) {
      setFetching(true);
      fetchCompanyPosts(
        {
          skip: 0,
          limit: 25,
          filters: ["post", "archived"],
        },
        () => setFetching(false)
      );
    }
    if (e.target.dataset.value === filter) {
      onGoBack();
    } else {
      let payload = {
        filter: e.target.dataset.value,
        tag: null,
      };
      setCompanyFilterPosts(payload);
      onGoBack();
    }
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "inbox" ? "active" : ""}`} data-value="inbox" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="inbox" />
        {dictionary.inbox}
        {unreadCounter.general_post > 0 && <span className="small ml-auto">{unreadCounter.general_post}</span>}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`} data-value="all" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="mail" />
        {dictionary.all}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "in_progress" ? "active" : ""}`} data-value="in_progress" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="clock" />
        {dictionary.inProgress}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "my_posts" ? "active" : ""}`} data-value="my_posts" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="send-post" />
        {dictionary.myPosts}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "star" ? "active" : ""}`} data-value="star" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="star" />
        {dictionary.starred}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "archive" ? "active" : ""}`} data-value="archive" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="clock" />
        {dictionary.archived}
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "draft" ? "active" : ""}`} data-value="draft" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="edit-3" />
        {dictionary.drafts}
        <span className="small ml-auto">{counters.drafts > 0 && counters.drafts}</span>
      </span>
    </Wrapper>
  );
};

export default React.memo(CompanyPostFilterItem);
