import React, { useEffect, useState, useRef, useMemo } from "react";
import styled from "styled-components";
//import { useSelector } from "react-redux";
import AllWorkspaceSidebar from "./AllWorkspaceSidebar";
import AllWorkspaceSearch from "./AllWorkspaceSearch";
import AllWorkspaceBody from "./AllWorkspaceBody";
import { useTranslationActions, useWorkspaceSearchActions, useFilterAllWorkspaces, useQueryParams } from "../../hooks";
import { throttle } from "lodash";
import { Loader, Loading } from "../../common";
import RelatedWorkspaceBody from "./RelatedWorkspaceBody";

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
  const { loaded, filterBy, hasMore, limit, skip, searching, value, query } = search;
  const { _t } = useTranslationActions();
  const actions = useWorkspaceSearchActions();

  const [loadMore, setLoadMore] = useState(false);
  const [initialFetch, setInitialFetch] = useState(null);

  const componentIsMounted = useRef(true);

  const { params } = useQueryParams();
  const userId = params ? params["user-id"] : null;

  useEffect(() => {
    document.body.classList.add("stretch-layout");
    actions.getFilterCount();
    if (!loaded) {
      setInitialFetch(true);
      actions.search(
        {
          //search: "",
          skip: skip,
          limit: limit,
          filter_by: "all",
        },
        (err, res) => {
          if (componentIsMounted.current) {
            setInitialFetch(false);
          }
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
              // results: res.data.workspaces,
              loaded: true,
              skip: res.data.workspaces.length,
            });
          }
        }
      );
    }

    return () => {
      componentIsMounted.current = false;
      actions.updateSearch({
        filterBy: "all",
        filterByFolder: null,
      });
    };
  }, []);

  const handleScroll = useMemo(() => {
    const throttled = throttle((e) => {
      if (e.target.scrollHeight - e.target.scrollTop < 1500) {
        setLoadMore(true);
      }
    }, 300);
    return (e) => {
      e.persist();
      return throttled(e);
    };
  }, []);

  const handleLoadMore = () => {
    if (loaded && !searching) {
      if (value === "" && hasMore) {
        actions.updateSearch({
          searching: true,
        });
        actions.search(
          {
            search: "",
            skip: skip,
            limit: limit,
            filter_by: "all",
          },
          (err, res) => {
            if (componentIsMounted.current) {
              setLoadMore(false);
            }
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
                skip: skip + res.data.workspaces.length,
              });
            }
          }
        );
      } else if (value !== "" && query.hasMore) {
        actions.updateSearch({
          searching: true,
        });
        const payload = {
          search: query.value,
          skip: query.skip,
          limit: query.limit,
          filter_by: filterBy,
        };
        actions.search(payload, (err, res) => {
          if (componentIsMounted.current) {
            setLoadMore(false);
          }
          if (err) {
            actions.updateSearch({
              searching: false,
            });
          } else {
            actions.updateSearch({
              filterBy: filterBy,
              searching: false,
              query: {
                ...query,
                hasMore: res.data.has_more,
                skip: query.skip + res.data.workspaces.length,
              },
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    if (loadMore) {
      handleLoadMore();
    }
  }, [loadMore]);

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
    workspaceYouShareWith: _t("WORKSPACE_BODY.WORKSPACE_YOUR_SHARE_WITH", "Workspaces you share with"),
    noSharedWorkspace: _t("WORKSPACE_BODY.NO_SHARED_WORKSPACE", "You have no shared workspace with"),
    loadingWorkspaces: _t("LABEL.LOADING_WORKSPACES", "Loading workspaces"),
    sharedClient: _t("PAGE.SHARED_CLIENT", "Shared"),
  };

  return (
    <Wrapper className={"container-fluid h-100 fadeIn"} onScroll={handleScroll}>
      <div className="row app-block">
        <AllWorkspaceSidebar actions={actions} dictionary={dictionary} filterBy={filterBy} counters={search.counters} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <AllWorkspaceSearch actions={actions} dictionary={dictionary} search={search} />
          {/* {loaded && <AllWorkspaceBody actions={actions} dictionary={dictionary} filterBy={filterBy} results={filteredResults} />} */}
          {userId ? <RelatedWorkspaceBody userId={userId} /> : loaded && <AllWorkspaceBody actions={actions} dictionary={dictionary} filterBy={filterBy} results={filteredResults} />}
          {initialFetch && (
            <LoaderContainer className={"card initial-load"}>
              <Loader />
            </LoaderContainer>
          )}
          {searching && <Loading text={dictionary.loadingWorkspaces} />}
        </div>
      </div>
    </Wrapper>
  );
};

export default AllWorkspace;
