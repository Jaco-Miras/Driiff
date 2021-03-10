import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { addToModals, setNavMode } from "../../../redux/actions/globalActions";
import { NavLink, SvgEmptyState, SvgIcon, SvgIconFeather } from "../../common";
import { useSettings, useTodos, useTranslation, useWorkspace } from "../../hooks";
import { ExternalWorkspaceList, WorkspaceList } from "../../workspace";
import { QuickLinks } from "../../list/links";
import Tooltip from "react-tooltip-lite";

const Wrapper = styled.div`
  .navigation-menu-tab-header {
    display: flex;
    justify-content: center;
    align-items: center;
    //padding: 30px;
    margin-bottom: 2rem;
    min-height: 74px;
    max-height: 74px;
    background-color: #3f034a;
    .driff-logo {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-color: #fff3;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #fff3;
      @media (max-width: 620px) {
        width: 75px;
        height: 75px;
      }
    }
    @media (max-width: 620px) {
      padding: 20px 0;
    }
    .dark & {
      background-color: inherit;
    }
  }
  .driff-company-name {
    display: flex;
    align-items: center;
    position: relative;

    &.active {
      svg {
        &.action {
          opacity: 1;
        }
      }
    }

    &:hover {
      svg {
        &.action {
          opacity: 1;
        }
      }
    }

    a {
      width: 100%;
      input {
        width: calc(100% - 28px);
        background-color: #fff;
        border: none;
        color: #000;
        border-radius: 6px;
        padding-left: 6px;
      }
    }

    svg {
      &.action {
        opacity: 0;
        cursor: pointer;
        width: 14px;
        color: #fff;
        top: 8px;
        right: 22px;
        position: absolute;
        transition: all 0.5s ease;
      }
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
      top: -12px;
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
  height: 56px;
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
const NavInputContainer = styled.div`
  display: flex;
  color: #fff;
  height: 40px;
  justify-content: flex-start;
  align-items: center;
  margin: 0 15px 10px 15px;
  border-radius: 8px;
  width: 100%;

  &.active {
    background: #ffffff14;
  }
  div {
    display: inline-block;
    position: relative;
  }
  input {
    width: calc(100% - 75px);
    background-color: #fff;
    border: none;
    color: #000;
    border-radius: 6px;
    padding-left: 6px;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  margin: 0 8px 0 15px;
`;

const NavNewWorkspace = styled.button`
  background: #fff3 !important;
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

const GiftWrapper = styled.span`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  :before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    right: -6px;
    border-radius: 50%;
    top: -2px;
    background: #f44;
  }
`;

const GiftIcon = styled(SvgIconFeather)``;

const MainNavigationTabPanel = (props) => {
  const { className = "", isExternal } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const { count } = useTodos();
  const { actions, folders, sortedWorkspaces, workspaces, workspace, workspacesLoaded } = useWorkspace(true);
  const { updateCompanyName, driffSettings, generalSettings, userSettings } = useSettings();

  const { _t } = useTranslation();

  const dictionary = {
    allWorkspaces: _t("SIDEBAR.ALL_WORKSPACES", "Browse workspaces"),
    people: _t("SIDEBAR.PEOPLE", "All people"),
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
    personalLinks: _t("SIDEBAR.PERSONAL_LINKS", "Personal"),
    companyLinks: _t("SIDEBAR.COMPANY_LINKS", "Company"),
    addPersonalShortcut: _t("SIDEBAR.ADD_PERSONAL_SHORTCUT", "Add personal shortcut"),
    todoLinks: _t("SIDEBAR.TODO_LINKS", "Reminders"),
    addTodoItem: _t("SIDEBAR.ADD_TODO_ITEM", "Add reminder"),
    createWorkspace: _t("WORKSPACE.CREATE_WORKSPACE", "Create workspace"),
    sidebarTextCreateWorkspace: _t("WORKSPACE.TEXT_CREATE_WORKSPACE", "Create workspace"),
    bots: _t("SIDEBAR.BOTS", "Bots"),
  };

  const user = useSelector((state) => state.session.user);
  const { lastVisitedChannel } = useSelector((state) => state.chat);
  const { links, unreadCounter } = useSelector((state) => state.global);
  const { order_channel } = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const [editCompany, setEditCompany] = useState(false);
  const [companyName, setCompanyName] = useState(driffSettings.company_name);
  const [defaultTopic, setDefaultTopic] = useState(null);

  const refs = {
    companyName: useRef(null),
  };

  const handleIconClick = (e) => {
    e.preventDefault();
    if (e.target.dataset.link) {
      dispatch(setNavMode({ mode: 3 }));
    } else {
      dispatch(setNavMode({ mode: 2 }));
    }
    history.push(e.target.dataset.link);
  };

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

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const toggleEditCompany = () => {
    setEditCompany((prevState) => {
      let newState = !prevState;

      if (!newState && driffSettings.company_name !== companyName)
        updateCompanyName({
          company_name: companyName,
        });

      return newState;
    });
  };

  const handleCompanyNameKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: {
        toggleEditCompany();
        break;
      }
      case 27: {
        toggleEditCompany();
        break;
      }
      default:
        return;
    }
  };

  // useEffect(() => {
  //   // dispatch(getUnreadNotificationCounterEntries());
  //   // dispatch(getQuickLinks());
  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (defaultTopic) {
      actions.selectWorkspace(defaultTopic);
      actions.redirectTo(defaultTopic);
    }
  }, [defaultTopic]);

  useEffect(() => {
    const arrWorkspaces = Object.values(workspaces);
    if (generalSettings.active_topic === null && arrWorkspaces.length && defaultTopic === null) {
      const topic = arrWorkspaces.sort((a, b) => (b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1)).find((w) => w.type === "WORKSPACE" && w.active === 1);
      setDefaultTopic(topic);
    }
  }, [generalSettings.active_topic, defaultTopic, workspaces, setDefaultTopic]);

  useEffect(() => {
    if (refs.companyName.current) {
      refs.companyName.current.select();
    }
  }, [editCompany]);

  const sortWorkspace = useCallback(() => {
    return Object.values(sortedWorkspaces).sort((a, b) => {
      if (order_channel.order_by === "channel_date_updated") {
        return -1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [sortedWorkspaces]);

  const hasUnreadCounter =
    Object.keys(unreadCounter)
      .filter((k) => k !== "chat_reminder_message")
      .reduce((total, k) => {
        total += unreadCounter[k];
        return total;
      }, 0) !== 0 || count.overdue !== 0;

  const handleGiftClick = () => {
    history.push("/releases");
  };

  return (
    <Wrapper className={`navigation-menu-tab ${className}`}>
      <div className="navigation-menu-tab-header" data-toggle="tooltip" title="Driff" data-placement="right" data-original-title="Driff">
        {((driffSettings.READ_RELEASE_UPDATES && userSettings.READ_RELEASE_UPDATES && driffSettings.READ_RELEASE_UPDATES.timestamp > userSettings.READ_RELEASE_UPDATES.timestamp) || userSettings?.READ_RELEASE_UPDATES === null) && (
          <GiftWrapper>
            <GiftIcon icon="gift" color="#fff" onClick={handleGiftClick} />
          </GiftWrapper>
        )}
        <DriffLogo icon="driff-logo2" data-link="/" onClick={handleIconClick} />
      </div>

      <div className="flex navigation-menu-tab-header-options">
        <ul>
          {!isExternal && (
            <li onClick={closeLeftNav} className={`driff-company-name ${editCompany ? "active" : ""}`}>
              {editCompany ? (
                <NavInputContainer className="active">
                  <NavIcon icon={"home"} />
                  <input ref={refs.companyName} defaultValue={driffSettings.company_name} onChange={handleCompanyNameChange} onKeyDown={handleCompanyNameKeyDown} name="company-name" autoFocus={true} />
                </NavInputContainer>
              ) : (
                <NavIconContainer
                  active={["dashboard", "posts", "chat", "files", "people"].includes(props.match.params.page)}
                  to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ? `/chat/${lastVisitedChannel.code}` : "/chat"}
                >
                  <NavIcon icon={"home"} />
                  {driffSettings.company_name}
                  <div>{hasUnreadCounter === true && <Badge>&nbsp;</Badge>}</div>
                </NavIconContainer>
              )}
              {user.role && ["owner", "admin"].includes(user.role.name) && (
                <>{editCompany ? <SvgIconFeather className="action" onClick={toggleEditCompany} icon="save" /> : <SvgIconFeather className="action" onClick={toggleEditCompany} icon="pencil" />}</>
              )}
            </li>
          )}
          <li>
            <NavIconContainer to={"/todos"} active={["/todos"].includes(props.location.pathname)}>
              <NavIcon icon={"check"} />
              <div>{dictionary.todoLinks}</div>
              <div>{count.overdue !== 0 && <Badge>&nbsp;</Badge>}</div>
            </NavIconContainer>
          </li>
          <li onClick={closeLeftNav}>
            <NavIconContainer to={"/workspace/search"} active={["/workspace/search"].includes(props.location.pathname)}>
              <NavIcon icon={"compass"} />
              <div>{dictionary.allWorkspaces}</div>
            </NavIconContainer>
          </li>
          {user.type === "internal" && (
            <li>
              <NavIconContainer to={"/system/people"} active={["/system/people"].includes(props.location.pathname)}>
                <NavIcon icon={"user"} />
                <div>{dictionary.people}</div>
              </NavIconContainer>
            </li>
          )}
          {/* <li>
            <NavIconContainer>
              <NavIcon icon={"link"}/>
              <div>{dictionary.shortcuts}</div>
            </NavIconContainer>
          </li> */}
          <QuickLinks links={links} user={user} dictionary={dictionary} />
          {user.role && ["owner"].includes(user.role.name) && (
            <li>
              <NavIconContainer to={"/bot"} active={["/bot"].includes(props.location.pathname)}>
                <NavIcon icon={"cpu"} />
                <div>{dictionary.bots}</div>
              </NavIconContainer>
            </li>
          )}
        </ul>
      </div>

      <div className="your-workspaces-title">
        {dictionary.yourWorkspaces}
        {!isExternal && (
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="New folder">
            <FolderPlus onClick={handleShowFolderModal} icon="folder-plus" />
          </StyledTooltip>
        )}
      </div>
      <div className="navigation-menu-group">
        <div id="elements" className="open">
          {workspacesLoaded && Object.values(folders).length === 0 && Object.values(workspaces).length === 0 ? (
            <EmptyState>
              <div>
                <SvgEmptyState height={200} icon={2} />
                {user.type !== "external" && (
                  <>
                    <h5>{dictionary.sidebarTextCreateWorkspace}</h5>
                    <button className="btn btn-primary mt-2" onClick={handleShowWorkspaceModal}>
                      {dictionary.createWorkspace}
                    </button>
                  </>
                )}
              </div>
            </EmptyState>
          ) : (
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
                          workspaces={sortWorkspace().filter((ws) => {
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
                    workspaces={sortWorkspace().filter((ws) => {
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
                      unread_count: Object.values(workspaces).filter((ws) => {
                        return ws.folder_id === null && ws.active === 1 && (ws.unread_chats > 0 || ws.unread_posts > 0);
                      }).length,
                    }}
                  />
                )}
                {isExternal &&
                  Object.keys(workspaces).length > 0 &&
                  Object.values(workspaces)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((ws) => {
                      return <ExternalWorkspaceList key={ws.id} actions={actions} workspace={ws} activeTopic={workspace} />;
                    })}
              </ul>
            </>
          )}
        </div>
      </div>
      {user.type !== "external" && !(Object.values(folders).length === 0 && Object.values(workspaces).length === 0) && (
        <div>
          <NavNewWorkspace onClick={handleShowWorkspaceModal} className="btn btn-outline-light" type="button">
            <div>
              <CirclePlus icon="circle-plus" />
              {dictionary.addNewWorkspace}
            </div>
          </NavNewWorkspace>
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(MainNavigationTabPanel);
