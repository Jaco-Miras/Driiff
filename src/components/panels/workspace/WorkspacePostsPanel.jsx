import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {useCountRenders, usePostActions, usePosts} from "../../hooks";
import {PostDetail, PostFilterSearchPanel, PostItemPanel, PostSidebar} from "../post";

const Wrapper = styled.div`
    .search-title {
        margin: 1.5rem 1.5rem 0;
    }
`;

const PostDetailWrapper = styled.div`
    .card-body {
        padding: 1rem 1.5rem;
    }
`;

const WorkspacePostsPanel = (props) => {

    const {className = ""} = props;

    const workspace = useSelector(state => state.workspaces.activeTopic);

    const {posts, filter, tag, sort, post, user, search} = usePosts();

    const postActions = usePostActions();

    const count = {
        is_must_reply: 0,
        is_must_read: 0,
        is_read_only: 0,
    };

    useCountRenders("posts panel");

    console.log(post)

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
                            {
                                search !== null &&
                                <>
                                    {
                                        posts.length === 0 ?
                                        <h6 className="search-title card-title font-size-11 text-uppercase mb-4">No
                                            result found: {search}</h6>
                                                           :
                                        posts.length === 1 ?
                                        <h6 className="search-title card-title font-size-11 text-uppercase mb-4">Search
                                            Result: {search}</h6>
                                                           :
                                        <h6 className="search-title card-title font-size-11 text-uppercase mb-4">Search
                                            Results: {search}</h6>
                                    }
                                </>
                            }
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