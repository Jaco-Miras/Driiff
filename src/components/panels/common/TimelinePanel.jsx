import React, {useEffect} from "react";
import styled from "styled-components";
import {
  CompanyAttachFileTimeline,
  CompanyMemberTimeline,
  CompanyPostTimeline,
  CompanyTopicTimeline
} from "../dashboard/timeline/company";

const Wrapper = styled.div`

  @media (max-width: 620px) {
    .timeline-item .d-flex.justify-content-between.mb-4 {
      flex-direction: column;
      .text-muted.font-weight-normal {
        padding-top: 2px;
        font-size: 12px;
      }
    }
  }

`;

const TimelinePanel = (props) => {
  const {className = "", timeline, actions, workspace, dictionary} = props;

  useEffect(() => {
    if (workspace) {
      actions.getTimeline({topic_id: workspace.id, skip:0, limit: 10});
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
                  return <CompanyMemberTimeline key={t.id} data={t.item}/>;
                case "POST":
                  return <CompanyPostTimeline key={t.id} data={t.item}/>;
                case "DOCUMENT":
                  return <CompanyAttachFileTimeline key={t.id} data={t.item}/>;
                case "TOPIC":
                  return <CompanyTopicTimeline key={t.id} data={t.item}/>;
              }
            })}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TimelinePanel);
