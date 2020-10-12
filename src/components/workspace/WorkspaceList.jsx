import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { addToModals } from "../../redux/actions/globalActions";
import { SvgIconFeather } from "../common";
import { useSettings } from "../hooks";
import TopicList from "./TopicList";

const Wrapper = styled.li`
  ${(props) => !props.show && "display: none;"}
  cursor: pointer;
  cursor: hand;
  position: relative;
  transition: all 0.3s ease;
  a.archived-folder {
    ${"" /* color: #bebebe !important; */}
  }
  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};
    div {
      position: relative;
      height: 40px;
      display: inline-flex;
      align-items: center;
      .badge {
        position: absolute;
        width: 6px;
        height: 6px;
        top: 7px;
        right: -12px;
        border-radius: 50%;
        background: #28a745;
        font-size: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        opacity: 1;
        &.enter-active {
          transform: translate(0, 0);
        }

        &.leave-active {
          opacity: 0;
          transform: translate(0, 100%);
        }
      }
    }
    .feather-pencil {
      display: none;
    }
    :hover {
      .sub-menu-arrow {
        margin-left: 10px;
      }
      .feather-pencil {
        display: block;
      }
    }
  }

  ul {
    li {
      .badge {
        position: absolute;
        width: 6px;
        height: 6px;
        top: 7px;
        right: -12px;
        border-radius: 50%;
        background: #28a745;
        font-size: 0;
      }
    }
  }
  .nav-action {
    ${"" /* background-color: #fff3; */}
    background-color: #ffffff14;
    height: 40px;
    display: flex;
    align-items: center;
    color: #fff9;
    padding: 0 10px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    svg {
      margin-right: 6px;
      width: 14px;
      height: 14px;
    }
  }
`;

const LockIcon = styled(SvgIconFeather)`
  height: 12px !important;
  width: 12px !important;
  cursor: pointer;
  margin-left: 4px;
  color: #fff8;
`;

const TopicNav = styled.ul`
  overflow: hidden;
  transition: all 0.3s ease;
  display: block !important;

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px !important;
  }
  &.leave-active {
    max-height: 0;
  }
`;

const EditIcon = styled(SvgIconFeather)`
  height: 12px !important;
  width: 12px !important;
  cursor: pointer;
  margin-left: auto;
  color: #fff8;
`;


const WorkspaceList = (props) => {
  const { className = "", actions, show = true, folder, history, workspace, workspaces } = props;

  const dispatch = useDispatch();
  // const history = useHistory();
  const ref = {
    container: useRef(),
    arrow: useRef(),
    nav: useRef(),
  };

  const {
    generalSettings: { workspace_open_folder },
    setGeneralSetting,
  } = useSettings();

  const [showTopics, setShowTopics] = useState(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const [selected, setSelected] = useState(false);
  const [triggerFocus, setTriggerFocus] = useState(null);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
      item: folder,
    };

    dispatch(addToModals(payload));
  };

  const handleShowTopics = (e) => {
    e.preventDefault();
    if (!showTopics) {
      setGeneralSetting({
        workspace_open_folder: {
          ...workspace_open_folder,
          [folder.id]: folder.id,
        },
      });
    } else {
      delete workspace_open_folder[folder.id];
      setGeneralSetting({
        workspace_open_folder: workspace_open_folder,
      });
    }
    setShowTopics((prevState) => !prevState);
  };

  const onShowTopics = (focusId) => {
    if (showTopics === null || showTopics === false) {
      setGeneralSetting({
        workspace_open_folder: {
          ...workspace_open_folder,
          [folder.id]: folder.id,
        },
      });
      setShowTopics((prevState) => !prevState);
    }
    setTriggerFocus(focusId);
  };

  const handleResetFocus = () => {
    setTriggerFocus(null);
  }

  const handleEditFolder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let payload = {
      mode: "edit",
      item: folder,
      type: "workspace_folder",
    };

    dispatch(addToModals(payload));
  };

  useEffect(() => {
    if (ref.nav.current !== null) {
      let maxHeight = window.innerHeight * 5;
      maxHeight = maxHeight < ref.nav.current.offsetHeight ? ref.nav.current.offsetHeight : maxHeight;
      setMaxHeight(maxHeight);
    }
  }, [ref.nav, maxHeight]);

  useEffect(() => {
    if (showTopics === null && maxHeight !== null) {
      setShowTopics(selected || workspace_open_folder.hasOwnProperty(folder.id));
    }
  }, [showTopics, folder.id, selected, maxHeight, workspace_open_folder]);

  useEffect(() => {
    if (workspaces.length && workspace !== null) {
      setSelected(folder.workspace_ids.some((id) => id === workspace.id));
    }
  }, [workspace, workspaces, folder.workspace_ids]);

  useEffect(() => {
    setShowTopics(workspace_open_folder.hasOwnProperty(folder.id));
  }, [workspace_open_folder]);

  return (

    <Wrapper ref={ref.container} className={`workspace-list fadeIn ${className} ${showTopics && "folder-open"}`}
             selected={selected} show={show}>
      <a className={`${folder.type === "ARCHIVE_FOLDER" ? "archived-folder" : ""}`} onClick={handleShowTopics}>
        <div>
          {folder.name}

          {folder.is_lock !== 0 && <LockIcon icon="lock" strokeWidth="2"/>}
          {folder.type === "ARCHIVE_FOLDER" && <LockIcon icon="archive"/>}

          {folder.unread_count > 0 && (
            <Badge className={`${showTopics ? "leave-active" : "enter-active"}`} color="danger">
              {folder.unread_count}
            </Badge>
          )}
        </div>
          { folder.type === "FOLDER" && <EditIcon icon="pencil" onClick={handleEditFolder}/> }
        <i ref={ref.arrow} className={`sub-menu-arrow ti-angle-up ${showTopics ? "ti-minus rotate-in" : "ti-plus"}`} />
      </a>

      <TopicNav ref={ref.nav} maxHeight={maxHeight} className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
        {folder.workspace_ids.length > 0 && Object.keys(workspaces).length > 0 &&
          workspaces.map((ws) => {
            return <TopicList key={ws.id} topic={ws} onShowTopics={onShowTopics} onResetFocus={handleResetFocus} triggerFocus={triggerFocus} showTopics={showTopics} history={history} selected={workspace && workspace.id === ws.id} actions={actions}/>;
          })
        }
        <li className="nav-action" onClick={handleShowWorkspaceModal}>
          <SvgIconFeather icon="circle-plus" /> New workspace
        </li>
      </TopicNav>
    </Wrapper>
  );
};

export default WorkspaceList;
