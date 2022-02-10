import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { NotificationTimelineItem } from "../../list/notification/item";
import { SvgIconFeather, ToolTip } from "../../common";

const Wrapper = styled.div`
  > span:first-child {
    display: flex;
    align-items: center;
    // font-weight: 600;
  }
  .feather {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    h6 {
      margin: 0 !important;
    }
    > div {
      padding: 10px !important;
      display: flex;
      align-items: center;
      background: unset;
    }
  }
`;

const PostMentionCard = (props) => {
  const { dictionary } = props;
  const notifications = useSelector((state) => state.notifications.notifications);
  const sortedNotifications = Object.values(notifications)
    .filter((n) => {
      return ["POST_REQST_APPROVAL", "POST_MENTION"].includes(n.type);
    })
    .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  return (
    <Wrapper>
      <span>
        <h5 className="card-title mb-0">{dictionary.postMentionsActions}</h5>

        <ToolTip content={dictionary.postMentionsTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip>
      </span>
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
