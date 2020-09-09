import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {
  addToModals,
  getQuickLinks,
  getUnreadNotificationCounterEntries,
  setNavMode
} from "../../../redux/actions/globalActions";
import {NavLink, SvgEmptyState, SvgIcon, SvgIconFeather} from "../../common";
import {useTranslation, useWorkspace} from "../../hooks";
import {ExternalWorkspaceList, WorkspaceList} from "../../workspace";
import {PersonalLinks, QuickLinks} from "../../list/links";
import Tooltip from "react-tooltip-lite";

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
    @media (max-width: 620px) {
      padding: 10px 0 20px 0;
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
    @media (max-width: 620px) {
      padding: 15px 2px 15px 2px;
      font-size: 10px;
      text-transform: uppercase;
      svg {
        margin-right: 3px;
        stroke: #fff9;
        width: 16px;
        height: 16px;
      }
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
    height: 78vh;
    overflow: scroll;
    overscroll-behavior: contain;
    margin: 0 15px;
    &::-webkit-scrollbar {
      display: none;
    }
    ul li a {
      justify-content: space-between;
      height: 40px;
      padding: 0 10px;
      @media (max-width: 620px) {
        color: #ffffff;
        padding: 0 8px;
      }
    }
  }
  .navigation-menu-tab-header-options {
    margin-bottom: 1rem;
    @media (max-width: 620px) {
      margin-bottom: 10px;
    }
  }
`;

const DriffLogo = styled(SvgIcon)`
  width: 84px;
  height: 36px;
  filter: brightness(0) saturate(100%) invert(1);
  cursor: pointer;
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
  margin: 0 8px 0 15px;
`;

const NavNewWorkspace = styled.button`
  background: #fff3 !important;
  color: #ffffffcc;
  border: 0 !important;
  margin: 15px;
  height: 40px;
  width: calc(100% - 30px);
  justify-content: center;
  align-items: center;
  color: #ffffff !important;
  
  div {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`  
  display: flex;
  align-items: start;
  justify-content: center;
  text-align: center;
  color: #fff;
  
  svg {
    display: block;
    margin: 1rem auto;

    circle {
      fill: transparent;
    }
  }
  button {  
    text-transform: uppercase;
  }
`;

const MainNavigationTabPanel = (props) => {
  const {className = "", isExternal} = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const {actions, folders, sortedWorkspaces, workspaces, workspace, workspacesLoaded} = useWorkspace(true);

  const {_t} = useTranslation();

  const dictionary = {
    allWorkspaces: _t("SIDEBAR.ALL_WORKSPACES", "All Workspaces"),
    workspace: _t("SIDEBAR.WORKSPACE", "Workspace"),
    workspaces: _t("SIDEBAR.WORKSPACES", "Workspaces"),
    chats: _t("SIDEBAR.CHATS", "Chats"),
    yourWorkspaces: _t("SIDEBAR.YOUR_WORKSPACES", "Your workspaces"),
    newWorkspace: _t("SIDEBAR.NEW_WORKSPACE", "New workspace"),
    addNewWorkspace: _t("SIDEBAR.ADD_NEW_WORKSPACES", "Add new workspace"),
    workspacesFolder: _t("SIDEBAR.WORKSPACES_FOLDER", "Workspaces"),
    generalFolder: _t("SIDEBAR.GENERAL_FOLDER", "General"),
    archivedFolder: _t("SIDEBAR.ARCHIVED_FOLDER", "Archived workspaces"),
    shortcuts: _t("SIDEBAR.SHORTCUTS", "Shortcuts"),
    personalLinks: _t("SIDEBAR.PERSONAL_LINKS", "Personal links"),
    addShortcut: _t("SIDEBAR.ADD_SHORTCUT", "Add shortcut"),
  };

  const {active_topic} = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const driff = useSelector((state) => state.settings.driff);
  const user = useSelector((state) => state.session.user);
  const {lastVisitedChannel} = useSelector((state) => state.chat);
  const {links, unreadCounter} = useSelector((state) => state.global);

  const [defaultTopic, setDefaultTopic] = useState(null);

  const handleIconClick = (e) => {
    e.preventDefault();
    if (e.target.dataset.link) {
      dispatch(setNavMode({mode: 3}));
    } else {
      dispatch(setNavMode({mode: 2}));
    }
    history.push(e.target.dataset.link);
  };

  useEffect(() => {
    dispatch(getUnreadNotificationCounterEntries());
    dispatch(getQuickLinks());
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

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

  const closeLeftNav = () => {
    document.body.classList.remove("navigation-show");
  };

  useEffect(() => {
    if (defaultTopic) {
      actions.selectWorkspace(defaultTopic);
      actions.redirectTo(defaultTopic);
    }
  }, [defaultTopic]);

  useEffect(() => {
    const arrWorkspaces = Object.values(workspaces);
    if (active_topic === null && arrWorkspaces.length && defaultTopic === null) {
      const topic = arrWorkspaces.sort((a, b) => (b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1)).find((w) => w.type === "WORKSPACE" && w.active === 1);
      setDefaultTopic(topic);
    }
  }, [active_topic, defaultTopic, workspaces, setDefaultTopic]);

  return (
    <Wrapper className={`navigation-menu-tab ${className}`}>
      <div>
        <div className="navigation-menu-tab-header" data-toggle="tooltip" title="Driff" data-placement="right"
             data-original-title="Driff">
          <div className="driff-logo">
            <DriffLogo icon="driff-logo" data-link="/" onClick={handleIconClick}/>
          </div>
        </div>
      </div>
      <div className="flex navigation-menu-tab-header-options">
        <ul>
          <li onClick={closeLeftNav}>
            <NavIconContainer to={"/workspace/search"} active={["/workspace/search"].includes(props.location.pathname)}>
              <NavIcon icon={"compass"}/>
              <div>
                {dictionary.allWorkspaces}
              </div>
            </NavIconContainer>
          </li>
          {!isExternal && (
            <li onClick={closeLeftNav}>
              <NavIconContainer
                active={["dashboard", "posts", "chat", "files", "people"].includes(props.match.params.page)}
                to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ? `/chat/${lastVisitedChannel.code}` : "/chat"}
              >
                <NavIcon icon={"home"}/>
                <div>
                  {driff.company_name}
                  {(unreadCounter.chat_message >= 1 || unreadCounter.unread_channel > 0) &&
                  <Badge data-count={unreadCounter.chat_message}>&nbsp;</Badge>}
                </div>
              </NavIconContainer>
            </li>
          )}
          {links.length > 0 && <QuickLinks links={links} user={user} dictionary={dictionary}/>}
          <PersonalLinks dictionary={dictionary}/>
        </ul>
      </div>

      <div className="your-workspaces-title">
        {dictionary.yourWorkspaces}
        {!isExternal && (
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="New folder">
            <FolderPlus onClick={handleShowFolderModal} icon="folder-plus"/>
          </StyledTooltip>
        )}
      </div>
      <div className="navigation-menu-group">
        <div id="elements" className="open">
          {
            workspacesLoaded && Object.values(folders).length === 0 && Object.values(workspaces).length === 0 ?
              <EmptyState>
                <div>
                  <SvgEmptyState height={200} icon={2}/>
                  <h5>Start by adding a new workspace down there!</h5>
                  <button className="btn btn-primary mt-2" onClick={handleShowWorkspaceModal}>
                    Create workspace
                  </button>
                </div>
              </EmptyState>
              :
              <>
                <ul>
                  {!isExternal &&
                  Object.values(folders)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((folder) => {
                      return (
                        <WorkspaceList
                          key={folder.key_id}
                          actions={actions}
                          folder={folder}
                          history={history}
                          show={true}
                          workspace={workspace}
                          workspaces={sortedWorkspaces.filter((ws) => {
                            return ws.active === 1 && folder.workspace_ids.some((id) => id === ws.id);
                          })}
                        />
                      );
                    })}
                  {!isExternal && Object.values(workspaces).length > 0 && (
                    <WorkspaceList
                      actions={actions}
                      history={history}
                      show={true}
                      workspace={workspace}
                      workspaces={sortedWorkspaces.filter((ws) => {
                        return ws.active === 1 && ws.folder_id === null;
                      })}
                      folder={{
                        id: "general_internal",
                        is_lock: 0,
                        // selected: generalWorkspaces.some((ws) => ws.selected),
                        name: dictionary.workspacesFolder,
                        type: "GENERAL_FOLDER",
                        workspace_ids: Object.values(workspaces)
                          .filter((ws) => {
                            return ws.folder_id === null && ws.active === 1;
                          })
                          .map((ws) => ws.id),
                        unread_count: 0,
                      }}
                    />
                  )}
                  {isExternal &&
                    Object.keys(workspaces).length > 0 &&
                    Object.values(workspaces).map((ws) => {
                      return <ExternalWorkspaceList key={ws.key_id} actions={actions} workspace={ws}
                                                  activeTopic={workspace}/>;
                  })}
                </ul>
              </>
          }
        </div>
      </div>
      {!isExternal && !(Object.values(folders).length === 0 && Object.values(workspaces).length === 0) && (
        <div>
          <NavNewWorkspace onClick={handleShowWorkspaceModal} className="btn btn-outline-light" type="button">
            <div>
              <CirclePlus icon="circle-plus"/>
              {dictionary.addNewWorkspace}
            </div>
          </NavNewWorkspace>
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(MainNavigationTabPanel);
