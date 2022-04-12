import React from "react";
import styled from "styled-components";
import { Avatar } from "../../../../common";
import { useTimeFormat } from "../../../../hooks";

const Wrapper = styled.div`
  .action-text {
    .joined {
      color: #00c851;
    }

    .left {
      color: #f44;
    }
  }
  .title {
    color: #505050;
  }
`;

const CompanyTopicTimeline = (props) => {
  const { className = "", data, scrollRef } = props;
  const { fromNow } = useTimeFormat();

  return (
    <Wrapper className={`topic-timeline timeline-item ${className}`}>
      <div>
        {data.user && (
          <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link} id={data.user.id} showSlider={true} scrollRef={scrollRef} />
        )}
      </div>
      <div>
        <h6 className="d-flex justify-content-between mb-4">
          <span className="action-text title font-weight-normal">
            {data.user.name} <strong>created {data.name} workspace</strong>
          </span>
          <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
        </h6>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyTopicTimeline);
