import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { MoreOptions } from "../../panels/common";
import { useToaster, useTranslationActions } from "../../hooks";
import { copyTextToClipboard } from "../../../helpers/commonFunctions";
import { addToModals } from "../../../redux/actions/globalActions";
import { useParams } from "react-router-dom";
import { deleteDriveLink } from "../../../redux/actions/fileActions";

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

const DriveLinkOptions = (props) => {
  const { className = "", link, scrollRef = null } = props;

  const dispatch = useDispatch();
  const params = useParams();
  const toaster = useToaster();

  const { _t } = useTranslationActions();

  const dictionary = {
    rename: _t("FILES.RENAME", "Rename"),
    remove: _t("FILES.REMOVE", "Remove"),
    viewDetails: _t("FILES.VIEW_DETAILS", "View details"),
    share: _t("FILES.SHARE", "Share"),
    favorite: _t("FILES.FAVORITE", "Favorite"),
    unfavorite: _t("FILES.UNFAVORITE", "Unfavorite"),
    modalHeader: _t("MODAL.DRIVE_LINK_REMOVE", "Remove link"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    removeLink: _t("BUTTON.REMOVE_LINK", "Remove link"),
    modalBody: _t("MODAL.BODY_REMOVE_LINK", "Are you sure you want to remove this drive link?"),
    removedLink: _t("TOASTER.REMOVED_DRIVE_LINK", "::linkName:: removed from drive", { linkName: link.name }),
  };

  const handleViewDetail = () => {
    window.open(link.link, "_blank");
  };

  //   const handleFavorite = () => {
  //     actions.favorite(file);
  //   };

  const handleShare = () => {
    copyTextToClipboard(toaster, link);
  };

  const handleRename = () => {
    const modal = {
      type: "external_file_folder",
      mode: "update",
      topic_id: params.workspaceId ? Number(params.workspaceId) : null,
      params: params,
      link: link,
    };
    dispatch(addToModals(modal));
  };

  const handleDelete = () => {
    const handleDeleteLink = () => {
      dispatch(
        deleteDriveLink(
          {
            id: link.id,
          },
          (err, res) => {
            if (err) return;
            toaster.info(dictionary.removedLink);
          }
        )
      );
    };
    let payload = {
      type: "confirmation",
      headerText: dictionary.modalHeader,
      submitText: dictionary.removeLink,
      cancelText: dictionary.cancel,
      bodyText: dictionary.modalBody,
      actions: {
        onSubmit: handleDeleteLink,
      },
    };

    dispatch(addToModals(payload));
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-horizontal" scrollRef={scrollRef}>
      <div onClick={handleViewDetail}>{dictionary.viewDetails}</div>
      <div onClick={handleShare}>{dictionary.share}</div>
      <div onClick={handleRename}>{dictionary.rename}</div>
      <div onClick={handleDelete}>{dictionary.remove}</div>
    </Wrapper>
  );
};

export default React.memo(DriveLinkOptions);
