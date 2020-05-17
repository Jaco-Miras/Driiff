import React from "react";
import {Link, useLocation} from "react-router-dom";

const NavLink = (props) => {

    const {className = ""} = props;
    const location = useLocation();

    let activeClass = location.pathname === props.to ? "active" : "";

    //if url is
    if (activeClass === "" && location.pathname.indexOf(props.to) === 0) {
        activeClass = "active";
    } else if(props.to.indexOf(`/${location.pathname.split("/")[1]}`) === 0) {
        activeClass = "active";
    }

    return (
        <Link {...props} className={`${className} ${activeClass}`}>
            {props.children}
        </Link>
    );

};

export default React.memo(NavLink);