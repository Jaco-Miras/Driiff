import React from "react";

const WorkspaceSearchItem = (props) => {

    const { data } = props;
    const { topic, workspace } = data;

    return (
        <li className="list-group-item p-l-0 p-r-0">
            <h5>{topic.name}</h5>
            <p className="text-muted">workspace description here</p>
        </li>
    );
};

export default WorkspaceSearchItem;