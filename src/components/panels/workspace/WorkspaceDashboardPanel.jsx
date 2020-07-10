import React from "react";
import styled from "styled-components";
import {usePosts, useWorkspace} from "../../hooks";
import TimelinePanel from "../common/TimelinePanel";
import {DashboardAboutWorkspace, DashboardTeam, RecentPosts} from "../dashboard";

const Wrapper = styled.div`
    overflow: auto !important;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    h5 {
        text-align: left;
    }
`;

const WorkspaceDashboardPanel = (props) => {

    const {className = "", isMember, match} = props;

    const {params} = match;

    const {workspace, actions, timeline} = useWorkspace();
    const {recentPosts} = usePosts();

    const handleEditClick = () => {
        actions.showModal(workspace, "edit", "workspace");
    };

    return (
        <Wrapper className={`container-fluid fadeIn ${className}`}>
            <div className={"row"}>
                <div className={"col-md-6"}>
                    <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick}/>
                    <TimelinePanel timeline={timeline} actions={actions} params={params}/>
                </div>

                <div className={"col-md-6"}>
                    <DashboardTeam workspace={workspace} onEditClick={handleEditClick}/>
                    <RecentPosts posts={recentPosts}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceDashboardPanel);