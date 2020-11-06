import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getAPIUrl } from "../../../../helpers/slugHelper";
import useFileActions from "../../../hooks/useFileActions";
import { useFiles } from "../../../hooks";

const ImgLoader = styled.div`
  position: relative;
  border: 1px solid #ddd;
  background-color: transparent;
  max-height: 150px;
  min-height: 150px;
  max-width: 200px;
  min-width: 200px;
  border-radius: 8px;
`;

const ImgLoaderDiv = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0.25em solid #7a1b8b;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  opacity: 0.8;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FileImage = styled.img`
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

  > img {
    border: 1px solid #ddd;
    border-radius: inherit;
    object-fit: cover;
    max-height: 150px;
    min-height: 150px;
    max-width: 200px;
    min-width: 200px;
    @media (max-width: 380px) {
      min-width: auto;
      min-height: auto;
    }
  }
`;
const DocFile = styled.div`
  .card {
    margin-bottom: 0;
    min-width: 180px;
    @media (max-width: 380px) {
      min-width: auto;
    }
  }
  > img {
    width: 30px;
  }
`;

const FilePill = forwardRef((props, ref) => {
  let { className = "", file, cbFilePreview, ...otherProps } = props;
  if (typeof file.type === "undefined") {
    file.type = file.mime_type;
  }

  const refImageLoader = useRef();
  const refImage = useRef();

  const { fileThumbnailBlobs, actions: { setFileThumbnailSrc } } = useFiles();

  const [imgSrc, setImgSrc] = useState(file.thumbnail_link && file.type.toLowerCase().includes("image") ? fileThumbnailBlobs[file.id] : file.view_link);

  const userAuth = JSON.parse(localStorage.getItem("userAuthToken"));

  const handleViewFile = (e) => {
    cbFilePreview(e, file);
  };

  const handleImageOnLoad = (e) => {
    e.currentTarget.classList.remove("d-none");
    e.currentTarget.removeAttribute("height");
    refImageLoader.current.classList.add("d-none");
  };

  const handleImageOnError = (e) => {
    console.log(file, "image did not load");
    if (e.currentTarget.dataset.attempt === "0") {
      e.currentTarget.dataset.attempt = 1;
      e.currentTarget.src = `${getAPIUrl({ isDNS: true })}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
    } else if (e.currentTarget.dataset.attemp === "1") {
      e.currentTarget.dataset.attempt = 2;
      e.currentTarget.src = `${e.currentTarget.src}&timestamp=${new Date().getTime()}`;
    } else {
      e.currentTarget.classList.add("img-error");
      e.currentTarget.src = require("../../../../assets/icon/limitations/l/text.svg");
    }
  };

  const handleVideoOnLoad = (e) => {
    //removed image loader in video file
    // e.currentTarget.classList.remove("d-none");
    // e.currentTarget.removeAttribute("height");
    // refVideoLoader.current.classList.add("d-none");
  };

  const handleVideoOnError = (e) => {
    console.log(e, "image did not load");
    if (e.currentTarget.dataset.attempt === "0") {
      e.currentTarget.dataset.attempt = 1;
      e.currentTarget.src = `${getAPIUrl({ isDNS: true })}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
    } else if (e.currentTarget.dataset.attemp === "1") {
      e.currentTarget.dataset.attempt = 2;
      e.currentTarget.src = `${e.currentTarget.src}&timestamp=${new Date().getTime()}`;
    }
  };

  const fileHandler = useFileActions();

  let timerStart = 0;
  let xDown = null;
  let yDown = null;
  const handleTouchStartChannel = (e) => {
    timerStart = e.timeStamp;
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
  };

  const handleTouchEndChannel = (e) => {
    if ((e.timeStamp - timerStart) <= 125) {
      handleViewFile(e);
    }
  };

  const handleTouchMoveChannel = (e) => {
    let xUp = e.touches[0].clientX;
    let yUp = e.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
      /* left swipe */
      if (xDiff > 0) {
        ref.current.focus();
      } else {
        timerStart += 125;
      }
    } else {
      timerStart -= 125;
    }

    xDown = null;
    yDown = null;
  };

  useEffect(() => {
    if (!imgSrc) {
      fetch(file.thumbnail_link, {
        method: "GET", keepalive: true, headers: {
          Authorization: `Bearer ${userAuth.access_token}`,
          'Access-Control-Allow-Origin': "*",
          Connection: "keep-alive",
          crossorigin: true,
        }
      })
        .then(function (response) {
          return response.blob();
        })
        .then(function (data) {
          const imgObj = URL.createObjectURL(data);
          setImgSrc(imgObj);
          setFileThumbnailSrc({
            id: file.id,
            src: imgObj
          });
        }, function (err) {
          console.log(err, 'error');
        });
    }
  }, []);

  return (
    <FilePillContainer onTouchStart={handleTouchStartChannel} onTouchEnd={handleTouchEndChannel}
                       onTouchMove={handleTouchMoveChannel} onClick={handleViewFile} ref={ref}
                       className={`file-pill ${className}`} {...otherProps}>
      {file.type.toLowerCase() === "image" ? (
        <>
          <ImgLoader ref={refImageLoader}>
            <ImgLoaderDiv className={"img-loader"}/>
          </ImgLoader>
          <FileImage
            ref={refImage}
            data-attempt={0}
            className={"d-none"}
            onLoad={handleImageOnLoad}
            onError={handleImageOnError}
            height={150}
            src={imgSrc}
            alt={file.filename ? file.filename : file.search}
            title={file.filename ? file.filename : file.search}
          />
        </>
      ) : file.type.toLowerCase() === "video" ? (
        <>
          {/* <ImgLoader ref={refVideoLoader}>
            <ImgLoaderDiv className={"img-loader"} />
          </ImgLoader> */}
          {/* <FileVideoOverlay onClick={handleViewFile} /> */}
          <FileVideo data-attempt={0} width="320" height="240" controls playsInline onLoadStart={handleVideoOnLoad} onError={handleVideoOnError}>
            <source src={file.view_link} type="video/mp4" />
            Your browser does not support the video tag.
          </FileVideo>
        </>
      ) : (
        <DocFile>
          <div className="card app-file-list">
            <div className="app-file-icon">{fileHandler.getFileIcon(file.type)}</div>
            <div className="p-2 small">
              <div>{file.filename ? file.filename : file.search}</div>
            </div>
          </div>
        </DocFile>
      )}
    </FilePillContainer>
  );
});

export default React.memo(FilePill);
