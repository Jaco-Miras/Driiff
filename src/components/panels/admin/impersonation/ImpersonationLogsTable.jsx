import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { impersonationLists } from "../../../../redux/actions/userAction";
import { useTimeFormat, useTranslationActions } from "../../../hooks";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../../../helpers/stringFormatter";

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
`;

const UserLink = styled.span`
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const ImpersonationLogsTable = ({ itemsPerPage }) => {
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();
  const { loading, logs } = useSelector((state) => state.users.impersonation);
  const [page, setPage] = useState(1);
  const { localizeDate, localizeTime, timeDiff } = useTimeFormat();
  const history = useHistory();

  const dictionary = {
    tableColumnDate: _t("ADMIN.TABLE_COLUMN_DATE", "Date"),
    tableColumnIP: _t("ADMIN.TABLE_COLUMN_IP", "IP"),
    tableColumnImpersonatedAs: _t("ADMIN.TABLE_COLUMN_IMPERSONATED_AS", "Impersonated As"),
    tableColumnImpersonator: _t("ADMIN.TABLE_COLUMN_IMPERSONATOR_AS", "Impersonated By"),
    tableColumnDuration: _t("ADMIN.TABLE_COLUMN_DURATION", "Duration"),
    tablePaginationNextLabel: _t("ADMIN.TABLE_PAGINATION_NEXT_LABEL", "Next"),
    tablePaginationPrevLabel: _t("ADMIN.TABLE_PAGINATION_PREV_LABEL", "Previous"),
  };

  useEffect(() => {
    dispatch(impersonationLists({ page, limit: itemsPerPage }));
  }, [page, itemsPerPage]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  const conputeDuration = (log) => {
    let diff = 0;
    if (log.logout_at && log.logout_at.timestamp) {
      diff = timeDiff(log.logout_at.timestamp, log.login_at.timestamp);
    } else {
      return 0;
    }

    return diff;
  };

  const handleUserCLick = (user) => {
    const url = `${window.location.origin}/profile/${user.id}/${replaceChar(user.name)}`;
    window.open(url);
  };

  return (
    <>
      <div class="table-responsive px-3">
        <table class="table table-bordered position-relative" style={{ minHeight: 100 }}>
          {loading && (
            <LoadingContainer>
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </LoadingContainer>
          )}
          <thead>
            <tr>
              <th>{dictionary.tableColumnDate}</th>
              <th>{dictionary.tableColumnIP}</th>
              <th>{dictionary.tableColumnImpersonator}</th>
              <th>{dictionary.tableColumnImpersonatedAs}</th>
              <th>{dictionary.tableColumnDuration}</th>
            </tr>
          </thead>
          <tbody>
            {logs.data.map((log) => {
              return (
                <tr>
                  <th scope="row">{localizeDate(log.login_at ? log.login_at.timestamp : 0)}</th>
                  <td>{log.ip_address}</td>
                  <td>
                    <UserLink role="button" onClick={() => handleUserCLick(log.user)}>
                      {log.user.name}
                    </UserLink>
                  </td>
                  <td>
                    <UserLink role="button" onClick={() => handleUserCLick(log.userAs)}>
                      {log.userAs.name}
                    </UserLink>
                  </td>
                  <td>{conputeDuration(log)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel={dictionary.tablePaginationNextLabel}
        previousLabel={dictionary.tablePaginationPrevLabel}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={logs.lastPage}
        marginPagesDisplayed={2}
        renderOnZeroPageCount={null}
        breakClassName={"break-me page-item"}
        breakLinkClassName={"page-link"}
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
    </>
  );
};

export default ImpersonationLogsTable;
