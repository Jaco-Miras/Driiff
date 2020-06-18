import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
import {Avatar, FileAttachments} from "../../../common";

const Wrapper = styled.div`
    .title {
        color: #828282;
        font-weight: normal;
        a {
            color: #505050;
            font-weight: bold;
        }
    }
    img {
        max-width: 100%;
    }
    .files {

    }
`;

const PostTimeline = (props) => {

    const {className = "", data} = props;
    const history = useHistory();

    const handleLinkClick = (e) => {
        e.preventDefault();
        history.push(`/workspace/posts`);
    };

    return (
        <Wrapper className={`post-timeline timeline-item ${className}`}>
            <div>
                <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link}/>
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                    <span className="title">
                        {data.user.name} <a onClick={handleLinkClick}>shared a post</a>
                    </span>
                    <span
                        className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                </h6>
                <a onClick={handleLinkClick}>
                    <div className="mb-3 border p-3 border-radius-1">
                        <div dangerouslySetInnerHTML={{__html: data.body}}/>
                    </div>
                </a>

                {
                    data.files && data.files.length >= 1 &&
                    <>
                        File attachments:
                        <FileAttachments attachedFiles={data.files}/>
                    </>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(PostTimeline);