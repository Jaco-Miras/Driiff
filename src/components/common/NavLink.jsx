import React from "react";
import {Link, useLocation} from "react-router-dom";

const NavLink = (props) => {

    const {className = "", isSub = false, ...otherProps} = props;
    const location = useLocation();

    let activeClass = location.pathname === props.to ? "active" : "";

    //if url is
    if (activeClass === "" && location.pathname.indexOf(props.to) === 0) {
        activeClass = "active";
    } else if (!isSub && props.to.indexOf(`/${location.pathname.split("/")[1]}`) === 0) {
        activeClass = "active";
    }

    return (
        <Link {...otherProps} className={`${className} ${activeClass}`}>
            {props.children}
        </Link>
    );

};

export default React.memo(NavLink);