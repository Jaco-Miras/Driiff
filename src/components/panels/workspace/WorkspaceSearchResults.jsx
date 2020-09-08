import React from "react";
import { useSelector } from "react-redux";
import WorkspaceSearchResult from "./WorkspaceSearchResult";
import {useToaster} from "../../hooks";

const WorkspaceSearchResults = (props) => {

    const { actions, page, results, redirect } = props;

    const workspaces = useSelector((state) => state.workspaces.workspaces);
    const user = useSelector((state) => state.session.user);

    const toaster = useToaster();

    const handleRedirect = (item) => {
        let payload = {
            id: item.topic.id,
            name: item.topic.name,
            folder_id: item.workspace ? item.workspace.id : null,
            folder_name: item.workspace ? item.workspace.name : null
        }
        if (workspaces.hasOwnProperty(item.topic.id)) {
            console.log('to workspace', item);
            redirect.toWorkspace(payload);
        } else {
            console.log('fetch workspace', item);
            redirect.fetchWorkspaceAndRedirect(payload);
        }
    };

    const onJoinWorkspace = (item) => {
        let payload = {
            channel_id: item.channel.id,
            recipient_ids: [user.id],
        };
        let cb = (err, res) => {
            if (err) return;
            handleRedirect(item);
            toaster.success(
                <>
                You have joined <b>#{item.topic.name}</b>
                </>
            );
        };
        actions.join(payload, cb);
    };
    
    return (
        <div className="tab-content search-results" id="myTabContent">
            <div className={`tab-pane fade active show`} role="tabpanel">
                <ul className="list-group list-group-flush">
                    {
                        results.sort((a, b) => a.topic.name.localeCompare(b.topic.name)).slice(page > 1 ? (page*25)-25 : 0, page*25).map((item) => {
                            return <WorkspaceSearchResult key={item.topic.id} onJoinWorkspace={onJoinWorkspace} item={item} redirect={redirect} workspaces={workspaces}/>
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default WorkspaceSearchResults;