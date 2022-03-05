import React from "react";
import styled from "styled-components";
import { FileListItem } from "../../../list/file/item";

const Wrapper = styled.div``;

const CompanyImportantFiles = (props) => {
  const { className = "", folders, files, dictionary } = props;

  return (
    <Wrapper className={`important-files ${className}`}>
      <h6 className="font-size-11 text-uppercase mb-4">{dictionary.favoriteTitle}</h6>
      <div className="row">
        {files.length > 0 &&
          files.map((file) => {
            return <FileListItem key={file.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={file} folders={folders} />;
          })}
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyImportantFiles);
