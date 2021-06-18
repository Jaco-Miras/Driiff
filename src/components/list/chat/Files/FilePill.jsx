import React, { forwardRef, useEffect, useRef } from "react";
import styled from "styled-components";
import { getAPIUrl } from "../../../../helpers/slugHelper";
import { useTouchActions, useTranslation } from "../../../hooks";
import { useSelector, useDispatch } from "react-redux";
import { incomingFileThumbnailData } from "../../../../redux/actions/fileActions";

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

// const FileVideoOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: 1;
//   cursor: pointer;
// `;

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

  const dispatch = useDispatch();
  //const refImageLoader = useRef();
  const refImage = useRef();

  const { _t } = useTranslation();

  const dictionary = {
    fileAutomaticallyRemoved: _t("FILE.AUTOMATICALLY_REMOVED_LABEL", "File automatically removed by owner request"),
  };

  const setFileThumbnailSrc = (payload, callback = () => {}) => {
    dispatch(incomingFileThumbnailData(payload, callback));
  };

  const getFileIcon = (mimeType = "") => {
    if (mimeType) {
      if (mimeType === "trashed") {
        return <i class="fa fa-exclamation-triangle text-danger"></i>;
      } else if (mimeType.includes("image")) {
        return <i className="fa fa-file-image-o text-instagram" />;
      } else if (mimeType.includes("audio")) {
        return <i className="fa fa-file-audio-o text-dark" />;
      } else if (mimeType.includes("video")) {
        return <i className="fa fa-file-video-o text-google" />;
      } else if (mimeType.includes("pdf")) {
        return <i className="fa fa-file-pdf-o text-danger" />;
      } else if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("x-rar")) {
        return <i className="fa fa-file-zip-o text-primary" />;
      } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet") || mimeType.includes("csv") || mimeType.includes("numbers") || mimeType.includes("xml")) {
        return <i className="fa fa-file-excel-o text-success" />;
      } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
        return <i className="fa fa-file-powerpoint-o text-secondary" />;
      } else if (mimeType.includes("word") || mimeType.includes("document")) {
        return <i className="fa fa-file-word-o text-info" />;
      } else if (mimeType.includes("script")) {
        return <i className="fa fa-file-code-o" />;
      } else return <i className="fa fa-file-text-o text-warning" />;
    } else {
      return <i className="fa fa-file-text-o text-warning" />;
    }
  };

  const fileThumbnailBlobs = useSelector((state) => state.files.fileThumbnailBlobs);

  //const [imgSrc, setImgSrc] = useState(file.thumbnail_link && file.type.toLowerCase().includes("image") ? fileThumbnailBlobs[file.id] : file.view_link);

  const userAuth = JSON.parse(localStorage.getItem("userAuthToken"));

  const handleViewFile = (e) => {
    if (file.type === "trashed") return;
    cbFilePreview(e, file);
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

  let touchActions = false;
  const handleTouchStart = (e) => {
    touchActions = false;
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (!touchActions) handleViewFile(e);
  };

  const handleSwipeLeft = (e) => {
    touchActions = true;
  };
  const handleSwipeRight = (e) => {
    touchActions = true;
  };

  const { touchStart, touchMove, touchEnd } = useTouchActions({
    handleTouchStart,
    handleTouchEnd,
    handleSwipeLeft,
    handleSwipeRight,
  });

  useEffect(() => {
    if (!fileThumbnailBlobs[file.id] && file.type.toLowerCase().includes("image") && userAuth) {
      fetch(file.thumbnail_link, {
        method: "GET",
        keepalive: true,
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`,
          "Access-Control-Allow-Origin": "*",
          Connection: "keep-alive",
          crossorigin: true,
        },
      })
        .then(function (response) {
          return response.blob();
        })
        .then(
          function (data) {
            const imgObj = URL.createObjectURL(data);
            //setImgSrc(imgObj);
            setFileThumbnailSrc({
              id: file.id,
              src: imgObj,
            });
          },
          function (err) {
            console.log(err, "error");
          }
        );
    }
  }, []);

  const isFileRemoved = file.file_type === "trashed";

  return (
    <FilePillContainer onTouchStart={touchStart} onTouchEnd={touchEnd} onTouchMove={touchMove} onClick={handleViewFile} ref={ref} className={`file-pill ${className}`} {...otherProps}>
      {isFileRemoved ? (
        <DocFile>
          <div className="card app-file-list">
            <div className="app-file-icon">{getFileIcon("trashed")}</div>
            <div className="p-2 small">
              <div>{dictionary.fileAutomaticallyRemoved}</div>
            </div>
          </div>
        </DocFile>
      ) : file.type.toLowerCase() === "image" ? (
        <>
          <ImgLoader className={fileThumbnailBlobs[file.id] ? "d-none" : ""}>
            <ImgLoaderDiv className={"img-loader"} />
          </ImgLoader>
          <FileImage
            ref={refImage}
            data-attempt={0}
            className={fileThumbnailBlobs[file.id] ? "" : "d-none"}
            onError={handleImageOnError}
            height={150}
            src={fileThumbnailBlobs[file.id] ? fileThumbnailBlobs[file.id] : file.view_link ? file.view_link : ""}
            alt={file.filename ? file.filename : file.search}
            title={file.filename ? file.filename : file.search}
          />
        </>
      ) : file.type.toLowerCase().includes("video") ? (
        <>
          {/* <ImgLoader ref={refVideoLoader}>
            <ImgLoaderDiv className={"img-loader"} />
          </ImgLoader> */}
          {/* <FileVideoOverlay onClick={handleViewFile} /> */}
          <FileVideo data-attempt={0} width="320" height="240" controls playsInline onLoadStart={handleVideoOnLoad} onError={handleVideoOnError}>
            <source src={file.view_link} type={file.type} />
            Your browser does not support the video tag.
          </FileVideo>
        </>
      ) : (
        <DocFile>
          <div className="card app-file-list">
            <div className="app-file-icon">{getFileIcon(file.type)}</div>
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
