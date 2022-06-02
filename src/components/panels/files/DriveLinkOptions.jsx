import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { MoreOptions } from "../../panels/common";
import { useToaster, useTranslationActions } from "../../hooks";
import { copyTextToClipboard } from "../../../helpers/commonFunctions";
import { addToModals } from "../../../redux/actions/globalActions";
import { useParams, useHistory } from "react-router-dom";
import { deleteDriveLink, putDriveLink } from "../../../redux/actions/fileActions";

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
  const history = useHistory();
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

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
    moveTo: _t("FILES.MOVE_TO", "Move to"),
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
      let sharedPayload = null;
      if (params.workspaceId && history.location.pathname.startsWith("/shared-workspace") && workspace) {
        sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
      }
      dispatch(
        deleteDriveLink(
          {
            id: link.id,
            sharedPayload: sharedPayload,
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

  const handleMoveTo = () => {
    if (params.workspaceId) {
      let sharedPayload = null;
      if (params.workspaceId && history.location.pathname.startsWith("/shared-workspace") && workspace) {
        sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
      }
      let payload = {
        type: "move_files",
        file: { ...link, search: link.name },
        topic_id: params.workspaceId,
        folder_id: null,
        isLink: true,
        sharedPayload: sharedPayload,
      };
      if (params.hasOwnProperty("fileFolderId")) {
        payload = {
          ...payload,
          folder_id: params.fileFolderId,
        };
      }
      dispatch(addToModals(payload));
    } else {
      const handleMoveFile = (payload, callback = () => {}, options = {}) => {
        let linkPayload = {
          id: link.id,
          type: link.type,
          name: link.name,
          link: link.link,
          folder_id: payload.folder_id,
        };
        if (params.workspaceId) {
          let sharedPayload = null;
          if (params.workspaceId && history.location.pathname.startsWith("/shared-workspace") && workspace) {
            sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
          }
          linkPayload = {
            ...linkPayload,
            topic_id: parseInt(params.workspaceId),
            sharedPayload: sharedPayload,
          };
        }

        dispatch(
          putDriveLink(linkPayload, (err, res) => {
            if (err) {
              toaster.error(
                <div>
                  Failed to move <b>{link.search}</b> to folder <strong>{options.selectedFolder}</strong>
                </div>
              );
            }
            if (res) {
              toaster.success(
                <div>
                  <strong>{link.search}</strong> has been moved to folder <strong>{options.selectedFolder}</strong>
                </div>
              );
            }
            callback(err, res);
          })
        );
      };

      let payload = {
        type: "move_company_files",
        dictionary: {
          headerText: "Move files",
          submitText: "Move",
          cancelText: "Cancel",
          bodyText: link.name,
        },
        file: { ...link, search: link.name },
        folder_id: null,
        actions: {
          onSubmit: handleMoveFile,
        },
      };

      if (params.hasOwnProperty("folderId")) {
        payload = {
          ...payload,
          folder_id: params.folderId,
        };
      }

      dispatch(addToModals(payload));
    }
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-horizontal" scrollRef={scrollRef}>
      <div onClick={handleViewDetail}>{dictionary.viewDetails}</div>
      <div onClick={handleShare}>{dictionary.share}</div>
      <div onClick={handleMoveTo}>{dictionary.moveTo}</div>
      <div onClick={handleRename}>{dictionary.rename}</div>
      <div onClick={handleDelete}>{dictionary.remove}</div>
    </Wrapper>
  );
};

export default React.memo(DriveLinkOptions);
