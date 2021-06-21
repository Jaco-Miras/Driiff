import React, { forwardRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setViewFiles } from "../../../../redux/actions/fileActions";
import FilePill from "./FilePill";

const MessageFilesContainer = styled.div`
  position: relative;
  z-index: 1;
  border-radius: 8px;
  color: #828282;
`;

const FilesLink = styled.div`
  margin-bottom: 0.5rem;
`;

const FilesContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const FileWrapper = styled(FilePill)``;

//DRIFF-89
// const FileShowDiv = styled.a`
//   display: flex;
//   align-items: center;
//   border: 10px solid #000;

//   :after {
//     content: "";
//     mask-image: ${(props) => (props.show ? `url(${arrowDown})` : `url(${arrowRight})`)};
//     background-color: #676767;
//     mask-repeat: no-repeat;
//     mask-size: 60%;
//     mask-position: center;
//     width: 20px;
//     height: 20px;
//     display: inline-block;
//   }
// `;

const MessageFiles = forwardRef((props, ref) => {
  const { className = "", files, reply, type = "chat", topic_id = null, dictionary, ...otherProps } = props;

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
    <MessageFilesContainer className={`message-files ${className}`} filesLength={files.length} type={type} {...otherProps}>
      {/* {files.length >= 1 && (type === "chat" && files.length === 1) === false && (
        <FileShowDiv onClick={handleToggleShowFile} show={showFiles}>
          {files.length > 1 ? `${files.length} files` : "1 file"}
        </FileShowDiv>
      )} */}
      <FilesContainer>
        {files.map((file, key) => {
          if (files.length === 1 && type === "chat") {
            return <FileWrapper key={key} cbFilePreview={handlePreviewFile} file={file} data-file-type={file.type} dictionary={dictionary} />;
          } else {
            return (
              <FilesLink key={file.id}>
                <FileWrapper cbFilePreview={handlePreviewFile} file={file} data-file-type={file.type} dictionary={dictionary} />
              </FilesLink>
            );
          }
        })}
      </FilesContainer>
    </MessageFilesContainer>
  );
});

export default React.memo(MessageFiles);
