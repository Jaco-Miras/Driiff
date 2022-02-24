import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import WorkspaceListItem from "./WorkspaceListItem";
import { ToolTip } from "../../common";
import useQueryParams from "../../hooks/useQueryParams";
import { useUsers } from "../../hooks";
const Wrapper = styled.div`
  overflow: visible !important;
`;

const ListsHeader = styled.li`
  border: none;
  cursor: pointer;
  .badge.badge-light {
    background: #f1f2f7;
  }
`;

const Lists = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    padding: 15px;
  }
  li:nth-child(2) {
    border-top: none;
  }
  &.active-workspaces {
    border-radius 6px 6px 0 0;
  }
  &.archived-workspaces {
    .dark & {
      border: 1px solid;
      border-top: 0;
      border-color: hsla(0,0%,60.8%,.1);
      border-radius: 0 0 6px 6px;
      background: #252a2d;
    }
  }
  &.archived-workspaces li {
    background-color: #fafafa;
    opacity: .7;
    .dark & {
      background-color: #252a2d;
    }
  }
  &.archived-workspaces li:last-child {
    border-radius 0 0 6px 6px;
    border-bottom: none;
  }
`;
const AllWorkspaceBody = (props) => {
  const { actions, dictionary, filterBy, results } = props;
  const [showWorkspaces, setShowWorkspaces] = useState({ showActive: true, showArchived: true });
  const [sortWorkspaces, setSortWorkspaces] = useState({ activeDate: true, archivedDate: true }); // default is date else alphabet

  const { users } = useUsers();
  const { params } = useQueryParams();
  const userId = params ? params["user-id"] : null;

  const connectedUser = useMemo(() => {
    if (userId && filterBy === "all") {
      return users[userId];
    }
    return null;
  }, [userId, users, filterBy]);

  const handleShowWorkspaces = (type) => {
    setShowWorkspaces({
      ...showWorkspaces,
      [type]: !showWorkspaces[type],
    });
  };

  const handleSortWorkspaces = (type) => {
    setSortWorkspaces({
      ...sortWorkspaces,
      [type]: !sortWorkspaces[type],
    });
  };

  return (
    <Wrapper className={"card"}>
      {connectedUser && (
        <p className="mx-3 my-2">
          {dictionary.connectedWorkspaceOf}: {connectedUser.name}
        </p>
      )}
      <Lists className="active-workspaces">
        <ListsHeader className="list-group-item">
          <span className="badge badge-light" onClick={() => handleShowWorkspaces("showActive")}>
            <SvgIconFeather icon={showWorkspaces.showActive ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
            {dictionary.active}
          </span>
          <div style={{ float: "right" }}>
            <ToolTip content={sortWorkspaces.activeDate ? dictionary.workspaceSortOptionsDate : dictionary.workspaceSortOptionsAlpha}>
              <span className="badge badge-light" onClick={() => handleSortWorkspaces("activeDate")}>
                <SvgIconFeather icon={sortWorkspaces.activeDate ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
              </span>
            </ToolTip>
          </div>
        </ListsHeader>
        {showWorkspaces.showActive &&
          results
            .filter((r) => {
              if (filterBy === "favourites") {
                return !r.topic.is_archive && r.topic.is_favourite;
              } else {
                return !r.topic.is_archive;
              }
            })
            .sort(function (a, b) {
              if (sortWorkspaces.activeDate) {
                return new Date(b.topic.created_at.date_time) - new Date(a.topic.created_at.date_time);
              } else {
                if (a.topic.name.toLowerCase() < b.topic.name.toLowerCase()) return -1;
                if (a.topic.name.toLowerCase() > b.topic.name.toLowerCase()) return 1;
              }

              return 0;
            })
            .map((result) => {
              return <WorkspaceListItem actions={actions} key={result.topic.id} dictionary={dictionary} item={result} />;
            })}
      </Lists>
      <Lists className="archived-workspaces">
        <ListsHeader className="list-group-item">
          <span className="badge badge-light" onClick={() => handleShowWorkspaces("showArchived")}>
            <SvgIconFeather icon={showWorkspaces.showArchived ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
            {dictionary.archived}
          </span>
          <div style={{ float: "right" }}>
            <ToolTip content={sortWorkspaces.archivedDate ? dictionary.workspaceSortOptionsDate : dictionary.workspaceSortOptionsAlpha}>
              <span className="badge badge-light" onClick={() => handleSortWorkspaces("archivedDate")}>
                <SvgIconFeather icon={sortWorkspaces.archivedDate ? "arrow-down" : "arrow-up"} width={16} height={16} className="mr-1" />
              </span>
            </ToolTip>
          </div>
        </ListsHeader>
        {showWorkspaces.showArchived &&
          results
            .filter((r) => {
              if (filterBy === "favourites") {
                return r.topic.is_archive && r.topic.is_favourite;
              } else {
                return r.topic.is_archive;
              }
            })
            .sort(function (a, b) {
              if (sortWorkspaces.archivedDate) {
                return new Date(b.topic.created_at.date_time) - new Date(a.topic.created_at.date_time);
              } else {
                if (a.topic.name.toLowerCase() < b.topic.name.toLowerCase()) return -1;
                if (a.topic.name.toLowerCase() > b.topic.name.toLowerCase()) return 1;
              }

              return 0;
            })
            .map((result) => {
              return <WorkspaceListItem actions={actions} key={result.topic.id} dictionary={dictionary} item={result} />;
            })}
      </Lists>
    </Wrapper>
  );
};

export default AllWorkspaceBody;
