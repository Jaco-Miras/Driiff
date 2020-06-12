import React, {useRef, useState} from "react";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom"
import {FileAttachments, SvgIconFeather} from "../../common";
import {PostDetailFooter, PostBody, PostComments} from "./index";
import {useComments, useCommentActions} from "../../hooks";
import {DropDocument} from "../../dropzone/DropDocument";
import {addToModals} from "../../../redux/actions/globalActions";
import {setParentIdForUpload} from "../../../redux/actions/postActions";

const MainBody = styled.div`
    display: flex;
    flex-grow: 1;
    width: 100%;
    flex-flow: column;
`;

const Counters = styled.div`
    width: 100%;
    padding: .5rem 1.5rem;
`;

const PostDetail = props => {

    const {post, postActions, user} = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [showDropZone, setshowDropZone] = useState(false);

    const handleClosePost = () => {
        history.goBack();
    };
    const commentActions = useCommentActions();
    const comments = useComments(post, commentActions);
    
    const refs = {
        dropZoneRef: useRef(),
    };

    const handleOpenFileDialog = (parentId) => {
        dispatch(setParentIdForUpload(parentId))
        if (refs.dropZoneRef.current) {
            refs.dropZoneRef.current.open();
        }
    };

    const handleHideDropzone = () => {
        setshowDropZone(false);
    };

    const handleshowDropZone = () => {
        setshowDropZone(true);
    };

    const dropAction = (acceptedFiles) => {

        let attachedFiles = [];
        acceptedFiles.forEach(file => {
            var bodyFormData = new FormData();
            bodyFormData.append("file", file);
            let shortFileId = require("shortid").generate();
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
                attachedFiles.push({
                    ...file,
                    type: "IMAGE",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    bodyFormData: bodyFormData,
                    name: file.name ? file.name : file.path,
                });
            } else if (file.type === "video/mp4") {
                attachedFiles.push({
                    ...file,
                    type: "VIDEO",
                    id: shortFileId,
                    status: false,
                    src: URL.createObjectURL(file),
                    bodyFormData: bodyFormData,
                    name: file.name ? file.name : file.path,
                });
            } else {
                attachedFiles.push({
                    ...file,
                    type: "DOC",
                    id: shortFileId,
                    status: false,
                    src: "#",
                    bodyFormData: bodyFormData,
                    name: file.name ? file.name : file.path,
                });
            }
        });
        handleHideDropzone();

        let modal = {
            type: "file_upload",
            droppedFiles: attachedFiles,
            mode: "post",
            post: post,
        };

        dispatch(addToModals(modal));
    };

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
                    {
                        post.author.id === user.id &&
                        <div>
                            <span data-toggle="modal" data-target="#editTaskModal">
                            <a onClick={() => postActions.showModal("edit",post)} className="btn btn-outline-light ml-2" title=""
                                data-toggle="tooltip" data-original-title="Edit Task">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        className="feather feather-edit-3"><path d="M12 20h9"></path><path
                                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </a>
                            </span>
                        
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
                        </div>
                    }
                </div>
            </div>
            <MainBody className="app-detail-article" onDragOver={handleshowDropZone}>
                <DropDocument
                    hide={!showDropZone}
                    ref={refs.dropZoneRef}
                    onDragLeave={handleHideDropzone}
                    onDrop={({acceptedFiles}) => {
                        dropAction(acceptedFiles);
                    }}
                    onCancel={handleHideDropzone}
                />
                <PostBody post={post} postActions={postActions}/>
                <hr className="m-0"/>
                <Counters className="d-flex align-items-center">
                    <div><SvgIconFeather icon="heart"/>{post.clap_count}</div>
                    <div className="ml-auto">
                        <SvgIconFeather icon="message-square"/>{post.reply_count}
                        <SvgIconFeather icon="eye"/>{post.view_user_ids.length}
                    </div>
                </Counters>
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
                <PostComments comments={comments} post={post} user={user} commentActions={commentActions}
                    onShowFileDialog={handleOpenFileDialog} dropAction={dropAction}
                />
                <hr className="m-0"/>
                <PostDetailFooter post={post} commentActions={commentActions} onShowFileDialog={handleOpenFileDialog} dropAction={dropAction}/>
            </MainBody>
        </>
    )
};

export default React.memo(PostDetail);