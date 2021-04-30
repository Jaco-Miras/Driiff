import React from "react";
import styled from "styled-components";

const Wrapper = styled.ul`
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
  li {
    cursor: pointer;
  }
`;

const AllWorkspaceFilters = (props) => {
  const { actions, count, onGoBack, dictionary, filterBy } = props;

  const handleClickFilter = (e) => {
    e.persist();

    if (filterBy === e.target.dataset.value) {
      actions.updateSearch({
        filterBy: null,
      });
    } else {
      actions.updateSearch({
        filterBy: e.target.dataset.value,
      });
    }

    //onGoBack();
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={"list-group list-group-flush"}>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "new" ? "active" : ""}`} data-value="new" onClick={handleClickFilter}>
        <span className="text-success fa fa-circle mr-2" />
        {dictionary.new}
        <span className="small ml-auto">{count && count.new > 0 && count.new}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "nonMember" ? "active" : ""}`} data-value="nonMember" onClick={handleClickFilter}>
        <span className="text-danger fa fa-circle mr-2" />
        {dictionary.notJoined}
        <span className="small ml-auto">{count && count.not_joined > 0 && count.not_joined}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "external" ? "active" : ""}`} data-value="external" onClick={handleClickFilter}>
        <span className="text-warning fa fa-circle mr-2" />
        {dictionary.withClient}
        <span className="small ml-auto">{count && count.with_client > 0 && count.with_client}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "private" ? "active" : ""}`} data-value="private" onClick={handleClickFilter}>
        <span className="text-info fa fa-circle mr-2" />
        {dictionary.private}
        <span className="small ml-auto">{count && count.private > 0 && count.private}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "archived" ? "active" : ""}`} data-value="archived" onClick={handleClickFilter}>
        <span className="text-light fa fa-circle mr-2" />
        {dictionary.archived}
        <span className="small ml-auto">{count && count.archived > 0 && count.archived}</span>
      </li>
    </Wrapper>
  );
};

export default AllWorkspaceFilters;
