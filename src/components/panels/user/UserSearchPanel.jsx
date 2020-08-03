import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MainSearch, SearchTabs, SearchPagination, TabContents } from "../../list/search";
//import { SvgEmptyState } from "../../common";
import { useSearch, useSearchActions } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;
      color: #972c86;
    }
  }
`;

const UserSearchPanel = (props) => {
  const { className = "" } = props;

  const actions = useSearchActions();
  const { count, results, searching, tabs, value } = useSearch();

  const [activeTab, setActiveTab] = useState(null);

  const handleSelectTab = (e) => {
    if (e.currentTarget.dataset.value !== activeTab) {
      setActiveTab(e.currentTarget.dataset.value)
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

  return (
    <Wrapper className={`user-search-panel container-fluid h-100 ${className}`}>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <MainSearch actions={actions} value={value}/>
              {
                value !== "" && 
                <h4 className="mb-5">
                  <SvgIconFeather icon="search" />
                  {
                    searching && <span>Searching <span className="text-primary">“{value}”</span></span>
                  }
                  {
                    !searching && <span>{count} results found for: <span className="text-primary">“{value}”</span></span>
                  }
                </h4>
              }
              {
                count > 0 && <SearchPagination activeTab={activeTab} tabs={tabs} actions={actions} value={value}/>
              }
              <SearchTabs activeTab={activeTab} onSelectTab={handleSelectTab} tabs={tabs}/>
              <TabContents activeTab={activeTab} results={results} tabs={tabs}/>
              {
                //count > 0 && <SearchPagination activeTab={activeTab} tabs={tabs} actions={actions} value={value}/>
              }
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserSearchPanel);
