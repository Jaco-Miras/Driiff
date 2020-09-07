import React from "react";
import { useSelector } from "react-redux";
import WorkspaceSearchResult from "./WorkspaceSearchResult";
import {useToaster} from "../../hooks";

const WorkspaceSearchResults = (props) => {

    const { actions, page, results, redirect } = props;

    const workspaces = useSelector((state) => state.workspaces.workspaces);
    const user = useSelector((state) => state.session.user);

    const toaster = useToaster();

    const onJoinWorkspace = (item) => {
        let payload = {
            channel_id: item.topic.channel_id,
            recipient_ids: [user.id],
        };
        let cb = (err, res) => {
            if (err) return;
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
                        results.slice(page > 1 ? (page*25)-25 : 0, page*25).map((item) => {
                            return <WorkspaceSearchResult onJoinWorkspace={onJoinWorkspace} item={item} redirect={redirect} workspaces={workspaces}/>
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default WorkspaceSearchResults;