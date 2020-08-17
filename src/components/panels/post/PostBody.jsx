import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTimeFormat } from "../../hooks";
import { PostBadge } from "./index";
import GifPlayer from "react-gif-player";
import {getGifLinks} from "../../../helpers/urlContentHelper";
import { MemberLists } from "../../list/members";

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
  const { post, postActions, dictionary, disableOptions } = props;

  const [star, setStar] = useState(post.is_favourite);
  const { localizeDate } = useTimeFormat();
  const [showGifPlayer, setShowGifPlayer] = useState(null);

  useEffect(() => {
    if (post.body.match(/\.(gif)/g) !== null) {
      setShowGifPlayer(true);
    }
  }, []);

  const handleStarPost = () => {
    if (disableOptions) return;
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
        <div className="d-flex align-items-center">{post.users_responsible.length > 0 && <MemberLists members={post.users_responsible} />}</div>
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
          <PostBadge post={post} isBadgePill={true} dictionary={dictionary}/>
          {post.files.length > 0 && <Icon className="mr-2" icon="paperclip" />}
          <Icon className="mr-2" onClick={handleStarPost} icon="star" fill={star ? "#ffc107" : "none"} stroke={star ? "#ffc107" : "currentcolor"} />
          { !disableOptions && <Icon className="mr-2" onClick={handleArchivePost} icon="archive" /> }
          <span className="text-muted">{localizeDate(post.created_at.timestamp, "LT")}</span>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
      {showGifPlayer &&
        getGifLinks(post.body).map((gifLink, index) => {
          return <GifPlayer key={index} className={"gifPlayer"} gif={gifLink} autoplay={true}/>;
        })}
    </Wrapper>
  );
};

export default React.memo(PostBody);
