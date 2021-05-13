import React from "react";
import styled from "styled-components";
import { CompanyFileListItem } from "../../../list/file/item/company";

const Wrapper = styled.div``;

const CompanyRecentEditedFile = (props) => {
  const { className = "", folders, files, actions, disableOptions } = props;

  return (
    <Wrapper className={`recent-edited-files ${className}`}>
      <h6 className="font-size-11 text-uppercase mb-4">Recently edited</h6>
      <div className="row">
        {files.length > 0 &&
          files.map((f) => {
            return <CompanyFileListItem key={f.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={f} files={files} folders={folders} actions={actions} disableOptions={disableOptions} />;
          })}
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyRecentEditedFile);
