import React from "react";
import styled from "styled-components";
import TimelinePanel from "../common/TimelinePanel";
import {AboutWorkspace} from "../dashboard";

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

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className={`row`}>
                <div className={`col-md-6`}>
                    <AboutWorkspace/>
                    <TimelinePanel/>
                </div>

                <div className={`col-md-6`}>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceDashboardPanel);