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
    
  a.archived-folder {
    color: #bebebe !important;
  }

  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "bold" : "normal")};
    color: ${(props) => (props.selected ? "#7a1b8b !important" : "#64625C")};
    
    .badge {
      padding: 3px 7px;
      position: absolute;
      right: 25px;
      overflow: hidden;
      transition: all 0.3s ease;
      top: 12px;
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

  ul {
    li {
      .badge {
        padding: 3px 7px;
        position: absolute;
        right: -40px;
        top: 0;
      }
    }
  }
`;

const LockIcon = styled(SvgIconFeather)`
  position: absolute;
  width: 12px;
  left: 12px;
  top: 8px;
`;

const TopicNav = styled.ul`
  display: block !important;
  overflow: hidden;
  transition: all 0.3s ease;

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px;
    margin: 4px 0 8px 2px;
  }

  &.leave-active {
    max-height: 0px;
  }
`;

const WorkspaceList = (props) => {
  const {className = "", show = true, workspace} = props;
  if (workspace.is_active === 0) {
    console.log(workspace.topics);
  }

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
      setMaxHeight(ref.nav.current.offsetHeight);
    }
  }, [ref.nav, maxHeight]);

  useEffect(() => {
    if (showTopics === null && maxHeight !== null) {
      setShowTopics(workspace.selected || workspace_open_folder.hasOwnProperty(workspace.id));
    }
  }, [showTopics, workspace.id, workspace.selected, maxHeight, workspace_open_folder]);

  return (
      <Wrapper ref={ref.container} className={`workspace-list fadeIn ${className}`} selected={workspace.selected}
               show={show}>
        <a className={`${workspace.selected ? "active" : ""} ${workspace.is_active === 0 ? "archived-folder" : ""}`}
           href="/" onClick={handleShowTopics}>
          {workspace.is_lock !== 0 && <LockIcon icon="lock"/>}
          {workspace.is_active === 0 && <LockIcon icon="archive"/>}
          {workspace.name}
          {["FOLDER", "GENERAL_FOLDER", "ARCHIVE_FOLDER"].includes(workspace.type) &&
          <i ref={ref.arrow}
             className={`sub-menu-arrow ti-angle-up ${showTopics ? "ti-minus rotate-in" : "ti-plus"}`}/>}
          {workspace.unread_count > 0 && (
              <Badge className={`${showTopics ? "leave-active" : "enter-active"}`} color="danger">
                {workspace.unread_count}
              </Badge>
          )}
        </a>
        {workspace.type === "FOLDER" && (
        <TopicNav ref={ref.nav} maxHeight={maxHeight} className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
          {Object.keys(workspace.topics).length > 0 &&
            Object.values(workspace.topics)
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
            <SvgIconFeather icon="plus" /> New workspace
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
                return <TopicList key={topic.id} topic={topic}/>;
              })}
          <li className="nav-action" onClick={handleShowWorkspaceModal}>
            <SvgIconFeather icon="plus"/> New workspace
          </li>
        </TopicNav>
      )}
        {workspace.type === "ARCHIVE_FOLDER" && (
            <TopicNav ref={ref.nav} maxHeight={maxHeight}
                      className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
              {workspace.topics.length > 0 &&
              workspace.topics
                  .sort((a, b) => {
                    /*let compare = b.updated_at.timestamp - a.updated_at.timestamp;
                                    if (compare !== 0)
                                        return compare;*/

                    return a.name.localeCompare(b.name);
                  })
                  .map((topic) => {
                    return <TopicList key={topic.id} topic={topic}/>;
                  })}
            </TopicNav>
        )}
      </Wrapper>
  );
};

export default WorkspaceList;
