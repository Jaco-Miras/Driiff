import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {restoreLastVisitedChannel} from "../../../redux/actions/chatActions";
import {addToModals} from "../../../redux/actions/globalActions";
import {getWorkspaces, setActiveTab, setActiveTopic} from "../../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../../common";
import {WorkspaceList} from "../../workspace";

const Wrapper = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    &.navigation-menu-body {            
        h4 {
            color: #7a1b8b;    
            text-transform: uppercase;
            margin: 14px 0 14px 32px;
            font-size: 16px;
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
                    font-size: 13px;
                
                    &.navigation-divider {
                        cursor: pointer;
                        cursor: hand;
                        text-transform: none;
                        margin: 0 0 0 30px;
                        padding: 0;
                        color: #BEBEBE;
                        font-size: 9px;
                        font-weight: normal;
                        
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
                            max-width:calc(100% - 75px);                            
                            // white-space: nowrap;
                            // overflow: hidden;
                            // text-overflow: ellipsis;
                            position: relative;
                            padding-left: 18px;
                                            
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
                                width:4px;                                
                                top:-2px;
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
    const history = useHistory();

    const workspaces = useSelector(state => state.workspaces.workspaces);
    const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const activeTab = useSelector(state => state.workspaces.activeTab);

    const handleShowFolderModal = () => {
        let payload = {
            type: "workspace_folder",
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

    useEffect(() => {
        if (!workspacesLoaded) {
            dispatch(
                getWorkspaces({is_external: 0}, (err, res) => {
                    if (err) return;
                    if (props.match.params.hasOwnProperty("workspaceId") && props.match.params.workspaceId !== undefined) {
                        let topic = null;
                        let wsfolder = null;
                        res.data.workspaces.forEach(ws => {
                            if (ws.type === "FOLDER" && ws.topics.length) {
                                ws.topics.forEach(t => {
                                    if (t.id === parseInt(props.match.params.workspaceId)) {
                                        wsfolder = ws;
                                        topic = t;
                                        return;
                                    }
                                });
                            } else {
                                if (ws.id === parseInt(props.match.params.workspaceId)) {
                                    topic = ws;
                                    return;
                                }
                            }
                        });
                        if (topic && wsfolder) {
                            topic = {
                                ...topic,
                                selected: true,
                                is_external: wsfolder.is_external,
                                workspace_id: wsfolder.id,
                                workspace_name: wsfolder.name,
                            };
                            dispatch(setActiveTopic(topic));
                        } else if (topic && wsfolder === null) {
                            topic = {
                                ...topic,
                                selected: true,
                            };
                            dispatch(setActiveTopic(topic));
                        }
                    }
                }),
            );
        } else {
            if (activeTopic && props.match.url === "/workspace/dashboard") {
                let path = `/workspace/dashboard/`;
                //let path = `/workspace/dashboard/${activeTopic.is_external === 0 ? "internal" : "external"}/`;
                if (activeTopic.workspace_id !== undefined) {
                    path += `${activeTopic.workspace_id}/${activeTopic.workspace_name}/${activeTopic.id}/${activeTopic.name}/`;
                    dispatch(restoreLastVisitedChannel({channel_id: activeTopic.channel.id}));
                } else {
                    path += `${activeTopic.id}/${activeTopic.name}`;
                    dispatch(restoreLastVisitedChannel({channel_id: activeTopic.topic_detail.channel.id}));
                }
                history.push(path);
            } else if (activeTopic && props.match.params.hasOwnProperty("workspaceId")) {
                //check if the active topic id is different in the params
                if (props.match.params.workspaceId !== undefined && parseInt(props.match.params.workspaceId) !== activeTopic.id) {
                    //find the new topic id in workspaces and set to active
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Wrapper className={`navigation-menu-body ${className}`}>
                <div className="" styles="overflow: hidden; outline: currentcolor none medium;"
                     tabIndex="3">
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
                                {
                                    Object.values(workspaces)
                                        .map(ws => {
                                            return <WorkspaceList
                                                show={ws.is_external === (activeTab === "intern" ? 0 : 1)}
                                                key={ws.key_id} workspace={ws}/>;
                                        })
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