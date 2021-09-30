import React from "react";
import styled from "styled-components";
import { SvgIconFeather, ToolTip } from "../../common";
import { DriveLinkOptions, DriveLinkIcons } from ".";

const Wrapper = styled.div`
  .card {
    overflow: unset;

    .file-options {
      position: absolute;
      top: 10px;
      right: 5px;
      width: 16px;
    }

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .app-file-icon {
      position: relative;

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
    .small {
      min-height: 49px;
    }
    .feather-link {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const Star = styled(SvgIconFeather)`
  position: absolute;
  top: 10px;
  left: 5px;
  width: 16px;
  fill: #ffc107;
  color: #ffc107;
`;

const DriveLink = (props) => {
  const { className = "", link, isFavorite } = props;

  const handleFileView = () => {
    window.open(link.link, "_blank");
  };

  return (
    <Wrapper className={`file-list-item ${className}`}>
      <div className="card  app-file-list">
        <div className={"app-file-icon uploaded cursor-pointer"} onClick={handleFileView}>
          {isFavorite === true && <Star icon="star" />}
          <DriveLinkOptions link={link} />
          <DriveLinkIcons type={link.type} />
        </div>
        <div className="p-2 small cursor-pointer" onClick={handleFileView}>
          <ToolTip content={link.name}>
            <div className="file-name">
              <SvgIconFeather className={"mr-2"} icon="link" />
              {link.name}
            </div>
          </ToolTip>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(DriveLink);
