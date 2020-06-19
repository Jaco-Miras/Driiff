import React from "react";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
import {Avatar} from "../../../common";

const Wrapper = styled.div`
    font-weight: bold;
    .action-text {
        margin: 0;
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
    
    let message = null;
    if (data.body.includes("CHANNEL_UPDATE")) {
        message = JSON.parse(data.body.replace("CHANNEL_UPDATE::", ""));
    }
    
    if (message === null) return null

    return (
        <Wrapper className={`member-timeline timeline-item ${className}`}>
            <div>
                {   
                    <Avatar className="mr-3" name={message.author.name} imageLink={message.author.profile_image_link}/>
                }
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                <   span className="title">
                        {message.author.name} updated {message.title}
                    </span>
                    <span
                        className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                </h6>
                {
                    message.added_members.length || message.removed_members.length ?
                    <div className="mb-3 border p-3 border-radius-1">
                        <p className="action-text">
                            {
                                message.added_members.length > 0 && 
                                message.added_members.map(m => m.name).join(", ")+ " has joined."
                            }
                        </p> 
                        <p className="action-text">
                            {
                                message.removed_members.length > 0 && 
                                message.removed_members.map(m => m.name).join(", ")+ " has left."
                            }
                        </p> 
                    </div>
                    : null
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(MemberTimeline);