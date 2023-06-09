import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { SvgEmptyState, SvgIconFeather } from "../../common";
import { useWorkspace, useSettings } from "../../hooks";
import { FavWorkspaceList } from "../../workspace";
import { addToModals } from "../../../redux/actions/globalActions";
import { setChannelHistoricalPosition } from "../../../redux/actions/chatActions";

const FONT_COLOR_DARK_MODE = "#CBD4DB";

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
  margin-left: 5px;
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
  justify-content: space-between;
  color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
  //color: rgba(255, 255, 255, 0.6);
  border-top: 2px solid;
  padding: 15px 0;
  > span {
    margin-left: 15px;
  }
  svg {
    margin-right: 8px;
  }
`;

const BrowseAll = styled.button`
  //color: rgba(255, 255, 255, 0.6);
  //text-decoration: underline;
  color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
  border: 1px solid;
  :hover {
    cursor: pointer;
    color: #cbd4db;
  }
`;

const WorkspaceListContainer = styled.div`
  padding: 0 30px;
  overflow: auto;
  .text-truncate {
    color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
  }
`;

const FavEmptyState = styled.div`
  display: flex;
  flex-flow: column;
  margin-top: 1rem;
  color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
  span:last-child {
    margin-top: 1rem;
  }
`;

const FavoriteWorkspacesPanel = (props) => {
  const { dictionary, isExternal, user } = props;

  const dispatch = useDispatch();

  const { actions, folders, history, orderChannel, workspaces, favoriteWorkspacesLoaded } = useWorkspace();
  const selectedChannelId = useSelector((state) => state.chat.selectedChannelId);
  const channelIds = useSelector((state) => Object.keys(state.chat.channels));
  const virtualization = useSelector((state) => state.settings.user.CHAT_SETTINGS.virtualization);

  const recipients = useSelector((state) => state.global.recipients);

  const companyRecipient = recipients.find((r) => r.type === "DEPARTMENT");
  const companyWs = Object.values(workspaces).find((ws) => companyRecipient && companyRecipient.id === ws.id);
  const companyChannel = useSelector((state) => state.chat.companyChannel);
  const companyName = useSelector((state) => state.settings.driff.company_name);
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  // need to revisit
  // const [defaultTopic, setDefaultTopic] = useState(null);

  // useEffect(() => {
  //   if (defaultTopic) {
  //     actions.selectWorkspace(defaultTopic);
  //     actions.redirectTo(defaultTopic);
  //   }
  // }, [defaultTopic]);

  // useEffect(() => {
  //   const arrWorkspaces = Object.values(workspaces);
  //   if (generalSettings.active_topic === null && arrWorkspaces.length && defaultTopic === null) {
  //     const topic = arrWorkspaces.sort((a, b) => (b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1)).find((w) => w.type === "WORKSPACE" && w.active === 1);
  //     setDefaultTopic(topic);
  //   }
  // }, [generalSettings.active_topic, defaultTopic, workspaces, setDefaultTopic]);

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
    if (companyWs && ws.id === companyWs.id && companyChannel) {
      history.push(`/chat/${companyChannel.code}`);
      actions.selectChannel({ id: companyChannel.id });
    } else {
      document.body.classList.remove("navigation-show");

      if (selectedChannelId && !virtualization) {
        const scrollComponent = document.getElementById("component-chat-thread");
        if (scrollComponent) {
          dispatch(
            setChannelHistoricalPosition({
              channel_id: selectedChannelId,
              scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
            })
          );
        }
      }
      //if (selected && onWorkspace) return;
      if (!ws.sharedSlug) {
        if (selectedChannelId && selectedChannelId !== ws.channel.id && channelIds.some((id) => parseInt(id) === ws.channel.id)) {
          actions.selectChannel({ id: ws.channel.id });
        }
      }

      actions.selectWorkspace(ws);
      actions.redirectTo(ws);
    }
  };

  const handleBrowseAll = () => {
    history.push("/hub/search");
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
      <FavWorkspacesLabel dark_mode={dark_mode}>
        <span>{dictionary.favoriteWorkspaces}</span>
        {!isExternal && (
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.newFolder}>
            <FolderPlus onClick={handleShowFolderModal} icon="folder-plus" />
          </StyledTooltip>
        )}
      </FavWorkspacesLabel>
      <WorkspaceListContainer dark_mode={dark_mode}>
        <div id="elements" className="open">
          {favoriteWorkspacesLoaded && Object.values(workspaces).length > 0 && favoriteWorkspaces.length === 0 && (
            <FavEmptyState dark_mode={dark_mode}>
              <span role="img" aria-label="star">
                ✨
              </span>
              <span dangerouslySetInnerHTML={{ __html: dictionary.addYourFavWs }} />
              <BrowseAll dark_mode={dark_mode} className="btn" onClick={handleBrowseAll}>
                {dictionary.startBrowsing}
              </BrowseAll>
            </FavEmptyState>
          )}

          {favoriteWorkspacesLoaded && Object.values(folders).length === 0 && Object.values(workspaces).length === 0 && <EmptyWorkspaces />}
          {favoriteWorkspacesLoaded && Object.values(workspaces).length > 0 && favoriteWorkspaces.length > 0 && (
            <>
              <ul>
                {favoriteWorkspaces.map((ws) => {
                  return <FavWorkspaceList key={ws.id} isExternal={isExternal} onSelectWorkspace={handleSelectWorkspace} workspace={ws} isCompanyWs={companyWs && companyWs.id === ws.id} companyName={companyName} />;
                })}
              </ul>
              <BrowseAll dark_mode={dark_mode} className="btn" onClick={handleBrowseAll}>
                {dictionary.browseAll}
              </BrowseAll>
            </>
          )}
        </div>
      </WorkspaceListContainer>
    </Wrapper>
  );
};

export default FavoriteWorkspacesPanel;
