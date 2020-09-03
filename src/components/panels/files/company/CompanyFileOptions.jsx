import React from "react";
import styled from "styled-components";
import {MoreOptions} from "../../../panels/common";

const Wrapper = styled(MoreOptions)`
  .more-options-tooltip {
    position: absolute;
    font-size: 0.835rem;
    width: 150px;

    &.orientation-top {
      top: calc(100% - 25px);
      bottom: auto;
    }
    &.orientation-bottom {
      top: calc(100% - 25px);
      bottom: auto;
    }
    &.orientation-left {
      right: calc(100% + 5px);
      left: auto;
    }
    &.orientation-right {
      left: calc(100% + 25px);
      right: auto;
    }
  }
`;

const CompanyFileOptions = (props) => {
  const {className = "", file, scrollRef = null, actions, forceDelete, disableOptions} = props;

  const handleViewDetail = () => {
    actions.viewCompanyFiles(file);
  };

  const handleFavorite = () => {
    actions.favorite(file);
  };

  const handleShare = () => {
    actions.copyLink(file.view_link);
  };

  const handleDownload = () => {
    actions.download(file);
  };

  const handleMoveTo = () => {
    actions.moveCompanyFile(file);
  };

  const handleRename = () => {
    actions.renameCompanyFile(file);
  };

  const handleRestore = () => {
    actions.restoreCompanyFile(file);
  }

  const handleDelete = () => {
    if (file.hasOwnProperty("payload_id")) {
      actions.unlinkGoogleAttachment(file);
    } else {
      actions.removeCompanyFile(file, () => {
      }, {
        forceDelete: forceDelete
      });
    }
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-vertical" file={file} scrollRef={scrollRef}>
      <div onClick={handleViewDetail}>View Details</div>
      <div onClick={handleFavorite}>{file.is_favorite ? "Unfavorite" : "Favorite"}</div>
      <div onClick={handleShare}>Share</div>
      <div onClick={handleDownload}>Download</div>
      <div onClick={handleMoveTo}>Move to</div>
      <div onClick={handleRename}>Rename</div>
      {
        forceDelete &&
        <div onClick={handleRestore}>Restore</div>
      }
      {!disableOptions && <div onClick={handleDelete}>Remove</div>}
    </Wrapper>
  );
};

export default React.memo(CompanyFileOptions);
