import React from "react";
import styled from "styled-components";
import {Comment} from "../../list/post/item";

const Wrapper = styled.div`
    display: flex;
    flex-grow: 1;
    width: 100%;
    height: auto;
    overflow: hidden;
    flex-basis: 0;
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
    }
    > ul {
        overflow: auto;
    }
`;

const PostComments = props => {

    const {comments, post, user, commentActions} = props;

    return (
        <Wrapper className="card-body">
            {
                comments &&
                <ul>
                {
                    Object.values(comments).map(c => {
                        return <Comment key={c.id} comment={c} post={post} user={user} commentActions={commentActions}/>
                    })
                }
                </ul>
            }
        </Wrapper>
    )
};

export default PostComments;