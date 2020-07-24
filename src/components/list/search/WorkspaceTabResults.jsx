import React from "react";
import { WorkspaceSearchItem } from "./index";

const WorkspaceTabResults = (props) => {

    const { workspaces } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(workspaces).map((w) => {
                    return <WorkspaceSearchItem key={w.id} data={w.data}/>
                })
            }
        </ul>
    );
};

export default WorkspaceTabResults;