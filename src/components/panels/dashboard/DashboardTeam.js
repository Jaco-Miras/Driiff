import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useLogRenders} from "../../hooks";
import {TeamListItem} from "../../list/people/item";

const Wrapper = styled.div`
    border-left: 5px solid #822492;
    
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

    const {className = ""} = props;
    const [scrollRef, setScrollRef] = useState(null);

    useLogRenders();

    const users = [
        {
            id: 1,
            name: "User 1",
            role: {
                name: "Leader",
            },
        },
        {
            id: 2,
            name: "User 2",
            role: {
                name: "Member",
            },
        },
        {
            id: 3,
            name: "User 2",
            role: {
                name: "Member",
            },
        },
    ];

    const assignRef = useCallback((e) => {
        if (scrollRef === null) {
            setScrollRef(e);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper className={`about-workspace card ${className}`}>
            <div ref={assignRef} className="card-body">
                <h5 className="card-title">Team <SvgIconFeather icon="edit"/></h5>
                <p>The team of a workspace is shown here.<br/>
                    PENDING From this location, the members can be given a certain role or can be removed from the
                    workspace.<br/>
                    The sorting of the team is done alphabetically, based on the first name.</p>
                <p>Behavior remove<br/>
                    The user selects the more options next to a team member<br/>
                    The user selects the option to remove the user<br/>
                    The system opens the ‘edit workspace’ option - with the cogwheel icon being active<br/>
                    The user can amend its changes</p>
                <ul className="list-group list-group-flush">
                    {
                        users.map(user => {
                            return <TeamListItem key={user.id} user={user} parentRef={scrollRef}/>;
                        })
                    }
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardTeam);