import React from "react";
import styled from "styled-components";
import {AvatarGroup, SvgIconFeather} from "../../common";
import {PostBadge} from "./index";
import {localizeDate} from "../../../helpers/momentFormatJS";

const Wrapper = styled.div`
    flex: unset;
    svg {
        cursor: pointer;
        margin-right: 5px;
    }
`;

const PostBody = props => {

    const {post, postActions} = props;

    const handleStarPost = () => {
        postActions.starPost(post)
    };

    const handleArchivePost = () => {
        postActions.archivePost(post)
    };

    return (
        <Wrapper className="card-body">
            <div className="d-flex align-items-center p-l-r-0 m-b-20">
                <div className="d-flex align-items-center">
                    {
                        post.users_responsible.length > 0 &&
                        <AvatarGroup users={post.users_responsible}/>
                    }
                </div>
                <div className="ml-auto d-flex align-items-center">
                    <PostBadge post={post}/>
                    {
                        post.files.length > 0 &&
                        <SvgIconFeather icon="paperclip" width={16} height={16}/>
                    }
                    <SvgIconFeather onCLick={handleStarPost} icon="star" fill={post.is_favourite ? "#ffc107" : "none"} width={16} height={16}/>
                    <SvgIconFeather onClick={handleArchivePost} icon="archive" width={16} height={16}/>
                    <span className="text-muted">{localizeDate(post.created_at.timestamp, "LT")}</span>
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div dangerouslySetInnerHTML={{__html: post.body}}/>
            </div>
        </Wrapper>
    )
};

export default PostBody;