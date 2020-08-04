import React from "react";

const WorkspaceSearchItem = (props) => {

    const { data, redirect } = props;
    const { topic, workspace } = data;
    const handleRedirect = () => {
        let payload = {
            id: topic.id,
            name: topic.name,
            folder_id: workspace ? workspace.id : null,
            folder_name: workspace ? workspace.name : null
        }
        redirect.toWorkspace(payload)
    };
    return (
        <li className="list-group-item p-l-0 p-r-0">
            <h5 onClick={handleRedirect}>{topic.name}</h5>
            {/* <p className="text-muted">workspace description here</p> */}
        </li>
    );
};

export default WorkspaceSearchItem;