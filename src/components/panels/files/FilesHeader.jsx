import React from "react";
import styled from "styled-components";
import {replaceChar} from "../../../helpers/stringFormatter";
import {ButtonDropdown, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    overflow: inherit !important;
    
    .action-left {
        ul {
            margin-bottom: 0;
            display: inherit;
            
            li {
                position: relative;
                
                .button-dropdown {
                }
            }
        }
    }
`;

const FilesHeader = (props) => {

    const {
        className = "", isMember, dropZoneRef, onSearchChange, onSearch, onEnter,
        wsFiles, handleAddEditFolder, folders, history, params, clearFilter
    } = props;

    const handleClickAdd = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.open();
        }
    };

    const handleClickFolder = (e) => {
        clearFilter();
        if (wsFiles.folders.hasOwnProperty(e.target.dataset.value)) {
            let f = wsFiles.folders[e.target.dataset.value];
            if (params.hasOwnProperty("fileFolderId")) {
                history.push(history.location.pathname.split("/folder/")[0]+`/folder/${f.id}/${replaceChar(f.search)}`);
            } else {
                history.push(history.location.pathname+`/folder/${f.id}/${replaceChar(f.search)}`);
            }
        }
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

    // const orderByDropDown = {
    //     label: "Order by",
    //     items: [
    //         {
    //             value: "favorite",
    //             label: "Starred",
    //             onClick: handleClickOrderBy,
    //         },
    //         {
    //             value: "recent",
    //             label: "Recent",
    //             onClick: handleClickOrderBy,
    //         },
    //         {
    //             value: "unread",
    //             label: "",
    //             onClick: handleClickOrderBy,
    //         },
    //     ],
    // };

    return (
        <Wrapper className={`files-header app-action ${className}`}>
            <div className="action-left">
                <ul className="list-inline">
                    {
                        isMember === true &&
                        <li className="list-inline-item mb-0">
                            <ButtonDropdown dropdown={addDropDown}/>
                        </li>
                    }
                    {
                        Object.keys(folders).length >= 1 &&
                        <li className="list-inline-item mb-0">
                            <ButtonDropdown dropdown={folderDropDown}/>
                        </li>
                    }
                </ul>
            </div>
            <div className="action-right">
                <div className="input-group">
                    <input type="text"
                            onChange={onSearchChange}
                            onKeyDown={onEnter}
                            className="form-control" placeholder="Search file"
                            aria-describedby="button-addon1"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-light" type="button"
                                id="button-addon1" onClick={onSearch}>
                            <SvgIconFeather icon="search"/>
                        </button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FilesHeader);