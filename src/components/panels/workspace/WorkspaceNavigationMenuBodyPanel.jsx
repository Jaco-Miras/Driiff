import React, {useEffect} from "react";
import styled from "styled-components";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SvgIconFeather} from "../../common";
import {getWorkspaces, setActiveTopic, setActiveTab} from "../../../redux/actions/workspaceActions";
import {WorkspaceList} from "../../workspace";
import {addToModals} from "../../../redux/actions/globalActions";
import {restoreLastVisitedChannel} from "../../../redux/actions/chatActions";

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
            
            .nav-item {
                cursor: pointer;
                cursor: hand;
            }
        }
        .navigation-menu-group{
            ul {
                li {
                    font-size: 16px;
                
                    &.navigation-divider {
                        cursor: pointer;
                        cursor: hand;
                        text-transform: none;
                        margin: 0 0 0 30px;
                        padding: 0;
                        color: #a7abc3;
                        
                        svg {
                            width: 18px;
                            height: 18px;
                        }
                    }
                    
                    > ul {
                        li {
                            list-style-type: disc;
                            margin-left: 45px;
                            margin-bottom: 10px;
                            color: #828282;
                            font-size: 14px;
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

    const workspaces = useSelector(state => state.workspaces.workspaces);
    const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const activeTab = useSelector(state => state.workspaces.activeTab);

    useEffect(() => {
        if (!workspacesLoaded) {
            dispatch(
                getWorkspaces({is_external: 0}, (err,res) => {
                    if (err) return;
                    if (props.match.params.hasOwnProperty("wsid") && props.match.params.wsid !== undefined) {
                        //set the topic
                        let topic = null;
                        let wsfolder = null;
                        res.data.workspaces.forEach(ws => {
                            if (ws.topics.length) {
                                ws.topics.forEach(t => {
                                    if (t.id === parseInt(props.match.params.wsid)) {
                                        wsfolder = ws;
                                        topic = t;
                                        return;
                                    } else return;
                                })
                            } else {
                                return
                            }
                        })
                        if (topic) {
                            topic = {
                                ...topic,
                                selected: true,
                                is_external: wsfolder.is_external,
                                workspace_id: wsfolder.id,
                                workspace_name: wsfolder.name,
                            }
                            dispatch(setActiveTopic(topic));
                        }
                    }
                })
            );
            //dispatch(getWorkspaceTopics({is_external: 0}));
        } else {
            if (activeTopic && props.match.url === "/workspace/dashboard") {
                let path = `/workspace/${activeTopic.is_external === 0 ? 'internal' : 'external'}/`;
                if (activeTopic.workspace_id !== undefined) {
                    path += `${activeTopic.workspace_name}/${activeTopic.workspace_id}/${activeTopic.name}/${activeTopic.id}/dashboard`;
                    dispatch(restoreLastVisitedChannel({channel_id: activeTopic.channel.id}));
                } else {
                    path += `${activeTopic.name}/${activeTopic.id}/dashboard`;
                    dispatch(restoreLastVisitedChannel({channel_id: activeTopic.topic_detail.channel.id}));
                }
                props.history.push(path)
            } else if (activeTopic && props.match.params.hasOwnProperty("wsid")) {
                //check if the active topic id is different in the params
                if (props.match.params.wsid !== undefined && parseInt(props.match.params.wsid) !== activeTopic.id) {
                    //find the new topic id in workspaces and set to active
                }
            }
        }
    }, []);

    const handleShowFolderModal = () => {
        let payload = {
            type: "workspace_folder"
        }
        // let body = document.getElementsByTagName("BODY")[0];
        // body.classList.add("modal-open")
        dispatch(
            addToModals(payload)
        );
    };

    const handleShowWorkspaceModal = () => {
        let payload = {
            type: "workspace_create_edit",
            mode: "create"
        }

        dispatch(
            addToModals(payload)
        );
    }

    const handleSelectTab = (e, tab) => {
        dispatch(setActiveTab(tab));
    }

    return (
        <>
            <Wrapper className={`navigation-menu-body ${className}`}>
                <div className="" styles="overflow: hidden; outline: currentcolor none medium;"
                     tabIndex="3">
                    <h4>Workspaces</h4>

                    <ul className="nav nav-tabs" id="pills-tab" role="tablist">
                        <li className="nav-item" onClick={e => handleSelectTab(e,"intern")}>
                            <span className={`nav-link ${activeTab === "intern" ? "active" : ""}`} id="pills-intern-tab"
                                  data-toggle="pill" role="tab" aria-controls="pills-intern"
                                  aria-selected={activeTab === "intern" ? "true" : "false"}>Intern</span></li>
                        <li className="nav-item" onClick={e => handleSelectTab(e,"extern")}>
                            <span className={`nav-link ${activeTab === "extern" ? "active" : ""}`} id="pills-extern-tab" data-toggle="pill"
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
                                    Object.values(workspaces).map(ws => {
                                        return <WorkspaceList key={ws.key_id} workspace={ws}/>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </Wrapper>
            <div id="ascrail2002" className="nicescroll-rails nicescroll-rails-vr"
                 styles="width: 8px; z-index: 4; cursor: default; position: absolute; top: 0px; left: 112px; height: 378.3px; display: none; opacity: 0;">
                <div
                    styles="position: relative; top: 0px; float: right; width: 6px; height: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                    className="nicescroll-cursors"></div>
            </div>
            <div id="ascrail2002-hr" className="nicescroll-rails nicescroll-rails-hr"
                 styles="height: 8px; z-index: 4; top: 370.3px; left: 0px; position: absolute; cursor: default; display: none; opacity: 0;">
                <div
                    styles="position: absolute; top: 0px; height: 6px; width: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px; left: 0px;"
                    className="nicescroll-cursors"></div>
            </div>
        </>
    );
};

export default React.memo(withRouter(WorkspaceNavigationMenuBodyPanel));