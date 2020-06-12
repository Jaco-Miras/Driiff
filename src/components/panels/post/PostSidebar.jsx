import React from "react";
import {useSelector} from "react-redux";
import {useIsMember} from "../../hooks";
import {PostFilterItem, PostFilterTag} from "./index";

const PostSidebar = props => {

    const {filter, tag, postActions} = props;
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleShowWorkspacePostModal = () => {
        postActions.showModal("create");
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