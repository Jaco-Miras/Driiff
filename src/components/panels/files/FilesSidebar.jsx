import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {ProgressBar} from "../common";

const Wrapper = styled.div`
    text-align: left;
`;

const Filter = styled.span`
    cursor: pointer;
    cursor: hand;

    ${props => props.active && `
        background: 0 0;
        color: #7a1b8b;
    `}
`;

const Icon = styled(SvgIconFeather)`
    width: 15px;
`;

const FileSidebar = (props) => {

    const {className = "", filterFile, filter = "all", dropZoneRef, storage = {amount: 10, limit: 25}, wsFiles} = props;

    const handleShowUploadModal = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.open();
        }
    };

    return (
        <Wrapper className={`file-sidebar ${className}`}>
            <div className="card">
                <div className="card-body">
                    <button
                        className="btn btn-primary btn-block file-upload-btn" onClick={handleShowUploadModal}>
                        Upload Files
                    </button>
                    <form className="d-none" id="file-upload">
                        <input type="file" multiple=""/>
                    </form>
                </div>
                <div className="app-sidebar-menu" tabIndex="1">
                    <div className="list-group list-group-flush">
                        <Filter onClick={filterFile} data-filter="" active={filter === ""}
                                className="list-group-item d-flex align-items-center">
                            <Icon className="mr-2" icon="folder"/>
                            All Files
                            <span className="small ml-auto">{wsFiles && wsFiles.count > 0 ? wsFiles.count : null}</span>
                        </Filter>
                        <Filter onClick={filterFile} data-filter="recent" active={filter === "recent"}
                                className="list-group-item d-flex align-items-center">
                            <Icon className="mr-2" icon="monitor"/>
                            Recently edited
                        </Filter>
                        <Filter onClick={filterFile} data-filter="important" active={filter === "important"}
                                className="list-group-item d-flex align-items-center">
                            <Icon className="mr-2" icon="star"/>
                            Important
                            <span className="small ml-auto">{wsFiles && wsFiles.stars > 0 ? wsFiles.stars : null}</span>
                        </Filter>
                        <Filter onClick={filterFile} data-filter="removed" active={filter === "removed"}
                                className="list-group-item d-flex align-items-center">
                            <Icon className="mr-2" icon="trash"/>
                            Removed
                            <span className="small ml-auto">{wsFiles && wsFiles.trash > 0 ? wsFiles.trash : null}</span>
                        </Filter>
                    </div>
                    {
                        typeof wsFiles !== "undefined" && wsFiles !== null &&
                        <div className="card-body">
                            <h6 className="mb-4">Storage Status</h6>
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    <SvgIconFeather icon="database"/>
                                </div>
                                <div className="flex-grow-1">
                                    <ProgressBar amount={wsFiles.storage / 1e9} limit={storage.limit}/>
                                    <div className="line-height-12 small text-muted mt-2">{(wsFiles.storage / 1e9).toFixed(2)}GB used
                                        of {storage.limit}GB
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FileSidebar);