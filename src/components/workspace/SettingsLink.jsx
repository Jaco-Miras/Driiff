import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useOutsideClick, useIsMember } from "../hooks";
import { SvgIconFeather } from "../common";
import { addToModals } from "../../redux/actions/globalActions";
import Tooltip from "react-tooltip-lite";

const SettingsLinkList = styled.li`
  position: relative;
  > a:after {
    display: none;
  }

  .dropdown-toggle {
    cursor: pointer;
    cursor: hand;

    &:after {
      display: none;
    }
    .feather {
      &:hover {
        color: #000000;
      }
    }
  }
  .dropdown-menu {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    > span {
      cursor: pointer;
      cursor: hand;
    }
  }
`;

const SettingsLink = () => {
  const wrapperRef = useRef();
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.workspaces.activeTopic);
  const [show, setShow] = useState(false);
  const toggle = useCallback(() => {
    setShow(!show);
  }, [show]);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const handleToggle = () => {
    if (topic && topic.hasOwnProperty("workspace_id")) {
      toggle();
    } else if (topic && topic.hasOwnProperty("type") && topic.type === "WORKSPACE") {
      handleOpenWorkspace("workspace");
    }
  };

  const handleDropdownItemClick = (e) => {
    handleOpenWorkspace(e.target.dataset.name);
  };

  const handleOpenWorkspace = (type) => {
    let payload = {
      mode: "edit",
      item: topic,
    };
    if (type === "folder") {
      payload = {
        ...payload,
        type: "workspace_folder",
      };
    } else {
      payload = {
        ...payload,
        type: "workspace_create_edit",
      };
    }

    dispatch(addToModals(payload));
  };

  useOutsideClick(wrapperRef, toggle, show);

  const isMember = useIsMember(topic ? topic.member_ids : []);

  if (!isMember) return null;

  return (
    <SettingsLinkList className="nav-item" ref={wrapperRef}>
      <div>
        <span className={`dropdown-toggle ${show ? "show" : ""}`} data-toggle="dropdown" onClick={handleToggle}>
          <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Workspace settings">
            <SvgIconFeather icon="pencil" />
          </Tooltip>
        </span>
        <div className={`dropdown-menu ${show ? "show" : ""}`}>
          <span className="dropdown-item" data-name="folder" onClick={handleDropdownItemClick}>
            Folder settings
          </span>
          <span className="dropdown-item" data-name="workspace" onClick={handleDropdownItemClick}>
            Workspace settings
          </span>
        </div>
      </div>
    </SettingsLinkList>
  );
};

export default React.memo(SettingsLink);
