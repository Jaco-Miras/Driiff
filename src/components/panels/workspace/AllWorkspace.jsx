import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import AllWorkspaceSidebar from "./AllWorkspaceSidebar";
import AllWorkspaceSearch from "./AllWorkspaceSearch";
import AllWorkspaceBody from "./AllWorkspaceBody";
import { useTranslation, useWorkspaceSearchActions } from "../../hooks";
import { throttle } from "lodash";

const Wrapper = styled.div`
  overflow: hidden auto;
  .app-block {
    overflow: inherit;
    .app-content {
      height: auto;
    }
  }
`;

const AllWorkspace = (props) => {
  const search = useSelector((state) => state.workspaces.search);
  const { hasMore, results, filterBy, value } = search;
  const { _t } = useTranslation();
  const actions = useWorkspaceSearchActions();

  const [loadMore, setLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("stretch-layout");
    actions.getFilterCount();
  }, []);

  useEffect(() => {
    actions.updateSearch({
      searching: true,
      results: [],
    });
    setLoading(true);
    actions.search(
      {
        search: value,
        skip: 0,
        limit: 25,
        filter_by: filterBy,
      },
      (err, res) => {
        setLoading(false);
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
            maxPage: Math.ceil(res.data.total_count / 25),
          });
        }
      }
    );
  }, [filterBy, value]);

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
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      actions.search(
        {
          search: value,
          skip: results.length,
          limit: 25,
          filter_by: filterBy,
        },
        (err, res) => {
          setLoading(false);
          setLoadMore(false);
          if (err) {
            actions.updateSearch({
              searching: false,
            });
          } else {
            actions.updateSearch({
              filterBy: filterBy,
              searching: false,
              hasMore: res.data.has_more,
              count: res.data.total_count,
              results: [...results, ...res.data.workspaces],
              maxPage: Math.ceil(res.data.total_count / 25),
            });
          }
        }
      );
    }
  };

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

  useEffect(() => {
    if (loadMore) {
      handleLoadMore();
    }
  }, [loadMore]);

  return (
    <Wrapper className={"container-fluid h-100 fadeIn"} onScroll={handleScroll}>
      <div className="row app-block">
        <AllWorkspaceSidebar actions={actions} dictionary={dictionary} filterBy={filterBy} counters={search.counters} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <AllWorkspaceSearch actions={actions} dictionary={dictionary} search={search} />
          <AllWorkspaceBody actions={actions} dictionary={dictionary} filterBy={filterBy} results={results} />
        </div>
      </div>
    </Wrapper>
  );
};

export default AllWorkspace;
