import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {RecentPostListItem} from "../../list/post/item";

const Wrapper = styled.div`
    border-left: 5px solid #822492;
    
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
`;

const RecentPosts = (props) => {

    const {className = ""} = props;
    const [scrollRef, setScrollRef] = useState(null);

    const posts = [
        {
            id: 1,
            title: "Post 1",
            is_mark_done: true,
            created_at: {
                timestamp: 1591713000,
            },
        },
        {
            id: 2,
            title: "Post 2",
            is_mark_done: false,
            created_at: {
                timestamp: 1589038200,
            },
        },
        {
            id: 3,
            title: "Post 3",
            is_mark_done: false,
            created_at: {
                timestamp: 1592351400,
            },
        },
        {
            id: 4,
            title: "Post 4",
            is_mark_done: true,
            created_at: {
                timestamp: 1591630300,
            },
        },
    ];

    const assignRef = useCallback((e) => {
        if (scrollRef === null) {
            setScrollRef(e);
        }
    }, []);

    return (
        <Wrapper className={`about-workspace card ${className}`}>
            <div ref={assignRef} className="card-body">
                <h5 className="card-title">Recent posts <SvgIconFeather icon="refresh-ccw"/></h5>
                <p>The widget for recent posts is not global. It follows personal changes, such as ‘mark as done’.</p>
                <p>The system displays the latest activity posts on top</p>
                <p>The system refreshes the list only when the user isn’t watching the dashboard, in case the user is
                    watching the dashboard / recent posts - it is required to select the refresh icon.</p>
                <p>The user can check / mark as done the posts, by using the checkbox</p>
                <p>The user can navigate to the post detail, by clicking on anything connected to the post except the
                    checkbox.</p>
                <ul className="list-group list-group-flush">
                    {
                        posts.map(post => {
                            return <RecentPostListItem key={post.id} post={post} parentRef={scrollRef}/>;
                        })
                    }
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(RecentPosts);