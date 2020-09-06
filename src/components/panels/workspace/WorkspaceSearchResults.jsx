import React from "react";
import { useSelector } from "react-redux";
import WorkspaceSearchResult from "./WorkspaceSearchResult";

const WorkspaceSearchResults = (props) => {

    const { page, results, redirect } = props;

    const workspaces = useSelector((state) => state.workspaces.workspaces);
    
    return (
        <div className="tab-content search-results" id="myTabContent">
            <div className={`tab-pane fade active show`} role="tabpanel">
                <ul className="list-group list-group-flush">
                    {
                        results.slice(page > 1 ? (page*25)-25 : 0, page*25).map((item) => {
                            return <WorkspaceSearchResult item={item} redirect={redirect} workspaces={workspaces}/>
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default WorkspaceSearchResults;