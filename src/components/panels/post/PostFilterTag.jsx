import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  a {
    cursor: pointer;
  }
`;
const PostFilterTag = (props) => {
  const { className = "", workspace, tag, count, onGoBack, dictionary } = props;

  const dispatch = useDispatch();

  const handleClickFilter = (e) => {
    let payload = {
      topic_id: workspace.id,
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
    dispatch(updateWorkspacePostFilterSort(payload));
    onGoBack();
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`list-group list-group-flush ${className}`}>
      <a className={`list-group-item d-flex align-items-center ${tag && tag === "is_must_reply" ? "active" : ""}`} data-value="is_must_reply" onClick={handleClickFilter}>
        <span className="text-warning fa fa-circle mr-2" />
        {dictionary.replyRequired}
        <span className="small ml-auto">{count && count.is_must_reply > 0 && count.is_must_reply}</span>
      </a>
      <a className={`list-group-item d-flex align-items-center ${tag && tag === "is_must_read" ? "active" : ""}`} data-value="is_must_read" onClick={handleClickFilter}>
        <span className="text-danger fa fa-circle mr-2" />
        {dictionary.mustRead}
        <span className="small ml-auto">{count && count.is_must_read > 0 && count.is_must_read}</span>
      </a>
      <a className={`list-group-item d-flex align-items-center ${tag && tag === "is_read_only" ? "active" : ""}`} data-value="is_read_only" onClick={handleClickFilter}>
        <span className="text-info fa fa-circle mr-2" />
        {dictionary.noReplies}
        <span className="small ml-auto">{count && count.is_read_only > 0 && count.is_read_only}</span>
      </a>
    </Wrapper>
  );
};

export default React.memo(PostFilterTag);
