import React from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { setViewFiles } from "../../../../redux/actions/fileActions";
import { Avatar } from "../../../common";
import { useTimeFormat } from "../../../hooks";
import useFileActions from "../../../hooks/useFileActions";

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
    cursor: hand;
  }
  .timeline-file-icon {
    cursor: pointer;
    cursor: hand;
  }
`;

const AttachFileTimeline = (props) => {
  const { className = "", data } = props;
  const { params } = useRouteMatch();

  const dispatch = useDispatch();
  const fileHandler = useFileActions();
  const { fromNow } = useTimeFormat();

  const handleFilePreview = () => {
    console.log(data, params);
    dispatch(
      setViewFiles({
        workspace_id: params.workspaceId,
        file_id: data.id,
      })
    );
  };

  return (
    <Wrapper className={`attach-file-timeline timeline-item ${className}`}>
      <div>
        <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link} id={data.user.id} />
      </div>
      {
        <div>
          <h6 className="d-flex justify-content-between font-weight-bold mb-4">
            <span>
              <span className="font-weight-normal">{data.user.name}</span>{" "}
              <span onClick={handleFilePreview} className="file-summary">
                attached a file
              </span>
            </span>
            <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
          </h6>
          <div className="mb-3 border p-3 border-radius-1">
            <span onClick={handleFilePreview} className="timeline-file-icon">
              {fileHandler.getFileIcon(data.mime_type)} <span>{data.name}</span>
            </span>
          </div>
        </div>
      }
    </Wrapper>
  );
};

export default React.memo(AttachFileTimeline);
