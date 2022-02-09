import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FavWorkspaceList } from "../../workspace";
import { useWorkspaceActions } from "../../hooks";
import { setChannelHistoricalPosition } from "../../../redux/actions/chatActions";

const Wrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    .workspace-title-folder > div,
    .feather {
      color: #505050;
    }
    > div {
      border-bottom: 1px solid #f1f2f7;
      padding: 10px;
      margin-bottom: 0;
    }
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
      if (selectedChannelId && selectedChannelId !== ws.channel.id && channelIds.some((id) => parseInt(id) === ws.channel.id)) {
        actions.selectChannel({ id: ws.channel.id });
      }
      actions.selectWorkspace(ws);
      actions.redirectTo(ws);
    }
  };

  return (
    <Wrapper>
      <span>
        <strong>Favorite workspaces</strong>
      </span>
      <ul>
        {favoriteWorkspaces.slice(0, 5).map((ws) => {
          return <FavWorkspaceList key={ws.id} isExternal={isExternal} onSelectWorkspace={handleSelectWorkspace} workspace={ws} isCompanyWs={companyWs && companyWs.id === ws.id} companyName={companyName} />;
        })}
      </ul>
    </Wrapper>
  );
};

export default FavoriteWorkspaceCard;
