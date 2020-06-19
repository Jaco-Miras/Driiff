import React, {useCallback, useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {RecentPostListItem} from "../../list/post/item";
import {usePostActions} from "../../hooks";

const Wrapper = styled.div`
    .feather-refresh-ccw {
        cursor: pointer;
        cursor: hand;
    }

    .card-title {
        position: relative;

        .feather-refresh-ccw {
            right: 0;
            width: 16px;
            position: absolute;
        }
    }

    .recent-post-list-item {
        position: relative;

        .more-options-tooltip {
            &.orientation-top{
                bottom: 10px;
            }
            &.orientation-right{
                left: 100%;
            }
        }
        &:hover {
            .more-options {
                visibility: visible;

            }
        }

        .more-options {
            visibility: hidden;
        }
    }

    .file-attachments {
        .files {
            width:100%;
        }
    }

    .feather {
        cursor: pointer;
        &:hover {
            color: #7a1b8b;
        }
    }
`;

const RecentPosts = (props) => {

    const {className = "", posts} = props;

    const postActions = usePostActions();
    const match = useRouteMatch();
    const [scrollRef, setScrollRef] = useState(null);

    const assignRef = useCallback((e) => {
        if (scrollRef === null) {
            setScrollRef(e);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenPost = (post) => {
        postActions.openPost(post, match.url.replace("/workspace/dashboard/", "/workspace/posts/"))
    };

    const handleRefetchPosts = () => {
        if (match.params.hasOwnProperty("workspaceId")) {
            postActions.getRecentPosts(match.params.workspaceId)
        }
    };

    useEffect(() => {
        postActions.getRecentPosts(match.params.workspaceId);
    }, []);

    return (
        <Wrapper className={`recent-posts card ${className}`}>
            <div ref={assignRef} className="card-body">
                <h5 className="card-title">Recent posts <SvgIconFeather icon="refresh-ccw" onClick={handleRefetchPosts}/></h5>
                {
                    posts &&
                    <ul className="list-group list-group-flush">
                    {
                        Object.values(posts).sort((a,b) => b.created_at.timestamp > a.created_at.timestamp ? 1 : -1).map(post => {
                            return <RecentPostListItem key={post.id} post={post} parentRef={scrollRef}
                                postActions={postActions} onOpenPost={handleOpenPost}/>;
                        })
                    }
                    </ul>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(RecentPosts);