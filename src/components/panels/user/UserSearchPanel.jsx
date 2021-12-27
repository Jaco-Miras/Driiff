import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MainSearch, SearchTabs, SearchPagination, TabContents } from "../../list/search";
//import { SvgEmptyState } from "../../common";
import { useSearch, useSearchActions, useRedirect, useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;
      color: ${(props) => props.theme.colors.primary};
    }
  }
  .text-primary {
    color: ${(props) => props.theme.colors.third}!important;
  }
`;

const UserSearchPanel = (props) => {
  const { className = "" } = props;

  const redirect = useRedirect();
  const actions = useSearchActions();
  const { count, results, searching, tabs, value } = useSearch();

  const { _t } = useTranslationActions();

  const dictionary = {
    searching: _t("SEARCH.SEARCHING", "Searching"),
    chatChannel: _t("SEARCH.TAB_CHAT_CHANNEL", "Chat channel"),
    message: _t("SEARCH.TAB_MESSAGE", "Message"),
    comment: _t("SEARCH.TAB_COMMENT", "Comment"),
    files: _t("SEARCH.TAB_FILES", "Files"),
    people: _t("SEARCH.TAB_PEOPLE", "People"),
    posts: _t("SEARCH.TAB_POSTS", "Posts"),
    workspace: _t("SEARCH.TAB_WORKSPACE", "Workspace"),
  };

  const [activeTab, setActiveTab] = useState(null);

  const handleSelectTab = (e) => {
    if (e.currentTarget.dataset.value !== activeTab) {
      setActiveTab(e.currentTarget.dataset.value);
    }
  };

  useEffect(() => {
    document.getElementById("main").setAttribute("style", "overflow: auto");
    return () => document.getElementById("main").removeAttribute("style");
  }, []);

  useEffect(() => {
    if (Object.keys(tabs).length && activeTab === null) {
      let tab = Object.keys(tabs)[0];
      setActiveTab(tab.toLowerCase());
    } else if (Object.keys(tabs).length === 0 && activeTab !== null) {
      setActiveTab(null);
    }
  }, [tabs, activeTab]);

  const clearTab = () => setActiveTab(null);

  return (
    <Wrapper className={`user-search-panel container-fluid h-100 ${className}`}>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <MainSearch actions={actions} value={value} clearTab={clearTab} />
              {value !== "" && (
                <h4 className="mb-5">
                  <SvgIconFeather icon="search" />
                  {searching && (
                    <span>
                      {dictionary.searching} <span className="text-primary">“{value}”</span>
                    </span>
                  )}
                  {!searching && (
                    <span>
                      {_t("SEARCH.RESULTS_FOUND", "::count:: results found for:", { count: count })} <span className="text-primary">“{value}”</span>
                    </span>
                  )}
                </h4>
              )}
              <SearchTabs activeTab={activeTab} onSelectTab={handleSelectTab} tabs={tabs} dictionary={dictionary} />
              <TabContents activeTab={activeTab} results={results} tabs={tabs} redirect={redirect} />
              {count > 0 && <SearchPagination activeTab={activeTab} tabs={tabs} actions={actions} value={value} />}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserSearchPanel);
