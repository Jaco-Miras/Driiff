import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SvgIconFeather, SvgIcon } from "../../common";
import { setNavMode } from "../../../redux/actions/globalActions";
// import { uploadDriffLogo } from "../../../redux/actions/settingsActions";
// import { DropDocument } from "../../dropzone/DropDocument";
// import { useToaster, useTranslationActions } from "../../hooks";

const LogoWrapper = styled.div`
  position: relative;
  ${(props) =>
    props.hasCompanyLogo &&
    `height: 60%;
    width: 70%;`}

  :hover {
    .feather-pencil {
      display: block;
      top: 0;
      right: -15px;
      cursor: pointer;
    }
  }
`;

const CompanyLogoWrapper = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  cursor: pointer;
  .feather-heart {
    color: #fff;
    height: 0.7rem;
    width: 0.7rem;
    min-height: 0.7rem;
    min-width: 0.7rem;
    margin: 0 5px;
  }
  .company-logo {
    height: 80%;
  }
`;

const DriffLogo = styled(SvgIcon)`
  width: 84px;
  height: 56px;
  filter: brightness(0) saturate(100%) invert(1);
  cursor: pointer;
`;

const SmallDriffLogo = styled(SvgIcon)`
  min-width: 2.5rem;
  min-height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  filter: brightness(0) saturate(100%) invert(1);
  cursor: pointer;
`;

// const EditIcon = styled(SvgIconFeather)`
//   height: 1rem;
//   width: 1rem;
//   color: #fff;
//   position: absolute;
//   display: none;
// `;

const MainLogo = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const toaster = useToaster();
  // const { _t } = useTranslationActions();
  // const dictionary = {
  //   uploadSuccess: _t("TOAST.UPLOAD_ICON_SUCCESS", "Uploaded icon success!"),
  //   fileTypeError: _t("TOAST.FILE_TYPE_ERROR", "File type not allowed. Please use an image file."),
  //   multipleFileError: _t("TOAST.MULTIPLE_FILE_ERROR", "Multiple files detected. First selected image will be used."),
  // };

  const companyLogo = useSelector((state) => state.settings.driff.logo);
  const handleIconClick = (e) => {
    e.preventDefault();
    if (e.target.dataset.link) {
      dispatch(setNavMode({ mode: 3 }));
    } else {
      dispatch(setNavMode({ mode: 2 }));
    }
    history.push("/chat");
  };

  // const iconDropZone = useRef(null);

  // const [showIconDropzone, setShowIconDropzone] = useState(false);

  // const handleUploadIcon = (file, fileUrl) => {
  //   let payload = {
  //     file: file,
  //     code: "code",
  //   };
  //   dispatch(
  //     uploadDriffLogo(payload, (err, res) => {
  //       if (err) return;
  //       toaster.success(dictionary.uploadSuccess);
  //     })
  //   );
  // };

  // const dropIconAction = (uploadedFiles) => {
  //   if (uploadedFiles.length === 0) {
  //     toaster.error(dictionary.fileTypeError);
  //   } else if (uploadedFiles.length > 1) {
  //     toaster.warning(dictionary.multipleFileError);
  //   }

  //   handleUploadIcon(uploadedFiles[0]);
  // };

  // const handleOpenDropzone = () => {
  //   if (iconDropZone.current) iconDropZone.current.open();
  // };

  // const handleHideIconDropzone = () => {
  //   setShowIconDropzone(false);
  // };

  return (
    <LogoWrapper hasCompanyLogo={companyLogo.trim() !== ""}>
      {/* <DropDocument
        acceptType="imageOnly"
        hide={!showIconDropzone}
        ref={iconDropZone}
        onDragLeave={handleHideIconDropzone}
        onDrop={({ acceptedFiles }) => {
          dropIconAction(acceptedFiles);
        }}
        onCancel={handleHideIconDropzone}
      /> */}
      {companyLogo.trim() !== "" && (
        <CompanyLogoWrapper data-link="/" onClick={handleIconClick}>
          <img className="company-logo" src={companyLogo} alt="company logo" />
          <SvgIconFeather icon="heart" />
          <SmallDriffLogo icon="driff-logo2" />
        </CompanyLogoWrapper>
      )}
      {companyLogo.trim() === "" && <DriffLogo icon="driff-logo2" data-link="/chat" onClick={handleIconClick} />}
      {/* <EditIcon icon="pencil" onClick={handleOpenDropzone} /> */}
    </LogoWrapper>
  );
};

export default MainLogo;
