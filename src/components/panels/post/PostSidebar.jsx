import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {useIsMember} from "../../hooks";
import {addToModals} from "../../../redux/actions/globalActions";
import {PostFilterItem, PostFilterTag} from "./index";

const PostSidebar = props => {

    const {filter, tag, sort} = props;
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
                    <PostFilterItem filter={filter}/>
                    <div className="card-body">
                        <h6 className="mb-0">Tags</h6>
                    </div>
                    <PostFilterTag tag={tag}/>
                </div>
            </div>
        </div>
    )
};

export default PostSidebar;