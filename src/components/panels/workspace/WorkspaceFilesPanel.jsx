import React, {useCallback, useRef, useState} from "react";
import styled from "styled-components";
import {useFiles} from "../../hooks";
import {FilesBody, FilesHeader, FilesSidebar} from "../files";


const Wrapper = styled.div`
    .app-sidebar-menu {
        overflow: hidden;
        outline: currentcolor none medium;
    }    
`;

const WorkspaceFilesPanel = (props) => {

    const {className = ""} = props;

    const {wsFiles} = useFiles();

    console.log(wsFiles)

    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");

    const refs = {
        dropZone: useRef(null),
    };

    const handleFilterFile = useCallback((e) => {
        setFilter(e.target.dataset.filter);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, [setSearch]);

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row app-block">
                <FilesSidebar dropZoneRef={refs.dropZone} className="col-md-3" filterFile={handleFilterFile}
                              filter={filter} wsFiles={wsFiles}/>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"/>
                    <FilesHeader dropZoneRef={refs.dropZone} onSearchChange={handleSearchChange}/>
                    <FilesBody dropZoneRef={refs.dropZone} filter={filter} search={search} wsFiles={wsFiles}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceFilesPanel);