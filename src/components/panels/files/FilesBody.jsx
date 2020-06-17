import React, {useState} from "react";
import styled from "styled-components";
import {DropDocument} from "../../dropzone/DropDocument";
import {FileListItem} from "../../list/file/item";
import {MoreOptions} from "../common";
import {ImportantFiles, PopularFiles, RecentEditedFile, RemoveFiles} from "./index";

const Wrapper = styled.div`
    .card-body {
        position: relative;
            
        overflow: auto !important;
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
        .recent-new-group-wrapper {
            padding-right: 24px;
        }
    }
`;

const MoreButton = styled(MoreOptions)`
    position: absolute;
    right: 10px;
    top: 10px;
    width: 18px;
}
`;

const FilesBody = (props) => {

    const {className = "", dropZoneRef, filter, search, wsFiles, handleAddEditFolder} = props;

    const scrollRef = document.querySelector(".app-content-body");

    const [showDropZone, setShowDropZone] = useState(false);

    const handleHideDropZone = () => {
        setShowDropZone(false);
    };

    const handleShowDropZone = () => {
        setShowDropZone(true);
    };

    const dropAction = (files) => {
        console.log(files);
        setShowDropZone(false);
    };

    const handleRemoveFolder = () => {
        
    };

    const handleEditFolder = () => {
        handleAddEditFolder("update")
    };

    return (
        <Wrapper className={`files-body card app-content-body ${className}`} onDragOver={handleShowDropZone}>
            <DropDocument
                ref={dropZoneRef}
                hide={!showDropZone}
                onDragLeave={handleHideDropZone}
                onDrop={({acceptedFiles}) => {
                    dropAction(acceptedFiles);
                }}
                onCancel={handleHideDropZone}
            />
            <div className="card-body">
                <MoreButton moreButton="settings">
                    <div onClick={handleEditFolder}>Edit folder</div>
                    <div onClick={handleRemoveFolder}>Remove folder</div>
                </MoreButton>

                {
                    filter === "" &&
                    <>
                        <h6 className="font-size-11 text-uppercase mb-4">All files</h6>
                        <div className="row">
                            {
                                wsFiles && 
                                Object.values(wsFiles.files).map(f => {
                                    return (
                                        <FileListItem scrollRef={scrollRef} key={f.id}
                                                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={f}/>
                                    );
                                })
                            }
                        </div>
                        {
                            wsFiles && wsFiles.popular_files.length > 0 &&
                            <PopularFiles search={search} scrollRef={scrollRef} wsFiles={wsFiles}/>
                        }
                        {
                            wsFiles && wsFiles.recently_edited.length > 0 &&
                            <RecentEditedFile search={search} scrollRef={scrollRef} wsFiles={wsFiles}/>
                        }
                    </>
                }
                {
                    filter === "recent" &&
                    wsFiles && wsFiles.recently_edited.length > 0 &&
                    <RecentEditedFile search={search} scrollRef={scrollRef} wsFiles={wsFiles}/>
                }
                {
                    filter === "important" &&
                    <ImportantFiles search={search} scrollRef={scrollRef}/>
                }
                {
                    filter === "removed" &&
                    <RemoveFiles search={search} scrollRef={scrollRef}/>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(FilesBody);