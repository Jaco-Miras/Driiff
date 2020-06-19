import React from "react";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";

const Wrapper = styled.div`
    font-weight: bold;
    .action-text {
        color: #828282;
        .joined {
            color: #00c851
        }
        .left {
            color: #f44;
        }
    }
`;

const MemberTimeline = (props) => {

    const {className = "", data} = props;

    console.log(data);

    return (
        <Wrapper className={`member-timeline timeline-item ${className}`}>
            <div>
                {/* <Avatar className="mr-3" name={member.user.name} imageLink={member.user.profile_image_link}/> */}
                <figure className="avatar avatar-sm mr-3 bring-forward">
                    {
                        data.body.includes("left") ?
                        <span className="avatar-title bg-primary rounded-circle"/>
                                                   :
                        <span className="avatar-title bg-light rounded-circle"/>
                    }
                </figure>
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                    <span className="action-text">
                        {
                            data.body
                        }
                        {/* {
                         member.action === "join" ?
                         <>{member.user.name} <span className="joined"> has joined.</span></>
                         :
                         <>{member.user.name} <span className="left"> has left.</span></>
                         } */}
                    </span>
                    <span
                        className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                </h6>
            </div>
        </Wrapper>
    );
};

export default React.memo(MemberTimeline);