import React, { forwardRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { useSystemMessage } from "../../hooks";
import { replaceChar } from "../../../helpers/stringFormatter";

const SystemMessageContainer = styled.span`
  display: block;
  width: 100%;

  .chat-file-notification {
    b:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .push-link {
    display: inline-block;
    position: relative;
    padding-bottom: 25px;
    margin-bottom: -25px;
    width: 100%;

    &:before {
      position: absolute;
      left: -14px;
      top: -7px;
      bottom: 0;
      width: 6px;
      height: calc(100% - 12px);
      background: linear-gradient(180deg, rgba(106, 36, 126, 1) 0%, rgba(216, 64, 113, 1) 100%);
      content: "";
      border-radius: 6px 0 0 6px;
    }

    .card-body {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding: 1rem;
      max-width: 95%;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }

    .open-post {
      display: flex;
      position: absolute;
      right: -20px;
      bottom: -10px;
      justify-content: center;
      align-items: center;
      font-size: 12px;

      svg {
        margin-left: 0;
        height: 12px;
      }
    }
  }
`;

const SystemMessageContent = styled.span`
  display: block;
  width: 100%;
`;
const ChatTimeStamp = styled.div`
  color: #a7abc3;
  font-style: italic;
  font-size: 11px;
  position: absolute;
  top: 0;
  left: calc(100% + 10px);
  display: flex;
  height: 100%;
  align-items: center;
  white-space: nowrap;

  .star-wrap {
    .feather-star {
      width: 16px;
      height: 16px;

      &.active {
        fill: #7a1b8bcc;
        color: #7a1b8bcc;
      }
    }
  }
`;

const SystemMessageVirtualized = forwardRef((props, ref) => {
  const { reply, selectedChannel, chatMessageActions, user, timeFormat, dictionary } = props;

  const history = useHistory();
  const params = useParams();

  const { parseBody } = useSystemMessage({ dictionary, reply, selectedChannel, user });

  const handleMessageClick = () => {
    if (reply.body.startsWith("UPLOAD_BULK::")) {
      const data = JSON.parse(reply.body.replace("UPLOAD_BULK::", ""));
      if (data.files) {
        chatMessageActions.viewFiles(data.files);
      }
    } else if (reply.body.startsWith("POST_CREATE::")) {
      let parsedData = reply.body.replace("POST_CREATE::", "");
      if (parsedData.trim() !== "") {
        let item = JSON.parse(reply.body.replace("POST_CREATE::", ""));
        if (params && params.workspaceId) {
          if (params.folderId) {
            history.push(`/workspace/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${item.post.id}/${replaceChar(item.post.title)}`);
          } else {
            history.push(`/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${replaceChar(item.post.title)}`);
          }
        } else {
          history.push(`/posts/${item.post.id}/${replaceChar(item.post.title)}`);
        }
      }
    }
  };
  return (
    <SystemMessageContainer>
      <SystemMessageContent ref={ref} id={`bot-${reply.id}`} onClick={handleMessageClick} dangerouslySetInnerHTML={{ __html: parseBody }} isPostNotification={reply.body.includes("POST_CREATE::")} />
      <ChatTimeStamp className="chat-timestamp" isAuthor={false}>
        <span className="reply-date created">{timeFormat.localizeTime(reply.created_at.timestamp)}</span>
      </ChatTimeStamp>
    </SystemMessageContainer>
  );
});

export default React.memo(SystemMessageVirtualized);
