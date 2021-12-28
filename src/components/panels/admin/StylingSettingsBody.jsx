import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions, useToaster, useOutsideClick } from "../../hooks";
import { DropDocument } from "../../dropzone/DropDocument";
import { updateThemeColors } from "../../../redux/actions/settingsActions";
import { putLoginSettings } from "../../../redux/actions/adminActions";
import { BlockPicker } from "react-color";
import colorWheel from "../../../assets/img/svgs/RGB_color_wheel_12.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  // > div {
  //   margin-bottom: 1rem;
  // }
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
  position: relative;
`;

const ColorInputWrapper = styled.div``;

const PickerWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: -50px;
  top: 30px;
`;

const ColorWheelIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

function StylingSettingsBody() {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const pickerRefPrimary = useRef(null);
  const pickerRefSecondary = useRef(null);
  const pickerRefThird = useRef(null);
  const pickerRefFourth = useRef(null);
  const pickerRefFifth = useRef(null);
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
  const origTheme = useSelector((state) => state.settings.origTheme);
  const loginSettings = useSelector((state) => state.admin.login);
  const custom_translation = useSelector((state) => state.settings.driff.settings.custom_translation);
  const [settings, setSettings] = useState({ ...loginSettings, custom_translation: custom_translation });
  const [colors, setColors] = useState({ ...theme.colors });
  const [showColorPicker, setShowColorPicker] = useState({
    primary: false,
    secondary: false,
    third: false,
    fourth: false,
    fifth: false,
  });

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
    dispatch(updateThemeColors({ colors: { primary: e.target.value } }));
  };
  const handleChangeSecondary = (e) => {
    setColors({ ...colors, secondary: e.target.value });
    dispatch(updateThemeColors({ colors: { secondary: e.target.value } }));
  };
  const handleChangeThird = (e) => {
    setColors({ ...colors, third: e.target.value });
    dispatch(updateThemeColors({ colors: { third: e.target.value } }));
  };

  const handleChangeFourth = (e) => {
    setColors({ ...colors, fourth: e.target.value });
    dispatch(updateThemeColors({ colors: { fourth: e.target.value } }));
  };

  const handleChangeFifth = (e) => {
    setColors({ ...colors, fifth: e.target.value });
    dispatch(updateThemeColors({ colors: { fifth: e.target.value } }));
  };

  // const handlePreviewTheme = () => {
  //   dispatch(updateThemeColors({ colors: colors }));
  // };

  const handleResetPreview = () => {
    dispatch(updateThemeColors({ colors: origTheme.colors }));
    setColors({ ...origTheme.colors });
  };

  const handleSubmit = () => {
    const payload = {
      ...settings,
      themes: JSON.stringify(theme.colors),
    };
    dispatch(putLoginSettings(payload));
    dispatch(updateThemeColors({ colors: colors }));
  };

  const handleColorChange = (color, key) => {
    setColors({ ...colors, [key]: color.hex });
    dispatch(updateThemeColors({ colors: { [key]: color.hex } }));
  };

  const handleShowColorPicker = (e, key) => {
    e.stopPropagation();
    e.preventDefault();
    setShowColorPicker({
      ...showColorPicker,
      [key]: !showColorPicker[key],
    });
  };
  const blockColors = ["#29323F", "#4E5D72", "#192536", "#FFC856", "#7a1b8b", "#8c3b9b", "#3f034a", "#4d075a", "#d9e3f0", "#f47373", "#37d67a", "#2ccce4", "#dce775", "#ff8a65"];
  useOutsideClick(pickerRefPrimary, () => setShowColorPicker({ ...showColorPicker, primary: !showColorPicker.primary }), showColorPicker.primary);
  useOutsideClick(pickerRefSecondary, () => setShowColorPicker({ ...showColorPicker, secondary: !showColorPicker.secondary }), showColorPicker.secondary);
  useOutsideClick(pickerRefThird, () => setShowColorPicker({ ...showColorPicker, third: !showColorPicker.third }), showColorPicker.third);
  useOutsideClick(pickerRefFourth, () => setShowColorPicker({ ...showColorPicker, fourth: !showColorPicker.fourth }), showColorPicker.fourth);
  useOutsideClick(pickerRefFifth, () => setShowColorPicker({ ...showColorPicker, fifth: !showColorPicker.fifth }), showColorPicker.fifth);

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
        <h4 className="mt-3">Styling</h4>
        {/* <p>Purple theme colors: primary: "#7a1b8b", secondary: "#8c3b9b", third: "#3f034a", fourth: "#4d075a", fifth: "#FFC856"</p>
        <p>New theme colors: primary: "#29323F", secondary: "#4E5D72", third: "#192536", fourth: "#29323F", fifth: "#FFC856"</p> */}
        <ColorInputWrapper>
          <span>
            Add your primary color (current:{" "}
            <ColorSpan color={theme.colors.primary}>
              {theme.colors.primary}
              {showColorPicker.primary && (
                <PickerWrapper ref={pickerRefPrimary}>
                  <BlockPicker
                    colors={blockColors}
                    color={colors.primary}
                    onChange={(color) => {
                      handleColorChange(color, "primary");
                    }}
                  />
                </PickerWrapper>
              )}
            </ColorSpan>
            )
            <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt="color picker" onClick={(e) => handleShowColorPicker(e, "primary")} />
          </span>
          <Inputfields className="w-100 form-control mt-2" id="primarycolor" onChange={handleChangePrimary} value={colors.primary}></Inputfields>
        </ColorInputWrapper>

        <ColorInputWrapper>
          <span>
            Add your secondary color (current:{" "}
            <ColorSpan color={theme.colors.secondary}>
              {theme.colors.secondary}
              {showColorPicker.secondary && (
                <PickerWrapper ref={pickerRefSecondary}>
                  <BlockPicker
                    colors={blockColors}
                    color={colors.secondary}
                    onChange={(color) => {
                      handleColorChange(color, "secondary");
                    }}
                  />
                </PickerWrapper>
              )}
            </ColorSpan>
            )
            <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt="color picker" onClick={(e) => handleShowColorPicker(e, "secondary")} />
          </span>
          <Inputfields className="w-100 form-control mt-2" id="secondarycolor" onChange={handleChangeSecondary} value={colors.secondary}></Inputfields>
        </ColorInputWrapper>
        <ColorInputWrapper>
          <span>
            Add your third color (current:{" "}
            <ColorSpan color={theme.colors.third}>
              {theme.colors.third}
              {showColorPicker.third && (
                <PickerWrapper ref={pickerRefThird}>
                  <BlockPicker
                    colors={blockColors}
                    color={colors.third}
                    onChange={(color) => {
                      handleColorChange(color, "third");
                    }}
                  />
                </PickerWrapper>
              )}
            </ColorSpan>
            )
            <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt="color picker" onClick={(e) => handleShowColorPicker(e, "third")} />
          </span>
          <Inputfields className="w-100 form-control mt-2" id="thirdcolor" onChange={handleChangeThird} value={colors.third}></Inputfields>
        </ColorInputWrapper>
        <ColorInputWrapper>
          <span>
            Add your fourth color - guest color (current:{" "}
            <ColorSpan color={theme.colors.fourth}>
              {theme.colors.fourth}
              {showColorPicker.fourth && (
                <PickerWrapper ref={pickerRefFourth}>
                  <BlockPicker
                    colors={blockColors}
                    color={colors.fourth}
                    onChange={(color) => {
                      handleColorChange(color, "fourth");
                    }}
                  />
                </PickerWrapper>
              )}
            </ColorSpan>
            )
            <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt="color picker" onClick={(e) => handleShowColorPicker(e, "fourth")} />
          </span>
          <Inputfields className="w-100 form-control mt-2" id="fourthcolor" onChange={handleChangeFourth} value={colors.fourth}></Inputfields>
        </ColorInputWrapper>
        <ColorInputWrapper>
          <span>
            Add your fifth color - sidebar logo bg color (current:{" "}
            <ColorSpan color={theme.colors.fifth}>
              {theme.colors.fifth}
              {showColorPicker.fifth && (
                <PickerWrapper ref={pickerRefFifth}>
                  <BlockPicker
                    colors={blockColors}
                    color={colors.fifth}
                    onChange={(color) => {
                      handleColorChange(color, "fifth");
                    }}
                  />
                </PickerWrapper>
              )}
            </ColorSpan>
            )
            <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt="color picker" onClick={(e) => handleShowColorPicker(e, "fifth")} />
          </span>
          <Inputfields className="w-100 form-control mt-2" id="fifthcolor" onChange={handleChangeFifth} value={colors.fifth}></Inputfields>
        </ColorInputWrapper>

        <div className="d-flex align-items-center">
          <SubmitButton className="btn btn-primary mr-2" id="SubmitColors" onClick={handleSubmit}>
            Submit
          </SubmitButton>
          {/* <SubmitButton className="btn btn-primary mr-2" onClick={handlePreviewTheme}>
            Preview
          </SubmitButton> */}
          <SubmitButton className="btn btn-primary" onClick={handleResetPreview}>
            Reset preview
          </SubmitButton>
        </div>
      </Wrapper>
    </div>
  );
}

export default StylingSettingsBody;
