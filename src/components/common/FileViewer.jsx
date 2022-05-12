import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getAPIUrl } from "../../helpers/slugHelper";
import { setViewFiles, removeFileDownload } from "../../redux/actions/fileActions";
import "../../vendors/lightbox/magnific-popup.css";
import { useFiles, useOutsideClick, useTimeFormat, useWindowSize } from "../hooks";
import { SvgIconFeather } from "./SvgIcon";
import { sessionService } from "redux-react-session";

const FileViewerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  align-items: center;
  justify-content: space-evenly;
  font-size: 2.5rem;
  color: #000;
  z-index: 9999;
  .fas {
    cursor: pointer;
  }
  .cannot-preview {
    min-width: 40vw;
    min-height: 40vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #cccccc;
    text-align: center;
    p {
      font-size: 1.1rem;
      line-height: 1.4rem;
      margin: 2rem 0 1.5rem 0;
    }
    svg {
      width: 48px;
      height: 48px;
    }
  }
  .iframe.file {
    min-width: 60vw;
    min-height: 60vh;
  }
`;

const DownloadIcon = styled(SvgIconFeather)`
  position: relative;
  top: -3px;
  margin-right: 5px;
`;

const Eye = styled(SvgIconFeather)``;

const FileNameContainer = styled.p`
  display: block;
  text-align: left;
  margin-bottom: 0;
`;
const FileName = styled.span`
  position: relative;
  z-index: 1;
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #000;

  &:hover {
    text-decoration: none;
    color: #000;
    cursor: pointer;
  }
`;
const FileCreated = styled.p`
  width: 100%;
  display: block;
  font-size: 11px;
  font-weight: normal;
  text-align: left;
  margin: 0;
`;
const PreviewContainer = styled.div`
  position: relative;
  top: 0;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(24, 24, 26, 0.5);

  :before {
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0.5;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
    display: block;
    z-index: -1;
  }

  .iframe {
    width: 100%;
    height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .mfp-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mfp-content {
    /* margin-top: -20px; */

    .mfp-close {
      position: absolute;
      width: 22px;
      right: 10px;
      color: #000;
    }
  }
  .mfp-figure {
    position: relative;
    padding: 32px;
    background-color: #fff;
    border-bottom: 2px solid #ccc;
    &::after {
      top: 58px;
      bottom: 0;
    }
  }
  .mfp-bottom-bar {
    margin-top: 0;
  }
`;
const FileDetails = styled.div`
  position: relative;
`;
const CloseButton = styled.button`
  color: #000;
  &:focus {
    outline: none;
  }
`;

const ArrowButton = styled.button`
  opacity: ${(props) => (props.show ? "1" : "0")};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};

  &:focus {
    outline: none;
  }
`;

const FileWrapper = styled.figure`
  box-sizing: border-box;
  padding: 0;
  margin: 0 auto;
  img {
    max-width: 100%;
    max-height: 60vh;
  }
`;

const StyledFileRender = styled.div`
  text-align: center;
  height: ${({ isLoaded }) => (isLoaded ? "60vh" : "initial")};

  .spinner-border {
    border-width: 3px;
    padding: 10px;
    margin: 5px;
  }
  .file {
    margin: 0 auto;
    transition: all 0.5s ease;
    opacity: 1;
    max-height: 60vh;
    max-width: 100%;

    &:not([src]) {
      opacity: 0;
      max-height: 0;
    }
    &[src] {
      ${(props) =>
        props.isLoaded
          ? `
        opacity: 1;
        max-height: 60vh;      
      `
          : `
        opacity: 0;
        max-height: 0;
      `}
    }

    &.file-pdf {
      &:not([data]) {
        opacity: 0;
        max-height: 0;
      }
      &[data] {
        ${(props) =>
          props.isLoaded
            ? `
          max-width: 1060px;
          max-height: 100%;
          opacity: 1;
        `
            : `
          opacity: 0;
          max-height: 0;
        `}
      }
    }
  }
`;

const DetailsContainer = styled.div`
  background-color: #fff;
  color: #000;
  padding: 0 2rem 2rem 2rem;
`;

const FileRender = (props) => {
  const { className = "", file, setFiles, files, viewFiles } = props;

  const dispatch = useDispatch();
  const winSize = useWindowSize();
  const {
    fileBlobs,
    actions: { setFileSrc },
  } = useFiles();

  const [isLoaded, setIsLoaded] = useState(false);

  let refFiles = {};
  const videoRef = useRef();

  const handlePdfOnLoad = (e) => {
    //console.log(e.target);
  };

  const handleImageOnError = (e) => {
    if (e.currentTarget.dataset.attempt === "0") {
      e.currentTarget.dataset.attempt = 1;
      e.currentTarget.src = `${getAPIUrl({ isDNS: true })}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
    } else if (e.currentTarget.dataset.attemp === "1") {
      e.currentTarget.dataset.attempt = 2;
      e.currentTarget.src = `${e.currentTarget.src}&timestamp=${new Date().getTime()}`;
    } else {
      e.currentTarget.classList.add("img-error");
      e.currentTarget.src = require("../../assets/icon/limitations/l/text.svg");
    }
  };

  const handleVideoOnLoad = (e) => {
    e.currentTarget.classList.remove("d-none");
    e.currentTarget.classList.remove("opacity-0");
    e.currentTarget.removeAttribute("height");
  };

  const handleVideoOnError = (e) => {
    if (e.currentTarget.dataset.attempt === "0") {
      e.currentTarget.dataset.attempt = 1;
      e.currentTarget.src = `${getAPIUrl({ isDNS: true })}/file-view-attempt/${file.file_id}/${localStorage.getItem("atoken")}`;
    } else {
      let img = document.querySelector(`.file-item[data-index="${e.currentTarget.dataset.index}"] img`);
      img.classList.remove("d-none");

      document.querySelector(`.file-item[data-index="${e.currentTarget.dataset.index}"] video`).classList.add("d-none");
    }
  };

  const handleDownloadFile = (e, file) => {
    if (file.remove_on_download) {
      let payload = {
        file_id: file.file_id,
      };
      if (viewFiles.topic_id) {
        payload = {
          ...payload,
          topic_id: viewFiles.topic_id,
        };
      }
      dispatch(removeFileDownload(payload));
    }
    e.preventDefault();
    window.open(file.download_link);
    // handle.blur();
    // window.focus();
  };

  useEffect(() => {
    if (!fileBlobs[file.id]) {
      setIsLoaded(false);
      sessionService.loadSession().then((current) => {
        let myToken = current.token;
        if (viewFiles && viewFiles.sharedSlug) {
          if (current.sharedWorkspaces[viewFiles.slug]) {
            myToken = `Bearer ${current.sharedWorkspaces[viewFiles.slug].access_token}`;
          }
        }
        fetch(file.view_link, {
          method: "GET",
          keepalive: true,
          headers: {
            Authorization: myToken,
            "Access-Control-Allow-Origin": "*",
            Connection: "keep-alive",
            crossorigin: true,
          },
        })
          .then(function (response) {
            return response.blob();
          })
          .then(function (data) {
            const imgObj = URL.createObjectURL(data);
            setFiles(
              files.map((f) => {
                if (f.id === file.id) {
                  return {
                    ...f,
                    imgSrc: imgObj,
                  };
                } else {
                  return f;
                }
              })
            );
            setFileSrc(
              {
                id: file.id,
                src: imgObj,
              },
              () => {
                setIsLoaded(true);
              }
            );
          })
          .catch((error) => {
            console.log("error fetching image");
            setIsLoaded(true);
          });
      });
    } else {
      setIsLoaded(true);
    }
  }, [file]);

  const fileType = file.type.toLowerCase();
  if (fileType.includes("video")) {
    return (
      <StyledFileRender isLoaded={isLoaded} key={file.id} data-index={file.id} className={`file-item mfp-img ${className}`}>
        {isLoaded ? (
          <>
            <img className={"d-none"} src={require("../../assets/icon/limitations/l/text.svg")} alt={"File not found."} />
            {/* <video
              className={"file opacity-0"}
              data-index={file.id}
              data-attempt={0}
              ref={(e) => (refFiles[file.id] = e)}
              controls
              playsInline
              key={file.id}
              autoPlay={false}
              onLoadStart={handleVideoOnLoad}
              onError={handleVideoOnError}
              src={file.view_link} 
            />*/}
            <video
              key={file.id}
              ref={videoRef}
              data-attempt={0}
              className={"file opacity-0"}
              data-index={file.id}
              //ref={(e) => (refFiles[file.id] = e)}
              controls
              playsInline
              autoPlay={false}
              onLoadStart={handleVideoOnLoad}
              onError={handleVideoOnError}
            >
              <source src={`${file.view_link}?playsinline=1`} type={file.type} />
              Your browser does not support the video tag.
            </video>
          </>
        ) : (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        )}
      </StyledFileRender>
    );
  } else if (fileType === "image") {
    return (
      <StyledFileRender isLoaded={isLoaded} key={file.id} data-index={file.id} className={`file-item mfp-img ${className}`}>
        {isLoaded ? (
          <>
            <img
              className={"file"}
              data-index={file.id}
              data-attempt={0}
              // onLoad={handleImageOnLoad}
              onError={handleImageOnError}
              ref={(e) => (refFiles[file.id] = e)}
              key={file.id}
              src={fileBlobs[file.id]}
              alt={file.filename ? file.filename : file.search}
            />
          </>
        ) : (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        )}
      </StyledFileRender>
    );
  } else if (fileType === "pdf") {
    return (
      <StyledFileRender isLoaded={isLoaded} key={file.id} data-index={file.id} className={`file-item mfp-img ${className}`}>
        {isLoaded ? (
          <>
            <object className={"file file-pdf"} data={fileBlobs[file.id]} width={winSize.width * 0.9} height={winSize.height - 122} onLoad={handlePdfOnLoad}>
              <embed src={fileBlobs[file.id]} width="600" height="400" />
            </object>
          </>
        ) : (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        )}
      </StyledFileRender>
    );
  } else {
    return (
      <StyledFileRender isLoaded={isLoaded} key={file.id} data-index={file.id} className={`file-item mfp-img cannot-preview ${className}`}>
        <Eye icon={"eye-off"} />
        <p>
          {file.search ? file.search : file.filename}
          We can't preview this file type. <br />
          Try downloading the file to view it.
        </p>
        {/* <FileIcon ref={e => refFiles[index] = e}
                            key={index} style={style} iconLeft={`documents`}
                            onClick={e => handleDownloadFile(e, file)}>{file.type.toLowerCase()}</FileIcon> */}
        <button className="btn btn-primary" onClick={(e) => handleDownloadFile(e, file)}>
          Download {file.search}
        </button>
      </StyledFileRender>
    );
  }
};

const FileViewer = (props) => {
  const { className = "" } = props;

  const fileRef = useRef();
  const dispatch = useDispatch();
  const channelFiles = useSelector((state) => state.files.channelFiles);
  const viewFiles = useSelector((state) => state.files.viewFiles);
  const workspaceFiles = useSelector((state) => state.files.workspaceFiles);
  //const companyFiles = useSelector((state) => state.files.companyFiles.items);
  const { localizeDate } = useTimeFormat();

  const [activeIndex, setActiveIndex] = useState(0);
  const [files, setFiles] = useState([]);

  const showNextFile = () => {
    let filesLength = files.length;
    if (filesLength - 1 === activeIndex) setActiveIndex(0);
    else setActiveIndex(activeIndex + 1);
  };

  const showPreviousFile = () => {
    const filesLength = files.length;
    if (activeIndex === 0) setActiveIndex(filesLength - 1);
    else setActiveIndex(activeIndex - 1);
  };

  const handleCloseFileViewer = () => {
    dispatch(setViewFiles(null));
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setViewFiles(null));
  };

  const handleDownloadFile = (e, file) => {
    if (file.remove_on_download) {
      let payload = {
        file_id: file.file_id,
      };
      if (viewFiles.topic_id) {
        payload = {
          ...payload,
          topic_id: viewFiles.topic_id,
        };
      }
      dispatch(removeFileDownload(payload));
    }
    e.preventDefault();
    window.open(file.download_link);
    // handle.blur();
    // window.focus();
  };

  useEffect(() => {
    if (Object.keys(channelFiles).length && channelFiles.hasOwnProperty(viewFiles.channel_id)) {
      setFiles(channelFiles[viewFiles.channel_id]);
      channelFiles[viewFiles.channel_id].forEach((file, index) => {
        if (file.file_id === viewFiles.file_id) {
          setActiveIndex(index);
        }
      });
    } else if (Object.keys(workspaceFiles).length && workspaceFiles.hasOwnProperty(viewFiles.workspace_id)) {
      let files = Object.values(workspaceFiles[viewFiles.workspace_id].files);
      if (viewFiles.hasOwnProperty("files")) {
        files = viewFiles.files;
      }
      setFiles(files);
      setActiveIndex(files.findIndex((f) => f.id === viewFiles.file_id));
    } else {
      if (viewFiles.files && viewFiles.files.length) {
        setFiles(viewFiles.files);
        setActiveIndex(viewFiles.files.findIndex((f) => f.file_id === viewFiles.file_id));
      }

      // let files = Object.values(companyFiles);
      // if (!Object.keys(viewFiles).some((k) => ["channel_id", "workspace_id"].includes(k))) {
      //   //console.log("default", viewFiles);
      //   if (files.length) {
      //     setFiles(files);
      //     setActiveIndex(files.findIndex((f) => f.file_id === viewFiles.file_id));
      //   } else {
      //     setFiles(viewFiles.files);
      //     setActiveIndex(viewFiles.files.findIndex((f) => f.file_id === viewFiles.file_id));
      //   }
      // }
    }
  }, []);

  useEffect(() => {
    if (fileRef.current) {
      const onHandleKeyDowm = (e) => {
        switch (e.keyCode) {
          case 27: {
            handleClose(e);
            break;
          }
          case 39: {
            showNextFile();
            break;
          }
          case 37: {
            showPreviousFile();
            break;
          }
          default:
            return null;
        }
      };

      document.addEventListener("keydown", onHandleKeyDowm);
      return () => document.removeEventListener("keydown", onHandleKeyDowm);
    }
  }, [fileRef]);

  useOutsideClick(fileRef, handleCloseFileViewer, true);

  let file = files[activeIndex];
  if (files.length === 0 || activeIndex === null || typeof file === "undefined") return;

  return (
    <FileViewerContainer className={`fileviewer-container ${className}`} data-file-index={activeIndex}>
      <PreviewContainer className="iframe-img-container">
        <div className="mfp-container mfp-s-ready mfp-image-holder">
          <div ref={fileRef}>
            <div className="mfp-content">
              <div className="d-flex justify-content-between align-items-center"></div>
              <div className="mfp-figure rounded-top">
                <CloseButton onClick={(e) => handleClose(e)} title="Close (Esc)" type="button" className="mfp-close">
                  ×
                </CloseButton>
                <FileWrapper>{<FileRender files={files} file={files[activeIndex]} setFiles={setFiles} viewFiles={viewFiles} />}</FileWrapper>
              </div>
              <DetailsContainer className="d-flex justify-content-between align-items-end rounded-bottom">
                <FileDetails>
                  <FileNameContainer>
                    <FileName onClick={(e) => handleDownloadFile(e, file)}>{file.filename ? file.filename : file.search}</FileName>
                  </FileNameContainer>
                  {file.created_at && file.created_at.timestamp && (
                    <FileCreated>
                      {localizeDate(file.created_at.timestamp)} ● {file.type.toLowerCase()}
                    </FileCreated>
                  )}
                </FileDetails>
                <button className="btn btn-primary" onClick={(e) => handleDownloadFile(e, file)}>
                  <DownloadIcon icon={"download"} /> Download
                </button>
              </DetailsContainer>
              <figcaption>
                <div className="mfp-bottom-bar">
                  <div className="mfp-title" />
                  <div className="mfp-counter">{`${activeIndex + 1} of ${files.length}`}</div>
                </div>
              </figcaption>
            </div>
            <div className="mfp-preloader">Loading...</div>
            <ArrowButton show={files.length > 1} onClick={(e) => showPreviousFile()} title="Previous (Left arrow key)" type="button" className="mfp-arrow mfp-arrow-left mfp-prevent-close" />
            <ArrowButton show={files.length > 1} onClick={(e) => showNextFile()} title="Next (Right arrow key)" type="button" className="mfp-arrow mfp-arrow-right mfp-prevent-close" />
          </div>
        </div>
      </PreviewContainer>
    </FileViewerContainer>
  );
};

export default React.memo(FileViewer);
