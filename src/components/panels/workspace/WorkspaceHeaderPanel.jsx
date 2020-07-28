import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {Avatar, SvgIconFeather} from "../../common";
import {HeaderProfileNavigation} from "../common";
import {SettingsLink} from "../../workspace";
import {joinWorkspace, joinWorkspaceReducer} from "../../../redux/actions/workspaceActions";
import {useToaster} from "../../hooks";

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
    svg {
      color: #ffffff;
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
  @media (max-width: 992px) {
    margin-right: 5px;
    padding-right: 5px;
  }
  @media (max-width: 768px) {
    .nav-item-folder, .nav-item-chevron {
      display: none;
    }
  }
`;

const NavBar = styled.ul`
  display: flex;
  width: 100%;
  align-items: center;

  li {
    justify-content: center;
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
      color: #000;
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

const WorspaceHeaderPanel = (props) => {

  const { isExternal } = props;
  const toaster = useToaster();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
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
            group_id: activeTopic.id,
            user_id: user.id,
          },
          (err, res) => {
            if (err) return;
            dispatch(
                joinWorkspaceReducer({
                  channel_id: activeTopic.channel.id,
                  topic_id: activeTopic.id,
                  user: user,
                }, () => {
                  toaster.success(<>You have joined <b>#${activeTopic.name}</b></>);
                })
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

    document.title = `Driff - Workspace ${pageName}`;
  }, [match.params.page, dispatch]);

  return (
    <>
      <NavBarLeft>
        <NavBar className="navbar-nav">
          <li className="nav-item navigation-toggler mobile-toggler">
            <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
              <SvgIconFeather icon="menu" />
            </a>
          </li>
          {activeTopic ? (
            <>
              {typeof activeTopic.workspace_name === "undefined" ? (
                  <>
                    <li className="nav-item nav-item-folder">
                      <WorkspaceName>General</WorkspaceName>
                    </li>
                    <li class="nav-item-chevron">
                      <SvgIconFeather icon="chevron-right"/>
                    </li>
                    <li className="nav-item">
                      <SubWorkspaceName>
                        {activeTopic.name}
                        { !isExternal && <SettingsLink/> }
                      </SubWorkspaceName>
                    </li>
                  </>
              ) : (
                <>
                  <li className="nav-item nav-item-folder">
                    <WorkspaceName>{activeTopic.workspace_name}</WorkspaceName>
                  </li>
                  <li class="nav-item-chevron">
                    <SvgIconFeather icon="chevron-right" />
                  </li>
                  <li className="nav-item">
                    <SubWorkspaceName>
                      {activeTopic.name}
                      { !isExternal && <SettingsLink/> }
                    </SubWorkspaceName>
                  </li>
                  <li className="nav-item-last">
                    {activeTopic.members.map((m, i) => {
                      return <StyledAvatar id={m.id} firstUser={i === 0} className="workspace-members" key={m.name}
                                           name={m.name} imageLink={m.profile_image_link}/>;
                    })}
                    {activeTopic.member_ids.includes(user.id) ? (
                        <button onClick={handleEditWorkspace} className="btn btn-primary">
                          <SvgIconFeather icon="user-plus"/>
                          Invite
                        </button>
                    ) : (
                        <button onClick={handleJoinWorkspace} className="btn btn-primary">
                        <SvgIconFeather icon="user-plus" />
                        Join
                      </button>
                    )}
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li className="nav-item">
                <WorkspaceButton onClick={handleShowWorkspaceModal}>
                  New workspace <SvgIconFeather className="ml-2" icon="circle-plus"/>
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

export default React.memo(WorspaceHeaderPanel);
