import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { DropDocument } from "../../dropzone/DropDocument";
import { updateThemeColors } from "../../../redux/actions/settingsActions";
import { putLoginSettings } from "../../../redux/actions/adminActions";

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
  width: 200px;
`;
const SubmitButton = styled.button`
  text-align: center;
`;

const ColorSpan = styled.span`
  background-color: ${(props) => props.color};
  color: white;
`;

function StylingSettingsBody() {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
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
  const { uploadLogo, resetLogo } = useAdminActions();
  const logo = useSelector((state) => state.settings.driff.logo);
  const theme = useSelector((state) => state.settings.driff.theme);
  const loginSettings = useSelector((state) => state.admin.login);
  const custom_translation = useSelector((state) => state.settings.driff.settings.custom_translation);
  const [settings, setSettings] = useState({ ...loginSettings, custom_translation: custom_translation });

  const [colors, setColors] = useState({ ...theme.colors });

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

  const handleChangePrimary = (e) => {
    setColors({ ...colors, primary: e.target.value });
  };
  const handleChangeSecondary = (e) => {
    setColors({ ...colors, secondary: e.target.value });
  };
  const handleChangeThird = (e) => {
    setColors({ ...colors, third: e.target.value });
  };

  const handleChangeFourth = (e) => {
    setColors({ ...colors, fourth: e.target.value });
  };

  const handleChangeFifth = (e) => {
    setColors({ ...colors, fifth: e.target.value });
  };

  const handlePreviewTheme = () => {
    dispatch(updateThemeColors({ colors: colors }));
  };

  const handleSubmit = () => {
    const defaultColors = {
      colors: {
        primary: "#7a1b8b",
        secondary: "#8c3b9b",
        third: "#3f034a",
        fourth: "#4d075a",
        fifth: "#FFC856",
      },
    };
    const newColors = {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        third: colors.third,
        fourth: colors.fourth,
        fifth: colors.fifth,
      },
    };
    const payload = {
      ...settings,
      themes: JSON.stringify(colors),
    };
    dispatch(putLoginSettings(payload));
    dispatch(updateThemeColors({ colors: colors }));
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
        <p>Purple theme colors: primary: "#7a1b8b", secondary: "#8c3b9b", third: "#3f034a", fourth: "#4d075a", fifth: "#FFC856"</p>
        <p>
          Add your primary color (current: <ColorSpan color={theme.colors.primary}>{theme.colors.primary} </ColorSpan>)
        </p>
        <Inputfields className="w-100 form-control" id="primarycolor" onChange={handleChangePrimary}></Inputfields>
        <p>
          Add your Secondary color (current: <ColorSpan color={theme.colors.secondary}>{theme.colors.secondary} </ColorSpan>)
        </p>
        <Inputfields className="w-100 form-control" id="secondarycolor" onChange={handleChangeSecondary}></Inputfields>
        <p>
          Add your Third color - sidebar logo bg color (current: <ColorSpan color={theme.colors.third}>{theme.colors.third} </ColorSpan>)
        </p>
        <Inputfields className="w-100 form-control" id="thirdcolor" onChange={handleChangeThird}></Inputfields>
        <p>
          Add your Fourth color - sidebar color (current: <ColorSpan color={theme.colors.fourth}>{theme.colors.fourth} </ColorSpan>)
        </p>
        <Inputfields className="w-100 form-control" id="fourthcolor" onChange={handleChangeFourth}></Inputfields>
        <p>
          Add your Fifth color - guest color (current: <ColorSpan color={theme.colors.fifth}>{theme.colors.fifth} </ColorSpan>)
        </p>
        <Inputfields className="w-100 form-control" id="fourthcolor" onChange={handleChangeFifth}></Inputfields>
        <div className="d-flex align-items-center">
          <SubmitButton className="btn btn-primary mr-2" id="SubmitColors" onClick={handleSubmit}>
            Submit
          </SubmitButton>
          <SubmitButton className="btn btn-primary" onClick={handlePreviewTheme}>
            Preview
          </SubmitButton>
        </div>
      </Wrapper>
    </div>
  );
}

export default StylingSettingsBody;
