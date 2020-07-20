import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { replaceChar } from "../../../helpers/stringFormatter";
import { getUnreadNotificationCounterEntries, setNavMode } from "../../../redux/actions/globalActions";
import { NavLink, SvgIcon, SvgIconFeather } from "../../common";
import Tooltip from "react-tooltip-lite";
// import { WorkspaceNavigationMenuBodyPanel } from "../workspace";
import { useSetWorkspace, useSortWorkspaces } from "../../hooks";
import { WorkspaceList } from "../../workspace";
import { addToModals } from "../../../redux/actions/globalActions";
import { setActiveTab } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  .navigation-menu-tab-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0 30px 0;
    .driff-logo {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-color: #fff3;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #fff3;
    }
  }
  .your-workspaces-title {
    margin: 0 15px;
    padding: 15px 10px 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff9;
    border-top: 1px solid #fff3;
    svg {
      color: #ffffff;
    }
  }
  li {
    position: relative;
    .badge {
      position: absolute;
      width: 6px;
      height: 6px;
      padding: 0;
      background: #28a745;
      right: -12px;
      top: -1px;
      z-index: 9;
    }
  }
  .navigation-menu-group {
    -ms-overflow-style: none;
    scrollbar-width: none;
    height: 74vh;
    overflow: scroll;
    margin: 0 15px;
    &::-webkit-scrollbar {
      display: none;
    }
    ul li a {
      justify-content: space-between;
      height: 40px;
      padding: 0 10px;
    }
  }
`;

const DriffLogo = styled(SvgIcon)`
  width: 84px;
  height: 36px;
  filter: brightness(0) saturate(100%) invert(1);
  cursor: pointer;
  cursor: hand;
`;

const FolderPlus = styled(SvgIconFeather)`
  height: 14px;
  width: 14px;
  cursor: pointer;
`;

const CirclePlus = styled(SvgIconFeather)`
  height: 14px;
  width: 14px;
  margin-right: 4px;
`;

const NavIconContainer = styled(NavLink)`
  display: flex;
  color: #fff;
  height: 40px;
  justify-content: flex-start;
  align-items: center;
  margin: 0 15px 10px 15px;
  border-radius: 8px;
  &.active {
    background: #ffffff14;
  }
  div {
    display: inline-block;
    position: relative;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  cursor: hand;
  margin: 0 8px 0 15px;
`;

const NavNewWorkspace = styled.button`
  background: #7a1b8bcc !important;
  color: #ffffffcc;
  border: 0 !important;
  margin: 15px;
  height: 40px;
  width: calc(100% - 30px);
  justify-content: center;
  align-items: center;
  color: #ffffff !important;
  ${"" /* border: 1px solid #fff3 !important; */}
  div {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    ${"" /* filter: invert(1); */}
    font-weight: 500;
  }
`;

const MainNavigationTabPanel = (props) => {
  const { className = "" } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const { active_topic } = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { lastVisitedChannel } = useSelector((state) => state.chat);
  const unreadCounter = useSelector((state) => state.global.unreadCounter);

  const [workspacePath, setWorkpacePath] = useState("/workspace/chat");

  const handleIconClick = (e) => {
    e.preventDefault();
    if (e.target.dataset.link) {
      dispatch(setNavMode({ mode: 3 }));
    } else {
      dispatch(setNavMode({ mode: 2 }));
    }
    history.push(e.target.dataset.link);
  };

  useEffect(() => {
    dispatch(getUnreadNotificationCounterEntries());

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  useEffect(() => {
    if (active_topic) {
      const { workspace, topic } = active_topic;
      if (workspace) {
        setWorkpacePath(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}/${topic.id}/${replaceChar(topic.name)}`);
      } else if (topic && topic.hasOwnProperty("id") && topic.id !== undefined) {
        setWorkpacePath(`/workspace/chat/${topic.id}/${replaceChar(topic.name)}`);
      }
    }
  }, [active_topic]);

  const activeTab = useSelector((state) => state.workspaces.activeTab);

  const handleShowFolderModal = () => {
    let payload = {
      type: "workspace_folder",
      mode: "create",
    };
    dispatch(addToModals(payload));
  };

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
  };

  useSetWorkspace();
  const sortedWorkspaces = useSortWorkspaces();
  const generalInternalWorkspaces = sortedWorkspaces.filter((ws) => ws.type !== "FOLDER" && ws.is_external === 0 && ws.topic_detail.active === 1);
  const generalExternalWorkspaces = sortedWorkspaces.filter((ws) => ws.type !== "FOLDER" && ws.is_external !== 0 && ws.topic_detail.active === 1);
  const archiveInternalWorkspacesFolder = sortedWorkspaces.filter((ws) => {
    return ws.type === "FOLDER" && ws.is_external === 0 && Object.values(ws.topics).some((t) => t.active === 0);
  });
  //const archiveExternalWorkspacesFolder = sortedWorkspaces.filter((ws) => ws.type === "FOLDER" && ws.is_external !== 0 && ws.topics.some(t => t.active === 0));
  const archiveInternalWorkspaces = sortedWorkspaces.filter((ws) => ws.type !== "FOLDER" && ws.is_external === 0 && ws.topic_detail.active === 0);
  const archiveExternalWorkspaces = sortedWorkspaces.filter((ws) => ws.type !== "FOLDER" && ws.is_external !== 0 && ws.topic_detail.active === 0);

  return (
    <Wrapper className={`navigation-menu-tab ${className}`}>
      <div>
        <div className="navigation-menu-tab-header" data-toggle="tooltip" title="Driff" data-placement="right" data-original-title="Driff">
          <div class="driff-logo">
            <DriffLogo icon="driff-logo" data-link="/" onClick={handleIconClick} />
          </div>
        </div>
      </div>
      <div className="flex-grow-1 mb-3">
        <ul>
          <li>
            <NavIconContainer to={workspacePath}>
              <NavIcon icon={"command"} />
              <div>
                Workspaces
                {unreadCounter.workspace_chat_message + unreadCounter.workspace_post >= 1 && <Badge data-count={unreadCounter.workspace_chat_message + unreadCounter.workspace_post}>&nbsp;</Badge>}
              </div>
            </NavIconContainer>
          </li>
          <li>
            <NavIconContainer
              active={["dashboard", "posts", "chat", "files", "people"].includes(props.match.params.page)}
              to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ? `/chat/${lastVisitedChannel.code}` : "/chat"}
            >
              <NavIcon icon={"message-circle"} />
              <div>
                Chats
                {(unreadCounter.chat_message >= 1 || unreadCounter.unread_channel > 0) && <Badge data-count={unreadCounter.chat_message}>&nbsp;</Badge>}
              </div>
            </NavIconContainer>
          </li>
        </ul>
      </div>

      <div className="your-workspaces-title">
        Your workspaces
        <FolderPlus onClick={handleShowFolderModal} icon="folder-plus" />
      </div>
      <div className="navigation-menu-group">
        <div id="elements" className="open">
          <ul>
            {sortedWorkspaces
              .filter((sws) => sws.type === "FOLDER")
              .map((ws) => {
                return <WorkspaceList show={ws.is_external === (activeTab === "intern" ? 0 : 1)} key={ws.key_id} workspace={ws} />;
              })}
            {generalInternalWorkspaces.length > 0 && (
              <WorkspaceList
                show={activeTab === "intern"}
                workspace={{
                  id: "general_internal",
                  is_lock: 0,
                  selected: generalInternalWorkspaces.some((ws) => ws.selected),
                  name: "General",
                  type: "GENERAL_FOLDER",
                  topics: generalInternalWorkspaces,
                }}
              />
            )}
            {generalExternalWorkspaces.length > 0 && (
              <WorkspaceList
                show={activeTab !== "intern"}
                workspace={{
                  id: "general_external",
                  is_lock: 0,
                  selected: generalInternalWorkspaces.some((ws) => ws.selected),
                  name: "General",
                  type: "GENERAL_FOLDER",
                  topics: generalInternalWorkspaces,
                }}
              />
            )}
          </ul>

          <ul>
            {archiveInternalWorkspaces.length > 0 && (
              <WorkspaceList
                show={activeTab === "intern"}
                workspace={{
                  id: "archive",
                  is_lock: 0,
                  is_active: 0,
                  selected: archiveInternalWorkspaces.some((ws) => ws.selected),
                  name: "Archived workspaces",
                  type: "ARCHIVE_FOLDER",
                  topics: archiveInternalWorkspaces,
                }}
              />
            )}
            {archiveExternalWorkspaces.length > 0 && (
              <WorkspaceList
                show={activeTab !== "intern"}
                workspace={{
                  id: "archive",
                  is_lock: 0,
                  is_active: 0,
                  selected: archiveExternalWorkspaces.some((ws) => ws.selected),
                  name: "Archived workspaces",
                  type: "ARCHIVE_FOLDER",
                  topics: archiveExternalWorkspaces,
                }}
              />
            )}
          </ul>
        </div>
      </div>

      <div>
        <NavNewWorkspace onClick={handleShowWorkspaceModal} className="btn btn-outline-light" type="button">
          <div>
            <CirclePlus icon="circle-plus" />
            Add new workspace
          </div>
        </NavNewWorkspace>
      </div>
    </Wrapper>
  );
};

export default React.memo(MainNavigationTabPanel);
