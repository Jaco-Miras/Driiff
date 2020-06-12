import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
`;

const FilesHeader = (props) => {

    const {className = "", onSearchChange} = props;

    const toggleDropDown = () => {};

    return (
        <Wrapper className={`files-header app-action ${className}`}>
            <div className="action-left">
                <ul className="list-inline">
                    <li className="list-inline-item mb-0">
                        <span className="btn btn-outline-light dropdown-toggle"
                              data-toggle="dropdown">
                            <SvgIconFeather icon="plus"/>
                            Add
                        </span>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/">Folder</a>
                            <a className="dropdown-item" href="/">File</a>
                        </div>
                    </li>
                    <li className="list-inline-item mb-0">
                        <span className="btn btn-outline-light dropdown-toggle"
                              data-toggle="dropdown">Folders</span>
                        <div className="dropdown-menu">
                            <a className="dropdown-item d-flex justify-content-between" href="/">
                                Video
                                <span className="text-muted">21</span>
                            </a>
                            <a className="dropdown-item d-flex justify-content-between" href="/">
                                Image
                                <span className="text-muted">5</span>
                            </a>
                            <a className="dropdown-item d-flex justify-content-between" href="/">
                                Audio
                                <span className="text-muted">12</span>
                            </a>
                            <a className="dropdown-item d-flex justify-content-between" href="/">
                                Documents
                                <span className="text-muted">7</span>
                            </a>
                        </div>
                    </li>
                    <li className="list-inline-item mb-0">
                        <span className="btn btn-outline-light dropdown-toggle"
                              data-toggle="dropdown">
                            Order by
                        </span>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/">Date</a>
                            <a className="dropdown-item" href="/">Name</a>
                            <a className="dropdown-item" href="/">Size</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="action-right">
                <form className="d-flex mr-3">
                    <a href="/" className="app-sidebar-menu-button btn btn-outline-light">
                        <SvgIconFeather icon="menu"/>
                    </a>
                    <div className="input-group">
                        <input type="text"
                               onChange={onSearchChange}
                               className="form-control" placeholder="Search file"
                               aria-describedby="button-addon1"/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-light" type="button"
                                    id="button-addon1">
                                <SvgIconFeather icon="search"/>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Wrapper>
    );
};

export default React.memo(FilesHeader);