import React, {useCallback, useRef, useState} from "react";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useIsMember, useOutsideClick, useTranslation, useToaster} from "../hooks";
import {SvgIconFeather} from "../common";
import {addToModals} from "../../redux/actions/globalActions";
import Tooltip from "react-tooltip-lite";
import {putChannel} from "../../redux/actions/chatActions";

const SettingsLinkList = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 6px;
  margin-right: 30px;
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
  @media all and (max-width: 400px) {
    margin-right: 0;
  }
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SettingsLink = (props) => {

  const {className = ""} = props;

  const toaster = useToaster();
  const {_t} = useTranslation();

  const dictionary = {
    archiveThisWorkspace: _t("WORKSPACE.WORKSPACE_ARCHIVE", "Archive this workspace"),
    unarchiveThisWorkspace: _t("WORKSPACE.WORKSPACE_UNARCHIVE", "Un-archive this workspace"),
    archiveWorkspace: _t("HEADER.ARCHIVE_WORKSPACE", "Archive workspace"),
    archive: _t("BUTTON.ARCHIVE", "Archive"),
    unarchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Un-archive workspace"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    archiveBodyText: _t("TEXT.ARCHIVE_CONFIRMATION", "Are you sure you want to archive this workspace?"),
    unarchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this workspace?"),
  };

  const wrapperRef = useRef();
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.workspaces.activeTopic);
  const folders = useSelector((state) => state.workspaces.folders);
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
    if ((topic && topic.folder_id !== null) || (topic && topic.active === 0)) {
      toggle();
    } else {
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
        item: folders[topic.folder_id]
      };
    } else {
      payload = {
        ...payload,
        type: "workspace_create_edit",
      };
    }

    dispatch(addToModals(payload));
  };

  const handleUnarchive = () => {
    let payload = {
        id: topic.channel.id,
        is_archived: false,
        is_muted: false,
        is_pinned: false,
        is_shared: topic.is_external,
        push_unarchived: 1
    };

    dispatch(putChannel(payload));
    toaster.success(
        <span>
          <b>{topic.name} workspace is un-archived.</b>
        </span>
    );
  };

  const handleShowArchiveConfirmation = () => {
    let payload = {
        type: "confirmation",
        cancelText: dictionary.cancel,
        headerText: dictionary.unarchiveWorkspace,
        submitText: dictionary.unarchiveWorkspace,
        bodyText: dictionary.unarchiveBodyText,
        actions: {
            onSubmit: handleUnarchive,
        },
    };

    dispatch(addToModals(payload));
};

  useOutsideClick(wrapperRef, toggle, show);

  const isMember = useIsMember(topic ? topic.member_ids : []);

  if (!isMember) return null;

  return (
      <SettingsLinkList className={`nav-item ${className}`} ref={wrapperRef}>
        <div>
        <span className={`dropdown-toggle ${show ? "show" : ""}`} data-toggle="dropdown" onClick={handleToggle}>
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Workspace settings">
            <SvgIconFeather icon="pencil"/>
          </StyledTooltip>
        </span>
          <div className={`dropdown-menu ${show ? "show" : ""}`}>
            {
              topic.active === 1 ? 
              <>
                <span className="dropdown-item" data-name="folder" onClick={handleDropdownItemClick}>
                  Folder settings
                </span>
                  <span className="dropdown-item" data-name="workspace" onClick={handleDropdownItemClick}>
                  Workspace settings
                </span>
              </>
              : 
              <span className="dropdown-item" data-name="unarchive" onClick={handleShowArchiveConfirmation}>
                Un-archive workspace
              </span>
            }
          </div>
      </div>
    </SettingsLinkList>
  );
};

export default React.memo(SettingsLink);
