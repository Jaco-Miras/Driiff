import React from "react";
import styled from "styled-components";
import { useToaster } from "../../hooks";
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
      left: calc(100% + 25px);
      right: auto;
    }
  }
`;

const FolderOptions = (props) => {
  const { className = "", folder, scrollRef = null, actions, isMember, history, params, handleAddEditFolder } = props;
  const toaster = useToaster();

  // const handleViewDetail = () => {
  // };

  const handleRename = () => {
    if (isMember) {
      handleAddEditFolder(folder, "edit");
    } else {
      toaster.warning("You are not a member of this workspace.");
    }
  };

  const handleDelete = () => {
    if (isMember) {
      if (folder.hasOwnProperty("payload")) {
        actions.unlinkGoogleFolder(folder);
      } else {
        let cb = (err, res) => {
          if (err) return;

          if (res) {
            let pathname = history.location.pathname.split("/folder/")[0];
            history.push(pathname);
          }
        };
        actions.removeFolder(folder, params.workspaceId, cb);
      }
    } else {
      toaster.warning("You are not a member of this workspace.");
    }
  };

  const handleRestore = () => {
    console.log(folder);
    actions.restoreWorkspaceFolder(
      folder,
      (err, res) => {
        if (res) {
          if (folder.parent_folder) {
            toaster.success(
              <>
                Folder <span className="font-weight-bold">{folder.search}</span> is restored to #${folder.parent_folder} folder.
              </>
            );
          } else {
            toaster.success(
              <>
                Folder <span className="font-weight-bold">{folder.search}</span> is restored to #All Files folder.
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

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-horizontal" folder={folder} scrollRef={scrollRef}>
      {/* <div onClick={handleViewDetail}>View Details</div> */}
      {!folder.hasOwnProperty("payload") && <div onClick={handleRename}>Rename</div>}
      {folder.is_archived && <div onClick={handleRestore}>Restore</div>}
      <div onClick={handleDelete}>Remove</div>
    </Wrapper>
  );
};

export default React.memo(FolderOptions);
