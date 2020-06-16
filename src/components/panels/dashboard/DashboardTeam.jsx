import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {TeamListItem} from "../../list/people/item";

const Wrapper = styled.div`    
    .feather-edit {
        cursor: pointer;
        cursor: hand;
    }
    
    .card-title {
        position: relative;
        
        .feather-edit {
            right: 0;
            width: 16px;
            position: absolute;
        }
    }
    
    .team-list-item {
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

const DashboardTeam = (props) => {

    const {className = "", workspace, onEditClick} = props;
    const [scrollRef, setScrollRef] = useState(null);

    const assignRef = useCallback((e) => {
        if (scrollRef === null) {
            setScrollRef(e);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!workspace)
        return <></>;

    return (
        <Wrapper className={`dashboard-team card ${className}`}>
            <div ref={assignRef} className="card-body">
                <h5 className="card-title">
                    {workspace.hasOwnProperty("workspace_name") ? `${workspace.workspace_name} (${workspace.name})` : workspace.name} team</h5>
                <ul className="list-group list-group-flush">
                    {
                        workspace.members.map(member => {
                            return <TeamListItem key={member.id} member={member} parentRef={scrollRef} onEditClick={onEditClick}/>;
                        })
                    }
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardTeam);