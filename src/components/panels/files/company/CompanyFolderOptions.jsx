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

const CompanyFolderOptions = (props) => {

  const {className = "", folder, scrollRef = null, actions, history, handleAddEditFolder} = props;

  const handleRename = () => {
    handleAddEditFolder(folder, "edit");
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
        }
      };
      actions.removeCompanyFolder(folder, cb);
    }
  };

  return (
    <Wrapper className={`file-options ${className}`} moreButton="more-vertical" folder={folder} scrollRef={scrollRef}>
      {/* <div onClick={handleViewDetail}>View Details</div> */}
      {!folder.hasOwnProperty("payload") && <div onClick={handleRename}>Rename</div>}
      <div onClick={handleDelete}>Remove</div>
    </Wrapper>
  );
};

export default React.memo(CompanyFolderOptions);
