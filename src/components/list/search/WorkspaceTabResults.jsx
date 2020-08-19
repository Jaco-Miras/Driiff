import React from "react";
import { WorkspaceSearchItem } from "./index";
import { useSelector } from "react-redux";

const WorkspaceTabResults = (props) => {

    const { page, workspaces, redirect } = props;

    const ws = useSelector(state => state.workspaces.workspaces);

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(workspaces).slice(page > 1 ? (page*10)-10 : 0, page*10).map((w) => {
                    return <WorkspaceSearchItem key={w.id} data={w.data} redirect={redirect} workspaces={ws}/>
                })
            }
        </ul>
    );
};

export default WorkspaceTabResults;