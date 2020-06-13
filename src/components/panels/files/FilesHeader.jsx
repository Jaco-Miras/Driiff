import React, {useRef} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {ButtonDropdown, SvgIconFeather} from "../../common";
import {useTranslation} from "../../hooks";

const Wrapper = styled.div`
    overflow: inherit !important;
    
    .action-left {
        ul {
            margin-bottom: 0;
            
            li {
                position: relative;
                
                .button-dropdown {
                }
            }
        }
    }
`;

const FilesHeader = (props) => {

    const {_t} = useTranslation();
    const {className = "", dropZoneRef, onSearchChange} = props;
    const dispatch = useDispatch();
    const dictionary = {
        createFolder: _t("CREATE_FOLDER", "Create folder"),
        create: _t("CREATE", "Create"),
    };

    const handleClickAdd = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.open();
        }
    };

    const folderName = useRef("");
    const handleCreateFolder = () => {
    };

    const handleCreateFolderClose = () => {
        folderName.current = "";
    };

    const handleFolderNameChange = (e) => {
        folderName.current = e.target.value.trim();
    };

    const handleClickFolder = () => {
        let payload = {
            type: "single_input",
            title: dictionary.createFolder,
            defaultValue: "",
            labelPrimaryAction: dictionary.create,
            onPrimaryAction: handleCreateFolder,
            onChange: handleFolderNameChange,
            onClose: handleCreateFolderClose,
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleClickOrderBy = () => {
    };

    const addDropDown = {
        label: <><SvgIconFeather className="mr-1" icon="plus"/> Add</>,
        items: [
            {
                value: "folder",
                label: "Folder",
                onClick: handleClickFolder,
            },
            {
                value: "file",
                label: "File",
                onClick: handleClickAdd,
            },
        ],
    };

    const folderDropDown = {
        label: "Folders",
        items: [
            {
                value: "favorite",
                label: <>Video <span className="text-muted">21</span></>,
                onClick: handleClickFolder,
            },
            {
                value: "recent",
                label: "Image",
                onClick: handleClickFolder,
            },
            {
                value: "unread",
                label: "Audio",
                onClick: handleClickFolder,
            },
            {
                value: "unread",
                label: "Documents",
                onClick: handleClickFolder,
            },
        ],
    };

    const orderByDropDown = {
        label: "Order by",
        items: [
            {
                value: "favorite",
                label: "Starred / favoriet",
                onClick: handleClickOrderBy,
            },
            {
                value: "recent",
                label: "Datum (recent)",
                onClick: handleClickOrderBy,
            },
            {
                value: "unread",
                label: "Ongelezen",
                onClick: handleClickOrderBy,
            },
        ],
    };

    return (
        <Wrapper className={`files-header app-action ${className}`}>
            <div className="action-left">
                <ul className="list-inline">
                    <li className="list-inline-item mb-0">
                        <ButtonDropdown dropdown={addDropDown}/>
                    </li>
                    <li className="list-inline-item mb-0">
                        <ButtonDropdown dropdown={folderDropDown}/>
                    </li>
                    <li className="list-inline-item mb-0">
                        <ButtonDropdown dropdown={orderByDropDown}/>
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