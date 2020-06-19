import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {SvgEmptyState} from "../../common";
import {useIsMember, usePostActions, usePosts} from "../../hooks";
import {PostDetail, PostFilterSearchPanel, PostItemPanel, PostSidebar} from "../post";

const Wrapper = styled.div`
    text-align: left;
    
    .app-block {
        overflow: inherit;
    }

    .search-title {
        margin: 1.5rem 1.5rem 0;
    }

    .app-content-body {
        position: relative;
    }
`;

const PostDetailWrapper = styled.div`
    .card-body {
        padding: 1rem 1.5rem;
    }
`;

const EmptyState = styled.div`
    padding: 8rem 0;    
    max-width: 375px;        
    margin: auto;
    text-align: center;

    svg {
        display: block;
    }
    button {
        width: auto !important;
        margin: 2rem auto;
    }
`;

const WorkspacePostsPanel = (props) => {

    const {className = ""} = props;

    const workspace = useSelector(state => state.workspaces.activeTopic);

    const isMember = useIsMember(workspace && workspace.member_ids.length ? workspace.member_ids : []);

    const postActions = usePostActions();

    const {posts, filter, tag, sort, post, user, search, count} = usePosts(postActions);

    const handleShowWorkspacePostModal = () => {
        postActions.showModal("create");
    };

    // const count = {
    //     is_must_reply: 0,
    //     is_must_read: 0,
    //     is_read_only: 0,
    // };
    //console.log(count)
    if (posts === null)
        return <></>;

    return (
        <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
            <div className="row app-block">
                <PostSidebar isMember={isMember} workspace={workspace} filter={filter} tag={tag}
                             postActions={postActions} count={count}/>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"/>
                    <PostFilterSearchPanel activeSort={sort} workspace={workspace}/>
                    <div className="card card-body app-content-body mb-2">
                        {
                            posts.length === 0 ?
                            <EmptyState>
                                <SvgEmptyState icon={3} height={252}/>
                                {
                                    isMember &&
                                    <button className="btn btn-outline-primary btn-block"
                                            onClick={handleShowWorkspacePostModal}>
                                        Create new post
                                    </button>
                                }
                            </EmptyState>
                                               :
                            <>{
                                post ?
                                <PostDetailWrapper>
                                    <PostDetail post={post} postActions={postActions} user={user}/>
                                </PostDetailWrapper>
                                     :
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
                            }</>
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspacePostsPanel);