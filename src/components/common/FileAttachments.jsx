import React, {useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "./index";

const Wrapper = styled.div`
    ul {
        padding:0;
    
        li {        
            list-style: none;
            position: relative;
            cursor: pointer;
            cursor: hand;            
        }
    }
`;

const Tooltip = styled.span`
    position: absolute;
    top: ${props => props.offsetTop}px;
    left: 50px;
    z-index: 1000;
    background-color: #fff;
    padding: 10px 10px 5px;
    border: 1px solid #e1e1e1;
    border-radius: 8px;;
    
    .fa {
        font-size: 42px;
    }
    .file {
        max-width: 200px;
        max-height: 200px;
        display: block;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
    }
    .file-name {
        display: block;                            
    }
    .file-delete {
        margin-top: 10px;
        cursor: pointer;
        cursor: hand;
        display: inline-block;
        font-weight: bold;
        
        &:hover {
            color: #f44;
        }
        
        svg {
            width: 11px;
            height: 11px;
            position: relative;
            top: -1px;
            margin-right: 5px;
        }
    }
`;

const AttachmentIcon = styled(SvgIconFeather)`
    width: 10px;
    height: 10px;
    margin-right: 10px;
`;

const FileAttachments = props => {

    const {className = "", attachedFiles, handleRemoveFile} = props;
    const [filePreview, setFilePreview] = useState(null);

    const renderFile = (f) => {
        switch (f.type) {
            case "IMAGE":
                return <img className="file" src={f.src} alt={f.name}/>;
            case "VIDEO":
                return <video
                    className="file"
                    controls playsInline type='video/mp4' autoPlay={false}
                    src={f.src}></video>;
            default:
                switch (f.rawFile.type) {
                    case "application/x-zip-compressed":
                        return <i className="fa fa-file-zip-o text-primary"></i>;
                    case "application/pdf":
                        return <i className="fa fa-file-pdf-o text-danger"></i>;
                    case "text/plain":
                        return <i className="fa fa-file-text-o text-warning"></i>;
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        return <i className="fa fa-file-excel-o text-success"></i>;
                    default:
                        return <i className="fa fa-file text-warning"></i>;
                }
        }
    };

    const handleClick = (e) => {
        const index = e.currentTarget.dataset.targetIndex;

        if(filePreview !== null && filePreview.file.id === attachedFiles[index].id) {
            closePreview(e);
        } else {
            setFilePreview({
                file: attachedFiles[index],
                offsetTop: e.currentTarget.offsetTop + 20,
            });
        }
    };

    const closePreview = (e) => {
        setFilePreview(null);
    };

    const handleDelete = (e) => {
        handleRemoveFile(e);
        setFilePreview(null);
    };

    return (
        <Wrapper className={`file-attachments ${className}`}>
            <ul className="files">
                {
                    attachedFiles.map((f, i) => {
                        console.log(f.rawFile);

                        return <li
                            data-target-index={i} key={i}
                            onClick={handleClick}
                            title={f.name}><AttachmentIcon icon="paperclip"/>{f.name}
                        </li>;
                    })
                }
            </ul>
            {
                filePreview !== null &&
                <Tooltip
                    className="tool-tip" offsetTop={filePreview.offsetTop}>
                    <a target="_blank" href={filePreview.file.src}>{renderFile(filePreview.file)}
                        <span className="file-name">{filePreview.file.name}</span></a>
                    <span className="file-delete" data-file-id={filePreview.file.id}
                          onClick={handleDelete}><SvgIconFeather icon="trash-2"/> Delete</span>
                </Tooltip>
            }
        </Wrapper>
    );
};

export default React.memo(FileAttachments);