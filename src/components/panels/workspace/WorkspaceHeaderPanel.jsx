import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";
import { HeaderProfileNavigation } from "../common";

const NavBar = styled.ul`
  li {
    justify-content: center;
    align-items: center;
  }
`;

const WorkspaceName = styled.h2`
  margin-right: 1rem;
  letter-spacing: 0;
  margin-bottom: 0;
  color: #64625c;
  font-weight: 600;
  font-size: 19px;
`;

const SubWorkspaceName = styled.h3`
  margin-right: 1rem;
  letter-spacing: 0;
  margin-bottom: 0;
  color: #b8b8b8;
  font-weight: normal;
  font-size: 19px;
  text-transform: lowercase;
`;

const WorkspaceButton = styled.h3`
  cursor: pointer;
  cursor: hand;

  svg {
    fill: #505050;
    transform: rotate(90deg);
  }
`;

const WorspaceHeaderPanel = () => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
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
      <div>
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
                  <li className="nav-item">
                    <WorkspaceName>{activeTopic.name}</WorkspaceName>
                    <SvgIconFeather icon="chevron-right" />
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <WorkspaceName>{activeTopic.workspace_name}</WorkspaceName>
                  </li>
                  <li className="nav-item">
                    <SubWorkspaceName>{activeTopic.name}</SubWorkspaceName>
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li className="nav-item">
                <WorkspaceButton onClick={handleShowWorkspaceModal}>
                  New workspace <SvgIconFeather icon="play" />
                </WorkspaceButton>
              </li>
            </>
          )}
        </NavBar>
      </div>
      <div>
        <HeaderProfileNavigation />
      </div>
    </>
  );
};

export default React.memo(WorspaceHeaderPanel);
