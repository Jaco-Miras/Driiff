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
        margin-left: auto;        
    }
    > ul {
        width: 100%;
                
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
        .recent-new-group-wrapper {
            padding-right: 24px;
        }
    }
`;

const PostComments = props => {

    const {className = "", comments, post, user, commentActions, onShowFileDialog, dropAction} = props;

    return (
        <Wrapper className={`post-comments card-body ${className}`}>
            {
                comments &&
                <ul>
                    {
                        Object.values(comments).map(c => {
                            return <Comment key={c.id} comment={c} post={post} user={user}
                                            commentActions={commentActions} onShowFileDialog={onShowFileDialog}
                                            dropAction={dropAction}/>;
                        })
                    }
                </ul>
            }
        </Wrapper>
    )
};

export default React.memo(PostComments);