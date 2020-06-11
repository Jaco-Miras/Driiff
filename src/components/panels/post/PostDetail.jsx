import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom"
import {FileAttachments} from "../../common";
import {PostDetailFooter, PostBody, PostComments} from "./index";
import {useComments, useCommentActions} from "../../hooks";

const MainBody = styled.div`
    display: flex;
    flex-grow: 1;
    width: 100%;
    flex-flow: column;
`;

const PostDetail = props => {

    const {post, postActions, user} = props;
    const history = useHistory();
    const handleClosePost = () => {
        history.goBack();
    };
    const commentActions = useCommentActions();
    const comments = useComments(post, commentActions);
    console.log(postActions)

    return (
        <>
            <div className="card-header">
                <div className="app-detail-action-left">
                    <a className="app-detail-close-button" onClick={handleClosePost}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-arrow-left mr-3">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </a>
                    <h5 className="mb-0">{post.title}</h5>
                </div>
                <div className="app-detail-action-right">
                    <div>
                        <span data-toggle="modal" data-target="#editTaskModal">
                        <a className="btn btn-outline-light ml-2" title=""
                            data-toggle="tooltip" data-original-title="Edit Task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-edit-3"><path d="M12 20h9"></path><path
                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </a>
                    </span>
                    {
                        post.author.id === user.id &&
                        <a onClick={() => postActions.trash(post)} className="btn btn-outline-light ml-2" data-toggle="tooltip"
                            title="" data-original-title="Delete Task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-trash">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </a>
                    }
                    </div>
                </div>
            </div>
            <MainBody className="app-detail-article">
                <PostBody post={post} postActions={postActions}/>
                <hr className="m-0"/>
                {
                    post.files.length > 0  &&
                    <>
                    <div className="card-body">
                        <h6 className="mb-3 font-size-11 text-uppercase">Files</h6>
                        <FileAttachments attachedFiles={post.files}/>
                    </div>
                    <hr className="m-0"/>
                    </>
                }
                <PostComments comments={comments} post={post} user={user} commentActions={commentActions}/>
                <hr className="m-0"/>
                <PostDetailFooter post={post} commentActions={commentActions}/>
            </MainBody>
        </>
    )
};

export default React.memo(PostDetail);