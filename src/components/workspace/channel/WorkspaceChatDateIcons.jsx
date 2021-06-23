import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTimeFormat } from "../../hooks";

const Wrapper = styled.div`
  display: ${(props) => (props.optionsVisible ? "none" : "initial")};
`;
const ActionContainer = styled.div`
  position: relative;
  top: 4px;
  display: flex;
  flex-flow: ;
  margin-top: 35px;
`;
const Icon = styled(SvgIconFeather)`
  position: relative;
  top: -3px;
  right: 0;
  width: 15px;
  height: 15px;
`;

const Badge = styled.span`
  color: #fff !important;

  &.unread {
    color: #7a1b8b !important;
    display: none;
  }
`;

const WorkspaceChatDateIcons = (props) => {
  const { workspace, optionsVisible } = props;
  const { channelPreviewDate } = useTimeFormat();

  const handleNotificationBadges = () => {
    if (workspace.is_read === 0) {
      return <Badge className={"badge badge-primary badge-pill ml-auto unread"}>0</Badge>;
    } else {
      if (workspace.total_unread > 0) {
        return <Badge className="badge badge-primary badge-pill ml-auto">{workspace.total_unread}</Badge>;
      } else {
        return null;
      }
    }
  };

  return (
    <Wrapper className="chat-timestamp" optionsVisible={optionsVisible}>
      {/* <span className={"small text-muted chat-timestamp_text"} dangerouslySetInnerHTML={{ __html: channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp) : "" }} /> */}
      {handleNotificationBadges()}
      <ActionContainer>
        {workspace.is_pinned && <Icon icon="star" />}
        {workspace.is_muted && <Icon icon="volume-x" className={`${workspace.is_pinned && "mr-1"}`} />}
      </ActionContainer>
    </Wrapper>
  );
};

export default React.memo(WorkspaceChatDateIcons);
