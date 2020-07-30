import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {replaceChar} from "../../helpers/stringFormatter";
import {addToModals} from "../../redux/actions/globalActions";
import {SvgIconFeather} from "../common";
import {useSettings} from "../hooks";
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

const WorkspaceList = (props) => {
  const { className = "", show = true, workspace } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const ref = {
    container: useRef(null),
    arrow: useRef(null),
    nav: useRef(null),
  };

  const {
    generalSettings: { workspace_open_folder },
    setGeneralSetting,
  } = useSettings();

  const [showTopics, setShowTopics] = useState(null);
  const [maxHeight, setMaxHeight] = useState(null);
  const [prevTopics, setPrevTopics] = useState(null);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
      item: workspace,
    };

    dispatch(addToModals(payload));
  };

  const handleSelectWorkspace = () => {
    //set the selected topic
    if (workspace.selected) return;

    history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
  };

  const handleShowTopics = (e) => {
    e.preventDefault();

    if (["FOLDER", "GENERAL_FOLDER", "ARCHIVE_FOLDER"].includes(workspace.type)) {
      if (!showTopics) {
        setGeneralSetting({
          workspace_open_folder: {
            ...workspace_open_folder,
            [workspace.id]: workspace.id,
          },
        });
      } else {
        delete workspace_open_folder[workspace.id];
        setGeneralSetting({
          workspace_open_folder: workspace_open_folder,
        });
      }
      setShowTopics((prevState) => !prevState);
    } else {
      handleSelectWorkspace();
    }
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
      setShowTopics(workspace.selected || workspace_open_folder.hasOwnProperty(workspace.id));
    }
  }, [showTopics, workspace.id, workspace.selected, maxHeight, workspace_open_folder]);

  useEffect(() => {
    if (prevTopics !== workspace.topics) {
      if (prevTopics !== null) {
        setMaxHeight(null);
      }
      setPrevTopics(workspace.topics);
    }
  }, [workspace.topics]);
  return (
    <Wrapper ref={ref.container} className={`workspace-list fadeIn ${className} ${showTopics && "folder-open"}`} selected={workspace.selected} show={show}>
      <a className={`${workspace.selected ? "" : ""} ${workspace.is_active === 0 ? "archived-folder" : ""}`} href="/" onClick={handleShowTopics}>
        <div>
          {workspace.name}

          {workspace.is_lock !== 0 && <LockIcon icon="lock" />}
          {workspace.is_active === 0 && <LockIcon icon="archive" />}

          {workspace.unread_count > 0 && (
            <Badge className={`${showTopics ? "leave-active" : "enter-active"}`} color="danger">
              {workspace.unread_count}
            </Badge>
          )}
        </div>

        {["FOLDER", "GENERAL_FOLDER", "ARCHIVE_FOLDER"].includes(workspace.type) && <i ref={ref.arrow} className={`sub-menu-arrow ti-angle-up ${showTopics ? "ti-minus rotate-in" : "ti-plus"}`} />}
      </a>
      {workspace.type === "FOLDER" && (
        <TopicNav ref={ref.nav} maxHeight={maxHeight} className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
          {Object.keys(workspace.topics).length > 0 &&
            Object.values(workspace.topics)
              .filter((t) => t.active === 1)
              .sort((a, b) => {
                /*let compare = b.updated_at.timestamp - a.updated_at.timestamp;
                                if (compare !== 0)
                                    return compare;*/
                return a.name.localeCompare(b.name);
              })
              .map((topic) => {
                return <TopicList key={topic.id} topic={topic} />;
              })}
          <li className="nav-action" onClick={handleShowWorkspaceModal}>
            <SvgIconFeather icon="circle-plus" /> New workspace
          </li>
        </TopicNav>
      )}
      {workspace.type === "GENERAL_FOLDER" && (
        <TopicNav ref={ref.nav} maxHeight={maxHeight} className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
          {workspace.topics.length > 0 &&
            workspace.topics
              .sort((a, b) => {
                /*let compare = b.updated_at.timestamp - a.updated_at.timestamp;
                                if (compare !== 0)
                                    return compare;*/

                return a.name.localeCompare(b.name);
              })
              .map((topic) => {
                return <TopicList key={topic.key_id} topic={topic} />;
              })}
          <li className="nav-action" onClick={handleShowWorkspaceModal}>
            <SvgIconFeather icon="plus" /> New workspace
          </li>
        </TopicNav>
      )}
      {workspace.type === "ARCHIVE_FOLDER" && (
        <TopicNav ref={ref.nav} maxHeight={maxHeight} className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
          {workspace.topics.length > 0 &&
            workspace.topics
              .sort((a, b) => {
                /*let compare = b.updated_at.timestamp - a.updated_at.timestamp;
                                    if (compare !== 0)
                                        return compare;*/

                return a.name.localeCompare(b.name);
              })
              .map((topic) => {
                return <TopicList key={topic.id} topic={topic} />;
              })}
        </TopicNav>
      )}
    </Wrapper>
  );
};

export default WorkspaceList;
