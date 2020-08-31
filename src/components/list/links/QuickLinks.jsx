import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {LinkItem} from "./index";

const Wrapper = styled.li`
  cursor: pointer;
  cursor: hand;
  position: relative;
  transition: all 0.3s ease;
  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};
    height: 40px;
    display: flex;
    color: #fff;
    height: 40px;
    justify-content: flex-start;
    align-items: center;
    margin: 0 15px;
    border-radius: 8px 8px 0 0;
  }
  .sub-menu-arrow {
    margin-right: 10px;
  }
  .feather-pencil {
    display: none;
  }
  :hover {
    .sub-menu-arrow {
      margin-left: ${(props) => props.showEditIcon ? "10px" : "auto"};
    }
    .feather-pencil {
      display: ${(props) => props.showEditIcon ? "block" : "none"};
    }
  }
`;

const LinkNav = styled.ul`
  overflow: hidden;
  transition: all 0.3s ease;
  display: block !important;
  margin: 0 15px !important;
  border-radius: 0 0 8px 8px;

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px !important;
  }
  &.leave-active {
    max-height: 0;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  cursor: hand;
  margin: 0 8px 0 15px;
`;

const EditIcon = styled(SvgIconFeather)`
  height: 12px !important;
  width: 12px !important;
  cursor: pointer;
  margin-left: auto;
  color: #fff8;
`;

const QuickLinks = (props) => {
  const {className = "", links, user, dictionary} = props;

  const ref = {
    container: useRef(),
    arrow: useRef(),
    nav: useRef(),
  };

  const [showLinks, setShowLinks] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);

  const handleShowLinks = (e) => {
    e.preventDefault();
    setShowLinks((prevState) => !prevState);
  };

  useEffect(() => {
    if (ref.nav.current !== null) {
      let maxHeight = window.innerHeight * 5;
      maxHeight = maxHeight < ref.nav.current.offsetHeight ? ref.nav.current.offsetHeight : maxHeight;
      setMaxHeight(maxHeight);
    }
  }, [ref.nav, maxHeight]);

  const handleEditLinks = () => {
    window.open(`${process.env.REACT_APP_apiProtocol}${localStorage.getItem("slug")}.driff.io/admin/quick-links`, "_blank");
  };


  return (

    <Wrapper ref={ref.container} className={`fadeIn ${className} ${showLinks && "folder-open"}`} selected={showLinks}
             showEditIcon={user && (user.role.name === "admin" || user.role.name === "owner")}>

      <a href="/" onClick={handleShowLinks}>
        <NavIcon icon="link"/>
        <div>{dictionary.shortcuts}</div>
        {user && (user.role.name === "admin" || user.role.name === "owner") &&
        <EditIcon icon="pencil" onClick={handleEditLinks}/>}
        <i ref={ref.arrow} className={`sub-menu-arrow ti-angle-up ${showLinks ? "ti-minus rotate-in" : "ti-plus"}`}/>
      </a>

      <LinkNav ref={ref.nav} maxHeight={maxHeight} className={showLinks ? "enter-active" : "leave-active"}>
        {
          links.map((link) => {
            return <LinkItem key={link.id} link={link}/>;
          })
        }
      </LinkNav>
    </Wrapper>
  );
};

export default QuickLinks;
