import React from "react";
import { WorkspaceSearchItem } from "./index";

const WorkspaceTabResults = (props) => {

    const { page, workspaces, redirect } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(workspaces).slice(page > 1 ? (page*10)-10 : 0, page*10).map((w) => {
                    return <WorkspaceSearchItem key={w.id} data={w.data} redirect={redirect}/>
                })
            }
        </ul>
    );
};

export default WorkspaceTabResults;