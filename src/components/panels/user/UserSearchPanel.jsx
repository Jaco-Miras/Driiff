import React, { useState } from "react";
import styled from "styled-components";
import { MainSearch, SearchTabs, TabContents } from "../../list/search";
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
  const { count, results, value } = useSearch();

  const [activeTab, setActiveTab] = useState(null);

  const handleSelectTab = (e) => {
    if (e.currentTarget.dataset.value !== activeTab) {
      setActiveTab(e.currentTarget.dataset.value)
    }
  };

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
                  {count} results found for: <span className="text-primary">“{value}”</span>
                </h4>
              }
              <SearchTabs activeTab={activeTab} onSelectTab={handleSelectTab}/>
              <TabContents activeTab={activeTab} results={results}/>
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">
                      Previous
                    </a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserSearchPanel);
