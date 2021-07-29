import React from "react";
import styled from "styled-components";
import { MoreOptions } from "../../../panels/common";
import { useToaster, useTranslationActions } from "../../../hooks";

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
  const { className = "", folders, file, files, scrollRef = null, actions, forceDelete, disableOptions } = props;

  const toaster = useToaster();

  const { _t } = useTranslationActions();

  const dictionary = {
    rename: _t("FILES.RENAME", "Rename"),
    restore: _t("FILES.RESTORE", "Restore"),
    remove: _t("FILES.REMOVE", "Remove"),
    viewDetails: _t("FILES.VIEW_DETAILS", "View details"),
    share: _t("FILES.SHARE", "Share"),
    download: _t("FILES.DOWNLOAD", "Download"),
    moveTo: _t("FILES.MOVE_TO", "Move to"),
    favorite: _t("FILES.FAVORITE", "Favorite"),
    unfavorite: _t("FILES.UNFAVORITE", "Unfavorite"),
  };

  const handleViewDetail = () => {
    actions.viewCompanyFiles(file, files);
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
    actions.restoreCompanyFile(
      file,
      (err, res) => {
        if (res) {
          if (file.folder_id && typeof folders[file.folder_id] !== "undefined") {
            toaster.success(
              <>
                Item <b>{file.search}</b> is restored to #{folders[file.folder_id].search} folder.
              </>
            );
          } else {
            toaster.success(
              <>
                Item <span className="font-weight-bold">{file.search}</span> is restored to #All Files folder.
              </>
            );
          }
        }
      },
      {
        message: false,
      }
    );
  };

  const handleDelete = () => {
    if (file.hasOwnProperty("payload_id")) {
      actions.unlinkGoogleAttachment(file);
    } else {
      actions.removeCompanyFile(file, () => {}, {
        forceDelete: forceDelete,
      });
    }
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-horizontal" file={file} scrollRef={scrollRef}>
      <div onClick={handleViewDetail}>{dictionary.viewDetails}</div>
      <div onClick={handleDownload}>{dictionary.download}</div>
      {forceDelete ? (
        <>
          <div onClick={handleRestore}>{dictionary.restore}</div>
        </>
      ) : (
        <>
          <div onClick={handleShare}>{dictionary.share}</div>
          <div onClick={handleFavorite}>{file.is_favorite ? dictionary.unfavorite : dictionary.favorite}</div>
          <div onClick={handleMoveTo}>{dictionary.moveTo}</div>
          <div onClick={handleRename}>{dictionary.rename}</div>
        </>
      )}
      {!disableOptions && <div onClick={handleDelete}>{dictionary.remove}</div>}
    </Wrapper>
  );
};

export default React.memo(CompanyFileOptions);
