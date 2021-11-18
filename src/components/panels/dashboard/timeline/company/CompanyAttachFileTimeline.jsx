import React from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { setViewFiles } from "../../../../../redux/actions/fileActions";
import { Avatar } from "../../../../common";
import { useTimeFormat } from "../../../../hooks";
import useFileActions from "../../../../hooks/useFileActions";
import FilePill from "../../../../list/chat/Files/FilePill";

const Wrapper = styled.div`
  .timeline-file-icon {
    color: #505050;
    display: flex;
    align-items: center;
    i {
      margin-right: 8px;
      display: inline-block;
      //filter: brightness(0) saturate(100%);
    }
  }
  .file-summary {
    cursor: pointer;
  }
  .timeline-file-icon {
    cursor: pointer;
  }
  .file-pill-container {
    background-color: #f1f2f7a3;
    .dark & {
      background-color: #f1f2f712;
    }
  }
`;

const CompanyAttachFileTimeline = (props) => {
  const { className = "", data, dictionary, scrollRef } = props;
  const { params } = useRouteMatch();

  const dispatch = useDispatch();
  const fileHandler = useFileActions();
  const { fromNow } = useTimeFormat();

  const handleFilePreview = () => {
    dispatch(
      setViewFiles({
        workspace_id: params.workspaceId,
        file_id: data.id,
        files: [{ ...data, filename: data.name, file_id: data.id }],
      })
    );
  };

  return (
    <Wrapper className={`attach-file-timeline timeline-item ${className}`}>
      <div>
        <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_thumbnail_link ? data.user.profile_image_thumbnail_link : data.user.profile_image_link} id={data.user.id} showSlider={true} scrollRef={scrollRef} />
      </div>
      {
        <div>
          <div>
            <h6 className="d-flex justify-content-between font-weight-bold mb-0">
              <span className="font-weight-normal">{data.user.name}</span> <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
            </h6>
          </div>
          <div className="mb-3">
            <span onClick={handleFilePreview} className="file-summary">
              {dictionary.attachedFile}
            </span>
          </div>
          <div className="mb-3 border p-3 border-radius-1 file-pill-container">
            <FilePill className="mb-2" file={data} dictionary={dictionary} />
            <span onClick={handleFilePreview} className="timeline-file-icon">
              {fileHandler.getFileIcon(data.mime_type)} <span>{data.name}</span>
            </span>
          </div>
        </div>
      }
    </Wrapper>
  );
};

export default React.memo(CompanyAttachFileTimeline);
