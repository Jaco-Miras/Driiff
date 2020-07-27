import React, { useEffect, useState } from "react";

const SearchPagination = (props) => {

    const { activeTab, tabs } = props;

    const [pages, setPages] = useState([]);
    
    useEffect(() => {
        if (activeTab && tabs[activeTab.toUpperCase()].maxPage > 1) {
            setPages(Array.from(Array(tabs[activeTab.toUpperCase()].maxPage), (_, i) => i + 1));
        }
    }, [activeTab]);
    
    if ((activeTab && tabs[activeTab.toUpperCase()].maxPage <= 1) || activeTab === null) return null;
    
    return (
        <nav className="mt-3">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${tabs[activeTab.toUpperCase()].page === 1 && "disabled"}`}>
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">
                    Previous
                </a>
                </li>
                {
                    pages.map((p) => {
                        return (
                            <li key={p} className={`page-item ${tabs[activeTab.toUpperCase()].page === p && "active"}`}>
                                <a className="page-link" href="#">
                                    {p}
                                </a>
                            </li>
                        )
                    })
                }
                <li className={`page-item ${tabs[activeTab.toUpperCase()].page === tabs[activeTab.toUpperCase()].maxPage && "disabled"}`}>
                <a className="page-link" href="#">
                    Next
                </a>
                </li>
            </ul>
        </nav>
    );
};

export default SearchPagination;