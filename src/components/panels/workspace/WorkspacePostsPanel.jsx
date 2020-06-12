import React from "react";
import styled from "styled-components";
import {PostDetail, PostFilterSearchPanel, PostItemPanel, PostSidebar} from "../post";
import {usePosts, usePostActions, useCountRenders} from "../../hooks";

const Wrapper = styled.div`
`;

const PostDetailWrapper = styled.div`
    .card-body {
        padding: 1rem 1.5rem;
    }
`;

const WorkspacePostsPanel = (props) => {

    const {className = ""} = props;

    const {posts, filter, tag, sort, post, user} = usePosts();
    const postActions = usePostActions();
    useCountRenders("posts panel")
    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row app-block">
                <PostSidebar filter={filter} tag={tag} sort={sort} postActions={postActions}/>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"></div>
                    <PostFilterSearchPanel/>
                    <div className="card card-body app-content-body">
                        <div className="app-lists"
                             tabIndex="1">
                            <ul className="list-group list-group-flush ui-sortable">
                                {
                                    posts &&
                                    posts.map(p => {
                                        return <PostItemPanel key={p.id} post={p} postActions={postActions}/>
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