import React, {useRef, useState} from "react";
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

    const {className = "", filter, search} = props;
    const refs = {
        dropZone: useRef(null),
    };


    const files = [
        {
            id: 1,
            name: "image",
            mimeType: "image",
            size: "0.5kb",
        },
        {
            id: 2,
            name: "audio",
            mimeType: "audio",
            size: "0.5kb",
        },
        {
            id: 3,
            name: "video",
            mimeType: "video",
            size: "0.5kb",
        },
        {
            id: 4,
            name: "pdf",
            mimeType: "pdf",
            size: "0.5kb",
        },
        {
            id: 5,
            name: "archive.zip",
            mimeType: "zip",
            size: "0.5kb",
        },
        {
            id: 6,
            name: "excel",
            mimeType: "excel",
            size: "0.5kb",
        },
        {
            id: 7,
            name: "powerpoint",
            mimeType: "powerpoint",
            size: "0.5kb",
        },
        {
            id: 8,
            name: "word",
            mimeType: "word",
            size: "0.5kb",
        },
        {
            id: 9,
            name: "script",
            mimeType: "script",
            size: "0.5kb",
        },
        {
            id: 10,
            name: "text",
            mimeType: "text",
            size: "0.5kb",
        },
    ];

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

    return (
        <Wrapper className={`files-body card app-content-body ${className}`} onDragOver={handleShowDropZone}>
            <DropDocument
                hide={!showDropZone}
                ref={refs.dropZone}
                onDragLeave={handleHideDropZone}
                onDrop={({acceptedFiles}) => {
                    dropAction(acceptedFiles);
                }}
                onCancel={handleHideDropZone}
            />
            <div className="card-body">
                <MoreButton moreButton="settings">
                    <div>Move to</div>
                    <div>Delete</div>
                </MoreButton>

                {
                    filter === "" &&
                    <>
                        <h6 className="font-size-11 text-uppercase mb-4">Showcase all available file icons - FPO -</h6>
                        <div className="row">
                            {
                                files.map(f => {
                                    return (
                                        <FileListItem scrollRef={scrollRef} key={f.id}
                                                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={f}/>
                                    );
                                })
                            }
                        </div>
                        <PopularFiles search={search} scrollRef={scrollRef}/>
                        <RecentEditedFile search={search} scrollRef={scrollRef}/>
                    </>
                }
                {
                    filter === "recent" &&
                    <RecentEditedFile search={search} scrollRef={scrollRef}/>
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