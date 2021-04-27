import React from "react";
import ReactPaginate from "react-paginate";

const TimelinePagination = (props) => {
  const { actions, workspace, workspaceTimeline } = props;
  const { page, maxPage, timeline } = workspaceTimeline;

  //   const [pages, setPages] = useState([]);

  //   useEffect(() => {
  //     if (maxPage > 1) {
  //       setPages(Array.from(Array(maxPage), (_, i) => i + 1));
  //     }
  //   }, [Object.keys(workspaceTimeline.timeline).length]);

  const loadMore = (skip = 0, limit = 10) => {
    actions.getTimeline({ topic_id: workspace.id, skip: skip, limit: limit });
  };

  const handleSetPage = (e) => {
    let selectedPage = e.selected + 1;
    if (selectedPage === page) return;
    actions.updateTimelinePage({ id: workspace.id, page: selectedPage });

    if (workspaceTimeline.total_items === Object.keys(timeline).length) return;

    if (Object.keys(timeline).length <= selectedPage * 10) {
      if (selectedPage * 10 - Object.keys(timeline).length > 0) {
        loadMore(Object.keys(timeline).length, selectedPage * 10);
      } else {
        loadMore(Object.keys(timeline).length, 10);
      }
    }
  };

  return (
    <nav className="mt-3">
      <ReactPaginate
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

export default TimelinePagination;
