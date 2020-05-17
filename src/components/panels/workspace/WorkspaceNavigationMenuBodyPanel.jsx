import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common/SvgIcon";

const Wrapper = styled.div`
`;

const WorkspaceNavigationMenuBodyPanel = (props) => {

    const {className = ""} = props;

    return (
        <>
            <Wrapper className={`navigation-menu-body ${className}`}>
                <div className="" styles="overflow: hidden; outline: currentcolor none medium;"
                     tabIndex="3">
                    <h4>Workspaces</h4>

                    <ul className="nav nav-tabs" id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <span className="nav-link active" id="pills-home-tab"
                                  data-toggle="pill" role="tab" aria-controls="pills-home"
                                  aria-selected="true">Intern</span></li>
                        <li className="nav-item">
                            <span className="nav-link" id="pills-contact-tab" data-toggle="pill"
                                  role="tab" aria-controls="pills-contact"
                                  aria-selected="false">Extern</span></li>
                    </ul>
                    <div className="navigation-menu-group">
                        <div id="elements" className="open">
                            <ul>
                                <li className="navigation-divider">
                                    <SvgIconFeather icon="plus"/> New workspace
                                </li>
                                <li>
                                    <a href="/">Consolidated<i className="sub-menu-arrow"></i></a>
                                </li>
                                <li>
                                    <a href="/">SodaStream<i
                                        className="sub-menu-arrow ti-angle-up rotate-in ti-minus"></i></a>
                                    <ul style={{display: "block"}}>
                                        <li><a href="basic-cards.html">Website </a></li>
                                        <li><a href="image-cards.html">Market Strategy </a></li>
                                        <li><a href="card-scroll.html">Facebook Campaign </a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Wrapper>
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
        </>
    );
};

export default React.memo(WorkspaceNavigationMenuBodyPanel);