import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { Avatar, FileAttachments } from "../../../common";
import { useTimeFormat } from "../../../hooks";
import Tooltip from "react-tooltip-lite";
import { replaceChar } from "../../../../helpers/stringFormatter";

const Wrapper = styled.div`
  .title {
    font-weight: normal;
    .post-title {
      cursor: pointer;
      cursor: hand;
      color: #505050;
      font-weight: 600;

      .text-primary {
        font-weight: 600;
        font-style: italic;
        font-weight: normal;
      }
    }
  }
  img {
    max-width: 100%;
  }
  .files {
  }
  .post-body {
    max-height: 300px;
    overflow: hidden;
    position: relative;
    background-color: #f1f2f7a3;
    > div:first-child {
      overflow: hidden;
      max-height: 210px;
    }
    svg {
      cursor: pointer;
      cursor: hand;
      position: absolute;
      right: 6px;
      color: #000;
      bottom: 6px;
      width: 16px;
      height: 16px;
    }
    .dark & {
      background-color: #f1f2f712;
    }
  }
  .mention a {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const toggleTooltip = () => {
  let tooltips = document.querySelectorAll("span.react-tooltip-lite");
  tooltips.forEach((tooltip) => {
    tooltip.parentElement.classList.toggle("tooltip-active");
  });
};

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PostTimeline = (props) => {
  const { className = "", data, dictionary, scrollRef } = props;
  const history = useHistory();
  const { params } = useRouteMatch();
  const { fromNow, localizeDate } = useTimeFormat();

  const handleLinkClick = (e) => {
    e.preventDefault();
    history.push(`/hub/posts/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${data.id}/${replaceChar(data.title)}`);
  };

  return (
    <Wrapper className={`post-timeline timeline-item ${className}`}>
      <div>
        <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link} id={data.user.id} showSlider={true} scrollRef={scrollRef} />
      </div>
      <div>
        <div>
          <h6 className="d-flex justify-content-between mb-0">
            <span className="title">{data.user.name}</span>
            <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={`${localizeDate(data.created_at.timestamp)}`}>
              <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
            </StyledTooltip>
          </h6>
        </div>
        <div className="mb-3">
          <span className="post-title" onClick={handleLinkClick} title={data.title}>
            {dictionary.sharedThePost} "{data.title}"
          </span>
        </div>
        {data.body.replace(/<\/?[^>]+(>|$)/g, "") && (
          <div className="mb-3 border p-3 border-radius-1 post-body" onClick={handleLinkClick}>
            {/* <SvgIconFeather icon="arrow-right" /> */}
            <div dangerouslySetInnerHTML={{ __html: data.body }} />
            <button className="btn btn-primary" onClick={handleLinkClick}>
              {dictionary.openPost}
            </button>
          </div>
        )}
        {data.files && data.files.length >= 1 && (
          <>
            {dictionary.fileAttachments}:
            <FileAttachments attachedFiles={data.files} type={"timeline"} />
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(PostTimeline);
