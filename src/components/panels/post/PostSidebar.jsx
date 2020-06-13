import React from "react";
import styled from "styled-components";
import {useIsMember} from "../../hooks";
import {PostFilterItem, PostFilterTag} from "./index";

const Wrapper = styled.div`
    .app-sidebar-menu {
        overflow: hidden;
        outline: currentcolor none medium;
    }
 `;

const PostSidebar = props => {

    const {workspace, filter, tag, count, postActions} = props;

    const handleShowWorkspacePostModal = () => {
        postActions.showModal("create");
    };

    const isMember = useIsMember(workspace && workspace.member_ids.length ? workspace.member_ids : []);

    return (
        <Wrapper className="col-md-3 app-sidebar">
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
                    <PostFilterItem workspace={workspace} filter={filter}/>
                    <div className="card-body">
                        <h6 className="mb-0">Tags</h6>
                    </div>
                    <PostFilterTag count={count} workspace={workspace} tag={tag}/>
                </div>
            </div>
        </Wrapper>
    )
};

export default React.memo(PostSidebar);