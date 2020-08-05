import React, {useEffect} from "react";
import styled from "styled-components";
import {AttachFileTimeline, MemberTimeline, PostTimeline, TopicTimeline} from "../dashboard/timeline";

const Wrapper = styled.div``;

const TimelinePanel = (props) => {
  const {className = "", timeline, actions, workspace, dictionary} = props;

  useEffect(() => {
    if (workspace) {
      actions.getTimeline(workspace.id);
    }
  }, [workspace]);

  return (
    <Wrapper className={`timeline-panel card ${className}`}>
      <div className="card-body">
        <h5 className="card-title">{dictionary.timeline}</h5>

        <div className="timeline">
          {timeline &&
            Object.values(timeline)
              .sort((a, b) => {
                return b.item.created_at.timestamp > a.item.created_at.timestamp ? 1 : -1;
              })
              .map((t) => {
                switch (t.tag) {
                  case "CHAT_BOT":
                    return <MemberTimeline key={t.id} data={t.item} />;
                  case "POST":
                    return <PostTimeline key={t.id} data={t.item}/>;
                  case "DOCUMENT":
                    return <AttachFileTimeline key={t.id} data={t.item} />;
                  case "TOPIC":
                    return <TopicTimeline key={t.id} data={t.item} />;
                }
              })}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TimelinePanel);
