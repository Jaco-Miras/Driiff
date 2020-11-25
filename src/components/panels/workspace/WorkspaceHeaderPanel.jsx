import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { Avatar, SvgIconFeather } from "../../common";
import { HeaderProfileNavigation } from "../common";
import { SettingsLink } from "../../workspace";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { useToaster, useTranslation, useWorkspaceSearchActions } from "../../hooks";
import { MemberLists } from "../../list/members";
import { WorkspacePageHeaderPanel } from "../workspace";

const NavBarLeft = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .btn {
    font-weight: 400;
    height: 32px;
    margin-left: 12px;
    padding-top: 0;
    padding-bottom: 0;
    svg {
      color: #ffffff;
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
  @media (max-width: 991.99px) {
    margin-right: 5px;
    padding-right: 10px;
  }
  @media (max-width: 991.99px) {
    .nav-item-folder,
    .nav-item-chevron {
      display: none;
    }
  }
  @media all and (max-width: 700px) {
    margin-right: 0;
    padding-right: 0;
  }
  .navbar-nav {
    height: 100%;
    .navbar-wrap {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .navbar-top {
        margin-top: 4px;
        display: flex;
        align-items: center;
        height: 40px;
      }
      .navbar-bottom {
        @media all and (max-width: 700px) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 0 16px;
        }
      }
    }
    @media all and (max-width: 700px) {
      margin-left: 0;
      display: flex;
      justify-content: space-between;
    }
  }
  svg.feather-menu {
    color: #7a1b8b !important;
  }
`;

const NavBar = styled.ul`
  display: flex;
  width: 100%;
  align-items: center;

  li {
    // justify-content: center;
    align-items: center;
    &.nav-item-last {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      padding-right: 15px;
      border-right: 1px solid #f1f1f1;
      @media all and (max-width: 700px) {
        display: none;
      }
      .btn {
        @media all and (max-width: 920px) {
          display: none;
        }
      }
      .nav-item-avatars-wrap {
        display: flex;
        flex-direction: row-reverse;
      }
      .avatar-sm {
        border: 2px solid #ffffff;
      }
      @media all and (max-width: 440px) {
        display: none;
      }
    }
    svg {
      color: #b8b8b8;
    }
    svg.feather-pencil {
      width: 16px;
      height: 16px;
      color: #64625c;
    }
    svg.feather-compass {
      color: rgb(80, 80, 80);
      
      .dark & {
        color: #fff;    
      }
    }
  }
  .nav-link {
    padding: 0px !important;
    background: transparent !important;
    svg {
      color: #000000;
      width: 24px !important;
      height: 24px !important;
    }
  }
`;

const WorkspaceName = styled.h2`
  letter-spacing: 0;
  margin-bottom: 0;
  color: #b8b8b8;
  font-weight: 500;
  font-size: 20px;
  margin-right: 2px;
  @media all and (max-width: 620px) {
    font-size: 16px;
  }
`;

const WorkspacePageTitle = styled.h2`
    letter-spacing: 0;
    margin-bottom: 0;
    color: rgb(80, 80, 80);
    font-weight: 500;
    font-size: 20px;
    margin-right: 2px;

    .dark & {
      color: #fff;    
    }

    svg {
      color: #64625c;
    }

    @media all and (max-width: 620px) {
      font-size: 16px;
    }
`;

const WorkspaceWrapper = styled.span`
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  @media all and (max-width: 1200px) {
    max-width: 200px;
  }
`;

const SubWorkspaceName = styled.h3`
  letter-spacing: 0;
  margin-bottom: 0;
  color: #000000;
  font-weight: normal;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    height: 2rem;
    width: 2rem;
    margin-right: 0.25rem;
  }
  svg {
    color: #64625c;
  }
  .feather-lock,
  .feather-share {
    color: #64625c;
  }
  @media all and (max-width: 620px) {
    font-size: 16px;
  }
`;

const WorkspaceButton = styled.h3`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 0;
  svg {
    margin-left: 4px;
    @media all and (max-width: 620px) {
      width: 18px !important;
      height: 18px !important;
    }
  }
  @media all and (max-width: 620px) {
    font-size: 16px;
  }
`;

const Icon = styled(SvgIconFeather)`
  height: 14px !important;
  width: 14px !important;
  margin-left: 5px;
`;

const WorspaceHeaderPanel = (props) => {
  const {isExternal} = props;
  const toaster = useToaster();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const {activeTopic, folders} = useSelector((state) => state.workspaces);
  const {driff, user: {GENERAL_SETTINGS: {dark_mode}}} = useSelector((state) => state.settings);
  const user = useSelector((state) => state.session.user);

  const {_t} = useTranslation();

  const dictionary = {
    allWorkspaces: _t("SIDEBAR.ALL_WORKSPACES", "Browse Workspaces"),
    pageTitleWorkspaceDashboard: _t("PAGE_TITLE.WORKSPACE_DASHBOARD", "Dashboard"),
    pageTitleWorkspacePosts: _t("PAGE_TITLE.WORKSPACE_POSTS", "Posts"),
    pageTitleWorkspaceChat: _t("PAGE_TITLE.WORKSPACE_CHAT", "Chat"),
    pageTitleWorkspaceFiles: _t("PAGE_TITLE.WORKSPACE_FILES", "Files"),
    pageTitleWorkspaceNotifications: _t("PAGE_TITLE.WORKSPACE_NOTIFICATIONS", "Notifications"),
    pageTitleWorkspacePeople: _t("PAGE_TITLE.WORKSPACE_PEOPLE", "People"),
    pageTitleWorkspaceProfile: _t("PAGE_TITLE.WORKSPACE_PROFILE", "Profile"),
    pageTitleWorkspaceSearch: _t("PAGE_TITLE.WORKSPACE_SEARCH", "Search workspace"),
    pageTitleSettings: _t("PAGE_TITLE.SETTINGS", "Settings"),
    pageTitleTodos: _t("PAGE_TITLE.TODOS", "To-dos & Reminders"),
    generalSearch: _t("GENERAL.SEARCH", "Search"),
    generalNotifications: _t("GENERAL.NOTIFICATIONS", "Notifications"),
    generalSwitchTheme: _t("SETTINGS.SWITCH_TO_THEME_MODE", "Switch to ::mode::", {
      mode: dark_mode === "0" ? _t("SETTINGS.DARK_MODE", "dark mode") : _t("SETTINGS.LIGHT_MODE", "light mode")
    }),
    actionWorkspaceNewWorkspace: _t("ACTION.NEW_WORKSPACE", "New workspace"),
    actionWorkspaceInvite: _t("ACTION.INVITE_WORKSPACE", "Invite"),
    actionWorkspaceJoin: _t("ACTION.JOIN_WORKSPACE", "Join"),
    statusWorkspacePrivate: _t("WORKSPACE.STATUS_PRIVATE", "Private"),
    statusWorkspaceArchived: _t("WORKSPACE.STATUS_ARCHIVED", "Archived"),
    toasterJoinWorkspace: _t("TOASTER.JOIN_WORKSPACE", "You have joined ::topic_name::", {
      topic_name: activeTopic ? `<b>#{activeTopic.name}</b>` : ""
    })
  }

  const actions = useWorkspaceSearchActions();

  const search = useSelector((state) => state.workspaces.search);

  const { value, searching } = search;
  const [inputValue, setInputValue] = useState(value);
  const [pageName, setPageName] = useState(dictionary.pageTitleDashboard);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
  };

  const handleEditWorkspace = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "edit",
      item: activeTopic,
    };

    dispatch(addToModals(payload));
  };

  const handleJoinWorkspace = () => {
    dispatch(
      joinWorkspace(
        {
          channel_id: activeTopic.channel.id,
          recipient_ids: [user.id],
        },
        (err, res) => {
          if (err) return;
          toaster.success(
            <span dangerouslySetInnerHTML={{__html: dictionary.toasterJoinWorkspace}}/>
          );
        }
      )
    );
  };

  const handleMenuOpenMobile = (e) => {
    e.preventDefault();
    document.body.classList.add("navigation-show");
  };

  useEffect(() => {
    const body = document.body;

    let pageName = "";
    switch (match.params.page) {
      case "posts": {
        pageName = dictionary.pageTitleWorkspacePosts;
        break;
      }
      case "chat": {
        pageName = dictionary.pageTitleWorkspaceChat;
        break;
      }
      case "files": {
        pageName = dictionary.pageTitleWorkspaceFiles;
        break;
      }
      case "people": {
        pageName = dictionary.pageTitleWorkspacePeople;
        break;
      }
      case "settings": {
        pageName = dictionary.pageTitleSettings;
        break;
      }
      default: {
        pageName = dictionary.pageTitleWorkspaceDashboard;
      }
    }

    if ([dictionary.pageTitleWorkspaceDashboard, dictionary.pageTitleWorkspacePosts,
      dictionary.pageTitleWorkspaceFiles, dictionary.pageTitleWorkspacePeople].includes(pageName)) {
      body.classList.remove("stretch-layout");
    } else {
      body.classList.add("stretch-layout");
    }

    if (activeTopic) {
      if (activeTopic.unread_chats >= 1 || activeTopic.unread_posts > 0) {
        document.title = `${pageName} ‹ * ${activeTopic.name} — ${driff.company_name} @ Driff`;
      } else {
        document.title = `${pageName} ‹ ${activeTopic.name} — ${driff.company_name} @ Driff`;
      }
    }
  }, [match.params.page, dispatch, activeTopic]);
  console.log(activeTopic);
  return (
    <>
      <NavBarLeft className="navbar-left">
        <NavBar className="navbar-nav">
          {match.params.page === "search" ? (
            <>
              <li className="nav-item navigation-toggler mobile-toggler">
                <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
                  <SvgIconFeather icon="menu"/>
                </a>
              </li>
              <li className="nav-item nav-item-folder d-inline-flex justify-content-start align-items-center">
                <SvgIconFeather className="mr-2" icon="compass"/>
                <WorkspacePageTitle>{dictionary.allWorkspaces}</WorkspacePageTitle>
              </li>
            </>
          ) : activeTopic ? (
            <>
              <div className="navbar-wrap">
                <div className="navbar-top">
                  <li className="nav-item navigation-toggler mobile-toggler">
                    <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
                      <SvgIconFeather icon="menu" />
                    </a>
                  </li>
                  {activeTopic.folder_id === null ? (
                    <>
                      {!isExternal && (
                        <>
                          <li className="nav-item nav-item-folder">
                            <WorkspaceName>Workspaces</WorkspaceName>
                          </li>
                          <li className="nav-item-chevron">
                            <SvgIconFeather icon="chevron-right" />
                          </li>
                        </>
                      )}
                      <li className="nav-item">
                        <SubWorkspaceName className="current-title">
                          <Avatar
                            forceThumbnail={false}
                            type={activeTopic.type}
                            imageLink={activeTopic.channel.icon_link}
                            id={`ws_${activeTopic.id}`}
                            name={activeTopic.name}
                            noDefaultClick={false}
                          />
                          <WorkspaceWrapper>
                            {activeTopic.name}
                            {activeTopic.is_shared === 1 && <Icon icon="share" strokeWidth="3"/>}
                          </WorkspaceWrapper>
                        </SubWorkspaceName>
                      </li>
                      {activeTopic.is_lock === 1 && (
                        <li className="nav-item">
                          <div className={`badge badge-light text-white ml-1`}>{dictionary.statusWorkspacePrivate}</div>
                        </li>
                      )}
                      {activeTopic.active === 0 && (
                        <li className="nav-item">
                          <div
                            className={`badge badge-light text-white ml-1`}>{dictionary.statusWorkspaceArchived}</div>
                        </li>
                      )}
                      <li className="nav-item">{!isExternal && <SettingsLink />}</li>
                    </>
                  ) : (
                    <>
                      {!isExternal && (
                        <>
                          <li className="nav-item nav-item-folder">
                            <WorkspaceName>
                              <WorkspaceWrapper>
                                {activeTopic.folder_name}
                                {folders.hasOwnProperty(activeTopic.folder_id) && folders[activeTopic.folder_id].is_lock === 1 && <Icon icon="lock" strokeWidth="2" />}{" "}
                              </WorkspaceWrapper>
                            </WorkspaceName>
                          </li>
                          <li className="nav-item-chevron">
                            <SvgIconFeather icon="chevron-right" />
                          </li>
                        </>
                      )}
                      <li className="nav-item">
                        <SubWorkspaceName className="current-title">
                          <Avatar
                            forceThumbnail={false}
                            type={activeTopic.type}
                            imageLink={activeTopic.channel.icon_link}
                            id={`ws_${activeTopic.id}`}
                            name={activeTopic.name}
                            noDefaultClick={false}
                          />
                          <WorkspaceWrapper>
                            {activeTopic.name}
                            {activeTopic.is_shared === 1 && <Icon icon="share" strokeWidth="3"/>}
                          </WorkspaceWrapper>
                        </SubWorkspaceName>
                      </li>
                      {activeTopic.is_lock === 1 && (
                        <li className="nav-item">
                          <div className={`badge badge-light text-white ml-1`}>{dictionary.statusWorkspacePrivate}</div>
                        </li>
                      )}
                      {activeTopic.active === 0 && (
                        <li className="nav-item">
                          <div
                            className={`badge badge-light text-white ml-1`}>{dictionary.statusWorkspaceArchived}</div>
                        </li>
                      )}
                      <li className="nav-item">{!isExternal && <SettingsLink />}</li>
                    </>
                  )}
                </div>
                <div className="navbar-bottom">
                  {/* <WorkspacePageHeaderPanel {...props} workspace={activeTopic} /> */}
                  <Route
                    {...props}
                    exact={true}
                    render={(props) => <WorkspacePageHeaderPanel {...props} workspace={activeTopic} />}
                    path={[
                      "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                      "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                      "/workspace/:page/:workspaceId/:workspaceName",
                      "/workspace/:page",
                    ]}
                  />
                </div>
              </div>

              <li className="nav-item-last">
                <div className="nav-item-avatars-wrap">
                  <MemberLists members={activeTopic.members} />
                </div>
                {activeTopic.member_ids.includes(user.id) && !isExternal ? (
                  <button onClick={handleEditWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                    <SvgIconFeather icon="user-plus" />
                    {dictionary.actionWorkspaceInvite}
                  </button>
                ) : !isExternal ? (
                  <button onClick={handleJoinWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                    <SvgIconFeather icon="user-plus" />
                    {dictionary.actionWorkspaceJoin}
                  </button>
                ) : null}
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <WorkspaceButton onClick={handleShowWorkspaceModal}>
                  {dictionary.actionWorkspaceNewWorkspace} <SvgIconFeather className="ml-2" icon="circle-plus"/>
                </WorkspaceButton>
              </li>
            </>
          )}
        </NavBar>
      </NavBarLeft>
      <div>
        <HeaderProfileNavigation dictionary={dictionary}/>
      </div>
    </>
  );
};

export default WorspaceHeaderPanel;
