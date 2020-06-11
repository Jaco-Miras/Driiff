import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {FilesBody, FilesHeader, FilesSidebar} from "../files";


const Wrapper = styled.div`
    .app-sidebar-menu {
        overflow: hidden;
        outline: currentcolor none medium;
    }    
`;

const WorkspaceFilesPanel = (props) => {

    const {className = ""} = props;

    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");

    const handleFilterFile = useCallback((e) => {
        setFilter(e.target.dataset.filter);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, [setSearch]);

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row app-block">
                <FilesSidebar className="col-md-3" filterFile={handleFilterFile} filter={filter}/>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"/>
                    <FilesHeader onSearchChange={handleSearchChange}/>
                    <FilesBody filter={filter} search={search}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceFilesPanel);