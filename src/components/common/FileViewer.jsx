import React, {forwardRef, useEffect, useState, useRef} from "react";
import styled from "styled-components";
import {localizeDate} from "../../helpers/momentFormatJS";
import {getAPIUrl} from "../../helpers/slugHelper";
import ImageTextLink from "./ImageTextLink";
import SvgImage from "./SvgImage";
import {useSelector, useDispatch} from "react-redux";
import {setViewFiles} from "../../redux/actions/fileActions";
import {useOutsideClick} from "../hooks";

const FileViewerContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width:100%; 
    height:100%;
    z-index: 99;
    pointer-events: auto;
    align-items: center;
    justify-content: space-evenly;
    font-size: 2.5em;
    color: #fff;
    
    .fas{
        cursor: pointer;
    }
    
    video.file{
        max-height: 85%;
        max-width: 85%;
        margin:auto;
        position: absolute;
        top: 65px;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
        cursor: hand;
    }
        
    img.file{
        max-height: 85%;
        max-width: 85%;
        margin:auto;
        position: absolute;
        top: 65px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    
    .file-item {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }
`;

const FileIcon = styled(ImageTextLink)`
    &.component-image-text-link {
        a {
            display: block;
            font-size: 1.5rem;
            margin-top: -2.5rem;
        }
        .component-svg-image {
            width: auto;
            height: 80%;
            filter: brightness(0) saturate(100%) invert(1);
            
            &:hover {
                filter: brightness(0) saturate(100%) invert(1);
            }
        }
    }
`;

const DownloadIcon = styled(SvgImage)`
    &.component-svg-image {
        width: 30px;
        height: 30px;
        filter: brightness(0) saturate(100%) invert(1);
        cursor: pointer;
        position: relative;
        top: -3px;
        
        &:hover {
            filter: brightness(0) saturate(100%) invert(1);
        }
    }
`;

const CloseIcon = styled(SvgImage)`
    &.component-svg-image {
        position: absolute;
        z-index: 1;
        width: 30px;
        height: 30px;
        filter: brightness(0) saturate(100%) invert(1);
        cursor: pointer;
        right: 0;
        top: 0;
        
        &:hover {
            filter: brightness(0) saturate(100%) invert(1);
        }
    }
`;
const FileNameContainer = styled.p`
    display: block;
    text-align: left;
`;
const FileName = styled.a`
    position: relative;
    z-index: 1;    
    display: inline-block;
    font-size: 28px;
    font-weight: 500;    
    margin: 1rem 1rem 0;
    color: #fff;
    
    &:hover {
        text-decoration: none;
        color: #fff;
    }
`;
const FileCreated = styled.p`
    width: 100%;
    display: block;
    font-size: 1rem;
    font-weight: normal;
    text-align: left;
    margin: 0 1rem 1rem;
`;
const PreviewContainer = styled.div`
    position: relative;
    top: 8%;
    margin: 0 auto;
    width: 80%;
    height: 80%;
    overflow: hidden;
    align-items: center;
    justify-content: center;    
    text-align: center;
    background-color: rgba(24, 24, 26,0.5);
    
    :before{
        background-color: rgba(0, 0, 0, 0.8);
        opacity: 0.5;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        display: block;
        z-index: -1;
    }
    
    .iframe{
        width:100%; 
        height:100%;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
`;

const ArrowIcon = styled.i`
    opacity: ${props => props.show ? "1" : "0"};
    visibility: ${props => props.show ? "visible" : "hidden"};
    position: absolute;   
    top: calc(50% - 30px);
    z-index: 1;
    cursor: pointer;
    cursor: hand;    
    
    &.fa-arrow-left {
        left: 1%;
    }
    &.fa-arrow-right {
        right: 1%;
    }
`;


const FileViewer = forwardRef((props, ref) => {
    const {fileIndex, className = ""} = props;

    const fileRef = useRef();
    const dispatch = useDispatch();
    const channelFiles = useSelector(state => state.files.channelFiles);
    const viewFiles = useSelector(state => state.files.viewFiles);
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [files, setFiles] = useState([]);

    useEffect(() => {

        if (Object.keys(channelFiles).length && channelFiles.hasOwnProperty(viewFiles.channel_id)) {
            setFiles(channelFiles[viewFiles.channel_id])
            //set ur index here based on viewFiles file id
            //setActiveIndex(0);
        }
    }, []);

    let refFiles = {};

    const showNextFile = e => {
        if (files[activeIndex].type.toLowerCase() === "video") {
            refFiles[activeIndex].pause();
        }

        let filesLength = files.length;
        if (filesLength - 1 === activeIndex)
            setActiveIndex(0);
        else
            setActiveIndex(activeIndex + 1);
    };

    const showPreviousFile = e => {
        if (files[activeIndex].type.toLowerCase() === "video") {
            refFiles[activeIndex].pause();
        }

        let filesLength = files.length;
        if (activeIndex === 0)
            setActiveIndex(filesLength - 1);
        else
            setActiveIndex(activeIndex - 1);
    };

    // useEffect(() => {
    //     const handleOutsideClick = e => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (fileDiv) {
    //             if (fileDiv.contains(e.target)) {
    //                 if (e.target.classList.contains("iframe-img-container") || e.target.classList.contains("fileviewer-container")) {
    //                     dispatch(setViewFiles(null));
    //                 }
    //             }
    //         }
    //     };
    //     const handleEscapeKey = e => {
    //         if (e.keyCode === 27) dispatch(setViewFiles(null));
    //     };
    //     document.addEventListener("click", handleOutsideClick, false);
    //     document.addEventListener("keydown", handleEscapeKey, false);
    //     // let ov = document.getElementById("component-bg-overlay");
    //     // ov.classList.add("d-block");
    //     return () => {
    //         document.removeEventListener("keydown", handleEscapeKey, false);
    //         document.removeEventListener("click", handleOutsideClick, false);
    //         // let ov = document.getElementById("component-bg-overlay");
    //         // ov.classList.remove("d-block");
    //     };

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleCloseFileViewer = () => {
        dispatch(setViewFiles(null));
    }

    useOutsideClick(fileRef, handleCloseFileViewer, true);

    useEffect(() => {
        if (files.length) {
            let nodes = document.querySelectorAll(".fileviewer-container .file-item");
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].classList.add("d-none");
            }

            document.querySelector(`.fileviewer-container .file-item[data-index="${activeIndex}"]`).classList.remove("d-none");
        }
    }, [activeIndex, files]);

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setViewFiles(null));
    };

    const handleImageOnLoad = (e) => {
        e.currentTarget.classList.remove(`d-none`);
        e.currentTarget.removeAttribute("height");
    };

    const handleImageOnError = (e) => {
        console.log(e, "image did not load");
        if (e.currentTarget.dataset.attempt === "0") {
            e.currentTarget.dataset.attempt = 1;
            e.currentTarget.src = `${getAPIUrl({isDNS: true})}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
        } else if (e.currentTarget.dataset.attemp === "1") {
            e.currentTarget.dataset.attempt = 2;
            e.currentTarget.src = `${e.currentTarget.src}&timestamp=${new Date().getTime()}`;
        } else {
            e.currentTarget.classList.add(`img-error`);
            e.currentTarget.src = require("../../assets/icon/limitations/l/text.svg");
        }
    };

    const handleVideoOnLoad = (e) => {
        e.currentTarget.classList.remove(`d-none`);
        e.currentTarget.removeAttribute("height");
    };

    const handleVideoOnError = (e) => {
        if (e.currentTarget.dataset.attempt === "0") {
            e.currentTarget.dataset.attempt = 1;
            e.currentTarget.src = `${getAPIUrl({isDNS: true})}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
        } else {
            let img = document.querySelector(`.file-item[data-index="${e.currentTarget.dataset.index}"] img`);
            img.classList.remove("d-none");

            document.querySelector(`.file-item[data-index="${e.currentTarget.dataset.index}"] video`).classList.add("d-none");
        }
    };

    const renderFile = (file, index) => {
        let style = {
            display: activeIndex === index ? "inline" : "none",
        };

        switch (file.type.toLowerCase()) {
            case "video":
                return <div key={index} data-index={index} className={`file-item`}>
                    <img className={`d-none`} src={require("../../assets/icon/limitations/l/text.svg")}
                         alt={`File not found.`}/>
                    <video
                        data-index={index}
                        data-attempt={0}
                        ref={e => refFiles[index] = e}
                        controls playsInline type='video/mp4'
                        key={index} style={style} className={`file d-none`} autoPlay={false}
                        onLoadStart={handleVideoOnLoad}
                        onError={handleVideoOnError}
                        src={file.view_link}></video>
                </div>;
            case "image":
                return <div key={index} data-index={index} className={`file-item`}>
                    <img
                        data-index={index}
                        data-attempt={0}
                        onLoad={handleImageOnLoad}
                        onError={handleImageOnError}
                        ref={e => refFiles[index] = e}
                        key={index} style={style} className={`file d-none`} src={file.view_link} alt='file preview'/>
                </div>;
            case "pdf":
                return <div key={index} data-index={index} className={`file-item`}>
                    <iframe
                        ref={e => refFiles[index] = e}
                        title={file.name}
                        key={index} style={style}
                        className={`iframe file`}
                        src={file.view_link}
                        frameBorder="0"></iframe>
                </div>;
            default:
                return <div key={index} data-index={index} className={`file-item`}>
                    <FileIcon ref={e => refFiles[index] = e}
                              key={index} style={style} iconLeft={`documents`}
                              onClick={e => handleDownloadFile(e, file)}>{file.type.toLowerCase()}</FileIcon>
                </div>;
        }
    };

    const handleDownloadFile = (e, file) => {
        e.preventDefault();
        let handle = window.open(file.download_link, "_self");
        handle.blur();
        window.focus();
    };

    let file = files[activeIndex];

    if (files.length === 0) return

    return <FileViewerContainer
        className={`fileviewer-container ${className}`} ref={fileRef}>
        <PreviewContainer
            className='iframe-img-container'>
            <ArrowIcon
                show={files.length > 1} className={`fas fa-arrow-left`}
                onClick={e => showPreviousFile(e)}/>
            <CloseIcon icon={`close`} onClick={e => handleClose(e)}/>
            <FileNameContainer>
                <FileName onClick={e => handleDownloadFile(e, file)} href={file.download_link} download={file.filename}
                          target={`_blank`}>
                    <DownloadIcon icon={`download`}/> {file.filename ? file.filename : file.name}
                </FileName>
            </FileNameContainer>
            {
                file.created_at && file.created_at.timestamp &&
                <FileCreated>{localizeDate(file.created_at.timestamp)} ● {file.type.toLowerCase()}</FileCreated>
            }
            {
                files.map((f, index) => {
                    return renderFile(f, index);
                })
            }
            <ArrowIcon
                show={files.length > 1} className={`fas fa-arrow-right`}
                onClick={e => showNextFile(e)}/>
        </PreviewContainer>
    </FileViewerContainer>;
});

export default React.memo(FileViewer);
