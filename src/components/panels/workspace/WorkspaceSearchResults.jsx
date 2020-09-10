import React from "react";
import { useSelector, useDispatch } from "react-redux";
import WorkspaceSearchResult from "./WorkspaceSearchResult";
import {useToaster} from "../../hooks";
import {updateWorkspace, leaveWorkspace} from "../../../redux/actions/workspaceActions";
import {putChannel} from "../../../redux/actions/chatActions";

const WorkspaceSearchResults = (props) => {

    const { actions, page, results, redirect, user } = props;

    const dispatch = useDispatch();
    const workspaces = useSelector((state) => state.workspaces.workspaces);

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

    const onLeaveWorkspace = (item) => {
        if (item.members.length === 1 && item.topic.is_locked) {
            let archivePayload = {
                id: item.channel.id,
                is_archived: true,
                is_muted: false,
                is_pinned: false,
            };
            dispatch(putChannel(archivePayload));
        } else {
            let payload = {
                name: item.topic.name,
                description: item.topic.description,
                topic_id: item.topic.id,
                is_external: 0,
                member_ids: item.members.map((m) => m.id),
                is_lock: item.topic.is_locked ? 1 : 0,
                workspace_id: item.workspace ? item.workspace.id : 0,
                new_member_ids: [],
                remove_member_ids: [user.id]
            };
            payload.system_message = `CHANNEL_UPDATE::${JSON.stringify({
                author: {
                    id: user.id,
                    name: user.name,
                    first_name: user.first_name,
                    partial_name: user.partial_name,
                    profile_image_link: user.profile_image_link,
                },
                title: "",
                added_members: [],
                removed_members: [user.id],
            })}`
        
            dispatch(leaveWorkspace({workspace_id: item.topic.id, channel_id: item.channel.id}));
            dispatch(updateWorkspace(payload));
        }
    };

    return (
        <div className="tab-content search-results" id="myTabContent">
            <div className={`tab-pane fade active show`} role="tabpanel">
                <ul className="list-group list-group-flush">
                    {
                        results.sort((a, b) => a.topic.name.localeCompare(b.topic.name)).slice(page > 1 ? (page*25)-25 : 0, page*25).map((item) => {
                            return <WorkspaceSearchResult key={item.topic.id} onJoinWorkspace={onJoinWorkspace} onLeaveWorkspace={onLeaveWorkspace} item={item} redirect={redirect} workspaces={workspaces}/>
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default WorkspaceSearchResults;