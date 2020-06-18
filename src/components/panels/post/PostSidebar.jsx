import React from "react";
import styled from "styled-components";
import {PostFilterItem, PostFilterTag} from "./index";

const Wrapper = styled.div`
    .app-sidebar-menu {
        overflow: hidden;
        outline: currentcolor none medium;
    }
 `;

const PostSidebar = props => {

    const {workspace, isMember, filter, tag, count, postActions} = props;

    const handleShowWorkspacePostModal = () => {
        postActions.showModal("create");
    };

    return (
        <Wrapper className="col-md-3 app-sidebar">
            <div className="">
                <div className="app-sidebar-menu" tabIndex="2">
                    {
                        isMember &&
                        <div className="card-body">
                            <button className="btn btn-primary btn-block"
                                    onClick={handleShowWorkspacePostModal}>
                                Create new post
                            </button>
                        </div>
                    }
                    <PostFilterItem workspace={workspace} filter={filter}/>
                    <div className="card-body">
                        <h6 className="mb-0">Tags</h6>
                    </div>
                    <PostFilterTag count={count} workspace={workspace} tag={tag}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(PostSidebar);