import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { impersonationLists } from "../../../../redux/actions/userAction";
import { Avatar } from "../../../common";
const SKIP_LIMIT = 15;
const LogList = () => {
  const dispatch = useDispatch();
  const { loading, logs } = useSelector((state) => state.users.impersonation);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(impersonationLists({ page, limit: SKIP_LIMIT }));
  }, [page]);

  return (
    <>
      <div class="list-group list-group-flush">
        {logs.data.map((log) => (
          <a href="#" className="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Avatar name={log.userAs.name} onClick={() => {}} />
              <span> as </span>
              <Avatar name={log.user.name} onClick={() => {}} />
            </div>
          </a>
        ))}
      </div>
      {logs.hasNext && (
        <div className="d-flex justify-content-center">
          <button disabled={loading} className="btn btn-primary mt-3 text-center" onClick={() => setPage((prev) => prev + 1)}>
            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default LogList;
