import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {ButtonDropdown, SvgIconFeather} from "../../common";
import {replaceChar} from "../../../helpers/stringFormatter";

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

    const {className = "", dropZoneRef, onSearchChange, wsFiles, handleAddEditFolder, folders} = props;
    
    const history = useHistory();
    //console.log(history)

    const handleClickAdd = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.open();
        }
    };

    const handleClickFolder = (e) => {
        if (wsFiles.folders.hasOwnProperty(e.target.dataset.value)) {
            let f = wsFiles.folders[e.target.dataset.value];
            history.push(history.location.pathname+`/folder/${f.id}/${replaceChar(f.search)}`);
        }
    };

    const handleClickOrderBy = () => {
    };

    const addDropDown = {
        label: <><SvgIconFeather className="mr-1" icon="plus"/> Add</>,
        items: [
            {
                value: "folder",
                label: "Folder",
                onClick: () => handleAddEditFolder("add"),
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
        items: wsFiles && Object.values(folders).length ? 
            Object.values(folders).map(f => {
                return {
                    value: f.id,
                    label: f.search,
                    //label: <>Video <span className="text-muted">21</span></>,
                    onClick: handleClickFolder
                }
            })
            : []
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