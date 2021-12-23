import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const SearchPagination = (props) => {
  const { actions, activeTab, tabs, value } = props;

  const [fetching, setFetching] = useState(false);

  const handleSetPage = (e) => {
    let p = e.selected + 1;
    let items = tabs[activeTab.toUpperCase()].items.slice(p > 1 ? p * 10 - 10 : 0, p * 10);
    let count = tabs[activeTab.toUpperCase()].count;
    if (items.length !== 10) {
      loadResults(count, p * 10);
    }
    let payload = {
      ...tabs[activeTab.toUpperCase()],
      page: p,
      key: activeTab.toUpperCase(),
    };
    actions.updateTabPage(payload);
  };

  const loadResults = (skip, limit) => {
    let tab = activeTab;
    if (activeTab === "workspace") {
      tab = "topic";
    } else if (activeTab === "people") {
      tab = "user";
    }
    setFetching(true);
    actions.search(
      {
        search: value,
        skip: skip,
        limit: limit,
        tag: tab,
      },
      (err, res) => {
        setFetching(false);
      }
    );
  };

  useEffect(() => {
    if (activeTab && !fetching) {
      let page = tabs[activeTab.toUpperCase()].page;
      let count = tabs[activeTab.toUpperCase()].count;
      if ((page === 1 && count < 10 && tabs[activeTab.toUpperCase()].total_count > 10) || (page === 1 && count === 0)) {
        loadResults(count, 10);
      }
    }
  }, [tabs, activeTab, fetching]);

  if ((activeTab && tabs[activeTab.toUpperCase()].maxPage <= 1) || activeTab === null) return null;
  let page = tabs[activeTab.toUpperCase()].page;
  let maxPage = tabs[activeTab.toUpperCase()].maxPage;
  return (
    <nav className="mt-3">
      <ReactPaginate
        forcePage={page - 1}
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me page-item"}
        breakLinkClassName={"page-link"}
        pageCount={maxPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handleSetPage}
        containerClassName={"pagination justify-content-center"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
      />
    </nav>
  );
};

export default SearchPagination;
