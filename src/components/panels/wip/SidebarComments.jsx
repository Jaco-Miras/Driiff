import React, { useRef } from "react";
import styled from "styled-components";
import { useWIPFileComments, useTimeFormat } from "../../hooks";
import { Avatar } from "../../common";

const Wrapper = styled.div`
  &.card-body {
    padding: 15px;
    overflow: auto;
    .file-comment-body {
      border-radius: 6px;
      padding: 0.5rem;
      background: #f0f0f0;
      display: inline-block;
    }
  }
  .file-comments-thread {
    width: 100%;
  }
  .avatar.avatar-sm {
    height: 2rem;
    width: 2rem;
  }
`;

const SidebarComments = (props) => {
  //const { wip } = props;
  const scrollRef = useRef();
  const { comments } = useWIPFileComments(scrollRef);
  const timeFormat = useTimeFormat();
  return (
    <Wrapper className="card-body d-flex" ref={scrollRef}>
      <div className="file-comments-thread">
        {comments.length > 0 &&
          comments.map((c) => {
            return (
              <div className="file-comment mb-2" key={c.id}>
                <div className="file-comment-body mb-2" dangerouslySetInnerHTML={{ __html: c.body }} />
                <div className="d-flex align-items-center">
                  <Avatar className={"avatar-sm mr-1"} id={c.author.id} type="USER" imageLink={c.author.profile_image_thumbnail_link} name={c.author.name} showSlider={false} />
                  <span className="mr-1">{c.author.first_name}</span>
                  <span className="text-muted">{timeFormat.fromNow(c.created_at.timestamp)}</span>
                </div>
              </div>
            );
          })}
      </div>
    </Wrapper>
  );
};

export default SidebarComments;
