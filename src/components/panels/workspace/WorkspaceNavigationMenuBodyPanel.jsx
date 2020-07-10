import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {setActiveTab} from "../../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../../common";
import {WorkspaceList} from "../../workspace";
import {useSetWorkspace, useSortWorkspaces} from "../../hooks";

const Wrapper = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    &.navigation-menu-body {
        border-right: 1px solid #f1f1f1;
        h4 {
            color: #7a1b8b;
            text-transform: uppercase;
            margin: 0 32px;
            height: 32px;
            font-size: 14px;
            display: flex;
            align-items: center;
        }
        #elements > ul:first-of-type {
            margin-bottom: 6px;
        }
        .nav-tabs {
            margin-left: 30px;
            width: calc(100% - 55px);

            .nav-item {
                cursor: pointer;
                cursor: hand;
            }
        }
        .navigation-menu-group{
            ul {
                li {
                    font-size: .835rem;
                    &.navigation-divider {
                        cursor: pointer;
                        cursor: hand;
                        text-transform: none;
                        margin: 0 0 0 30px;
                        padding: 0;
                        color: #BEBEBE;
                        font-size: 9px;
                        font-weight: normal;

                        &:hover {
                            color: #7a1b8b;
                        }

                        svg {
                            width: 7px;
                            height: 7px;
                            margin-right: 9px;
                        }
                    }

                    a {
                        padding: 10px 70px 10px 30px;
                    }

                    > ul {
                        li {
                            margin-left: 30px;
                            margin-bottom: 10px;
                            color: #828282;
                            font-size: 11px;
                            max-width:calc(100% - 95px);
                            // white-space: nowrap;
                            // overflow: hidden;
                            // text-overflow: ellipsis;
                            position: relative;
                            padding-left: 18px;

                            &:hover {
                                color: #7a1b8b;
                            }

                            &.nav-action {
                                list-style-type: none !important;
                                margin-left: 26px !important;
                                color: #BEBEBE !important;
                                font-size: 9px !important;
                                font-weight: normal;
                                padding-left: 22px;

                                svg {
                                    width: 7px;
                                    left: 6px;
                                    top:-4px;
                                }
                            }

                            svg {
                              color: #828282;
                              position: absolute;

                              &.feather-lock{
                                top:-3px;
                                left: 0;
                              }
                              &.feather-circle{
                                left: 3px;
                                width:6px;
                                top:-3px;
                                fill: #828282;
                              }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const WorkspaceNavigationMenuBodyPanel = (props) => {

    const {className = ""} = props;
    const dispatch = useDispatch();

    // const workspaces = useSelector(state => state.workspaces.workspaces);
    // const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    // const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const activeTab = useSelector(state => state.workspaces.activeTab);

    const handleShowFolderModal = () => {
        let payload = {
            type: "workspace_folder",
            mode: "create",
        };
        dispatch(
            addToModals(payload),
        );
    };

    const handleShowWorkspaceModal = () => {
        let payload = {
            type: "workspace_create_edit",
            mode: "create",
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleSelectTab = (e, tab) => {
        dispatch(setActiveTab(tab));
    };

    useSetWorkspace();
    const sortedWorkspaces = useSortWorkspaces();
    const generalInternalWorkspaces = sortedWorkspaces.filter(ws => ws.type !== "FOLDER" && ws.is_external === 0);
    const generalExternalWorkspaces = sortedWorkspaces.filter(ws => ws.type !== "FOLDER" && ws.is_external !== 0);

    return (
        <>
            <Wrapper className={`navigation-menu-body ${className}`}>
                <div>
                    <h4>Workspaces</h4>
                    <ul className="nav nav-tabs" id="pills-tab" role="tablist">
                        <li className="nav-item" onClick={e => handleSelectTab(e, "intern")}>
                            <span
                                className={`nav-link ${activeTab === "intern" ? "active" : ""}`}
                                data-toggle="pill" role="tab" aria-controls="pills-intern"
                                aria-selected={activeTab === "intern" ? "true" : "false"}>Intern</span></li>
                        <li className="nav-item" onClick={e => handleSelectTab(e, "extern")}>
                            <span
                                className={`nav-link ${activeTab === "extern" ? "active" : ""}`}
                                data-toggle="pill"
                                role="tab" aria-controls="pills-extern"
                                aria-selected={activeTab === "intern" ? "true" : "false"}>Extern</span></li>
                    </ul>
                    <div className="navigation-menu-group">
                        <div id="elements" className="open">
                            <ul>
                                <li className="navigation-divider" onClick={handleShowFolderModal}>
                                    <SvgIconFeather icon="plus"/> New folder
                                </li>
                                <li className="navigation-divider" onClick={handleShowWorkspaceModal}>
                                    <SvgIconFeather icon="plus"/> New workspace
                                </li>
                            </ul>
                            <ul>
                                {
                                    sortedWorkspaces
                                        .filter(sws => sws.type === "FOLDER")
                                        .map(ws => {
                                            return <WorkspaceList
                                                show={ws.is_external === (activeTab === "intern" ? 0 : 1)}
                                                key={ws.key_id}
                                                workspace={ws}/>;
                                        })
                                }
                                {
                                    generalInternalWorkspaces.length > 0 &&
                                    <WorkspaceList
                                        show={activeTab === "intern"}
                                        workspace={{
                                            id: "general_internal",
                                            is_lock: 0,
                                            selected: generalInternalWorkspaces.some(ws => ws.selected),
                                            name: "General",
                                            type: "GENERAL_FOLDER",
                                            topics: generalInternalWorkspaces
                                        }}/>
                                }
                                {
                                    generalExternalWorkspaces.length > 0 &&
                                    <WorkspaceList
                                        show={activeTab !== "intern"}
                                        workspace={{
                                            id: "general_external",
                                            is_lock: 0,
                                            selected: generalInternalWorkspaces.some(ws => ws.selected),
                                            name: "General",
                                            type: "GENERAL_FOLDER",
                                            topics: generalInternalWorkspaces
                                        }}/>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </>
    );
};

export default React.memo(WorkspaceNavigationMenuBodyPanel);