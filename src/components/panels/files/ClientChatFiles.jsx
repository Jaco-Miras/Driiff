import React from "react";
import styled from "styled-components";
import { FileListItem } from "../../list/file/item";

const Wrapper = styled.div``;

const ClientChatFiles = (props) => {
  const { className = "", folders, wsFiles, actions, disableOptions } = props;

  return (
    <Wrapper className={`recent-edited-files ${className}`}>
      <h6 className="font-size-11 text-uppercase mb-4">Client chat</h6>
      <div className="row">
        {wsFiles &&
          wsFiles.client_chat.length > 0 &&
          wsFiles.client_chat.map((id) => {
            if (wsFiles.files.hasOwnProperty(id)) {
              return <FileListItem key={id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[id]} actions={actions} folders={folders} disableOptions={disableOptions} />;
            } else {
              return null;
            }
          })}
      </div>
    </Wrapper>
  );
};

export default React.memo(ClientChatFiles);
