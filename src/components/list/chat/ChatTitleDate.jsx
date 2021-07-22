import React from "react";
import styled from "styled-components";
import { useTimeFormat } from "../../hooks";
import { Badge, ToolTip } from "../../common";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  max-width: 100%;
  .chat-timestamp_text {
    margin: 1px 0 3px 0;
  }
  .title-data-chat-folder {
    display: inline-block;
    height: 12px;
    color: #8b8b8b;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 12px;
    font-weight: normal;
    margin-left: 5px;
  }
`;

const IconFolder = styled(SvgIconFeather)`
  width: 12px;
  height: 10px;
`;

const ChannelTitleContainer = styled.h6`
  color: #363636;
  ${(props) => props.channel.total_unread && "color: #7a1b8b"};
  flex-grow: 1;
  ${(props) => props.selectedChannel !== null && props.channel.id === props.selectedChannel.id && "font-weight: bold;"};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 100px);

  &.is-unread {
    span {
      font-weight: bold;
    }
  }

  span {
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }

  .badge-wrapper {
    margin-right: 0.5rem !important;
  }
`;

const ChatTitleDate = (props) => {
  const { channelPreviewDate } = useTimeFormat();

  const { className = "", search = "", selectedChannel, channel, dictionary } = props;

  const workspaces = useSelector((state) => state.workspaces.workspaces);

  const getHighlightedSearchTitle = (title) => {
    let newTitle = title;
    if (channel.type === "DIRECT" && channel.profile) {
      newTitle = channel.profile.name;
    }
    if (search === "") {
      return newTitle;
    } else {
      const parts = newTitle.split(new RegExp(`(${search})`, "gi"));
      return <span>{parts.map((part) => (part.toLowerCase() === search.toLowerCase() ? <b>{part}</b> : part))}</span>;
    }
  };

  const chatTitle = (
    <>
      {!!channel.is_archived && (
        <>
          <Badge badgeClassName="bg-warning-bright" label="Archived" />
        </>
      )}
      {getHighlightedSearchTitle(channel.title)}
    </>
  );

  const getChannelFolder = () => {
    switch (channel.type) {
      case "TOPIC": {
        if (channel.workspace_folder) {
          return (
            <>
              <IconFolder icon="folder" /> {channel.workspace_folder.name}{" "}
            </>
          );
        } else {
          return (
            <>
              <span className="dictionary-label">{dictionary.workspace}</span>
            </>
          );
        }
      }
      default: {
        return "";
      }
    }
  };

  return (
    <Wrapper className={"d-flex justify-content-between align-items-center"}>
      <ChannelTitleContainer className={`mb-1 ${channel.is_read ? "" : "is-unread"} ${className}`} selectedChannel={selectedChannel} channel={channel}>
        <ToolTip direction="up-start" arrow={false} content={channel.title}>
          <span>
            {chatTitle}
            {/* channel.team && channel.type === "TOPIC" && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_shared && "(team chat)" */}
            {/* " " */}
            {/* !channel.team && channel.type === "TOPIC" && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_shared && "(client chat)" */}
            <span className="title-data-chat-folder">{getChannelFolder()}</span>
          </span>
        </ToolTip>
      </ChannelTitleContainer>
      <span className={"small text-muted chat-timestamp_text"} dangerouslySetInnerHTML={{ __html: channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp) : "" }} />
    </Wrapper>
  );
};

export default React.memo(ChatTitleDate);
