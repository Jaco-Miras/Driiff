import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import AllWorkspaceSidebar from "./AllWorkspaceSidebar";
import AllWorkspaceSearch from "./AllWorkspaceSearch";
import AllWorkspaceBody from "./AllWorkspaceBody";
import { useTranslation, useWorkspaceSearchActions } from "../../hooks";

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
  const user = useSelector((state) => state.session.user);
  const { results, filterBy, value } = search;
  const { _t } = useTranslation();
  const actions = useWorkspaceSearchActions();

  useEffect(() => {
    document.body.classList.add("stretch-layout");
    // document.getElementById("main").setAttribute("style", "overflow: auto");
    // return () => document.getElementById("main").removeAttribute("style");
  }, []);

  useEffect(() => {
    actions.updateSearch({
      searching: true,
      results: [],
    });
    actions.search(
      {
        search: value,
        skip: 0,
        limit: 25,
        filter_by: filterBy,
      },
      (err, res) => {
        if (err) {
          actions.updateSearch({
            searching: false,
          });
        } else {
          actions.updateSearch({
            filterBy: filterBy,
            searching: false,
            count: res.data.total_count,
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
  };
  return (
    <Wrapper className={"container-fluid h-100 fadeIn"}>
      <div className="row app-block">
        <AllWorkspaceSidebar actions={actions} dictionary={dictionary} filterBy={filterBy} />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <AllWorkspaceSearch actions={actions} dictionary={dictionary} search={search} />
          <AllWorkspaceBody dictionary={dictionary} results={results} />
        </div>
      </div>
    </Wrapper>
  );
};

export default AllWorkspace;
