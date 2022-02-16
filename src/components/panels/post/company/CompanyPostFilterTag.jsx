import React from "react";
import styled from "styled-components";
import { usePostActions } from "../../../hooks";

const Wrapper = styled.div`
  span.list-group-item {
    cursor: pointer;
  }
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
`;

const CompanyPostFilterTag = (props) => {
  const { className = "", tag, count, onGoBack, dictionary } = props;

  const { setCompanyFilterPosts } = usePostActions();

  const handleClickFilter = (e) => {
    e.persist();

    let payload = {
      tag: e.target.dataset.value,
      filter: null,
    };
    if (tag === e.target.dataset.value) {
      payload = {
        ...payload,
        tag: null,
        filter: "all",
      };
    }
    setCompanyFilterPosts(payload);
    onGoBack();
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`list-group list-group-flush ${className}`}>
      <span className={`list-group-item d-flex align-items-center ${tag && tag === "is_must_reply" ? "active" : ""}`} data-value="is_must_reply" onClick={handleClickFilter}>
        <span className="text-warning fa fa-circle mr-2" />
        {dictionary.replyRequired}
        <span className="small ml-auto">{count && count.is_must_reply > 0 && count.is_must_reply}</span>
      </span>
      <span className={`list-group-item d-flex align-items-center ${tag && tag === "is_must_read" ? "active" : ""}`} data-value="is_must_read" onClick={handleClickFilter}>
        <span className="text-danger fa fa-circle mr-2" />
        {dictionary.mustRead}
        <span className="small ml-auto">{count && count.is_must_read > 0 && count.is_must_read}</span>
      </span>
      <span className={`list-group-item d-flex align-items-center ${tag && tag === "is_read_only" ? "active" : ""}`} data-value="is_read_only" onClick={handleClickFilter}>
        <span className="text-info fa fa-circle mr-2" />
        {dictionary.noReplies}
        <span className="small ml-auto">{count && count.is_read_only > 0 && count.is_read_only}</span>
      </span>
      <span className={`list-group-item d-flex align-items-center ${tag && tag === "is_close" ? "active" : ""}`} data-value="is_close" onClick={handleClickFilter}>
        <span className="text-closed fa fa-circle mr-2" />
        {dictionary.closed}
        <span className="small ml-auto">{count && count.is_close > 0 && count.is_close}</span>
      </span>
    </Wrapper>
  );
};

export default React.memo(CompanyPostFilterTag);
