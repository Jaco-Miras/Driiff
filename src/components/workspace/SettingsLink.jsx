import React, {useCallback, useRef, useState} from "react";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useOutsideClick} from "../hooks";
import {SvgIconFeather} from "../common";
import {addToModals} from "../../redux/actions/globalActions";

const SettingsLinkList = styled.li`
    position: relative;
    > a:after{
        display: none;
    }
    .dropdown-menu {
        position: absolute;
        top: 25px;
        left: 25px;
    }
`;

const SettingsLink = props => {

    const wrapperRef = useRef();
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);
    const [show, setShow] = useState(false);
    const toggle = useCallback(() => {
        setShow(!show)
    }, [show]);

    const handleToggle = () => {
        if (topic && topic.hasOwnProperty("workspace_id")) {
            toggle();
        } else if (topic && topic.hasOwnProperty("type") && topic.type === "WORKSPACE") {
            handleOpenWorkspace("workspace");
        }
    };

    const handleDropdownItemClick = e => {
        handleOpenWorkspace(e.target.dataset.name)
    };

    const handleOpenWorkspace = (type) => {
        let payload = {
            mode: "edit",
            item: topic
        }
        if (type === "folder") {
            payload = {
                ...payload,
                type: "workspace_folder"
            };        
        } else {
            payload = {
                ...payload,
                type: "workspace_create_edit"
            };
        }

        dispatch(
            addToModals(payload),
        );
    };

    useOutsideClick(wrapperRef, toggle, show);

    return (
        <SettingsLinkList className="nav-item" ref={wrapperRef}>
            <a className={`dropdown-toggle ${show ? "show" : ""}`} 
                data-toggle="dropdown"
                onClick={handleToggle}>
                <SvgIconFeather icon="settings"/>
            </a>
            <div className={`dropdown-menu ${show ? "show" : ""}`}>
                <a className="dropdown-item" data-name="folder" onClick={handleDropdownItemClick}>
                    Folder settings
                </a>
                <a className="dropdown-item" data-name="workspace" onClick={handleDropdownItemClick}>
                    Workspace settings
                </a>
            </div>
        </SettingsLinkList>
    )
};

export default SettingsLink;