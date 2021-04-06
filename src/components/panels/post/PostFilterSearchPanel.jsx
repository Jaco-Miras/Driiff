import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { PostSearch } from "./index";

const Wrapper = styled.div`
  overflow: unset !important;

  .action-left {
    ul.list-inline {
      margin-bottom: 0;
    }
    .app-sidebar-menu-button {
      margin-left: 8px;
    }
  }
  .action-right {
    margin: 0 !important;
  }
`;

const PostFilterSearchPanel = (props) => {
  const { className = "", search, dictionary } = props;

  const openMobileModal = () => {
    document.body.classList.toggle("mobile-modal-open");
  };

  return (
    <Wrapper className={`post-filter-search-panel app-action ${className}`}>
      <div className="action-left">
        <span className="app-sidebar-menu-button btn btn-outline-light" onClick={openMobileModal}>
          <SvgIconFeather icon="menu" />
        </span>
      </div>
      <div className="action-right">
        <PostSearch search={search} placeholder={dictionary.searchPost} />
      </div>
    </Wrapper>
  );
};

export default React.memo(PostFilterSearchPanel);
