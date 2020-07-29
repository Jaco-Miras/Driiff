import React, { useEffect, useState } from "react";

const SearchPagination = (props) => {

    const { actions, activeTab, tabs, value } = props;

    const [pages, setPages] = useState([]);
    const [fetching, setFetching] = useState(false);

    const handleSetPage = (p) => {
        let items = tabs[activeTab.toUpperCase()].items.slice(p > 1 ? (p*10)-10 : 0, p*10);
        let count = tabs[activeTab.toUpperCase()].count;
        if (items.length !== 10) {
            loadResults(count, p*10);
        } 
        let payload = {
            ...tabs[activeTab.toUpperCase()],
            page: p,
            key: activeTab.toUpperCase()
        };
        actions.updateTabPage(payload);
    };

    const loadResults = (skip, limit) => {
        setFetching(true);
        actions.search({
            search: value,
            skip: skip,
            limit: limit,
            tag: activeTab
        }, (err, res) => {
            setFetching(false);
        });
      };
    
    useEffect(() => {
        if (activeTab && tabs[activeTab.toUpperCase()].maxPage > 1) {
            setPages(Array.from(Array(tabs[activeTab.toUpperCase()].maxPage), (_, i) => i + 1));
        }
    }, [activeTab]);
    

    useEffect(() => {
        if (activeTab && !fetching) {
            let page = tabs[activeTab.toUpperCase()].page;
            let count = tabs[activeTab.toUpperCase()].count;
            if (page === 1 && count < 10 && tabs[activeTab.toUpperCase()].total_count > 10) {
                loadResults(count, 10);
            }
        }
    }, [tabs, activeTab, fetching]);
    
    if ((activeTab && tabs[activeTab.toUpperCase()].maxPage <= 1) || activeTab === null) return null;
    
    return (
        <nav className="mt-3">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${tabs[activeTab.toUpperCase()].page === 1 && "disabled"}`}>
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true" onClick={() => handleSetPage(tabs[activeTab.toUpperCase()].page-1)}>
                    Previous
                </a>
                </li>
                {
                    pages.map((p) => {
                        return (
                            <li key={p} className={`page-item ${tabs[activeTab.toUpperCase()].page === p && "active"}`}>
                                <a className="page-link" href="#" onClick={() => handleSetPage(p)}>
                                    {p}
                                </a>
                            </li>
                        )
                    })
                }
                <li className={`page-item ${tabs[activeTab.toUpperCase()].page === tabs[activeTab.toUpperCase()].maxPage && "disabled"}`}>
                <a className="page-link" href="#" onClick={() => handleSetPage(tabs[activeTab.toUpperCase()].page+1)}>
                    Next
                </a>
                </li>
            </ul>
        </nav>
    );
};

export default SearchPagination;