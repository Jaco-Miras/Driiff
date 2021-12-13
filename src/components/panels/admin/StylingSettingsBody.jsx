import React, {useRef, useState} from 'react'
import styled from "styled-components";
import { useTheme } from 'styled-components';
import { useSelector } from "react-redux";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { Loader, SvgIconFeather } from "../../common";
import { DomainSelect } from "../../forms";
import Tooltip from "react-tooltip-lite";
import { DropDocument } from "../../dropzone/DropDocument";

const Wrapper = styled.div`
display: flex;
flex-direction: column;
padding: 1rem;
> div {
  margin-bottom: 1rem;
}
.feather-info {
  margin-left: 5px;
  height: 1rem;
  width: 1rem;
}
`;

const Inputfields = styled.input`
margin-bottom: 16px;
width: 200px;`
const SubmitButton = styled.button`
width: 150px;
text-align: center; 
`
const CurrentPrimSpan = styled.span`
background-color: ${(props) => props.theme.colors.primary};
color: white;
`
const CurrentSecSpan = styled.span`
background-color: ${(props) => props.theme.colors.secondary};
color: white;
`
const CurrentThirdSpan = styled.span`
background-color: ${(props) => props.theme.colors.third};
color: white;
`


function StylingSettingsBody() {
    const { _t } = useTranslationActions();
    const theme = useTheme();
    console.log(theme)
    const dictionary = {
        companyLogo: _t("ADMIN.COMPANY_LOGO", "Company logo"),
        companyLogoDescription: _t("ADMIN.COMPANY_LOGO_DESCRIPTION", "Upload your company logo."),
        uploadLogoBtn: _t("BUTTON.UPLOAD.LOGO_BTN", "Upload logo"),
        companyLogoRequirement: _t("ADMIN.COMPANY_LOGO_REQUIREMENT", "Your logo must be a image file."),
        companyLogoDimensions: _t("ADMIN.COMPANY_LOGO_DIMENSIONS", "Maximun dimensions are 80px by 60px"),
        uploadSuccess: _t("TOAST.UPLOAD_ICON_SUCCESS", "Uploaded icon success!"),
        fileTypeError: _t("TOAST.FILE_TYPE_ERROR", "File type not allowed. Please use an image file."),
        multipleFileError: _t("TOAST.MULTIPLE_FILE_ERROR", "Multiple files detected. First selected image will be used."),
        resetButton: _t("BUTTON.REMOVE_LOGO", "Remove logo"),
        resetLogoSuccess: _t("TOAST.RESET_COMPANY_LOGO_SUCCESS", "Reset company logo success!"),
        customTranslation: _t("SETTINGS.CUSTOM_TRANSLATION", "Use custom translation"),
        customTranslationInfo: _t("SETTINGS.CUSTOM_TRANSLATION_INFO", "Use custom translation"),
        toasterUpdateLoginError: _t("TOASTER.UPDATE_LOGIN_SETTINGS_ERROR", "Error updating login settings"),
      };


      const iconDropZone = useRef(null);
      const [showIconDropzone, setShowIconDropzone] = useState(false);
      const toast = useToaster();
      const {  uploadLogo, resetLogo } = useAdminActions();
      const logo = useSelector((state) => state.settings.driff.logo);

      const handleUploadIcon = (file, fileUrl) => {
        let payload = {
          file: file,
          code: "code",
        };
        let cb = (err, res) => {
          if (err) return;
          toast.success(dictionary.uploadSuccess);
        };
        uploadLogo(payload, cb);
      };

      const dropIconAction = (uploadedFiles) => {
        if (uploadedFiles.length === 0) {
          toast.error(dictionary.fileTypeError);
        } else if (uploadedFiles.length > 1) {
          toast.warning(dictionary.multipleFileError);
        }
    
        handleUploadIcon(uploadedFiles[0]);
      };

      const handleOpenDropzone = () => {
        if (iconDropZone.current) iconDropZone.current.open();
      };
    
      const handleHideIconDropzone = () => {
        setShowIconDropzone(false);
      };
    
      const handleRemoveLogo = () => {
        let cb = (err, res) => {
          if (err) return;
          toast.success(dictionary.resetLogoSuccess);
        };
        resetLogo({}, cb);
      };
    return (
        <div>
            <Wrapper theme={theme}>
            <h4>{dictionary.companyLogo}</h4>
      <h6>{dictionary.companyLogoDescription}</h6>
      <div>
        <label className="mb-0">{dictionary.companyLogoRequirement}</label>
        <br />
        <label className="mb-0">{dictionary.companyLogoDimensions}</label>
      </div>
            <div>
        <DropDocument
          acceptType="imageOnly"
          hide={!showIconDropzone}
          ref={iconDropZone}
          onDragLeave={handleHideIconDropzone}
          onDrop={({ acceptedFiles }) => {
            dropIconAction(acceptedFiles);
          }}
          onCancel={handleHideIconDropzone}
        />
        <button className="btn btn-primary" onClick={handleOpenDropzone}>
          {dictionary.uploadLogoBtn}
        </button>
        {logo !== "" && (
          <button className="ml-2 btn btn-secondary" onClick={handleRemoveLogo}>
            {dictionary.resetButton}
          </button>
        )}
      </div>
           <h4>Styling</h4>
           <p>Add your primary color (current: <CurrentPrimSpan>{theme.colors.primary} </CurrentPrimSpan>)</p>
           <Inputfields className="w-100 form-control" id="primarycolor"></Inputfields>
           <p>Add your Secondary color (current: <CurrentSecSpan>{theme.colors.primary} </CurrentSecSpan>)</p>
           <Inputfields className="w-100 form-control" id="secondarycolor"></Inputfields>
           <p>Add your Third color (current: <CurrentThirdSpan>{theme.colors.primary} </CurrentThirdSpan>)</p>
           <Inputfields className="w-100 form-control" id="thirdcolor"></Inputfields>
           <SubmitButton className="btn btn-primary" id="SubmitColors">Submit</SubmitButton>
         
           </Wrapper>
        </div>
    )
}

export default StylingSettingsBody
