import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
import {Avatar, FileAttachments} from "../../../common";

const Wrapper = styled.div`
    .title {
        color: #828282;
        
        a {
            color: #505050;
        }
    }
    
    .files {
    
    }    
`;

const PostTimeline = (props) => {

    const {className = "", post} = props;
    const history = useHistory();

    const handleLinkClick = (e) => {
        e.preventDefault();
        history.push(`/workspace/posts`);
    };

    return (
        <Wrapper className={`timeline-item ${className}`}>
            <div>
                <Avatar className="mr-3" name={post.user.name} imageLink={post.user.profile_image_link}/>
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                    <span className="title">
                        {post.user.name} <a href="/" onClick={handleLinkClick}>shared a post</a>
                    </span>
                    <span
                        className="text-muted font-weight-normal">{localizeChatTimestamp(post.created_at.timestamp)}</span>
                </h6>
                <a href="/" onClick={handleLinkClick}>
                    <div className="mb-3 border p-3 border-radius-1">
                        {post.body}
                    </div>
                </a>

                {
                    post.files.length >= 1 &&
                    <>
                        File attachments:
                        <FileAttachments attachedFiles={post.files}/>
                    </>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(PostTimeline);