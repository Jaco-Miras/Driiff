import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {TeamListItem} from "../../list/people/item";
import {addToModals} from "../../../redux/actions/globalActions";
import {useDispatch} from "react-redux";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    .feather-edit {
        cursor: pointer;
        cursor: hand;
    }

    .card-title {
        position: relative;
        .feather-plus {
            right: 0;
            width: 16px;
            position: absolute;
            cursor: pointer;
            &:hover {
                color: #7a1b8b;
            }
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

        .more-options {
            visibility: visible;
            display: flex;
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

    const dispatch = useDispatch();

    const handleShowWorkspaceModal = () => {
        let payload = {
            type: "workspace_create_edit",
            mode: "create",
        };

        dispatch(
            addToModals(payload),
        );
    };

    if (!workspace)
        return <></>;

    return (
        <Wrapper className={`dashboard-team card ${className}`}>
            <div ref={assignRef} className="card-body">
                <h5 className="card-title">Team <SvgIconFeather onClick={handleShowWorkspaceModal} icon="plus"/></h5>



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