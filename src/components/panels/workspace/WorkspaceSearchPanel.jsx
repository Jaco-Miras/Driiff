import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { WorkspaceSearch, WorkspaceSearchResults } from "./index";
import { useWorkspaceSearchActions, useRedirect, useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";
import ReactPaginate from "react-paginate";

const Wrapper = styled.div`
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const WorkspaceSearchPanel = (props) => {
  const { className = "" } = props;

  const redirect = useRedirect();
  const actions = useWorkspaceSearchActions();
  const search = useSelector((state) => state.workspaces.search);
  const user = useSelector((state) => state.session.user);
  const { count, maxPage, page, results, searching, filter_by, value } = search;
  useEffect(() => {
    document.getElementById("main").setAttribute("style", "overflow: auto");

    if (value === "") {
      actions.search(
        {
          search: "",
          skip: 0,
          limit: 25,
          filter_by: filter_by,
        },
        (err, res) => {
          if (err) {
            actions.updateSearch({
              ...search,
              searching: false,
            });
          } else {
            actions.updateSearch({
              ...search,
              filter_by: filter_by,
              searching: false,
              count: res.data.total_count,
              results: res.data.workspaces,
              maxPage: Math.ceil(res.data.total_count / 25),
            });
          }
        }
      );
      actions.updateSearch({
        ...search,
        searching: true,
      });
    }
    return () => document.getElementById("main").removeAttribute("style");
  }, []);

  const handlePageClick = (e) => {
    let selectedPage = e.selected + 1;
    if (results.length === count) {
      actions.updateSearch({
        ...search,
        filter_by: filter_by,
        page: selectedPage,
      });
    } else {
      if (results.length < selectedPage * 25) {
        actions.search(
          {
            search: value,
            skip: results.length,
            limit: selectedPage * 25 - results.length,
            filter_by: filter_by,
          },
          (err, res) => {
            if (err) {
              actions.updateSearch({
                ...search,
                searching: false,
                filter_by: filter_by,
              });
            } else {
              actions.updateSearch({
                ...search,
                searching: false,
                filter_by: filter_by,
                count: res.data.total_count,
                results: [...res.data.workspaces, ...results],
                maxPage: Math.ceil(res.data.total_count / 25),
                page: selectedPage,
              });
            }
          }
        );
      }
      actions.updateSearch({
        ...search,
        filter_by: filter_by,
        value: value,
        searching: true,
        page: selectedPage,
      });
    }
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    labelResultsFor: _t("LABEL.RESULTS_FOR", "results found for: "),
    labelSearching: _t("LABEL.SEARCHING", "Searching "),
    sidebarWorkspaces: _t("SIDEBAR.WORKSPACES", "Workspaces"),
    buttonNextPage: _t("BUTTON.NEXT_PAGE", "Next"),
    buttonPrevPage: _t("BUTTON.PREV_PAGE", "Previous"),
  };

  return (
    <Wrapper className={`user-search-panel container-fluid h-100 ${className}`}>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <WorkspaceSearch actions={actions} search={search} />
              {value !== "" ? (
                <h4 className="mb-5">
                  <SvgIconFeather icon="search" />
                  {searching && (
                    <span>
                      {dictionary.labelSearching}
                      <span className="text-primary">“{value}”</span>
                    </span>
                  )}
                  {!searching && (
                    <span>
                      {count} {dictionary.labelResultsFor}
                      <span className="text-primary">“{value}”</span>
                    </span>
                  )}
                </h4>
              ) : (
                <h4 className="mb-5">
                  {results.length > 0 && (
                    <span>
                      {count} {dictionary.sidebarWorkspaces}
                    </span>
                  )}
                </h4>
              )}
              {results.length > 0 && <WorkspaceSearchResults user={user} actions={actions} page={page} results={results} redirect={redirect} />}

              {
                //81 workspaces
                count > 25 && (
                  <nav className="mt-3">
                    <ReactPaginate
                      previousLabel={dictionary.buttonPrevPage}
                      nextLabel={dictionary.buttonNextPage}
                      breakLabel={"..."}
                      breakClassName={"break-me page-item"}
                      breakLinkClassName={"page-link"}
                      pageCount={maxPage}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination justify-content-center"}
                      subContainerClassName={"pages pagination"}
                      activeClassName={"active"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                    />
                  </nav>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceSearchPanel);
