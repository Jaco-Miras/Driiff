import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
//import { useSelector } from "react-redux";
import AllWorkspaceSidebar from "./AllWorkspaceSidebar";
import AllWorkspaceSearch from "./AllWorkspaceSearch";
import AllWorkspaceBody from "./AllWorkspaceBody";
import { useTranslationActions, useWorkspaceSearchActions, useFilterAllWorkspaces } from "../../hooks";
//import { throttle } from "lodash";
import { Loader } from "../../common";

const Wrapper = styled.div`
  overflow: hidden auto;
  .app-block {
    overflow: inherit;
    .app-content {
      height: auto;
    }
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const AllWorkspace = (props) => {
  const { search, filteredResults } = useFilterAllWorkspaces();
  const { loaded, results, filterBy } = search;
  const { _t } = useTranslationActions();
  const actions = useWorkspaceSearchActions();

  // const [loadMore, setLoadMore] = useState(false);
  const [loading, setLoading] = useState(null);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    document.body.classList.add("stretch-layout");
    if (!loaded) {
      actions.getFilterCount((err, res) => {
        if (err) return;
        if (res.data) {
          if (results.length === 0 && componentIsMounted.current) setLoading(true);
          const all = res.data.reduce((acc, val) => {
            if (val.entity_type === "NON_MEMBER" || val.entity_type === "MEMBER") {
              acc = acc + val.count;
            }
            return acc;
          }, 0);
          actions.search(
            {
              //search: value,
              search: "",
              skip: 0,
              limit: all,
              filter_by: "all",
            },
            (err, res) => {
              if (componentIsMounted.current) setLoading(false);
              if (err) {
                actions.updateSearch({
                  searching: false,
                });
              } else {
                actions.updateSearch({
                  filterBy: filterBy,
                  searching: false,
                  count: res.data.total_count,
                  hasMore: res.data.has_more,
                  results: res.data.workspaces,
                  loaded: true,
                  //maxPage: Math.ceil(res.data.total_count / 25),
                });
              }
            }
          );
        }
      });
    }

    return () => {
      componentIsMounted.current = false;
      actions.updateSearch({
        filterBy: "all",
        filterByFolder: null,
      });
    };
  }, []);

  // useEffect(() => {
  //   actions.updateSearch({
  //     searching: true,
  //     results: [],
  //   });
  //   setLoading(true);
  //   actions.search(
  //     {
  //       search: value,
  //       skip: 0,
  //       limit: 25,
  //       filter_by: filterBy,
  //     },
  //     (err, res) => {
  //       setLoading(false);
  //       if (err) {
  //         actions.updateSearch({
  //           searching: false,
  //         });
  //       } else {
  //         actions.updateSearch({
  //           filterBy: filterBy,
  //           searching: false,
  //           count: res.data.total_count,
  //           hasMore: res.data.has_more,
  //           results: res.data.workspaces,
  //           maxPage: Math.ceil(res.data.total_count / 25),
  //         });
  //       }
  //     }
  //   );
  // }, [filterBy, value]);

  const dictionary = {
    notJoined: _t("ALL_WORKSPACE.NOT_JOINED", "Not joined"),
    withClient: _t("ALL_WORKSPACE.WITH_CLIENT", "With client"),
    searchWorkspacePlaceholder: _t("PLACEHOLDER.SEARCH_WORKSPACE_TITLE", "Search workspace"),
    filters: _t("PLACEHOLDER.SEARCH_WORKSPACE_FILTER", "Filters", "Filters"),
    private: _t("WORKSPACE.PRIVATE", "Private"),
    archived: _t("WORKSPACE.ARCHIVED", "Archived"),
    new: _t("WORKSPACE.NEW", "New"),
    active: _t("ALL_WORKSPACE.ACTIVE", "Active"),
    labelOpen: _t("LABEL.OPEN", "Open"),
    labelJoined: _t("LABEL.JOINED", "Joined"),
    buttonJoin: _t("BUTTON.JOIN", "Join"),
    buttonLeave: _t("BUTTON.LEAVE", "Leave"),
    externalAccess: _t("WORKSPACE_SEARCH.EXTERNAL_ACCESS", "External access"),
    addNewWorkspace: _t("SIDEBAR.ADD_NEW_WORKSPACES", "Add new workspace"),
    favourites: _t("WORKSPACE.FAVOURITES", "Favourites"),
    all: _t("ALL_WORKSPACE.ALL", "All"),
    workspaceSortOptionsAlpha: _t("WORKSPACE_SORT_OPTIONS.ALPHA", "Sort by Alphabetical Order (A-Z)"),
    workspaceSortOptionsDate: _t("WORKSPACE_SORT_OPTIONS.DATE", "Sort by Date (New to Old)"),
    folders: _t("ALL_WORKSPACE.FOLDERS", "Folders"),
    newFolder: _t("TOOLTIP.NEW_FOLDER", "New folder"),
  };

  // const handleLoadMore = () => {
  //   if (!loading && hasMore) {
  //     actions.search(
  //       {
  //         search: value,
  //         skip: results.length,
  //         limit: 25,
  //         filter_by: filterBy,
  //       },
  //       (err, res) => {
  //         setLoading(false);
  //         setLoadMore(false);
  //         if (err) {
  //           actions.updateSearch({
  //             searching: false,
  //           });
  //         } else {
  //           actions.updateSearch({
  //             filterBy: filterBy,
  //             searching: false,
  //             hasMore: res.data.has_more,
  //             count: res.data.total_count,
  //             results: [...results, ...res.data.workspaces],
  //             maxPage: Math.ceil(res.data.total_count / 25),
  //           });
  //         }
  //       }
  //     );
  //   }
  // };

  // const handleScroll = useMemo(() => {
  //   const throttled = throttle((e) => {
  //     if (e.target.scrollHeight - e.target.scrollTop < 1500) {
  //       setLoadMore(true);
  //     }
  //   }, 300);
  //   return (e) => {
  //     e.persist();
  //     return throttled(e);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (loadMore) {
  //     handleLoadMore();
  //   }
  // }, [loadMore]);

  return (
    <Wrapper className={"container-fluid h-100 fadeIn"}>
      <div className="row app-block">
        <AllWorkspaceSidebar actions={actions} dictionary={dictionary} filterBy={filterBy} counters={search.counters} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <AllWorkspaceSearch actions={actions} dictionary={dictionary} search={search} />
          {loaded && <AllWorkspaceBody actions={actions} dictionary={dictionary} filterBy={filterBy} results={filteredResults} />}
          {loading && (
            <LoaderContainer className={"card initial-load"}>
              <Loader />
            </LoaderContainer>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default AllWorkspace;
