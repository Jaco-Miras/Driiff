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
      top: 25px;
      bottom: auto;
    }
    &.orientation-bottom {
      top: calc(100% - 25px);
      bottom: auto;
    }
    &.orientation-left {
      right: 0;
      left: auto;
    }
    &.orientation-right {
      left: calc(100% + 25px);
      right: auto;
    }
  }
`;

const CompanyFolderOptions = (props) => {
  const { className = "", folder, scrollRef = null, actions, history, handleAddEditFolder } = props;

  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    rename: _t("FILES.RENAME", "Rename"),
    restore: _t("FILES.RESTORE", "Restore"),
    remove: _t("FILES.REMOVE", "Remove"),
  };

  const handleRename = () => {
    handleAddEditFolder(folder, "edit");
  };

  const handleRestore = () => {
    actions.restoreCompanyFolder(
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

  const handleDelete = () => {
    if (folder.hasOwnProperty("payload")) {
      actions.unlinkGoogleFolder(folder);
    } else {
      let cb = (err, res) => {
        if (err) return;

        if (res) {
          let pathname = history.location.pathname.split("/folder/")[0];
          history.push(pathname);

          toaster.info(
            <>
              You have removed <b>{folder.search}</b>.
            </>
          );
        }
      };
      actions.removeCompanyFolder(folder, cb);
    }
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-horizontal" folder={folder} scrollRef={scrollRef}>
      {!folder.hasOwnProperty("payload") && !folder.is_archived && <div onClick={handleRename}>{dictionary.rename}</div>}
      {folder.is_archived && <div onClick={handleRestore}>{dictionary.restore}</div>}
      <div onClick={handleDelete}>{dictionary.remove}</div>
    </Wrapper>
  );
};

export default React.memo(CompanyFolderOptions);
