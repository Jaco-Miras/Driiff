import React from "react";
import styled from "styled-components";
import { useToaster, useTranslationActions } from "../../hooks";
import { MoreOptions } from "../../panels/common";

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
      left: calc(100% + 10px);
      right: auto;
    }
  }
`;

const ProposalOptions = (props) => {
  const { className = "", item, fromModal, parentId } = props;

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
    notMemberOfWs: _t("TOASTER.NOT_MEMBER_OF_WS", "You are not a member of this workspace."),
  };

  const handleRemoveFile = () => {
    if (item.removeItem) {
      item.removeItem(item, parentId);
    }
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-horizontal">
      {fromModal && item.file_id && <div onClick={handleRemoveFile}>Remove file</div>}
      {/* <div>Replace current image</div>
      <div>Upload new version</div> */}
    </Wrapper>
  );
};

export default React.memo(ProposalOptions);
