import React, {useCallback} from "react";
import styled from "styled-components";
import {ButtonDropdown, SvgIconFeather} from "../../../common";

// import {useCountRenders} from "../../hooks";
import {CompanyPostSearch} from "./index";
import {usePostActions} from "../../../hooks";

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
`;

const CompanyPostFilterSearchPanel = (props) => {
  const {className = "", activeSort = null, search, dictionary} = props;

  const {setCompanyFilterPosts} = usePostActions();

  const handleClickSort = useCallback((e) => {
    e.persist();
    setCompanyFilterPosts({
      sort: e.target.dataset.value,
    })
  });

  const sortDropdown = {
    label: dictionary.sortBy,
    items: [
      {
        value: "favorite",
        label: dictionary.starredFavorite,
        onClick: handleClickSort,
      },
      {
        value: "recent",
        label: dictionary.recent,
        onClick: handleClickSort,
      },
      {
        value: "unread",
        label: dictionary.unread,
        onClick: handleClickSort,
      },
    ],
  };

  const openMobileModal = () => {
    document.body.classList.toggle("mobile-modal-open");
  };

  return (
    <Wrapper className={`post-filter-search-panel app-action ${className}`}>
      <div className="action-left">
        <ul className="list-inline">
          {/* <li className="list-inline-item mb-0" style={{position: "relative"}}>
                     <ButtonDropdown dropdown={filterDropdown}/>
                     </li> */}
          <li className="list-inline-item mb-0">
            <ButtonDropdown value={activeSort} dropdown={sortDropdown}/>
          </li>
        </ul>
        <span class="app-sidebar-menu-button btn btn-outline-light" onClick={openMobileModal}>
          <SvgIconFeather icon="menu"/>
        </span>
      </div>
      <div className="action-right">
        <CompanyPostSearch search={search} placeholder={dictionary.searchPost}/>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyPostFilterSearchPanel);
