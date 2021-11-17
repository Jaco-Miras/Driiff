import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Avatar, FileAttachments, SvgIconFeather } from "../../../../common";
import { useTimeFormat } from "../../../../hooks";
import Tooltip from "react-tooltip-lite";

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
    max-height: 255px;
    overflow: hidden;
    position: relative;
    background-color: #f1f2f7a3;

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

const CompanyPostTimeline = (props) => {
  const { className = "", data, dictionary, scrollRef } = props;
  const history = useHistory();
  const { fromNow, localizeDate } = useTimeFormat();

  const handleLinkClick = (e) => {
    e.preventDefault();
    history.push(`/posts/${data.id}/${data.title}`);
  };

  return (
    <Wrapper className={`post-timeline timeline-item ${className}`}>
      <div>
        <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_thumbnail_link ? data.user.profile_image_thumbnail_link : data.user.profile_image_link} id={data.user.id} showSlider={true} scrollRef={scrollRef} />
      </div>
      <div>
        <h6 className="d-flex justify-content-between mb-4">
          <span className="title">
            {data.user.name}{" "}
            <span className="post-title" onClick={handleLinkClick} title={data.title}>
              {dictionary.sharedThePost} "{data.title}"
            </span>
          </span>
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={`${localizeDate(data.created_at.timestamp)}`}>
            <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
          </StyledTooltip>
        </h6>
        {data.body.replace(/<\/?[^>]+(>|$)/g, "") && (
          <span onClick={handleLinkClick}>
            <div className="mb-3 border p-3 border-radius-1 post-body">
              <SvgIconFeather icon="arrow-right" />
              <div dangerouslySetInnerHTML={{ __html: data.body }} />
            </div>
          </span>
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

export default React.memo(CompanyPostTimeline);
