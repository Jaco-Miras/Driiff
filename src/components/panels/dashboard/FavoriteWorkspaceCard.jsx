import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FavWorkspaceList } from "../../workspace";
import { useWorkspaceActions, useTranslationActions } from "../../hooks";
import { setChannelHistoricalPosition } from "../../../redux/actions/chatActions";
import { SvgIconFeather, ToolTip } from "../../common";

const Wrapper = styled.div`
  height: 100%;
  > span {
    display: flex;
    align-items: center;
    //font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }
  .feather-star {
    margin-right: 0.5rem;
  }
  .feather-info {
    margin-left: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    max-height: calc(100% - 40px);
    overflow-x: hidden;
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }

    .workspace-title-folder > div,
    .feather {
      color: #505050;
    }
    > div {
      border-bottom: 1px solid #f1f2f7;
      padding: 5px 0;
      margin-bottom: 0;
      .dark & {
        border-bottom: 1px solid rgba(155, 155, 155, 0.1);
        color: #fff;
      }
    }
  }
  .workspace-title-folder > div,
  .workspace-title-folder svg {
    .dark & {
      color: #fff;
    }
  }
`;

const FavEmptyState = styled.div`
  display: flex;
  flex-flow: column;
  margin-top: 1rem;
  span:last-child {
    margin-top: 1rem;
  }
`;

const BrowseAll = styled.button`
  border: 1px solid;
  .dark & {
    color: #fff;
  }
  :hover {
    cursor: pointer;
  }
`;

const FavoriteWorkspaceCard = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const recipients = useSelector((state) => state.global.recipients);
  const companyRecipient = recipients.find((r) => r.type === "DEPARTMENT");
  const companyWs = Object.values(workspaces).find((ws) => companyRecipient && companyRecipient.id === ws.id);
  const companyChannel = useSelector((state) => state.chat.companyChannel);
  const companyName = useSelector((state) => state.settings.driff.company_name);
  const selectedChannelId = useSelector((state) => state.chat.selectedChannelId);
  const channelIds = useSelector((state) => Object.keys(state.chat.channels));
  const virtualization = useSelector((state) => state.settings.user.CHAT_SETTINGS.virtualization);
  const actions = useWorkspaceActions();

  const { _t } = useTranslationActions();
  const dictionary = {
    favoriteWorkspaces: _t("SIDEBAR.FAVORITE_WORKSPACES", "Favorite workspaces"),
    startBrowsing: _t("SIDEBAR.START_BROWSING", "Start browsing..."),
    addYourFavWs: _t("SIDEBAR.ADD_YOUR_FAVORITE_WORKSPACE", "Add your favorite <br/>workspaces here, ::name::!", { name: user.first_name }),
    clickOnStarWs: _t("LABEL.CLICK_ON_START_WS", "Click on the ⭐ to mark a workspace as favorite"),
  };

  const sortWorkspace = () => {
    return Object.values(workspaces).sort((a, b) => {
      if (generalSettings.order_channel.order_by === "channel_date_updated") {
        return -1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };
  const favoriteWorkspaces = sortWorkspace().filter((ws) => ws.is_favourite);
  const isExternal = user.type === "external";

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

  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="star" /> <h5 className="card-title mb-0">{dictionary.favoriteWorkspaces}</h5>{" "}
        <ToolTip content={dictionary.clickOnStarWs}>
          <SvgIconFeather icon="info" />
        </ToolTip>
      </span>
      <ul className="mt-3">
        {favoriteWorkspaces.length === 0 && (
          <FavEmptyState>
            <span role="img" aria-label="star">
              ✨
            </span>
            <span dangerouslySetInnerHTML={{ __html: dictionary.addYourFavWs }} />
            <BrowseAll className="btn" onClick={handleBrowseAll}>
              {dictionary.startBrowsing}
            </BrowseAll>
          </FavEmptyState>
        )}
        {favoriteWorkspaces.map((ws) => {
          return <FavWorkspaceList key={ws.id} isExternal={isExternal} onSelectWorkspace={handleSelectWorkspace} workspace={ws} isCompanyWs={companyWs && companyWs.id === ws.id} companyName={companyName} />;
        })}
      </ul>
    </Wrapper>
  );
};

export default FavoriteWorkspaceCard;
