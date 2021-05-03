import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { SvgEmptyState, SvgIconFeather } from "../../common";
import { useWorkspace } from "../../hooks";
import { FavWorkspaceList } from "../../workspace";
import { addToModals } from "../../../redux/actions/globalActions";
import { setChannelHistoricalPosition } from "../../../redux/actions/chatActions";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  flex-flow: column;
  min-height: 0;
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FolderPlus = styled(SvgIconFeather)`
  height: 14px;
  width: 14px;
  cursor: pointer;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  text-align: center;
  color: #fff;

  svg {
    display: block;
    margin: 1rem auto;

    circle {
      fill: transparent;
    }
  }
  button {
    text-transform: uppercase;
  }
`;

const FavWorkspacesLabel = styled.div`
  margin: 0 15px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  border-top: 2px solid;
  padding: 15px 0;
`;

const BrowseAll = styled.span`
  color: rgba(255, 255, 255, 0.6);
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const FavoriteWorkspacesPanel = (props) => {
  const { dictionary, isExternal, generalSettings, user } = props;

  const dispatch = useDispatch();

  const { actions, folders, history, orderChannel, workspaces, workspacesLoaded } = useWorkspace();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channels = useSelector((state) => state.chat.channels);
  const { virtualization } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const [defaultTopic, setDefaultTopic] = useState(null);

  useEffect(() => {
    if (defaultTopic) {
      actions.selectWorkspace(defaultTopic);
      actions.redirectTo(defaultTopic);
    }
  }, [defaultTopic]);

  useEffect(() => {
    const arrWorkspaces = Object.values(workspaces);
    if (generalSettings.active_topic === null && arrWorkspaces.length && defaultTopic === null) {
      const topic = arrWorkspaces.sort((a, b) => (b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1)).find((w) => w.type === "WORKSPACE" && w.active === 1);
      setDefaultTopic(topic);
    }
  }, [generalSettings.active_topic, defaultTopic, workspaces, setDefaultTopic]);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const handleShowFolderModal = () => {
    let payload = {
      type: "workspace_folder",
      mode: "create",
    };
    dispatch(addToModals(payload));
  };

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
  };

  const sortWorkspace = () => {
    return Object.values(workspaces).sort((a, b) => {
      if (orderChannel.order_by === "channel_date_updated") {
        return -1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  const favoriteWorkspaces = sortWorkspace().filter((ws) => ws.is_favourite);

  const handleSelectWorkspace = (ws) => {
    document.body.classList.remove("navigation-show");

    if (selectedChannel && !virtualization) {
      const scrollComponent = document.getElementById("component-chat-thread");
      if (scrollComponent) {
        console.log(scrollComponent.scrollHeight - scrollComponent.scrollTop, "save this scroll");
        dispatch(
          setChannelHistoricalPosition({
            channel_id: selectedChannel.id,
            scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
          })
        );
      }
    }
    //if (selected && onWorkspace) return;
    if (selectedChannel && selectedChannel.id !== ws.channel.id && channels[ws.channel.id]) {
      actions.selectChannel(channels[ws.channel.id]);
    }
    actions.selectWorkspace(ws);
    actions.redirectTo(ws);
  };

  const handleBrowseAll = () => {
    history.push("/workspace/search");
  };

  const EmptyWorkspaces = () => {
    return (
      <EmptyState>
        <div>
          <SvgEmptyState height={200} icon={2} />
          {user.type !== "external" && (
            <>
              <h5>{dictionary.sidebarTextCreateWorkspace}</h5>
              <button className="btn btn-primary mt-2" onClick={handleShowWorkspaceModal}>
                {dictionary.createWorkspace}
              </button>
            </>
          )}
        </div>
      </EmptyState>
    );
  };

  return (
    <Wrapper>
      <FavWorkspacesLabel>
        {dictionary.favoriteWorkspaces}
        {!isExternal && (
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="New folder">
            <FolderPlus onClick={handleShowFolderModal} icon="folder-plus" />
          </StyledTooltip>
        )}
      </FavWorkspacesLabel>
      <div className="navigation-menu-group">
        <div id="elements" className="open">
          {workspacesLoaded && Object.values(folders).length === 0 && Object.values(workspaces).length === 0 && <EmptyWorkspaces />}
          {workspacesLoaded && Object.values(workspaces).length > 0 && (
            <>
              <ul>
                {favoriteWorkspaces.length > 0 &&
                  favoriteWorkspaces.map((ws) => {
                    return <FavWorkspaceList isExternal={isExternal} onSelectWorkspace={handleSelectWorkspace} workspace={ws} />;
                  })}
              </ul>
              <BrowseAll onClick={handleBrowseAll}>{dictionary.browseAll}</BrowseAll>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default FavoriteWorkspacesPanel;
