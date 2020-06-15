import React from "react";
import styled from "styled-components";
import {useWorkspace, usePosts} from "../../hooks";
import TimelinePanel from "../common/TimelinePanel";
import {DashboardAboutWorkspace, DashboardTeam, RecentPosts} from "../dashboard";

const Wrapper = styled.div`    
    overflow: auto !important;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const WorkspaceDashboardPanel = (props) => {

    const {className = ""} = props;

    const {workspace, actions} = useWorkspace();
    const {recentPosts} = usePosts();

    console.log(recentPosts)
    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className={`row`}>
                <div className={`col-md-6`}>
                    <DashboardAboutWorkspace workspace={workspace}/>
                    <TimelinePanel/>
                </div>

                <div className={`col-md-6`}>
                    <DashboardTeam workspace={workspace}/>
                    <RecentPosts posts={recentPosts}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceDashboardPanel);