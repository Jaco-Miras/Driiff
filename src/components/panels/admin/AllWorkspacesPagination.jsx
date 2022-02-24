import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { updateAllWorkspacesPage, getAllWorkspaces } from "../../../redux/actions/adminActions";

const AllWorkspacesPagination = (props) => {
  const dispatch = useDispatch();
  const allWorkspaces = useSelector((state) => state.admin.allWorkspaces);
  const allWorkspacesLastPage = useSelector((state) => state.admin.allWorkspacesLastPage);
  const handleSetPage = (e) => {
    let p = e.selected + 1;
    dispatch(updateAllWorkspacesPage({ page: p }));
    if (!allWorkspaces.hasOwnProperty(p)) {
      const payload = {
        page: p,
        limit: 25,
      };
      dispatch(getAllWorkspaces(payload));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(updateAllWorkspacesPage({ page: 1 }));
    };
  }, []);

  return (
    <div className="mt-3">
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me page-item"}
        breakLinkClassName={"page-link"}
        pageCount={allWorkspacesLastPage}
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
    </div>
  );
};

export default AllWorkspacesPagination;
