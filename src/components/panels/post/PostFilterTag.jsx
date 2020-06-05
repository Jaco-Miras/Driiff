import React from "react";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";

const PostFilterTag = props => {

    const {tag} = props;
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleClickFilter = e => {
        if (topic) {
            dispatch(
                updateWorkspacePostFilterSort({
                    topic_id: topic.id,
                    tag: e.target.dataset.value
                })
            )
        }
    }

    return (
        <div className="list-group list-group-flush">
            <a className={`list-group-item d-flex align-items-center ${tag && tag === "is_must_reply" ? "active" : ""}`} data-value="is_must_reply" onClick={handleClickFilter}>
                <span className="text-warning fa fa-circle mr-2"></span>
                Reply required
                <span className="small ml-auto">5</span>
            </a>
            <a className={`list-group-item d-flex align-items-center ${tag && tag === "is_must_read" ? "active" : ""}`} data-value="is_must_read" onClick={handleClickFilter}>
                <span className="text-danger fa fa-circle mr-2"></span>
                Must read
            </a>
            <a className={`list-group-item d-flex align-items-center ${tag && tag === "no_reply" ? "active" : ""}`} data-value="no_reply" onClick={handleClickFilter}>
                <span className="text-info fa fa-circle mr-2"></span>
                No replies
            </a>
        </div>
    );
};

export default PostFilterTag;