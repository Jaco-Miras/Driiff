import React from "react";
import styled from "styled-components";
import {useToaster} from "../../hooks";
import {MoreOptions} from "../../panels/common";

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

const FileOptions = (props) => {
  const {className = "", folders, file, scrollRef = null, actions, isMember, forceDelete, disableOptions} = props;
  const toaster = useToaster();

  //const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleViewDetail = () => {
    actions.viewFiles(file);
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
    if (isMember) {
      actions.moveFile(file);
    } else {
      toaster.warning(
        <>
          You are <b>not</b> a member of this workspace.
        </>
      );
    }
  };

  const handleRename = () => {
    if (isMember) {
      actions.renameFile(file);
    } else {
      toaster.warning("You are not a member of this workspace.");
    }
  };

  const handleRestore = () => {
    actions.restoreWorkspaceFile(file, (err, res) => {
      if (res) {
        if (file.folder_id && typeof folders[file.folder_id] !== "undefined") {
          toaster.success(<>Item <b>{file.search}</b> is restored on {folders[file.folder_id].search} folder.</>);
        } else {
          toaster.success(<>Item <span className="text-uppercase font-weight-bold">{file.search}</span> is
            restored.</>);
        }
      }
    }, {
      message: false
    });
  }

  const handleDelete = () => {
    if (isMember) {
      if (file.hasOwnProperty("payload_id")) {
        actions.unlinkGoogleAttachment(file);
      } else {
        actions.removeFile(file, forceDelete);
      }
    } else {
      toaster.warning("You are not a member of this workspace.");
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

export default React.memo(FileOptions);
