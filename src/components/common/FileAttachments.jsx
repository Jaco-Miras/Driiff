import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { deletePostFile, setViewFiles } from "../../redux/actions/fileActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useOutsideClick, useTooltipOrientation } from "../hooks";
import { SvgIconFeather } from "./index";

const Wrapper = styled.div`
  position: relative;
  transition: all 0.3;

  ul {
    padding: 0;

    li {
      list-style: none;
      position: relative;
      cursor: pointer;
      cursor: hand;
    }

    &.files {
      li {
        padding-right: 16px;

        &:hover {
          color: #972c86;

          svg.feather-trash-2 {
            color: #505050;
          }
        }

        svg {
          &.feather-trash-2 {
            position: absolute;
            margin-left: 5px;
            width: 11px;
            top: -1px;
            right: 0;

            &:hover {
              color: #972c86;
            }
          }
        }
      }
    }
  }
`;

const Tooltip = styled.span`
  ${(props) => props.hide && "display: none;"}
  position: absolute;
  z-index: 1000;
  background-color: #fff;
  padding: 10px 10px 5px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;

  &.orientation-top {
    top: ${(props) => props.offsetTop - (props.clientHeight + 20)}px;
  }
  &.orientation-bottom {
    top: ${(props) => props.offsetTop};
  }
  &.orientation-left {
    right: 30px;
    left: auto;
  }
  &.orientation-right {
    left: 30px;
    right: auto;
  }

  .fa {
    font-size: 42px;
  }
  .file {
    max-width: 200px;
    max-height: 200px;
    display: block;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
  }
  .file-name {
    display: block;
  }
  .file-delete {
    margin-top: 10px;
    cursor: pointer;
    cursor: hand;
    display: inline-block;
    font-weight: bold;

    &:hover {
      color: #f44;
    }

    svg {
      width: 11px;
      height: 11px;
      position: relative;
      top: -1px;
      margin-right: 5px;
    }
  }
`;

const AttachmentIcon = styled(SvgIconFeather)`
  width: 10px;
  height: 10px;
  margin-right: 10px;
`;

const FileAttachments = (props) => {
  const { className = "", attachedFiles, handleRemoveFile, scrollRef = null, type = "modal", comment = null } = props;
  const dispatch = useDispatch();
  const params = useParams();
  const [filePreview, setFilePreview] = useState(null);
  const { user: loggedUser } = useSelector((state) => state.session);

  const refs = {
    main: useRef(null),
    tooltip: useRef(null),
  };

  const renderFile = (f) => {
    switch (f.type) {
      case "IMAGE":
        return <img className="file" src={f.src} alt={f.name} />;
      case "VIDEO":
        return <video className="file" controls playsInline autoPlay={false} src={f.src} />;
      default:
        if (f.rawFile) {
          switch (f.rawFile.type) {
            case "application/x-zip-compressed":
              return <i className="fa fa-file-zip-o text-primary" />;
            case "application/pdf":
              return <i className="fa fa-file-pdf-o text-danger" />;
            case "text/plain":
              return <i className="fa fa-file-text-o text-warning" />;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              return <i className="fa fa-file-excel-o text-success" />;
            default:
              return <i className="fa fa-file text-warning" />;
          }
        } else {
          switch (f.type) {
            case "application/x-zip-compressed":
              return <i className="fa fa-file-zip-o text-primary" />;
            case "application/pdf":
              return <i className="fa fa-file-pdf-o text-danger" />;
            case "text/plain":
              return <i className="fa fa-file-text-o text-warning" />;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              return <i className="fa fa-file-excel-o text-success" />;
            default:
              return <i className="fa fa-file text-warning" />;
          }
        }
    }
  };

  const handleClick = (e) => {
    const index = e.currentTarget.dataset.targetIndex;
    if (type === "modal") {
      if (filePreview !== null && filePreview.file.id === attachedFiles[index].id) {
        closePreview(e);
      } else {
        setFilePreview({
          file: attachedFiles[index],
          offsetTop: e.currentTarget.offsetTop + 20,
        });
      }
    } else {
      if (params.hasOwnProperty("workspaceId")) {
        let payload = {
          workspace_id: params.workspaceId,
          file_id: attachedFiles[index].id,
        };

        if (params.hasOwnProperty("postId")) {
          payload = {
            ...payload,
            files: attachedFiles,
          };
        }
        dispatch(setViewFiles(payload));
      }
    }
  };

  const closePreview = () => {
    setFilePreview(null);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "modal") {
      handleRemoveFile(e.currentTarget.dataset.fileId);
      setFilePreview(null);
    } else {
      //confirmation modal for deleting file attachment
      if (params.hasOwnProperty("postId")) {
        let id = e.currentTarget.dataset.fileId;
        const handleDeleteFile = () => {
          dispatch(
            deletePostFile({
              file_id: id,
              post_id: params.postId,
              message_id: comment ? comment.id : null,
            })
          );
        };
        let payload = {
          type: "confirmation",
          headerText: "Remove file",
          submitText: "Remove",
          cancelText: "Cancel",
          bodyText: "Are you sure you want to remove this file?",
          actions: {
            onSubmit: handleDeleteFile,
          },
        };

        dispatch(addToModals(payload));
      }
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setFilePreview(null);
    }, 500);
  };

  const { orientation } = useTooltipOrientation(refs.main, refs.tooltip, scrollRef, filePreview !== null);
  useOutsideClick(refs.main, closePreview, filePreview !== null);

  return (
    <Wrapper ref={refs.main} className={`file-attachments ${className}`} onMouseLeave={handleMouseLeave}>
      <ul className="files">
        {attachedFiles.map((f, i) => {
          return (
            <li data-target-index={i} key={i} onClick={handleClick} title={f.search ? f.search : f.name}>
              <AttachmentIcon icon="paperclip" />
              {f.search ? f.search : f.name}
              {loggedUser.id === f.uploader.id && <SvgIconFeather data-file-id={f.id} onClick={handleDelete} icon="trash-2" />}
            </li>
          );
        })}
      </ul>
      {filePreview !== null && (
        <Tooltip
          ref={refs.tooltip}
          hide={orientation.horizontal === null || orientation.vertical === null}
          className={`tool-tip orientation-${orientation.horizontal} orientation-${orientation.vertical}`}
          clientHeight={orientation.clientHeight}
          offsetTop={filePreview.offsetTop}
        >
          <a target="_blank" href={filePreview.file.src}>
            {renderFile(filePreview.file)}
            <span className="file-name">{filePreview.file.name}</span>
          </a>
          <span className="file-delete" data-file-id={filePreview.file.id} onClick={handleDelete}>
            <SvgIconFeather icon="trash-2" /> Delete
          </span>
        </Tooltip>
      )}
    </Wrapper>
  );
};

export default React.memo(FileAttachments);
