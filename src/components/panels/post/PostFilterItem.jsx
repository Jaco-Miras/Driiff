import React from "react";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";

const PostFilterItem = props => {

    const {filter} = props;
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleClickFilter = e => {
        if (topic) {
            dispatch(
                updateWorkspacePostFilterSort({
                    topic_id: topic.id,
                    filter: e.target.dataset.value
                })
            )
        }
    };

    return (
        <div className="list-group list-group-flush">
            <a className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`} data-value="all" onClick={handleClickFilter}>
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
            <a className={`list-group-item ${filter && filter === "my_posts" ? "active" : ""}`} data-value="my_posts" onClick={handleClickFilter}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                        stroke-linecap="round" stroke-linejoin="round"
                        className="feather feather-send mr-2 width-15 height-15">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Mijn posts
            </a>
            <a className={`list-group-item ${filter && filter === "star" ? "active" : ""}`} data-value="star" onClick={handleClickFilter}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                        stroke-linecap="round" stroke-linejoin="round"
                        className="feather feather-send mr-2 width-15 height-15">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Met ster gemarkeerd
            </a>
            <a className={`list-group-item ${filter && filter === "draft" ? "active" : ""}`} data-value="draft" onClick={handleClickFilter}>
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
    );
};

export default PostFilterItem;