import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { Avatar, FileAttachments, SvgIconFeather } from "../../../common";
import { useTimeFormat } from "../../../hooks";

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

const PostTimeline = (props) => {
  const { className = "", data, dictionary, scrollRef } = props;
  const history = useHistory();
  const { params } = useRouteMatch();
  const { fromNow } = useTimeFormat();

  const handleLinkClick = (e) => {
    e.preventDefault();
    history.push(`/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${data.id}/${data.title}`);
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
          <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
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

export default React.memo(PostTimeline);
