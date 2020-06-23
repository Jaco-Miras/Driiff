import React from "react";
import styled from "styled-components";
import {todayOrYesterdayDate} from "../../../../helpers/momentFormatJS";
import {Avatar} from "../../../common";

const Wrapper = styled.div`
    .action-text {
        color: #828282;

        .joined {
            color: #00c851
        }

        .left {
            color: #f44;
        }
    }
    .title {
        color: #505050;
    }
`;

const TopicTimeline = (props) => {

    const {className = "", data} = props;

    return (
        <Wrapper className={`topic-timeline timeline-item ${className}`}>
            <div>
                {
                    data.user &&
                    <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link}/>
                }
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                    <span className="action-text title font-weight-normal">
                        {data.user.name} <strong>created {data.name} workspace</strong>
                    </span>
                    <span
                        className="text-muted font-weight-normal">{todayOrYesterdayDate(data.created_at.timestamp)}</span>
                </h6>
            </div>
        </Wrapper>
    );
};

export default React.memo(TopicTimeline);