import React, { useEffect, useState } from "react";

const TimelinePagination = (props) => {

    const { actions, workspace, workspaceTimeline } = props;
    const { page, maxPage, timeline } = workspaceTimeline;

    const [pages, setPages] = useState([]);

    useEffect(() => {
        if (maxPage > 1) {
            setPages(
                Array.from(Array(maxPage), (_, i) => i + 1)
            );
        }
    }, [Object.keys(workspaceTimeline.timeline).length]);

    const loadMore = (skip = 0, limit = 10) => {
        actions.getTimeline({topic_id: workspace.id, skip: skip, limit: limit});
    };

    const handleSetPage = (p) => {
        if (p === page) return;
        actions.updateTimelinePage({id: workspace.id, page: p});
        
        if (workspaceTimeline.total_items === Object.keys(timeline).length) return;

        if (Object.keys(timeline).length <= (p*10)) {
            if ( ((p*10) - Object.keys(timeline).length) > 0) {
                loadMore(Object.keys(timeline).length, p*10);
            } else {
                loadMore(Object.keys(timeline).length, 10);
            }
        }
    };

    return (
        <nav className="mt-3">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 && "disabled"}`}>
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true" onClick={() => handleSetPage(page-1)}>
                    Previous
                </a>
                </li>
                {
                    pages.map((p) => {
                        return (
                            <li key={p} className={`page-item ${page === p && "active"}`}>
                                <a className="page-link" href="#" onClick={() => handleSetPage(p)}>
                                    {p}
                                </a>
                            </li>
                        )
                    })
                }
                <li className={`page-item ${page === maxPage && "disabled"}`}>
                <a className="page-link" href="#" onClick={() => handleSetPage(page+1)}>
                    Next
                </a>
                </li>
            </ul>
        </nav>
    );
};

export default TimelinePagination;