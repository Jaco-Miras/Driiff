import React, {forwardRef, useRef} from "react";
import styled from "styled-components";
import {SvgIcon} from "../../../common";
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
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    background-color: #8C3B9B;
    border-radius: 50%;
    opacity: 0;
    animation: spinner-grow .75s linear infinite;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @keyframes spinner-grow {
        0% {
            transform: scale(0)
        }
        50% {
            opacity: 1
        }
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
    border-radius: 8px;
    cursor: pointer;
    cursor: hand;

    > img{
        border: 1px solid #ddd;
        border-radius: inherit;
        object-fit: cover;
        max-height: 150px;
        min-height: 150px;
        max-width: 200px;
        min-width: 200px;
    }
`;
const DocFile = styled.div`
    .card {
        margin-bottom: 0;
    }
    >img{
        width: 30px;
    }
`;

const FilePill = forwardRef((props, ref) => {
    const {className = "", file, cbFilePreview, ...otherProps} = props;
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

    return <FilePillContainer
        className={`file-pill ${className}`}
        {...otherProps}>
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
                    <div class="card app-file-list">
                        <div class="app-file-icon">
                            <SvgIcon icon={`document`} width="28" height="32"/>
                        </div>
                        <div class="p-2 small">
                            <div>{file.filename ? file.filename.substr(0, file.filename.lastIndexOf(".")) : file.name.substr(0, file.name.lastIndexOf("."))}</div>
                        </div>
                    </div>
                </DocFile>
        }
    </FilePillContainer>;
});

export default React.memo(FilePill);