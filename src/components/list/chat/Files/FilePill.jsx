import React, {forwardRef, useRef} from "react";
import styled from "styled-components";
import docIcon from "../../../../assets/img/svgs/documents-icons/documents_secundary.svg";
import {getAPIUrl} from "../../../../helpers/slugHelper";

const ImgLoader = styled.div`
    position: relative;    
    border: 1px solid #ddd;
    background-color: transparent;
    max-height: 150px;
    min-height: 150px;
    max-width: 200px;
    min-width: 200px;
`;

const ImgLoaderDiv = styled.div`
    border: 10px solid #f3f3f3; 
    border-top: 10px solid #972c86;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }      
`;

const FileImage = styled.img`
    background-image: url(${props => props.bgImg});
    &.img-error {
        background-image: none;
        padding: 2.8rem 3rem;
    }
`;

const FileVideoOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    cursor: pointer;
    cursor: hand;
`;

const FileVideo = styled.video`
    max-height: 150px;
    min-height: 150px;
    max-width: 200px;
    min-width: 200px;
`;

const FilePillContainer = styled.div`
    // margin-top: 5px;
    // margin-right: 20px;    
    border-radius: 10px;
    background: ${props => props.type === "image" ? "transparent" : "#dedede"};
    cursor: pointer;
    cursor: hand;
    
    > img{    
        border: 1px solid #ddd;
        border-radius: inherit;
        // max-height: 200px;
        // max-width: 200px;
        object-fit: cover;
        max-height: 150px;
        min-height: 150px;
        max-width: 200px;
        min-width: 200px;

        //height: auto;
        //max-width: 100%;
    }
`;
const DocFile = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    min-height: 100px;
    padding: 0 10px;
    >img{
        width: 30px;
        height: 30px;
    }
`;

const FilePill = forwardRef((props, ref) => {
    const {file, cbFilePreview} = props;
    const refImageLoader = useRef();
    const refImage = useRef();
    const refVideoLoader = useRef();

    const handleViewFile = (e) => {
        cbFilePreview(e, file);
    };

    const handleImageOnLoad = (e) => {
        e.currentTarget.classList.remove(`d-none`);
        e.currentTarget.removeAttribute("height");
        refImageLoader.current.classList.add("d-none");
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
            e.currentTarget.src = require("../../../../assets/icon/limitations/l/text.svg");
        }
    };

    const handleVideoOnLoad = (e) => {
        e.currentTarget.classList.remove(`d-none`);
        e.currentTarget.removeAttribute("height");
        refVideoLoader.current.classList.add("d-none");
    };

    const handleVideoOnError = (e) => {
        console.log(e, "image did not load");
        if (e.currentTarget.dataset.attempt === "0") {
            e.currentTarget.dataset.attempt = 1;
            e.currentTarget.src = `${getAPIUrl({isDNS: true})}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
        } else if (e.currentTarget.dataset.attemp === "1") {
            e.currentTarget.dataset.attempt = 2;
            e.currentTarget.src = `${e.currentTarget.src}&timestamp=${new Date().getTime()}`;
        }
    };

    return <FilePillContainer type={file.type.toLowerCase()}>
        {
            file.type.toLowerCase() === "image" ?
                <>
                    <ImgLoader ref={refImageLoader}>
                        <ImgLoaderDiv className={`img-loader`}/>
                    </ImgLoader>
                    <FileImage
                        ref={refImage}
                        bgImg={file.view_link}
                        data-attempt={0}
                        className={`d-none`}
                        onLoad={handleImageOnLoad}
                        onError={handleImageOnError}
                        height={150}
                        onClick={handleViewFile}
                        src={file.view_link}
                        alt={file.filename}
                        title={file.filename}/>
                </>
                : file.type.toLowerCase() === "video" ?
                <>
                    <ImgLoader ref={refVideoLoader}>
                        <ImgLoaderDiv className={`img-loader`}/>
                    </ImgLoader>
                    <FileVideoOverlay onClick={handleViewFile}/>
                    <FileVideo
                        data-attempt={0}
                        width="320" height="240" controls playsInline
                        onLoadStart={handleVideoOnLoad}
                        onError={handleVideoOnError}>
                        <source src={file.view_link} type="video/mp4"></source>
                        Your browser does not support the video tag.
                    </FileVideo>
                </>
                : <DocFile onClick={handleViewFile}>
                    <img src={docIcon} alt={"document"}/>
                    <p>{file.filename ? file.filename.substr(0, file.filename.lastIndexOf(".")) : file.name.substr(0, file.name.lastIndexOf("."))}</p>
                </DocFile>
        }
    </FilePillContainer>;
});

export default React.memo(FilePill);