import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import useQueryParams from "../../hooks/useQueryParams";

const Wrapper = styled.ul`
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
  li {
    cursor: pointer;
  }
  &.list-group .list-group-item.active {
    border-color: #eeebee;
    background-color: #fafafa !important;
    .dark & {
      background-color: #111417 !important;
    }
  }
  .text-external {
    color: ${(props) => props.theme.colors.fourth};
  }
`;

const AllWorkspaceFilters = (props) => {
  const { actions, counters, dictionary, filterBy } = props;

  const user = useSelector((state) => state.session.user);
  const isExternal = user.type === "external";
  const workspaces = useSelector((state) => state.workspaces.workspaces);

  const { removeParam } = useQueryParams();

  const handleClickFilter = (e) => {
    e.persist();
    removeParam("user-id");
    if (filterBy === e.target.dataset.value) return;
    actions.updateSearch({
      filterBy: e.target.dataset.value,
      filterByFolder: null,
    });

    //onGoBack();
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={"list-group list-group-flush"}>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "all" ? "active" : ""}`} data-value="all" onClick={handleClickFilter}>
        <span className="text-primary fa fa-circle mr-2" />
        {dictionary.all}
        <span className="small ml-auto">{counters.nonMember + counters.member > 0 && counters.nonMember + counters.member}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "shared" ? "active" : ""}`} data-value="shared" onClick={handleClickFilter}>
        <span className="text-external fa fa-circle mr-2" />
        {dictionary.sharedClient}
        <span className="small ml-auto">{Object.values(workspaces).filter((ws) => ws.sharedSlug).length}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "member" ? "active" : ""}`} data-value="member" onClick={handleClickFilter}>
        <span className="text-success fa fa-circle mr-2" />
        {dictionary.labelJoined}
        <span className="small ml-auto">{counters.member > 0 && counters.member}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "favourites" ? "active" : ""}`} data-value="favourites" onClick={handleClickFilter}>
        <span className="text-warning fa fa-circle mr-2" />
        {dictionary.favourites}
        <span className="small ml-auto">{counters.favourites > 0 && counters.favourites}</span>
      </li>
      <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "new" ? "active" : ""}`} data-value="new" onClick={handleClickFilter}>
        <span className="text-info fa fa-circle mr-2" />
        {dictionary.new}
        <span className="small ml-auto">{counters.new > 0 && counters.new}</span>
      </li>
      {!isExternal && (
        <li className={`list-group-item d-flex align-items-center ${filterBy && filterBy === "nonMember" ? "active" : ""}`} data-value="nonMember" onClick={handleClickFilter}>
          <span className="text-secondary fa fa-circle mr-2" />
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
        <span className="text-danger fa fa-circle mr-2" />
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
