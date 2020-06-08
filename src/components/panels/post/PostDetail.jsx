import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom"
import {FileAttachments} from "../../common";
import {PostDetailFooter, PostBody} from "./index";

const PostDetailWrapper = styled.div`
    .card-body {
        padding: 1rem 1.5rem;
    }
    .app-detail-article {
        display: flex;
        flex-grow: 1;
        width: 100%;
        flex-flow: column;
    }
`;
const PostRepliesDiv = styled.div`
    display: flex;
    flex-grow: 1;
    width: 100%;
`;

const PostDetail = props => {

    const {post} = props;
    const history = useHistory();
    const handleClosePost = () => {
        history.goBack();
    };

    // if (post === null) return null;

    return (
        <PostDetailWrapper className={`card app-detail ${post ? "show" : ""}`}>
            {
                post &&
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
                            <a href="/" className="btn btn-outline-light ml-2" title=""
                                data-toggle="tooltip" data-original-title="Edit Task">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        className="feather feather-edit-3"><path d="M12 20h9"></path><path
                                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </a>
                        </span>
                            <a href="/" className="btn btn-outline-light ml-2" data-toggle="tooltip"
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
                        </div>
                    </div>
                </div>
                <div className="app-detail-article">
                    <PostBody post={post}/>
                    <hr className="m-0"/>
                    {
                        post.files.length > 0  &&
                        <div className="card-body">
                            <h6 className="mb-3 font-size-11 text-uppercase">Files</h6>
                            <FileAttachments attachedFiles={post.files}/>
                        </div>
                    }
                    <hr className="m-0"/>
            
                    <PostRepliesDiv className="card-body">

                    </PostRepliesDiv>
                    <hr className="m-0"/>
                    <PostDetailFooter post={post}/>
                    {/* <div className="card-body">
                        <h6 className="mb-3 font-size-11 text-uppercase">Comment</h6>
                        <div className="reply-email-quill-editor mb-3 ql-container ql-snow">
                            <div className="ql-editor ql-blank" data-gramm="false"
                                    data-placeholder="Type something... " contentEditable="true">
                                <p><br/></p></div>
                            <div className="ql-clipboard" tabIndex="-1"
                                    contentEditable="true"></div>
                            <div className="ql-tooltip ql-hidden"><a className="ql-preview"
                                                                        target="_blank"
                                                                        href="about:blank"></a><input
                                type="text" data-formula="e=mc^2"
                                data-link="https://quilljs.com" data-video="Embed URL"/><a
                                className="ql-action"></a><a className="ql-remove"></a></div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="reply-email-quill-toolbar ql-toolbar ql-snow">
                            <span className="ql-formats mr-0">
                                <button className="ql-bold" type="button"><svg viewBox="0 0 18 18"> <path
                                    className="ql-stroke"
                                    d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path> <path
                                    className="ql-stroke"
                                    d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path> </svg></button>
                                <button className="ql-italic" type="button"><svg viewBox="0 0 18 18"> <line
                                    className="ql-stroke" x1="7" x2="13" y1="4" y2="4"></line> <line
                                    className="ql-stroke" x1="5" x2="11" y1="14" y2="14"></line> <line
                                    className="ql-stroke" x1="8" x2="10" y1="14"
                                    y2="4"></line> </svg></button>
                                <button className="ql-underline" type="button"><svg viewBox="0 0 18 18"> <path
                                    className="ql-stroke"
                                    d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"></path> <rect
                                    className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3"
                                    y="15"></rect> </svg></button>
                                <button className="ql-link" type="button"><svg viewBox="0 0 18 18"> <line
                                    className="ql-stroke" x1="7" x2="11" y1="7" y2="11"></line> <path
                                    className="ql-even ql-stroke"
                                    d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"></path> <path
                                    className="ql-even ql-stroke"
                                    d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"></path> </svg></button>
                                <button className="ql-image" type="button"><svg viewBox="0 0 18 18"> <rect
                                    className="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle
                                    className="ql-fill" cx="6" cy="7" r="1"></circle> <polyline
                                    className="ql-even ql-fill"
                                    points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg></button>
                            </span>
                            </div>
                            <button className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="feather feather-send mr-2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                Send
                            </button>
                        </div>
                    </div> */}
                </div>
                </>
            }
        </PostDetailWrapper>
    )
};

export default PostDetail;