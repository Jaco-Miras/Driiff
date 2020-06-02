import React, {useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "./index";

const Wrapper = styled.div`
    ul {
        padding:0;
    
        li {        
            list-style: none;
            position: relative;            
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
    
    .file {
        max-width: 100px;
        max-height: 100px;
        display: block;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
    }
    .file-name {
        display: block;            
    }
    .file-delete {
        cursor: pointer;
        cursor: hand;
        display: inline-block;
        
        svg {
            width: 10px;
            height: 10px;
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
                return <></>;
        }
    };

    const handleMouseEnter = (e) => {
        setFilePreview({
            file: attachedFiles[e.currentTarget.dataset.targetIndex],
            offsetTop: e.currentTarget.offsetTop + 20,
        });
    };

    const handleMouseLeave = (e) => {
        setFilePreview(null);
    };

    const handleDelete = (e) => {
        handleRemoveFile(e);
        setFilePreview(null);
    };

    return (
        <Wrapper className={`file-attachments ${className}`} onMouseLeave={handleMouseLeave}>
            <ul className="files">
                {
                    attachedFiles.map((f, i) => {
                        return <li
                            data-target-index={i} key={i}
                            onMouseEnter={handleMouseEnter}
                            title={f.name}><AttachmentIcon icon="paperclip"/>{f.name}
                        </li>;
                    })
                }
            </ul>
            {
                filePreview !== null &&
                <Tooltip
                    className="tool-tip" offsetTop={filePreview.offsetTop}
                    onMouseLeave={handleMouseLeave}>
                    {renderFile(filePreview.file)}
                    <span className="file-name">{filePreview.file.name}</span>
                    <span className="file-delete" data-file-id={filePreview.file.id}
                          onClick={handleDelete}><SvgIconFeather icon="x"/> Delete</span>
                </Tooltip>
            }
        </Wrapper>
    );
};

export default React.memo(FileAttachments);