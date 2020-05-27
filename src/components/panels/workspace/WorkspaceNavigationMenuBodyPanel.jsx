import React, {useEffect} from "react";
import styled from "styled-components";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SvgIconFeather} from "../../common";
import {getWorkspaces, getWorkspaceTopics, setActiveTopic} from "../../../redux/actions/workspaceActions";
import {WorkspaceList} from "../../workspace";
import {addToModals} from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
`;

const WorkspaceNavigationMenuBodyPanel = (props) => {

    const {className = ""} = props;
    const dispatch = useDispatch();

    const workspaces = useSelector(state => state.workspaces.workspaces);
    const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);

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
            dispatch(getWorkspaceTopics({is_external: 0}));
        } else {
            if (activeTopic && props.match.url === "/workspace/dashboard") {
                let path = `/workspace/${activeTopic.is_external === 0 ? 'internal' : 'external'}/`;
                if (activeTopic.workspace_id !== undefined) {
                    path += `${activeTopic.workspace_name}/${activeTopic.workspace_id}/${activeTopic.name}/${activeTopic.id}/dashboard`;
                } else {
                    path += `${activeTopic.name}/${activeTopic.id}/dashboard`;
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

    return (
        <>
            <Wrapper className={`navigation-menu-body ${className}`}>
                <div className="" styles="overflow: hidden; outline: currentcolor none medium;"
                     tabIndex="3">
                    <h4>Workspaces</h4>

                    <ul className="nav nav-tabs" id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <span className="nav-link active" id="pills-home-tab"
                                  data-toggle="pill" role="tab" aria-controls="pills-home"
                                  aria-selected="true">Intern</span></li>
                        <li className="nav-item">
                            <span className="nav-link" id="pills-contact-tab" data-toggle="pill"
                                  role="tab" aria-controls="pills-contact"
                                  aria-selected="false">Extern</span></li>
                    </ul>
                    <div className="navigation-menu-group">
                        <div id="elements" className="open">
                            <ul>
                                <li className="navigation-divider" onClick={handleShowFolderModal}>
                                    <SvgIconFeather icon="plus"/> New folder
                                </li>
                                <li className="navigation-divider">
                                    <SvgIconFeather icon="plus"/> New workspace
                                </li>
                                {
                                    Object.values(workspaces).map(ws => {
                                        return <WorkspaceList key={ws.id} workspace={ws}/>
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