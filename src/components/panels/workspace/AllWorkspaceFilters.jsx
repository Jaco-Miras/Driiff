import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Wrapper = styled.ul`
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
  li {
    cursor: pointer;
  }
`;

const AllWorkspaceFilters = (props) => {
  const { actions, counters, dictionary, filterBy } = props;

  const user = useSelector((state) => state.session.user);
  const isExternal = user.type === "external";

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
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "member" ? "active" : ""}`} data-value="member" onClick={handleClickFilter}>
        <span className="text-primary fa fa-circle mr-2" />
        {dictionary.labelJoined}
        <span className="small ml-auto">{counters.member > 0 && counters.member}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "favourites" ? "active" : ""}`} data-value="favourites" onClick={handleClickFilter}>
        <span className="text-warning fa fa-circle mr-2" />
        {dictionary.favourites}
        <span className="small ml-auto">{counters.favourites > 0 && counters.favourites}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "new" ? "active" : ""}`} data-value="new" onClick={handleClickFilter}>
        <span className="text-success fa fa-circle mr-2" />
        {dictionary.new}
        <span className="small ml-auto">{counters.new > 0 && counters.new}</span>
      </li>
      {!isExternal && (
        <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "nonMember" ? "active" : ""}`} data-value="nonMember" onClick={handleClickFilter}>
          <span className="text-danger fa fa-circle mr-2" />
          {dictionary.notJoined}
          <span className="small ml-auto">{counters.nonMember > 0 && counters.nonMember}</span>
        </li>
      )}
      {!isExternal && (
        <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "external" ? "active" : ""}`} data-value="external" onClick={handleClickFilter}>
          <span className="text-external fa fa-circle mr-2" />
          {dictionary.withClient}
          <span className="small ml-auto">{counters.external > 0 && counters.external}</span>
        </li>
      )}
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "private" ? "active" : ""}`} data-value="private" onClick={handleClickFilter}>
        <span className="text-info fa fa-circle mr-2" />
        {dictionary.private}
        <span className="small ml-auto">{counters.private > 0 && counters.private}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "archived" ? "active" : ""}`} data-value="archived" onClick={handleClickFilter}>
        <span className="text-light fa fa-circle mr-2" />
        {dictionary.archived}
        <span className="small ml-auto">{counters.archived > 0 && counters.archived}</span>
      </li>
    </Wrapper>
  );
};

export default AllWorkspaceFilters;
