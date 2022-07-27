import React from "react";
import styled from "styled-components";
import { NavLink } from "../../common";
import { useLocation } from "react-router-dom";
import { useTranslationActions, useUsers } from "../../hooks";

const Wrapper = styled.div``;

const Navbar = styled.ul`
  display: flex;
  width: 100%;
  margin-left: -15px;
  li {
    display: inline-block;
    text-align: center;
    margin-right: 1.5rem;
    &:last-child {
      display: inline-flex !important;
      justify-content: flex-end;
    }
    a {
      white-space: nowrap;
    }
  }
  li:first-child {
    margin-left: 15px;
    @media all and (max-width: 700px) {
      margin-left: 0;
    }
  }
`;

const MainNavLink = styled(NavLink)`
  color: #828282;
  // margin: 0 1rem;
  transition: color 200ms ease 0ms;
  font-weight: 500;
  border-radius: 0;
  display: flex;
  height: 27px;
  position: relative;
  font-size: 13px;
  white-space: nowrap;
  &.active {
    color: #363636;
    .dark & {
      color: #fff;
    }
    &:after {
      content: "";
      height: 2px;
      width: 100%;
      bottom: 0;
      left: 0;
      background: ${(props) => props.theme.colors.primary};
      position: absolute;
    }
  }
  .badge {
    font-size: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 7px;
    height: 7px;
    background: ${(props) => props.theme.colors.primary};
    top: 0;
    right: -13px;
  }
  @media all and (max-width: 700px) {
    margin: 0;
  }
`;

const AllPeoplePageHeader = (props) => {
  const { className = "" } = props;

  const location = useLocation();

  const { _t } = useTranslationActions();
  const { acceptedActiveUser } = useUsers();

  const dictionary = {
    people: _t("ALL_PEOPLE_PAGE_HEADER_LINKS.PEOPLE", "People"),
    teams: _t("ALL_PEOPLE_PAGE_HEADER_LINKS.TEAMS", "Teams"),
    organization: _t("ALL_PEOPLE_PAGE_HEADER_LINKS.ORGANIZATION", "Organization chart"),
  };

  return (
    <>
      <Wrapper className={`${className}`}>
        <Navbar className="navbar-nav">
          <li className="nav-item">
            <MainNavLink to="/system/people/all" active={location.pathname === "/system/people/all"}>
              {dictionary.people} ({Object.keys(acceptedActiveUser).length})
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/system/people/teams" active={location.pathname.startsWith("/system/people/teams")}>
              {dictionary.teams}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/system/people/organization" active={location.pathname === "/system/people/organization"}>
              {dictionary.organization}
            </MainNavLink>
          </li>
        </Navbar>
      </Wrapper>
    </>
  );
};

export default React.memo(AllPeoplePageHeader);
