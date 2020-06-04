import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {useIsMember} from "../../hooks";
import {addToModals} from "../../../redux/actions/globalActions";

const PostSidebar = props => {

    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleShowWorkspacePostModal = (e) => {
        let payload = {
            type: "workspace_post_create_edit",
            mode: "create",
            item: {
                workspace: topic,
            },
        };

        dispatch(
            addToModals(payload),
        );
    };

    const isMember = useIsMember(topic && topic.member_ids.length ? topic.member_ids : []);

    return (
        <div className="col-md-3 app-sidebar">
            <div className="card">
                <div className="card-body">
                    {
                        isMember &&
                        <button className="btn btn-outline-primary btn-block" onClick={handleShowWorkspacePostModal}>
                            Create new post
                        </button>
                    }
                </div>
                <div className="app-sidebar-menu"
                        styles="overflow: hidden; outline: currentcolor none medium;" tabIndex="2">
                    <div className="list-group list-group-flush">
                        <a href="/" className="list-group-item active d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-mail mr-2 width-15 height-15">
                                <path
                                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Alles
                        </a>
                        <a href="/" className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-send mr-2 width-15 height-15">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            Mijn posts
                        </a>
                        <a href="/" className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-send mr-2 width-15 height-15">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            Met ster gemarkeerd
                        </a>
                        <a href="/" className="list-group-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-send mr-2 width-15 height-15">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            Concepten
                        </a>
                    </div>
                    <div className="card-body">
                        <h6 className="mb-0">Tags</h6>
                    </div>
                    <div className="list-group list-group-flush">
                        <a href="/" className="list-group-item d-flex align-items-center">
                            <span className="text-warning fa fa-circle mr-2"></span>
                            Reply required
                            <span className="small ml-auto">5</span>
                        </a>
                        <a href="/" className="list-group-item d-flex align-items-center">
                            <span className="text-danger fa fa-circle mr-2"></span>
                            Must read
                        </a>
                        <a href="/" className="list-group-item d-flex align-items-center">
                            <span className="text-info fa fa-circle mr-2"></span>
                            No replies
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PostSidebar;