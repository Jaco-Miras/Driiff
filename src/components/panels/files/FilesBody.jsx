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

    const {className = "", dropZoneRef, filter, search, wsFiles, 
            handleAddEditFolder, actions, params, folder, fileIds, history } = props;

    const scrollRef = document.querySelector(".app-content-body");

    const [showDropZone, setShowDropZone] = useState(false);

    const handleHideDropZone = () => {
        setShowDropZone(false);
    };

    const handleShowDropZone = () => {
        setShowDropZone(true);
    };

    const dropAction = (attachedFiles) => {
        console.log(attachedFiles);
        setShowDropZone(false);
        
        let formData = new FormData();
        for (const i in attachedFiles) {
            formData.append("files[" + i + "]", attachedFiles[i]);
        }

        let payload = {
            is_primary: 0,
            topic_id: params.workspaceId,
            files: formData,
        }
        if (params.fileFolderId) {
            payload = {
                ...payload,
                folder_id: params.fileFolderId
            }
        }

        actions.uploadFiles(payload);
    };

    const handleRemoveFolder = () => {
        if (folder) {
            let cb = (err,res) => {
                if (err) return;
                let pathname = history.location.pathname.split("/folder/")[0]
                history.push(pathname);
            }
            actions.removeFolder(folder, params.workspaceId, cb);
        }
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
                {
                    folder &&
                    <MoreButton moreButton="settings">
                        <div onClick={handleEditFolder}>Edit folder</div>
                        <div onClick={handleRemoveFolder}>Remove folder</div>
                    </MoreButton>
                }
                {
                    filter === "" &&
                    <>
                        <h6 className="font-size-11 text-uppercase mb-4">All files</h6>
                        <div className="row">
                            {
                                wsFiles && 
                                fileIds.map(f => {
                                    return (
                                        <FileListItem scrollRef={scrollRef} key={f.id} actions={actions}
                                                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[f]}/>
                                    );
                                })
                            }
                        </div>
                        {
                            wsFiles && wsFiles.popular_files.length > 0 && folder === null &&
                            <PopularFiles search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions}/>
                        }
                        {
                            wsFiles && wsFiles.recently_edited.length > 0 && folder === null &&
                            <RecentEditedFile search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions}/>
                        }
                    </>
                }
                {
                    filter === "recent" &&
                    wsFiles && wsFiles.recently_edited.length > 0 &&
                    <RecentEditedFile search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions}/>
                }
                {
                    filter === "important" && 
                    wsFiles && wsFiles.favorite_files && wsFiles.favorite_files.length > 0 &&
                    <ImportantFiles search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions}/>
                }
                {
                    filter === "removed" &&
                    <RemoveFiles search={search} scrollRef={scrollRef} actions={actions}/>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(FilesBody);