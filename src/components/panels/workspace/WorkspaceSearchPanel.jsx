import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { WorkspaceSearch, WorkspaceSearchResults } from "./index";
import { useWorkspaceSearchActions, useRedirect } from "../../hooks";
import { SvgIconFeather } from "../../common";
import ReactPaginate from "react-paginate"

const Wrapper = styled.div`
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;
      color: #972c86;
    }
  }
`;

const WorkspaceSearchPanel = (props) => {
    const { className = "" } = props;

    const redirect = useRedirect();
    const actions = useWorkspaceSearchActions();
    const search = useSelector((state) => state.workspaces.search);
    const { count, maxPage, page, results, searching, value } = search;

    //const [activeTab, setActiveTab] = useState(null);


    useEffect(() => {
    document.getElementById("main").setAttribute("style", "overflow: auto");
    return () => document.getElementById("main").removeAttribute("style");
    }, []);

    //   useEffect(() => {
    //     if (Object.keys(tabs).length && activeTab === null) {
    //       let tab = Object.keys(tabs)[0];
    //       setActiveTab(tab.toLowerCase());
    //     } else if (Object.keys(tabs).length === 0 && activeTab !== null) {
    //       setActiveTab(null);
    //     }
    //   }, [tabs, activeTab]);
    //   const handleSelectTab = (e) => {
    //     if (e.currentTarget.dataset.value !== activeTab) {
    //       setActiveTab(e.currentTarget.dataset.value)
    //     }
    //   };

    const handlePageClick = (e) => {
        let selectedPage = e.selected + 1;
        if (results.length === count) {
            actions.updateSearch({
                ...search,
                page: selectedPage
            });
        } else {
            actions.search({
                search: value,
                skip: results.length,
                limit: 25,
            });
            actions.updateSearch({
                ...search,
                value: value,
                searching: true,
                page: selectedPage
            });
        }
    }

    return (
        <Wrapper className={`user-search-panel container-fluid h-100 ${className}`}>
        <div className="row">
            <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                <WorkspaceSearch actions={actions} search={search}/>
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
                        results.length > 0 && <WorkspaceSearchResults page={page} results={results} redirect={redirect}/>
                    }
                    
                    {
                        //81 workspaces
                        count > 25 && 
                        <nav className="mt-3">
                            <ReactPaginate
                                previousLabel={'previous'}
                                nextLabel={'next'}
                                breakLabel={'...'}
                                breakClassName={'break-me page-item'}
                                breakLinkClassName={"page-link"}
                                pageCount={maxPage}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination justify-content-center'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                            />
                        </nav>
                    }
                </div>
            </div>
            </div>
        </div>

        </Wrapper>
    );
};

export default React.memo(WorkspaceSearchPanel);
