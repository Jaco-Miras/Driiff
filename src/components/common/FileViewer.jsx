import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getAPIUrl } from "../../helpers/slugHelper";
import { setViewFiles } from "../../redux/actions/fileActions";
import "../../vendors/lightbox/magnific-popup.css";
import { useOutsideClick, useTimeFormat } from "../hooks";
import ImageTextLink from "./ImageTextLink";
import { SvgIconFeather } from "./SvgIcon";

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
  color: #fff;
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
    min-width: 80vw;
    min-height: 80vh;
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
const FileName = styled.a`
  position: relative;
  z-index: 1;
  display: inline-block;
  font-size: 16px;
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
  font-size: 11px;
  font-weight: normal;
  text-align: left;
  margin: 0 1rem 1rem;
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
`;

const CloseButton = styled.button`
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
  padding: 40px 0;
  margin: 0 auto;
  img {
    max-width: 80vh;
    max-height: 80vh;
  }
`;

const FileRender = (props) => {
  const {file, setFiles, files} = props;
  let refFiles = {};
  let userAuth = JSON.parse(localStorage.getItem("userAuthToken"))
  useEffect(() => {
    if (file.type === "pdf" && !file.hasOwnProperty("pdfSrc")) {
      fetch(file.view_link, {method: "GET", headers: {
        Authorization: `Bearer ${userAuth.access_token}`,
        Connection: "keep-alive"
      }})
      .then(function(response) {
        return response.arrayBuffer()
      })
      .then(function(data) {
        const pdfObj = URL.createObjectURL(new Blob([data], {
          type: "application/pdf"
        }))
      
        setFiles(files.map((f) => {
          if (f.id === file.id) {
            return {
              ...f,
              pdfSrc: pdfObj
            }
          } else {
            return f
          }
        }))
      }, function(err) {
          console.log(err, 'error');
      });
    }
  }, [file]);

  const handleImageOnLoad = (e) => {
    e.currentTarget.classList.remove("d-none");
    e.currentTarget.removeAttribute("height");
  };

  const handleImageOnError = (e) => {
    //console.log(e, "image did not load");
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
    e.preventDefault();
    let handle = window.open(file.download_link, "_self");
    handle.blur();
    window.focus();
  };

  switch (file.type.toLowerCase()) {
    case "video":
      return (
        <div key={file.id} data-index={file.id} className={"file-item mfp-img"}>
          <img className={"d-none"} src={require("../../assets/icon/limitations/l/text.svg")}
               alt={"File not found."}/>
          <video
            data-index={file.id}
            data-attempt={0}
            ref={(e) => (refFiles[file.id] = e)}
            controls
            playsInline
            key={file.id}
            className={"file"}
            autoPlay={false}
            onLoadStart={handleVideoOnLoad}
            onError={handleVideoOnError}
            src={file.view_link}
          />
        </div>
      );
    case "image":
      return (
        <div key={file.id} data-index={file.id} className={"file-item mfp-img"}>
          <img data-index={file.id} data-attempt={0} onLoad={handleImageOnLoad} onError={handleImageOnError}
               ref={(e) => (refFiles[file.id] = e)} key={file.id} className={"file"} src={file.view_link}
               alt="file preview"/>
        </div>
      );
    case "pdf":
      return (
        <div key={file.id} data-index={file.id} className={"file-item mfp-img"}>
          {
            file.hasOwnProperty("pdfSrc") && 
          <object data={file.pdfSrc} width="600" height="400">
            <embed src={file.pdfSrc} width="600" height="400"/>
          </object> 
          }
        </div>
      );
    default:
      return (
        <div key={file.id} data-index={file.id} className={"file-item mfp-img cannot-preview"}>
          <Eye icon={"eye-off"}/>

          <p>
            We can't preview this file type. <br/>
            Try downloading the file to view it.
          </p>
          {/* <FileIcon ref={e => refFiles[index] = e}
                            key={index} style={style} iconLeft={`documents`}
                            onClick={e => handleDownloadFile(e, file)}>{file.type.toLowerCase()}</FileIcon> */}
          <button className="btn btn-primary" onClick={(e) => handleDownloadFile(e, file)}>
            Download {file.search}
          </button>
        </div>
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
  const companyFiles = useSelector((state) => state.files.companyFiles.items);
  const {localizeDate} = useTimeFormat();

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
    e.preventDefault();
    let handle = window.open(file.download_link, "_self");
    handle.blur();
    window.focus();
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
      setActiveIndex(files.findIndex(f => f.id === viewFiles.file_id));
    } else {
      let files = Object.values(companyFiles);
      if (!Object.keys(viewFiles).some(k => ["channel_id", "workspace_id"].includes(k))) {
        if (files.length) {
          setFiles(files);
          setActiveIndex(files.findIndex(f => f.file_id === viewFiles.file_id));
        } else {
          setFiles(viewFiles.files);
          setActiveIndex(viewFiles.files.findIndex(f => f.file_id === viewFiles.file_id));
        }
      }
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
        }
      };

      document.addEventListener("keydown", onHandleKeyDowm);
    }
  }, [fileRef]);

  useOutsideClick(fileRef, handleCloseFileViewer, true);

  let file = files[activeIndex];
  if (files.length === 0 || activeIndex === null) return;

  return (
    <FileViewerContainer className={`fileviewer-container ${className}`} ref={fileRef} data-file-index={activeIndex}>
      <PreviewContainer className="iframe-img-container">
        <FileNameContainer>
          <FileName onClick={(e) => handleDownloadFile(e, file)} href={file.download_link} download={file.filename}
                    target={"_blank"}>
            <DownloadIcon icon={"download"}/> {file.filename ? file.filename : file.name}
          </FileName>
        </FileNameContainer>
        {file.created_at && file.created_at.timestamp && (
          <FileCreated>
            {localizeDate(file.created_at.timestamp)} ● {file.type.toLowerCase()}
          </FileCreated>
        )}
        <div className="mfp-container mfp-s-ready mfp-image-holder">
          <div className="mfp-content">
            <div className="mfp-figure">
              <CloseButton onClick={(e) => handleClose(e)} title="Close (Esc)" type="button" className="mfp-close">
                ×
              </CloseButton>
              <FileWrapper>
                {/* {renderFile(files[activeIndex])} */}
                {
                  <FileRender 
                    files={files}
                    file={files[activeIndex]}
                    setFiles={setFiles}
                  />
                }
                <figcaption>
                  <div className="mfp-bottom-bar">
                    <div className="mfp-title"/>
                    <div className="mfp-counter">{`${activeIndex + 1} of ${files.length}`}</div>
                  </div>
                </figcaption>
              </FileWrapper>
            </div>
          </div>
          <div className="mfp-preloader">Loading...</div>
          <ArrowButton show={files.length > 1} onClick={(e) => showPreviousFile()} title="Previous (Left arrow key)"
                       type="button" className="mfp-arrow mfp-arrow-left mfp-prevent-close"/>
          <ArrowButton show={files.length > 1} onClick={(e) => showNextFile()} title="Next (Right arrow key)"
                       type="button" className="mfp-arrow mfp-arrow-right mfp-prevent-close"/>
        </div>
      </PreviewContainer>
    </FileViewerContainer>
  );
};

export default React.memo(FileViewer);
