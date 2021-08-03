import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = (props) => {
  const { className = "", active = null, isSub = false, ...otherProps } = props;
  const location = useLocation();

  let activeClass = active === true ? "active" : "";

  if (active === null) {
    if (activeClass === "" && location.pathname.indexOf(props.to) === 0) {
      activeClass = "active";
    } else if (!isSub && props.to.indexOf(`/${location.pathname.split("/")[1]}`) === 0) {
      activeClass = "active";
    } else {
      activeClass = location.pathname === props.to ? "active" : "";
    }
  }

  return (
    <Link {...otherProps} className={`${className} ${activeClass}`}>
      {props.children}
    </Link>
  );
};

export default NavLink;
