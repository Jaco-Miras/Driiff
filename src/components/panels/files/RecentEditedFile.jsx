import React from "react";
import styled from "styled-components";
import { FileListItem } from "../../list/file/item";

const Wrapper = styled.div``;

const RecentEditedFile = (props) => {
  const { className = "", folders, wsFiles, actions, disableOptions, isMember } = props;

  return (
    <Wrapper className={`recent-edited-files ${className}`}>
      <h6 className="font-size-11 text-uppercase mb-4">Recently edited</h6>
      <div className="row">
        {wsFiles &&
          wsFiles.recently_edited.length > 0 &&
          wsFiles.recently_edited.map((id) => {
            if (wsFiles.files.hasOwnProperty(id)) {
              return <FileListItem key={id} isMember={isMember} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[id]} actions={actions} folders={folders} disableOptions={disableOptions} />;
            } else {
              return null;
            }
          })}
      </div>
    </Wrapper>
  );
};

export default React.memo(RecentEditedFile);
