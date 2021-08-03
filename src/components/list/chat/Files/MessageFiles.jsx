import React from "react";
import { useDispatch } from "react-redux";
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
`;

const MessageFiles = (props) => {
  const { className = "", files, type = "chat", topic_id = null, dictionary } = props;

  const dispatch = useDispatch();

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
            return <FilePill key={key} cbFilePreview={handlePreviewFile} file={file} data-file-type={file.type} dictionary={dictionary} />;
          } else {
            return (
              <FilesLink key={file.id}>
                <FilePill cbFilePreview={handlePreviewFile} file={file} data-file-type={file.type} dictionary={dictionary} />
              </FilesLink>
            );
          }
        })}
      </FilesContainer>
    </MessageFilesContainer>
  );
};

export default React.memo(MessageFiles);
