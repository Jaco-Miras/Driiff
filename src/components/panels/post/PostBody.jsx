import React, { useState } from "react";
import styled from "styled-components";
import { AvatarGroup, SvgIconFeather } from "../../common";
import { useTimeFormat } from "../../hooks";
import { PostBadge } from "./index";

const Wrapper = styled.div`
  flex: unset;
  svg {
    cursor: pointer;
    margin-right: 5px;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
  cursor: pointer;
  cursor: hand;
`;

const PostBody = (props) => {
  const { post, postActions } = props;

  const [star, setStar] = useState(post.is_favourite);
  const { localizeDate } = useTimeFormat();

  const handleStarPost = () => {
    postActions.starPost(post);
    setStar(!star);
  };

  const handleArchivePost = () => {
    postActions.archivePost(post);
  };

  // const markRead = () => {
  //     postActions.markReadRequirement(post);
  // };

  return (
    <Wrapper className="card-body">
      <div className="d-flex align-items-center p-l-r-0 m-b-20">
        <div className="d-flex align-items-center">{post.users_responsible.length > 0 && <AvatarGroup users={post.users_responsible} />}</div>
        <div className="ml-auto d-flex align-items-center text-muted">
          {
            // !isAuthor && post.is_read_requirement &&
            // <MarkAsReadBtn onClick={markRead}>Mark as read</MarkAsReadBtn>
          }
          {
            // !isAuthor && post.is_read_requirement &&
            // <div className="mr-3 d-sm-inline d-none">
            //     <div className="badge badge-dark">
            //         I've read this
            //     </div>
            // </div>
          }
          <PostBadge post={post} isBadgePill={true} />
          {post.files.length > 0 && <Icon className="mr-2" icon="paperclip" />}
          <Icon className="mr-2" onClick={handleStarPost} icon="star" fill={star ? "#ffc107" : "none"} stroke={star ? "#ffc107" : "currentcolor"} />
          <Icon className="mr-2" onClick={handleArchivePost} icon="archive" />
          <span className="text-muted">{localizeDate(post.created_at.timestamp, "LT")}</span>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </Wrapper>
  );
};

export default React.memo(PostBody);
