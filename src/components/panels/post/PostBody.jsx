import React from "react";
import styled from "styled-components";
import {AvatarGroup, SvgIconFeather} from "../../common";
import {PostBadge} from "./index";
import {localizeDate} from "../../../helpers/momentFormatJS";

const Wrapper = styled.div`
    flex: unset;
`;

const PostBody = props => {

    const {post} = props;

    return (
        <Wrapper className="card-body">
            <div className="d-flex align-items-center p-l-r-0 m-b-20">
                <div className="d-flex align-items-center">
                    {
                        post.users_responsible.length > 0 &&
                        <AvatarGroup users={post.users_responsible}/>
                    }
                </div>
                <div className="ml-auto">
                    <PostBadge post={post}/>
                    {
                        post.files.length > 0 &&
                        <SvgIconFeather icon="paperclip" width={16} height={16}/>
                    }
                    <SvgIconFeather icon="star" fill="#ffc107" width={16} height={16}/>
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