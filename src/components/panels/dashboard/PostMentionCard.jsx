import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { NotificationTimelineItem } from "../../list/notification/item";
import { SvgIconFeather, ToolTip } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
  > span:first-child {
    display: flex;
    align-items: center;
    // font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }
  .feather-megaphone {
    margin-right: 0.5rem;
    width: 20px;
    height: 20px;
  }
  .feather-info {
    margin-left: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    h6 {
      margin: 0 !important;
    }
    > div {
      padding: 10px 0 !important;
      display: flex;
      align-items: center;
      background: unset;
    }
    .timeline-item > div:last-child {
      width: 100%;
    }
  }
`;

const PostBtn = styled.button`
  border: 1px solid;
  .dark & {
    color: #fff;
  }
  :hover {
    cursor: pointer;
  }
`;

const PostMentionCard = (props) => {
  const { dictionary } = props;
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const user = useSelector((state) => state.session.user);
  const handleShowPostModal = () => {
    let payload = {
      type: "post_modal",
      mode: "create",
      item: {
        post: null,
      },
    };
    dispatch(addToModals(payload));
  };

  const sortedNotifications = Object.values(notifications)
    .filter((n) => {
      if (n.type === "POST_MENTION") {
        return n.is_read === 0;
      } else if (n.type === "POST_REQST_APPROVAL") {
        return n.data.is_close === 0 && n.data.users_approval && n.data.users_approval.find((u) => u.ip_address === null && user.id === u.id);
      } else if (n.type === "POST_CREATE") {
        return (
          (n.data.is_close === 0 && n.data.must_read && n.data.must_read_users && n.data.must_read_users.some((u) => u.id === user.id && !u.must_read)) ||
          (n.data.must_reply && n.data.must_reply_users && n.data.must_reply_users.some((u) => u.id === user.id && !u.must_reply))
        );
      } else {
        return false;
      }
    })
    .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="megaphone" />
        <h5 className="card-title mb-0">{dictionary.postMentionsActions}</h5>
        <ToolTip content={dictionary.postMentionsTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip>
      </span>
      {sortedNotifications.length === 0 && (
        <div className="mt-3">
          <div>
            {dictionary.startWritingPost} {user.name}
          </div>
          <PostBtn className="btn" onClick={handleShowPostModal}>
            {dictionary.createNewPost}
          </PostBtn>
        </div>
      )}

      <ul className="mt-3">
        {sortedNotifications.length > 0 &&
          sortedNotifications.map((n) => {
            return <NotificationTimelineItem key={n.id} notification={n} showToggle={false} />;
          })}
      </ul>
    </Wrapper>
  );
};

export default PostMentionCard;
