import React, { useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import WorkspaceListItem from "./WorkspaceListItem";

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

  const handleShowWorkspaces = (type) => {
    setShowWorkspaces({
      ...showWorkspaces,
      [type]: !showWorkspaces[type],
    });
  };

  return (
    <Wrapper className={"card"}>
      <Lists className="active-workspaces">
        <ListsHeader className="list-group-item" onClick={() => handleShowWorkspaces("showActive")}>
          <span className="badge badge-light">
            <SvgIconFeather icon={showWorkspaces.showActive ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
            {dictionary.active}
          </span>
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
            .map((result) => {
              return <WorkspaceListItem actions={actions} key={result.topic.id} dictionary={dictionary} item={result} />;
            })}
      </Lists>
      <Lists className="archived-workspaces">
        <ListsHeader className="list-group-item" onClick={() => handleShowWorkspaces("showArchived")}>
          <span className="badge badge-light">
            <SvgIconFeather icon={showWorkspaces.showArchived ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
            {dictionary.archived}
          </span>
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
            .map((result) => {
              return <WorkspaceListItem actions={actions} key={result.topic.id} dictionary={dictionary} item={result} />;
            })}
      </Lists>
    </Wrapper>
  );
};

export default AllWorkspaceBody;
