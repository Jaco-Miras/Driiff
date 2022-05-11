import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setViewFiles } from "../../../../redux/actions/fileActions";
import FilePill from "./FilePill";

const MessageFilesContainer = styled.div`
  position: relative;
  z-index: 1;
  border-radius: 8px;
  color: #828282;
  .chat-bubble {
    img {
      cursor: pointer;
    }
    a {
      font-weight: bold;
      cursor: pointer;
    }
    .reply-file-item {
      display: block;
      font-weight: bold;

      &.file-only {
        img {
          width: 52.5px;
          height: 52.5px;
        }
      }
    }
  }
`;

const FilesLink = styled.div`
  margin-bottom: 0.5rem;
`;

const FilesContainer = styled.div`
  display: flex;
  flex-flow: column;
  .app-file-list {
    max-width: 180px;
  }
  .app-file-icon,
  .p-2.small {
    width: 100%;
  }
`;

const MessageFiles = (props) => {
  const { className = "", files, type = "chat", topic_id = null, dictionary } = props;

  const dispatch = useDispatch();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  const handlePreviewFile = (e, file) => {
    e.stopPropagation();

    if (type === "chat" && file.file_type !== "trashed") {
      let payload = {
        //channel_id: reply.channel_id,
        file_id: file.file_id,
        files: [file],
        topic_id: topic_id,
      };
      dispatch(setViewFiles(payload));
    }
  };

  return (
    <MessageFilesContainer className={`message-files ${className}`} filesLength={files.length} type={type}>
      <FilesContainer>
        {files.map((file, key) => {
          if (files.length === 1 && type === "chat") {
            return <FilePill key={key} cbFilePreview={handlePreviewFile} file={file} data-file-type={file.type} dictionary={dictionary} sharedSlug={selectedChannel ? selectedChannel.slug : null} />;
          } else {
            return (
              <FilesLink key={file.id}>
                <FilePill cbFilePreview={handlePreviewFile} file={file} data-file-type={file.type} dictionary={dictionary} sharedSlug={selectedChannel ? selectedChannel.slug : null} />
              </FilesLink>
            );
          }
        })}
      </FilesContainer>
    </MessageFilesContainer>
  );
};

export default React.memo(MessageFiles);
