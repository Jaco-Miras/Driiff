import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {useCountRenders, usePostActions, usePosts} from "../../hooks";
import {PostDetail, PostFilterSearchPanel, PostItemPanel, PostSidebar} from "../post";

const Wrapper = styled.div`
`;

const PostDetailWrapper = styled.div`
    .card-body {
        padding: 1rem 1.5rem;
    }
`;

const WorkspacePostsPanel = (props) => {

    const {className = ""} = props;

    const workspace = useSelector(state => state.workspaces.activeTopic);

    const {posts, filter, tag, sort, post, user} = usePosts();

    const postActions = usePostActions();

    const count = {
        is_must_reply: 0,
        is_must_read: 0,
        is_read_only: 0,
    };

    useCountRenders("posts panel");

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row app-block">
                <PostSidebar workspace={workspace} filter={filter} tag={tag} postActions={postActions} count={count}/>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"/>
                    <PostFilterSearchPanel activeSort={sort} workspace={workspace}/>
                    <div className="card card-body app-content-body">
                        <div className="app-lists"
                             tabIndex="1">
                            <ul className="list-group list-group-flush ui-sortable">
                                {
                                    posts &&
                                    posts.map(p => {
                                        return <PostItemPanel key={p.id} post={p} postActions={postActions}/>;
                                    })
                                }
                            </ul>
                        </div>
                        <PostDetailWrapper className={`card app-detail ${post ? "show" : ""}`}>
                            {
                                post && <PostDetail post={post} postActions={postActions} user={user}/>
                            }
                        </PostDetailWrapper>

                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspacePostsPanel);