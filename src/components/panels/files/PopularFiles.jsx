import React from "react";
import styled from "styled-components";
import { FileListItem } from "../../list/file/item";

const Wrapper = styled.div``;

const PopularFiles = (props) => {
  const { className = "", folders, wsFiles, disableOptions } = props;

  // const files = [
  //     {
  //         id: 1,
  //         name: "file name",
  //         size: "20Mb",
  //         mimeType: "image",
  //     },
  //     {
  //         id: 2,
  //         name: "file name 2",
  //         size: "10Mb",
  //         mimeType: "video",
  //     },
  //     {
  //         id: 3,
  //         name: "file name",
  //         size: "20Mb",
  //         mimeType: "audio",
  //     },
  //     {
  //         id: 4,
  //         name: "file name 2",
  //         size: "10Mb",
  //         mimeType: "document",
  //     }];

  return (
    <Wrapper className={`popular-files ${className}`}>
      <h6 className="font-size-11 text-uppercase mb-4">Popular</h6>
      <div className="row">
        {wsFiles &&
          wsFiles.popular_files.length > 0 &&
          wsFiles.popular_files.map((id) => {
            return <FileListItem key={id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[id]} folders={folders} disableOptions={disableOptions} />;
          })}
      </div>
    </Wrapper>
  );
};

export default React.memo(PopularFiles);
