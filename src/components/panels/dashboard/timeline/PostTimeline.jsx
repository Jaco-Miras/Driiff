import React from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {todayOrYesterdayDate} from "../../../../helpers/momentFormatJS";
import {Avatar, FileAttachments} from "../../../common";

const Wrapper = styled.div`
    .title {
        color: #828282;
        font-weight: normal;

        .post-title {
            cursor: pointer;
            cursor: hand;
            color: #505050;
            font-weight: 600;

            .text-primary {
                font-weight: 600;
                font-style: italic;
                font-weight: normal;
            }
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
    const {params} = useRouteMatch();

    const handleLinkClick = (e) => {
        e.preventDefault();
        history.push(`/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${data.id}/${data.title}`);
    };

    return (
        <Wrapper className={`post-timeline timeline-item ${className}`}>
            <div>
                <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link}/>
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                    <span className="title">
                        {data.user.name} <span className="post-title" onClick={handleLinkClick} title={data.title}>shared a post: <span
                        className="text-primary">{data.title}</span></span>                    </span>
                    <span
                        className="text-muted font-weight-normal">{todayOrYesterdayDate(data.created_at.timestamp)}</span>
                </h6>
                <span onClick={handleLinkClick}>
                    <div className="mb-3 border p-3 border-radius-1">
                        <div dangerouslySetInnerHTML={{__html: data.body}}/>
                    </div>
                </span>

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