import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { Avatar, SvgIconFeather } from "../../common";
import { HeaderProfileNavigation, MoreOptions } from "../common";
import { SettingsLink } from "../../workspace";
import { joinWorkspace, favouriteWorkspace } from "../../../redux/actions/workspaceActions";
import { useToaster, useTranslationActions, useWorkspaceActions, useIsMember, useRedirect } from "../../hooks";
import { MemberLists } from "../../list/members";
import { WorkspacePageHeaderPanel } from "../workspace";
import MainBackButton from "../main/MainBackButton";
import Tooltip from "react-tooltip-lite";
import { useWindowSize } from "../../hooks";
import { useMemo } from "react";

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
  .nav-item {
    display: flex;
    .mobile-private {
      display: none;
    }
    @media all and (max-width: 440px) {
      .badge.badge-danger {
        display: none !important;
      }
      .mobile-private {
        display: block;
      }
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
          overflow: auto;
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
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .component-user-list-pop-up-container .profile-slider {
    right: 165px;
    top: 0;
  }
  .profile-slider svg {
    margin: 0;
    color: inherit;
  }
  .plus-recipient-component {
    width: 2.7rem;
    height: 2.7rem;
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
      max-width: 80px;
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
    .badge {
      display: flex;
    }
    svg {
      color: #b8b8b8;
    }
    svg.feather-eye {
      color: inherit;
      margin-left: 0;
      margin-right: 0.4rem;
      width: 11px !important;
      height: 11px !important;
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
  .feather-lock {
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
  cursor: pointer;
  &.feather-bell,
  &.feather-bell-off {
    color: #64625c;
  }
`;

const StarIcon = styled(SvgIconFeather)`
  height: 14px !important;
  width: 14px !important;
  margin-left: 5px;
  cursor: pointer;
  color: #64625c;
  ${(props) =>
    props.isFav &&
    `
    color: rgb(255, 193, 7)!important;
    fill: rgb(255, 193, 7);
    :hover {
      color: rgb(255, 193, 7);
    }`}
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledDivider = styled.hr`
  margin: 0 1rem;
`;

const toggleTooltip = () => {
  let tooltips = document.querySelectorAll("span.react-tooltip-lite");
  tooltips.forEach((tooltip) => {
    tooltip.parentElement.classList.toggle("tooltip-active");
  });
};

const WorspaceHeaderPanel = (props) => {
  const { isExternal } = props;
  const toaster = useToaster();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  //const history = useHistory();
  const theme = useTheme();
  const folders = useSelector((state) => state.workspaces.folders);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const workspacesLoaded = useSelector((state) => state.workspaces.workspacesLoaded);
  const {
    driff,
    user: {
      GENERAL_SETTINGS: { dark_mode },
    },
  } = useSelector((state) => state.settings);
  const user = useSelector((state) => state.session.user);

  const [bellClicked, setBellClicked] = useState(false);
  const winSize = useWindowSize();

  const isMobile = useMemo(() => winSize.width < 1440, [winSize]);
  const { _t } = useTranslationActions();
  const redirect = useRedirect();


  const dictionary = {
    allWorkspaces: _t("SIDEBAR.ALL_WORKSPACES", "Browse Workspaces"),
    pageTitleWorkspaceReminders: _t("PAGE_TITLE.WORKSPACE_REMINDERS", "Reminders"),
    pageTitleWorkspaceDashboard: _t("PAGE_TITLE.WORKSPACE_DASHBOARD", "Dashboard"),
    pageTitleWorkspacePosts: _t("PAGE_TITLE.WORKSPACE_POSTS", "Posts"),
    pageTitleWorkspaceChat: _t("PAGE_TITLE.WORKSPACE_CHAT", "Chat"),
    pageTitleWorkspaceFiles: _t("PAGE_TITLE.WORKSPACE_FILES", "Files"),
    pageTitleWorkspaceNotifications: _t("PAGE_TITLE.WORKSPACE_NOTIFICATIONS", "Notifications"),
    pageTitleWorkspacePeople: _t("PAGE_TITLE.WORKSPACE_PEOPLE", "People"),
    pageTitleWorkspaceProfile: _t("PAGE_TITLE.WORKSPACE_PROFILE", "Profile"),
    pageTitleWorkspaceSearch: _t("PAGE_TITLE.WORKSPACE_SEARCH", "Search workspace"),
    pageTitleSettings: _t("PAGE_TITLE.SETTINGS", "Settings"),
    pageTitleTodos: _t("PAGE_TITLE.TODOS", "Reminders"),
    generalSearch: _t("GENERAL.SEARCH", "Search"),
    generalNotifications: _t("GENERAL.NOTIFICATIONS", "Notifications"),
    generalSwitchTheme: _t("SETTINGS.SWITCH_TO_THEME_MODE", "Switch to ::mode::", {
      mode: dark_mode === "0" ? _t("SETTINGS.DARK_MODE", "dark mode") : _t("SETTINGS.LIGHT_MODE", "light mode"),
    }),
    actionWorkspaceNewWorkspace: _t("ACTION.NEW_WORKSPACE", "New workspace"),
    actionWorkspaceInvite: _t("ACTION.INVITE_WORKSPACE", "Invite"),
    actionWorkspaceJoin: _t("ACTION.JOIN_WORKSPACE", "Join"),
    statusWorkspacePrivate: _t("WORKSPACE.STATUS_PRIVATE", "Private"),
    statusWorkspaceArchived: _t("WORKSPACE.STATUS_ARCHIVED", "Archived"),
    statusNoWorkspaceExternal: _t("WORKSPACE.EXTERNAL_NO_WORKSPACES", "You currently don't have any workspaces."),
    // toasterJoinWorkspace: _t("TOASTER.JOIN_WORKSPACE", "You have joined ::topic_name::", {
    //   topic_name: activeTopic ? `<b>#${activeTopic.name}</b>` : "",
    // }),
    joinWorkspace: _t("TOASTER.JOIN_WORKSPACE_SUCCESS", "You have joined #"),
    withClient: _t("PAGE.WITH_CLIENT", "With client"),
    somethingWentWrong: _t("TOASTER.SOMETHING_WENT_WRONG", "Something went wrong!"),
    workspaces: _t("WORKSPACES", "Workspces"),
    buttonLeave: _t("BUTTON.LEAVE", "Leave"),
    leaveWorkspace: _t("TOASTER.LEAVE_WORKSPACE", "You have left #"),
    leaveWorkspaceHeader: _t("CONFIRMATION.LEAVE_WORKSPACE_HEADER", "Leave workspace"),
    leaveWorkspaceBody: _t("CONFIRMATION.LEAVE_WORKSPACE_BODY", "Are you sure that you want to leave this workspace?"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    toasterBellNotificationOff: _t("TOASTER.WORKSPACE_BELL_NOTIFICATION_OFF", "All notifications are off except for mention and post actions"),
    toasterBellNotificationOn: _t("TOASTER.WORKSPACE_BELL_NOTIFICATION_ON", "All notifications for this workspace is ON"),
    notificationsOn: _t("TOOLTIP.NOTIFICATIONS_ON", "Notifications on"),
    notificationsOff: _t("TOOLTIP.NOTIFICATIONS_OFF", "Notifications off"),
    favoriteWorkspace: _t("TOOLTIP.FAVORITE_WORKSPACE", "Favorite workspace"),
  };

  const actions = useWorkspaceActions();

  //const search = useSelector((state) => state.workspaces.search);

  //const { value, searching } = search;
  // const [inputValue, setInputValue] = useState(value);
  // const [pageName, setPageName] = useState(dictionary.pageTitleDashboard);

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
          channel_id: activeTopic.team_channel && activeTopic.team_channel.id !== 0 ? activeTopic.team_channel.id : activeTopic.channel && activeTopic.channel.id !== 0 ? activeTopic.channel.id : 0,
          recipient_ids: [user.id],
        },
        (err, res) => {
          if (err) return;
          toaster.success(`${dictionary.joinWorkspace} ${activeTopic.name}`);
        }
      )
    );
  };

  const handleMenuOpenMobile = (e) => {
    e.preventDefault();
    document.body.classList.add("navigation-show");
  };

  useEffect(() => {
    //const body = document.body;

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
      case "reminders": {
        pageName = dictionary.pageTitleWorkspaceReminders;
        break;
      }
      default: {
        pageName = dictionary.pageTitleWorkspaceDashboard;
      }
    }

    // if ([dictionary.pageTitleWorkspaceDashboard, dictionary.pageTitleWorkspaceFiles, dictionary.pageTitleWorkspacePeople].includes(pageName)) {
    //   body.classList.remove("stretch-layout");
    // } else {
    //   body.classList.add("stretch-layout");
    // }

    if (activeTopic) {
      if (activeTopic.unread_chats >= 1 || activeTopic.unread_posts > 0) {
        document.title = `${pageName} ‹ * ${activeTopic.name} — ${driff.company_name} @ Driff`;
      } else {
        document.title = `${pageName} ‹ ${activeTopic.name} — ${driff.company_name} @ Driff`;
      }
    }
  }, [match.params.page, dispatch, activeTopic, driff.company_name]);

  // useEffect(() => {
  //   if (activeTopic && !activeTopic.members.some((m) => m.id === user.id)) {
  //     history.push("/");
  //   }
  // }, [activeTopic]);

  const handleFavoriteWorkspace = () => {
    let payload = {
      id: activeTopic.id,
      workspace_id: activeTopic.folder_id ? activeTopic.folder_id : 0,
      is_pinned: activeTopic.is_favourite ? 0 : 1,
    };

    dispatch(
      favouriteWorkspace(payload, (err, res) => {
        if (err) {
          toaster.error(dictionary.somethingWentWrong);
          return;
        }
        if (payload.is_pinned) {
          toaster.success(_t("TOASTER.ADDED_TO_FAVORITES", "::title:: added to favorites", { title: activeTopic.name }));
        } else {
          toaster.success(_t("TOASTER.REMOVED_FROM_FAVORITES", "::title:: removed from favorites", { title: activeTopic.name }));
        }
      })
    );
  };

  const workspaceMembers = activeTopic
    ? activeTopic.members
      .map((m) => {
        if (m.member_ids) {
          return m.member_ids;
        } else return m.id;
      })
      .flat()
    : [];

  const isMember = useIsMember(activeTopic && activeTopic.member_ids.length ? [...new Set(workspaceMembers)] : []);

  const handleLeaveWorkspace = () => {
    const leaveWorkspace = () => {
      let callback = (err, res) => {
        if (err) return;
        toaster.success(
          <>
            {dictionary.leaveWorkspace}
            <b>{activeTopic.name}</b>
          </>
        );
      };
      actions.leave(activeTopic, user, callback);
    };

    let payload = {
      type: "confirmation",
      headerText: dictionary.leaveWorkspaceHeader,
      submitText: dictionary.buttonLeave,
      cancelText: dictionary.cancel,
      bodyText: dictionary.leaveWorkspaceBody,
      actions: {
        onSubmit: leaveWorkspace,
      },
    };

    dispatch(addToModals(payload));
  };

  const handleWorkspaceNotification = () => {
    if (bellClicked) return;
    const payload = {
      id: activeTopic.id,
      is_active: !activeTopic.is_active,
    };
    setBellClicked(true);
    actions.toggleWorkspaceNotification(payload, (err, res) => {
      setBellClicked(false);
      if (err) {
        return;
      }
      if (payload.is_active) {
        toaster.success(dictionary.toasterBellNotificationOn);
      } else {
        toaster.success(dictionary.toasterBellNotificationOff);
      }
    });
  };

  const renderPrivateLabel = () => {
    if (user.type === "external") return null;
    return (
      <li className="nav-item">
        <Icon icon="lock" className="mobile-private ml-1" />
        <div className={"badge badge-danger text-white ml-1"}>{dictionary.statusWorkspacePrivate}</div>
      </li>
    );
  };

  const handleRedirectToWorkspace = (e) => {
    let payload = {
      id: e.id,
      name: e.name,
      folder_id: e ? e.id : null,
      folder_name: e ? e.name : null,
    };
    redirect.toWorkspace(payload, "dashboard");
  };

  return (
    <>
      <NavBarLeft className="navbar-left">
        <NavBar className="navbar-nav">
          {match.params.page === "search" ? (
            <>
              <li className="nav-item navigation-toggler mobile-toggler">
                <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
                  <SvgIconFeather icon="menu" />
                </a>
              </li>
              <MainBackButton />
              <li className="nav-item nav-item-folder d-inline-flex justify-content-start align-items-center">
                <SvgIconFeather className="mr-2" icon="compass" />
                <WorkspacePageTitle>{dictionary.allWorkspaces}</WorkspacePageTitle>
              </li>
            </>
          ) : activeTopic ? (
            <>
              <div className="navbar-wrap">
                <div className="navbar-top d-flex flex-wrap">
                  <li className="nav-item navigation-toggler mobile-toggler">
                    <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
                      <SvgIconFeather icon="menu" />
                    </a>
                  </li>
                  <MainBackButton />
                  {activeTopic.folder_id === null ? (
                    <>
                      {!isExternal && (
                        <>
                          <li className="nav-item nav-item-folder">
                            <WorkspaceName>{dictionary.workspaces}</WorkspaceName>
                          </li>
                          <li className="nav-item-chevron">
                            <SvgIconFeather icon="chevron-right" />
                          </li>
                        </>
                      )}
                      <li className="nav-item">
                        <SubWorkspaceName className="current-title">
                          <Avatar
                            onClick={() => handleRedirectToWorkspace(activeTopic)}
                            forceThumbnail={false}
                            type={activeTopic.type}
                            imageLink={activeTopic.team_channel.icon_link}
                            id={`ws_${activeTopic.id}`}
                            name={activeTopic.name}
                            noDefaultClick={false}
                          />
                          <WorkspaceWrapper>{activeTopic.name}</WorkspaceWrapper>
                        </SubWorkspaceName>
                      </li>
                      {activeTopic.is_lock === 1 && renderPrivateLabel()}
                      {activeTopic.active === 0 && (
                        <li className="nav-item">
                          <div className={"badge badge-light text-white ml-1"}>{dictionary.statusWorkspaceArchived}</div>
                        </li>
                      )}
                      {activeTopic.is_shared && !isExternal && (
                        <li className="nav-item">
                          <div className={"badge badge-warning ml-1 d-flex align-items-center"} style={{ backgroundColor: theme.colors.fourth }}>
                            <Icon icon="eye" /> {dictionary.withClient}
                          </div>
                        </li>
                      )}
                      <li className="nav-item">
                        <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={activeTopic.is_active ? dictionary.notificationsOn : dictionary.notificationsOff}>
                          <Icon icon={activeTopic.is_active ? "bell" : "bell-off"} onClick={handleWorkspaceNotification} />
                        </StyledTooltip>
                      </li>
                      <li className="nav-item">
                        <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.favoriteWorkspace}>
                          <StarIcon icon="star" isFav={activeTopic.is_favourite} onClick={handleFavoriteWorkspace} />
                        </StyledTooltip>
                      </li>
                      <li className="nav-item">{!isExternal && <SettingsLink />}</li>
                    </>
                  ) : (
                    <>
                      {!isExternal && (
                        <>
                          <li className="nav-item nav-item-folder">
                            <SvgIconFeather icon="folder" className={"mr-1"} />
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
                          <Avatar forceThumbnail={false} type={activeTopic.type} imageLink={activeTopic.team_channel.icon_link} id={`ws_${activeTopic.id}`} name={activeTopic.name} noDefaultClick={false} />
                          <WorkspaceWrapper>{activeTopic.name}</WorkspaceWrapper>
                        </SubWorkspaceName>
                      </li>
                      {activeTopic.is_lock === 1 && (
                        <li className="nav-item">
                          <Icon icon="lock" className="mobile-private ml-1" />
                          <div className={"badge badge-danger text-white ml-1"}>{dictionary.statusWorkspacePrivate}</div>
                        </li>
                      )}
                      {activeTopic.active === 0 && (
                        <li className="nav-item">
                          <div className={"badge badge-light text-white ml-1"}>{dictionary.statusWorkspaceArchived}</div>
                        </li>
                      )}
                      {activeTopic.is_shared && !isExternal && (
                        <li className="nav-item">
                          <div className={"badge badge-warning ml-1 d-flex align-items-center"} style={{ backgroundColor: theme.colors.fourth }}>
                            <Icon icon="eye" /> {dictionary.withClient}
                          </div>
                        </li>
                      )}
                      <li className="nav-item">
                        <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={activeTopic.is_active ? dictionary.notificationsOn : dictionary.notificationsOff}>
                          <Icon icon={activeTopic.is_active ? "bell" : "bell-off"} onClick={handleWorkspaceNotification} />
                        </StyledTooltip>
                      </li>
                      <li className="nav-item">
                        <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.favoriteWorkspace}>
                          <StarIcon icon="star" isFav={activeTopic.is_favourite} onClick={handleFavoriteWorkspace} />
                        </StyledTooltip>
                      </li>

                      <li className="nav-item">{!isExternal && <SettingsLink />}</li>
                    </>
                  )}
                  {!isMobile && <div style={{ flexGrow: 1 }}></div>}
                  <li className="nav-item">
                    {isMobile && (
                      <MoreOptions className="ml-2" disableHoverEffect>
                        <MemberLists members={activeTopic.members} size={3} />
                        <StyledDivider />
                        <div style={{ display: "flex", padding: "8px", gap: 8 }}>
                          {isMember && !isExternal ? (
                            <>
                              <button style={{ margin: 0 }} onClick={handleEditWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                                <SvgIconFeather icon="user-plus" />
                                {dictionary.actionWorkspaceInvite}
                              </button>
                              <button style={{ margin: 0 }} onClick={handleLeaveWorkspace} className="btn btn-danger" disabled={activeTopic.active === 0}>
                                {dictionary.buttonLeave}
                              </button>
                            </>
                          ) : !isExternal ? (
                            <>
                              <button style={{ margin: 0 }} onClick={handleJoinWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                                <SvgIconFeather icon="user-plus" />
                                {dictionary.actionWorkspaceJoin}
                              </button>
                            </>
                          ) : null}
                        </div>
                      </MoreOptions>
                    )}
                  </li>
                </div>
                <div className="navbar-bottom">
                  {/* <WorkspacePageHeaderPanel {...props} workspace={activeTopic} /> */}
                  <Route
                    {...props}
                    exact={true}
                    render={(props) => <WorkspacePageHeaderPanel {...props} user={user} workspace={activeTopic} />}
                    path={[
                      "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                      "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                      "/workspace/:page/:workspaceId/:workspaceName",
                      "/workspace/:workspaceId/:workspaceName",
                      "/workspace/:page",
                    ]}
                  />
                </div>
              </div>
              {!isMobile && (
                <>
                  <div className="nav-item-avatars-wrap">
                    <MemberLists members={activeTopic.members} />
                  </div>
                  {isMember && !isExternal ? (
                    <>
                      <button onClick={handleEditWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                        <SvgIconFeather icon="user-plus" />
                        {dictionary.actionWorkspaceInvite}
                      </button>
                      <button onClick={handleLeaveWorkspace} className="btn btn-danger" disabled={activeTopic.active === 0}>
                        {dictionary.buttonLeave}
                      </button>
                    </>
                  ) : !isExternal ? (
                    <button onClick={handleJoinWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                      <SvgIconFeather icon="user-plus" />
                      {dictionary.actionWorkspaceJoin}
                    </button>
                  ) : null}
                </>
              )}
            </>
          ) : (
            <>
              <li className="nav-item">
                {workspacesLoaded && (
                  <>
                    {user.type === "external" ? (
                      <>{dictionary.statusNoWorkspaceExternal}</>
                    ) : (
                      <WorkspaceButton onClick={handleShowWorkspaceModal}>
                        {dictionary.actionWorkspaceNewWorkspace} <SvgIconFeather className="ml-2" icon="circle-plus" />
                      </WorkspaceButton>
                    )}
                  </>
                )}
              </li>
            </>
          )}
        </NavBar>
      </NavBarLeft>
      <div>
        <HeaderProfileNavigation dictionary={dictionary} />
      </div>
    </>
  );
};

export default WorspaceHeaderPanel;
