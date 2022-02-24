import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { NavLink, SvgIconFeather } from "../../common";
import { QuickLinks } from "../../list/links";
//import { Badge } from "reactstrap";
//import christmas from "../../../assets/img/christmas.png";

const Wrapper = styled.div`
  .badge {
    padding: 4px 8px;
    font-size: 9px;
  }
`;

const NavInputContainer = styled.div`
  display: flex;
  color: #fff;
  height: 40px;
  justify-content: flex-start;
  align-items: center;
  margin: 0 15px 10px 15px;
  border-radius: 8px;
  width: 100%;

  &.active {
    background: #ffffff14;
  }
  div {
    display: inline-block;
    position: relative;
  }
  input {
    width: calc(100% - 75px);
    background-color: #fff;
    border: none;
    color: #000;
    border-radius: 6px;
    padding-left: 6px;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  margin: 0 8px 0 15px;
`;

const NavIconContainer = styled(NavLink)`
  display: flex;
  height: 40px;
  justify-content: flex-start;
  align-items: center;
  margin: 0 15px;
  border-radius: 8px;
  &.active {
    background: ${({ theme }) => theme.colors.primary};
  }
  div {
    display: inline-block;
    position: relative;
  }
`;

const Hat = styled.div`
  position: absolute !important;
  z-index: 20;
  transform: rotate(-41deg) scaleX(-1);
  left: 1px;
  top: -6px;
  img {
    width: 26px;
  }
`;

const MainSidebarLinks = (props) => {
  const { dictionary, isExternal, driffSettings, user, updateCompanyName } = props;

  const params = useParams();
  const location = useLocation();
  const lastVisitedChannel = useSelector((state) => state.chat.lastVisitedChannel);
  //const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const [companyName, setCompanyName] = useState(driffSettings.company_name);
  const [editCompany, setEditCompany] = useState(false);

  const companyNameRef = useRef(null);

  useEffect(() => {
    if (companyNameRef.current) {
      companyNameRef.current.select();
    }
  }, [editCompany]);

  const closeLeftNav = () => {
    document.body.classList.remove("navigation-show");
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const toggleEditCompany = () => {
    setEditCompany((prevState) => {
      let newState = !prevState;

      if (!newState && driffSettings.company_name !== companyName)
        updateCompanyName({
          company_name: companyName,
        });

      return newState;
    });
  };

  const handleCompanyNameKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: {
        toggleEditCompany();
        break;
      }
      case 27: {
        toggleEditCompany();
        break;
      }
      default:
        return;
    }
  };

  // const unreadCount = Object.keys(unreadCounter)
  //   .filter((k) => k !== "chat_reminder_message")
  //   .reduce((total, k) => {
  //     total += unreadCounter[k];
  //     return total;
  //   }, 0);

  return (
    <Wrapper className="flex navigation-menu-tab-header-options">
      <ul>
        {!isExternal && (
          <li onClick={closeLeftNav} className={`driff-company-name ${editCompany ? "active" : ""}`}>
            {editCompany ? (
              <NavInputContainer className="active">
                <NavIcon icon={"home"} />

                <input ref={companyNameRef} defaultValue={driffSettings.company_name} onChange={handleCompanyNameChange} onKeyDown={handleCompanyNameKeyDown} name="company-name" autoFocus={true} />
              </NavInputContainer>
            ) : (
              <NavIconContainer active={["dashboard", "posts", "chat", "files", "people"].includes(params.page)} to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ? `/chat/${lastVisitedChannel.code}` : "/chat"}>
                <div style={{ postion: "relative" }}>
                  <NavIcon icon={"home"} />
                  {/* <Hat>
                    <img src={christmas} alt="christmas hat" />
                  </Hat> */}
                </div>

                {driffSettings.company_name}
                {/* {unreadCount > 0 && <Badge className={"badge badge-primary badge-pill ml-1"}>{unreadCount > 99 ? "99+" : unreadCount}</Badge>} */}
              </NavIconContainer>
            )}
            {user.role && user.role.id <= 2 && <>{editCompany ? <SvgIconFeather className="action" onClick={toggleEditCompany} icon="save" /> : <SvgIconFeather className="action" onClick={toggleEditCompany} icon="pencil" />}</>}
          </li>
        )}
        {/* <li>
          <NavIconContainer to={"/todos"} active={["/todos"].includes(location.pathname)}>
            <NavIcon icon={"calendar"} />
            <div>{dictionary.todoLinks}</div>
          </NavIconContainer>
        </li> */}
        <li onClick={closeLeftNav}>
          <NavIconContainer to={"/workspace/search"} active={["/workspace/search"].includes(location.pathname)}>
            <NavIcon icon={"compass"} />
            <div>{dictionary.allWorkspaces}</div>
          </NavIconContainer>
        </li>
        {user.type === "internal" && (
          <li onClick={closeLeftNav}>
            <NavIconContainer to={"/system/people"} active={["/system/people"].includes(location.pathname)}>
              <NavIcon icon={"user"} />
              <div>{dictionary.people}</div>
            </NavIconContainer>
          </li>
        )}

        {/* {user.type !== "external" ? <QuickLinks user={user} dictionary={dictionary} /> : null} */}
      </ul>
    </Wrapper>
  );
};

export default MainSidebarLinks;
