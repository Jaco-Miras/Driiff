import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {useIsMember} from "../../hooks";
import {PostFilterItem, PostFilterTag} from "./index";

const Wrapper = styled.div`
 .app-sidebar-menu {
 overflow: hidden;
 outline: currentcolor none medium;
 }
 `;

const PostSidebar = props => {

    const {className = "", filter, tag} = props;
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleShowWorkspacePostModal = () => {
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
        <Wrapper className={`post-sidebar col-md-3 app-sidebar ${className}`}>
            <div className="card">
                <div className="card-body">
                    {
                        isMember &&
                        <button className="btn btn-outline-primary btn-block" onClick={handleShowWorkspacePostModal}>
                            Create new post
                        </button>
                    }
                </div>
                <div className="app-sidebar-menu" tabIndex="2">
                    <PostFilterItem filter={filter}/>
                    <div className="card-body">
                        <h6 className="mb-0">Tags</h6>
                    </div>
                    <PostFilterTag tag={tag}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default PostSidebar;