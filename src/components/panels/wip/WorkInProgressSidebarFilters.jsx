import React, { useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

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

const WorkInProgressSidebarFilters = (props) => {
  const { className = "", filter = "inbox", onGoBack, counters, dictionary } = props;

  const [fetching, setFetching] = useState(false);

  const handleClickFilter = (e) => {
    e.persist();
    // if (e.target.dataset.value === "archive" && archived.skip === 0 && !fetching) {
    //   setFetching(true);
    //   fetchCompanyPosts(
    //     {
    //       skip: 0,
    //       limit: 25,
    //       filters: ["post", "archived"],
    //     },
    //     () => setFetching(false)
    //   );
    // }
    // if (e.target.dataset.value === filter) {
    //   onGoBack();
    // } else {
    //   let payload = {
    //     filter: e.target.dataset.value,
    //     tag: null,
    //   };
    //   setCompanyFilterPosts(payload);
    //   onGoBack();
    // }
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "inbox" ? "active" : ""}`} data-value="inbox" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="inbox" />
        All
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`} data-value="all" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="clock" />
        Recently changed
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "my_posts" ? "active" : ""}`} data-value="my_posts" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="star" />
        Favorites
      </span>
      <span className={`list-group-item d-flex align-items-center ${filter && filter === "star" ? "active" : ""}`} data-value="star" onClick={handleClickFilter}>
        <SvgIconFeather className="mr-2" icon="archive" />
        Approved
      </span>
    </Wrapper>
  );
};

export default React.memo(WorkInProgressSidebarFilters);
