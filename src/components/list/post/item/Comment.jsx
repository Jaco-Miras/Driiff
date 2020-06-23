import React, {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Avatar, FileAttachments, SvgIconFeather} from "../../../common";
import {MoreOptions} from "../../../panels/common";
import {PostDetailFooter} from "../../../panels/post/index";
import {SubComments} from "./index";

const Wrapper = styled.li`
    margin-bottom: 1rem;
`;

const InputWrapper = styled.li`
    overflow: initial;
    z-index: 10;
`;

const CommentWrapper = styled.div`
    .comment-reaction {
        cursor: pointer;
    }
    .clap-true {
        color: #f44;
        fill: #f44;
    }
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
const CommentBody = styled.div`

`;

const CommentInput = styled(PostDetailFooter)`
`;

const Reply = styled.span`
    cursor: pointer;
`;

const Icon = styled(SvgIconFeather)`
    width: 16px;
`;

const Comment = props => {

    const {className = "", comment, post, type = "main", user, commentActions, parentId, onShowFileDialog, dropAction, parentShowInput = null} = props;
    const refs = {
        input: useRef(null),
        body: useRef(null),
    };

    const [showInput, setShowInput] = useState(null);
    const [userMention, setUserMention] = useState(null);

    const handleShowInput = useCallback((commentId = null) => {
        if (parentShowInput) {
            parentShowInput(commentId);
        } else {
            setShowInput(typeof commentId !== "number" ? comment.id : commentId);
        }
        inputFocus();
    }, [setShowInput]);

    const handleMentionUser = () => {
        setUserMention(`<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${comment.author.id}" data-value="${comment.author.name}">
        <span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${comment.author.name}</span></span></p> `);
        setShowInput(true);
    };

    const handleClearUserMention = useCallback(() => {
        setUserMention(null);
    }, []);

    const handleQuote = () => {
        if (parentShowInput) {
            parentShowInput(comment.id);
        } else {
            setShowInput(comment.id);
            inputFocus();
        }
        commentActions.addQuote(comment);
    };

    const inputFocus = useCallback(() => {
        if (showInput !== null && refs.input.current !== null) {
            refs.input.current.querySelector(".ql-editor").scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "start",
            });
            refs.input.current.querySelector(".ql-editor").focus();
        }
    }, [showInput, refs.input.current]);

    useEffect(() => {
        inputFocus();
    }, [inputFocus]);

    const handleReaction = () => {
        let payload = {
            id: comment.id,
            reaction: "clap",
            counter: comment.user_clap_count === 0 ? 1 : 0,
        }
        commentActions.clap(payload);
    }

    return (
        <>
            <Wrapper ref={refs.main} className={`comment card border fadeBottom ${className}`}>
                {
                    comment.quote &&
                    <div>{comment.quote.body}</div>
                }
                <CommentWrapper ref={refs.body} className="card-body" type={type}>
                    <CommentHeader className="d-flex">
                        <div>
                            <Avatar className="mr-2" id={comment.author.id} name={comment.author.name}
                                    imageLink={comment.author.profile_image_link}/>
                            {comment.author.first_name}
                        </div>
                        {
                            post.is_read_only !== 1 &&
                            <MoreOptions scrollRef={refs.body.current} moreButton={`more-vertical`}>
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
                        }
                    </CommentHeader>
                    <CommentBody
                        className="mt-2 mb-3"
                        dangerouslySetInnerHTML={{__html: comment.body}}/>
                    {
                        comment.files.length >= 1 &&
                        <>
                            <hr/>
                            <h6>Files</h6>
                            <FileAttachments attachedFiles={comment.files} type="workspace"/>
                        </>
                    }
                    <div className="d-flex align-items-center justify-content-start">
                        <Icon className={comment.user_clap_count ? 'mr-2 comment-reaction clap-true' : 'mr-2 comment-reaction clap-false'}  icon="heart" onClick={handleReaction}/>
                        {comment.clap_count > 0 ? comment.clap_count : null}
                        {
                            post.is_read_only !== 1 &&
                            <Reply className="ml-3" onClick={handleShowInput}>Comment</Reply>
                        }
                    </div>
                </CommentWrapper>
            </Wrapper>
            {
                type === "main" && Object.values(comment.replies).length > 0 &&
                <SubComments
                    parentShowInput={handleShowInput}
                    comments={comment.replies} post={post} user={user}
                    commentActions={commentActions} parentId={type === "main" ? comment.id : null}
                    onShowFileDialog={onShowFileDialog} dropAction={dropAction}
                />
            }
            {
                showInput !== null &&
                <InputWrapper className="card">
                    <CommentInput
                        innerRef={refs.input}
                        user={user}
                        commentId={showInput}
                        post={post}
                        parentId={type === "main" ? comment.id : parentId}
                        commentActions={commentActions}
                        userMention={userMention}
                        handleClearUserMention={handleClearUserMention}
                        onShowFileDialog={onShowFileDialog} dropAction={dropAction}
                    />
                </InputWrapper>
            }
        </>

    );
};

export default React.memo(Comment);