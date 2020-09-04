import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {
  CompanyAttachFileTimeline,
  CompanyMemberTimeline,
  CompanyPostTimeline,
  CompanyTopicTimeline
} from "../dashboard/timeline/company";
import TimelinePagination from "../dashboard/timeline/TimelinePagination"

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
  const {className = "", workspaceTimeline, actions, workspace, dictionary} = props;

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!workspaceTimeline && workspace && !fetching) {
      setFetching(true);
      actions.getTimeline(
        {topic_id: workspace.id, skip:0, limit: 10},
        () => { 
          setFetching(false);
        }
      );
    }
  }, [workspaceTimeline, workspace, fetching]);



  return (
    <Wrapper className={`timeline-panel card ${className}`}>
      <div className="card-body">
        <h5 className="card-title">{dictionary.timeline}</h5>

        <div className="timeline">
          {workspaceTimeline &&
          Object.values(workspaceTimeline.timeline)
            .sort((a, b) => {
              return b.item.created_at.timestamp > a.item.created_at.timestamp ? 1 : -1;
            })
            .slice(workspaceTimeline.page > 1 ? (workspaceTimeline.page*10)-10 : 0, workspaceTimeline.page*10)
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
      {
        workspaceTimeline && workspaceTimeline.total_items > 10 && <TimelinePagination workspaceTimeline={workspaceTimeline} actions={actions} workspace={workspace}/>
      }
    </Wrapper>
  );
};

export default React.memo(TimelinePanel);
