import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useToaster } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div``;

const ChatWebhooksCard = (props) => {
  const { dictionary } = props;

  const toast = useToaster();

  //const { workspace } = useWorkspace();
  const workspace = useSelector((state) => state.workspaces.activeTopic);

  const handleTeamCopy = () => {
    navigator.clipboard.writeText(workspace.topic_detail.team_channel_bot.url_webhook).then(() => {
      toast.info(dictionary.chatWebhooksClipboardCopy);
    });
  };
  const handleGuestCopy = () => {
    navigator.clipboard.writeText(workspace.topic_detail.channel_bot.url_webhook).then(() => {
      toast.info(dictionary.chatWebhooksClipboardCopy);
    });
  };
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="clipboard" width={20} height={20} />
        <h5 className="card-title mb-0 d-inline-block ml-1">{dictionary.chatWebhooksTitle}</h5>
        {/* <ToolTip content={dictionary.postMentionsTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip> */}
      </span>

      <ul class="list-group list-group-flush">
        <li class="list-group-item px-1 d-flex justify-content-between align-items-center">
          <span>
            <span className="d-inline-block ml-3">{dictionary.chatWebhooksTeams}</span>
          </span>
          {
            <span role="button" onClick={handleTeamCopy}>
              {dictionary.chatWebhooksCopy}
            </span>
          }
        </li>
        {workspace.is_shared && (
          <li class="list-group-item px-1 d-flex justify-content-between align-items-center">
            <span>
              <span className="d-inline-block ml-3"> {dictionary.chatWebhooksGuest}</span>
            </span>
            <span role="button" onClick={handleGuestCopy}>
              {dictionary.chatWebhooksCopy}
            </span>
          </li>
        )}
      </ul>
    </Wrapper>
  );
};

export default ChatWebhooksCard;
