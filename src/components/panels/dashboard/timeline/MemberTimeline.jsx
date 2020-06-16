import React from "react";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
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
`;

const MemberTimeline = (props) => {

    const {className = "", data} = props;

    return (
        <Wrapper className={`timeline-item ${className}`}>
            <div>
                {/* <Avatar className="mr-3" name={member.user.name} imageLink={member.user.profile_image_link}/> */}
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