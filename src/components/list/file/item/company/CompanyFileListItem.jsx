import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SvgIconFeather, ToolTip } from "../../../../common";
import { ProgressBar } from "../../../../panels/common";
import { CompanyFileOptions } from "../../../../panels/files/company";

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

const CompanyFileListItem = (props) => {
  const { className = "", folders, file, files, actions, forceDelete = false, disableOptions } = props;

  const fileSizeUnit = actions.getFileSizeUnit(file.hasOwnProperty("size") && typeof file.size === "number" ? file.size : 0);
  const [isFavorite, setIsFavorite] = useState(file.is_favorite);
  const [fileName, setFileName] = useState(typeof file.name === "undefined" ? file.search : file.name);

  const handleFileView = () => {
    actions.viewCompanyFiles(file, files);
  };

  const handleFavorite = () => {
    setIsFavorite((prevState) => !prevState);
    actions.favorite(file);
  };

  useEffect(() => {
    setFileName(typeof file.name === "undefined" ? file.search : file.name);
  }, [file.name, file.search]);

  return (
    <Wrapper className={`file-list-item cursor-pointer ${className}`} onClick={handleFileView}>
      <div className="card  app-file-list">
        <div className={typeof file.id === "string" ? "app-file-icon uploading" : "app-file-icon uploaded"}>
          {isFavorite === true && <Star icon="star" />}
          {actions.getFileIcon(file.mime_type)}
          {typeof file.id === "number" && <CompanyFileOptions file={file} files={files} folders={folders} actions={{ ...actions, favorite: handleFavorite }} forceDelete={forceDelete} disableOptions={disableOptions} />}
          {typeof file.id === "string" && <ProgressBar amount={100} barClassName={"progress-bar-striped progress-bar-animated"} />}
        </div>
        <div className="p-2 small">
          <ToolTip content={fileName}>
            <div className="file-name">
              {file.hasOwnProperty("payload_id") && <SvgIconFeather className={"mr-2"} icon="gdrive" viewBox="0 0 512 512" fill="#000" height="20" width="15" opacity=".8" />}
              {fileName}
            </div>
          </ToolTip>
          <div className="text-muted">
            {fileSizeUnit.size.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}
            {fileSizeUnit.unit}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyFileListItem);
