import React, {useState, useCallback} from "react";
import styled from "styled-components";
import {SubComments} from "./index";
import {PostDetailFooter} from "../../../panels/post/index";
import {MoreOptions} from "../../../panels/common";

const Wrapper = styled.li`
`;

const CommentWrapper = styled.div`
    width: ${props => props.type === "main" ? "100%" : "90%"};
    margin-left: auto;
    border-radius: 5px;
    border: 1px solid;
    padding .5rem;
    margin-bottom: 1rem;
`;
const CommentHeader = styled.div`
    .more-options {
        margin-left: auto;
        svg {
            width: 1rem;
            height: 1rem;
        }
    }
`;

const CommentInput = styled(PostDetailFooter)`
`;

const Reply = styled.span`
    cursor: pointer;
`;

const Comment = props => {

    const {comment, post, type = "main", user, commentActions, parentId} = props;

    const [showInput, setShowInput] = useState(false);
    const [userMention, setUserMention] = useState(null);

    const handleShowInput = useCallback(() => {
        setShowInput(prevState => !prevState)
    }, [setShowInput]);
    
    const handleMentionUser = () => {
        setUserMention(`<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${comment.author.id}" data-value="${comment.author.name}">
        <span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${comment.author.name}</span></span></p> `);
        setShowInput(true);
    };

    const handleClearUserMention = useCallback(() => {
        setUserMention(null)
    }, []);

    const handleQuote = () => {
        setShowInput(true);
        commentActions.addQuote(comment)
    }

    return (
        <Wrapper>
            {
                comment.quote &&
                <div>{comment.quote.body}</div>
            }
            <CommentWrapper type={type}>
                <CommentHeader className="d-flex">
                    <div></div>
                    <div>{comment.author.name} {comment.id}</div>
                    <MoreOptions moreButton={`vertical`}>
                        {
                            user.id === comment.author.id &&
                            <div onClick={() => commentActions.setToEdit(comment)}>
                                Edit reply
                            </div>
                        }
                        <div onClick={handleQuote}>
                            Quote
                        </div>
                        {
                            user.id !== comment.author.id &&
                            <div onClick={handleMentionUser}>
                                Mention user
                            </div>
                        }
                    </MoreOptions>
                </CommentHeader>
                <div dangerouslySetInnerHTML={{__html: comment.body}}/>
                <div>
                    {comment.clap_count > 0 ? comment.clap_count : null}
                    <Reply onClick={handleShowInput}>Reageren</Reply>
                </div>
            </CommentWrapper>
            {
                showInput &&
                <CommentInput 
                    commentId={comment.id}
                    post={post} 
                    parentId={type === "main" ? comment.id : parentId} 
                    commentActions={commentActions}
                    userMention={userMention}
                    handleClearUserMention={handleClearUserMention}
                />
            }
            {
                type === "main" && Object.values(comment.replies).length > 0 &&
                <SubComments comments={comment.replies} post={post} user={user} commentActions={commentActions} parentId={type === "main" ? comment.id : null}/>
            }
        </Wrapper>
    )
};

export default React.memo(Comment);