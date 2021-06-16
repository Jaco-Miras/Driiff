import React, { useRef } from "react";
import styled from "styled-components";
import { CompanyAttachFileTimeline, CompanyMemberTimeline, CompanyPostTimeline, CompanyTopicTimeline } from "../dashboard/timeline/company";

const Wrapper = styled.div`
  overflow: unset;
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

const CompanyTimelinePanel = (props) => {
  const { className = "", init, timeline, dictionary } = props;
  const mainRef = useRef(null);

  return (
    <Wrapper className={`timeline-panel card ${className}`} ref={mainRef}>
      <div className="card-body">
        <h5 className="card-title">{dictionary.timeline}</h5>
        <div className="timeline">
          {!init ? (
            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
          ) : (
            <>
              {timeline &&
                Object.values(timeline)
                  .sort((a, b) => {
                    return b.item.created_at.timestamp > a.item.created_at.timestamp ? 1 : -1;
                  })
                  .map((t) => {
                    switch (t.tag) {
                      case "CHAT_BOT":
                        return <CompanyMemberTimeline key={t.id} data={t.item} dictionary={dictionary} scrollRef={mainRef.current} />;
                      case "POST":
                        return <CompanyPostTimeline key={t.id} data={t.item} dictionary={dictionary} scrollRef={mainRef.current} />;
                      case "DOCUMENT":
                        return <CompanyAttachFileTimeline key={t.id} data={t.item} dictionary={dictionary} scrollRef={mainRef.current} />;
                      case "TOPIC":
                        return <CompanyTopicTimeline key={t.id} data={t.item} scrollRef={mainRef.current} />;
                    }
                  })}
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
export default React.memo(CompanyTimelinePanel);