import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {DashboardNavigationTabPanel} from "../index";
import DashboardNavigationMenuBodyPanel from "./DashboardNavigationMenuBodyPanel";

const Wrapper = styled.div`
    ${props => {
    switch (props.navMode) {
        case 0:
            return `display: none`;
        case 1:
            return `width: auto;`;
        default:
            return ``;
    }
}}  
`;

const DashboardNavigationPanel = (props) => {

    const {className = ""} = props;

    const navMode = useSelector(state => state.settings.navMode);

    return (
        <Wrapper className={`navigation ${className}`} navMode={navMode}>

            <DashboardNavigationTabPanel/>

            <DashboardNavigationMenuBodyPanel/>

            <div id="ascrail2002" className="nicescroll-rails nicescroll-rails-vr"
                 styles="width: 8px; z-index: 4; cursor: default; position: absolute; top: 0px; left: 112px; height: 378.3px; display: none; opacity: 0;">
                <div
                    styles="position: relative; top: 0px; float: right; width: 6px; height: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                    className="nicescroll-cursors"></div>
            </div>
            <div id="ascrail2002-hr" className="nicescroll-rails nicescroll-rails-hr"
                 styles="height: 8px; z-index: 4; top: 370.3px; left: 0px; position: absolute; cursor: default; display: none; opacity: 0;">
                <div
                    styles="position: absolute; top: 0px; height: 6px; width: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px; left: 0px;"
                    className="nicescroll-cursors"></div>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardNavigationPanel);