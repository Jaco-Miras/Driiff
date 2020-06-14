import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {setParentIdForUpload} from "../../../redux/actions/postActions";
import {FileAttachments, SvgIconFeather} from "../../common";
import {DropDocument} from "../../dropzone/DropDocument";
import {useCommentActions, useComments} from "../../hooks";
import {PostBody, PostComments, PostDetailFooter} from "./index";

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

const Icon = styled(SvgIconFeather)`
    width: 16px;
    
    &.close {
        cursor: pointer;
        cursor: hand;
    }
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
        dispatch(setParentIdForUpload(parentId));
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
                    <Icon className="close mr-2" icon="arrow-left" onClick={handleClosePost}/>
                    <h5 className="mb-0">{post.title}</h5>
                </div>
                <div className="app-detail-action-right">
                    {
                        post.author.id === user.id &&
                        <div>
                            <span data-toggle="modal" data-target="#editTaskModal">
                            <a onClick={() => postActions.showModal("edit", post)}
                               className="btn btn-outline-light ml-2" title=""
                               data-toggle="tooltip" data-original-title="Edit Task">
                                <Icon icon="edit-3"/>
                            </a>
                            </span>

                            <a onClick={() => postActions.trash(post)} className="btn btn-outline-light ml-2"
                               data-toggle="tooltip"
                               title="" data-original-title="Delete Task">
                                <Icon icon="trash"/>
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
                    <div><Icon className="mr-2" icon="heart"/>{post.clap_count}</div>
                    <div className="ml-auto">
                        <Icon className="mr-2" icon="message-square"/>{post.reply_count}
                        <Icon className="ml-2 mr-2" icon="eye"/>{post.view_user_ids.length}
                    </div>
                </Counters>
                {
                    post.files.length > 0 &&
                    <>
                        <div className="card-body">
                            <h6 className="mb-3 font-size-11 text-uppercase">Files</h6>
                            <FileAttachments attachedFiles={post.files}/>
                        </div>
                        <hr className="m-0"/>
                    </>
                }
                <PostComments
                    comments={comments} post={post} user={user} commentActions={commentActions}
                    onShowFileDialog={handleOpenFileDialog} dropAction={dropAction}
                />
                <hr className="m-0"/>
                <PostDetailFooter post={post} commentActions={commentActions} onShowFileDialog={handleOpenFileDialog}
                                  dropAction={dropAction}/>
            </MainBody>
        </>
    );
};

export default React.memo(PostDetail);