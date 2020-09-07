import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { Avatar, SvgIconFeather } from "../../common";
import { HeaderProfileNavigation } from "../common";
import { SettingsLink } from "../../workspace";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { useToaster } from "../../hooks";
import { MemberLists } from "../../list/members";

const NavBarLeft = styled.div`
  width: 100%;
  border-right: 1px solid #ebebeb;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 14px;
  padding-right: 14px;
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
  @media (max-width: 992px) {
    margin-right: 5px;
    padding-right: 10px;
  }
  @media (max-width: 768px) {
    .nav-item-folder,
    .nav-item-chevron {
      display: none;
    }
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
  }
  .nav-link {
    padding: 0px !important;
    background: transparent !important;
    svg {
      color: #7a1b8b;
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
  font-size: 19px;
  margin-right: 2px;
  @media all and (max-width: 620px) {
    font-size: 16px;
  }
`;

const SubWorkspaceName = styled.h3`
  letter-spacing: 0;
  margin-bottom: 0;
  color: #000000;
  font-weight: normal;
  font-size: 19px;
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

const StyledAvatar = styled(Avatar)`
  height: 2rem;
  width: 2rem;
  margin-left: ${(props) => (props.firstUser ? "0" : "-0.5rem")};
  @media all and (max-width: 920px) {
    margin-left: -1.5rem;
  }
`;

const WorkspaceButton = styled.h3`
  cursor: pointer;
  cursor: hand;
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
  const { isExternal } = props;
  const toaster = useToaster();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { activeTopic, folders } = useSelector((state) => state.workspaces);
  const driff = useSelector((state) => state.settings.driff);
  const user = useSelector((state) => state.session.user);

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
            <>
              You have joined <b>#{activeTopic.name}</b>
            </>
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
        pageName = "Posts";
        break;
      }
      case "chat": {
        pageName = "Chat";
        break;
      }
      case "files": {
        pageName = "Files";
        break;
      }
      case "people": {
        pageName = "People";
        break;
      }
      case "settings": {
        pageName = "Settings";
        break;
      }
      default: {
        pageName = "Dashboard";
      }
    }

    if (["Dashboard", "Posts", "Files", "People"].includes(pageName)) {
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

  return (
    <>
      <NavBarLeft className="navbar-left">
        <NavBar className="navbar-nav">
          <li className="nav-item navigation-toggler mobile-toggler">
            <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
              <SvgIconFeather icon="menu" />
            </a>
          </li>

          {match.params.page === "search" ? (
            <li className="nav-item nav-item-folder">
              <WorkspaceName>Search workspace</WorkspaceName>
            </li>
          ) : activeTopic ? (
            <>
              {activeTopic.folder_id === null ? (
                <>
                  {!isExternal && (
                    <>
                      <li className="nav-item nav-item-folder">
                        <WorkspaceName>General</WorkspaceName>
                      </li>
                      <li className="nav-item-chevron">
                        <SvgIconFeather icon="chevron-right" />
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <SubWorkspaceName className="current-title">
                      {activeTopic.name}
                      {activeTopic.is_shared === 1 && <Icon icon="share" strokeWidth="3" />}
                    </SubWorkspaceName>
                  </li>
                  {activeTopic.is_lock === 1 && (
                    <li className="nav-item">
                      <div className={`badge badge-light text-white ml-1`}>Locked</div>
                    </li>
                  )}
                  {activeTopic.active === 0 && (
                    <li className="nav-item">
                      <div className={`badge badge-light text-white ml-1`}>Archived</div>
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
                          {activeTopic.folder_name}
                          {folders.hasOwnProperty(activeTopic.folder_id) && folders[activeTopic.folder_id].is_lock === 1 && <Icon icon="lock" strokeWidth="2" />}
                        </WorkspaceName>
                      </li>
                      <li className="nav-item-chevron">
                        <SvgIconFeather icon="chevron-right" />
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <SubWorkspaceName className="current-title">
                      {activeTopic.name}
                      {activeTopic.is_shared === 1 && <Icon icon="share" strokeWidth="3" />}
                    </SubWorkspaceName>
                  </li>
                  {activeTopic.is_lock === 1 && (
                    <li className="nav-item">
                      <div className={`badge badge-light text-white ml-1`}>Locked</div>
                    </li>
                  )}
                  {activeTopic.active === 0 && (
                    <li className="nav-item">
                      <div className={`badge badge-light text-white ml-1`}>Archived</div>
                    </li>
                  )}
                  <li className="nav-item">{!isExternal && <SettingsLink />}</li>
                </>
              )}
              <li className="nav-item-last">
                <div className="nav-item-avatars-wrap">
                  {<MemberLists members={activeTopic.members} />}
                  {/* {activeTopic.members.map((m, i) => {
                    return <StyledAvatar id={m.id} firstUser={i === 0} className="workspace-members" key={m.id}
                                         name={m.name ? m.name : m.email} imageLink={m.profile_image_link}
                                         hasAccepted={m.has_accepted}/>;
                  })} */}
                </div>
                {activeTopic.member_ids.includes(user.id) && !isExternal ? (
                  <button onClick={handleEditWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                    <SvgIconFeather icon="user-plus" />
                    Invite
                  </button>
                ) : !isExternal ? (
                  <button onClick={handleJoinWorkspace} className="btn btn-primary" disabled={activeTopic.active === 0}>
                    <SvgIconFeather icon="user-plus" />
                    Join
                  </button>
                ) : null}
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <WorkspaceButton onClick={handleShowWorkspaceModal}>
                  New workspace <SvgIconFeather className="ml-2" icon="circle-plus" />
                </WorkspaceButton>
              </li>
            </>
          )}
        </NavBar>
      </NavBarLeft>
      <div>
        <HeaderProfileNavigation />
      </div>
    </>
  );
};

export default WorspaceHeaderPanel;
