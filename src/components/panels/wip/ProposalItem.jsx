import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ToolTip, SvgIconFeather } from "../../common";
import ProposalOptions from "./ProposalOptions";
import ProposalVersionLabel from "./ProposalVersionLabel";
// import { FileOptions } from "../../../panels/files";

const Wrapper = styled.div`
  .card {
    overflow: unset;

    // .file-options {
    //   position: absolute;
    //   top: 10px;
    //   right: 5px;
    //   width: 16px;
    // }

    .file-list {
      outline: ${(props) => (props.isApproved ? "2px solid green" : "unset")};
    }

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .app-file-icon {
      position: relative;
      border-radius: 0;
      padding: 1rem;

      &.uploading {
        background: #afb8bd;
        opacity: 0.8;
      }
      .progress {
        bottom: 10px;
        position: absolute;
        width: 90%;
        left: 5%;
      }
    }
  }
  .file-header {
    padding: 0.5rem;
    background-color: #f5f5f5;
    border-radius: 6px 6px 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .checked-circle {
    border-radius: 50%;
    background-color: green;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      color: #fff;
      width: 12px;
      height: 12px;
      stroke-width: 3;
    }
  }
`;

const ProposalItem = (props) => {
  const { className = "", item, isLink = false, fromModal, parentId } = props;
  const history = useHistory();

  const getFileSizeUnit = (size) => {
    if (size) {
      if (size < 1e6) {
        return {
          size: size / 1000,
          unit: "KB",
        };
      } else if (size < 1e9) {
        return {
          size: size / 1e6,
          unit: "MB",
        };
      } else if (size < 1e12) {
        return {
          size: size / 1e9,
          unit: "GB",
        };
      }
    } else {
      return {
        size: 0,
        unit: "KB",
      };
    }
  };

  const getFileIcon = (mimeType = "") => {
    if (mimeType) {
      if (mimeType === "trashed") {
        return <i class="fa fa-exclamation-triangle text-danger"></i>;
      } else if (mimeType.includes("image")) {
        return <i className="fa fa-file-image-o text-instagram" />;
      } else if (mimeType.includes("audio")) {
        return <i className="fa fa-file-audio-o text-dark" />;
      } else if (mimeType.includes("video")) {
        return <i className="fa fa-file-video-o text-google" />;
      } else if (mimeType.includes("pdf")) {
        return <i className="fa fa-file-pdf-o text-danger" />;
      } else if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("x-rar")) {
        return <i className="fa fa-file-zip-o text-primary" />;
      } else if (mimeType.includes("word") || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return <i className="fa fa-file-word-o text-info" />;
      } else if (
        mimeType.includes("excel") ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("csv") ||
        mimeType.includes("numbers") ||
        //mimeType.includes("xml") ||
        mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        return <i className="fa fa-file-excel-o text-success" />;
      } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
        return <i className="fa fa-file-powerpoint-o text-secondary" />;
      } else if (mimeType.includes("script")) {
        return <i className="fa fa-file-code-o" />;
      } else return <i className="fa fa-file-text-o text-warning" />;
    } else {
      return <i className="fa fa-file-text-o text-warning" />;
    }
  };
  const fileSizeUnit = !isLink && getFileSizeUnit(item.hasOwnProperty("size") && typeof item.size === "number" ? item.size : 0);

  const handleFileView = (e) => {
    //actions.viewFiles(file);
    e.stopPropagation();
    if (!fromModal) {
      history.push(history.location.pathname + `/file/${parentId}/${item.id}`);
    }
  };

  return (
    <Wrapper className={`file-list-item ${className}`} isApproved={item.is_approved} onClick={handleFileView}>
      <div className="card app-file-list mb-0">
        <div className="file-header">
          <ProposalVersionLabel />
          {item.is_approved && (
            <span className="checked-circle mr-2">
              <SvgIconFeather icon="check" />
            </span>
          )}
          <ProposalOptions item={item} fromModal={fromModal} />
        </div>
        <div className="app-file-icon cursor-pointer" onClick={handleFileView}>
          {!isLink && getFileIcon(item.mime_type)}
          {isLink && <i class="fa fa-link"></i>}
        </div>
        <div className="p-2 small cursor-pointer" onClick={handleFileView}>
          <ToolTip content={isLink ? item.media_link_title : item.name}>
            <div className="file-name">{isLink ? item.media_link_title : item.name}</div>
          </ToolTip>
          {!isLink && (
            <div className="text-muted">
              {fileSizeUnit.size.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}
              {fileSizeUnit.unit}
            </div>
          )}
          {isLink && <div className="text-muted file-name">{item.media_link}</div>}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(ProposalItem);
