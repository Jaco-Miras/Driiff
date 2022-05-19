import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions, useToaster, useOutsideClick } from "../../hooks";
import { DropDocument } from "../../dropzone/DropDocument";
import { updateThemeColors } from "../../../redux/actions/settingsActions";
import { putLoginSettings } from "../../../redux/actions/adminActions";
import { BlockPicker } from "react-color";
import { CustomInput } from "reactstrap";
import colorWheel from "../../../assets/img/svgs/RGB_color_wheel_12.svg";
import { putNotificationSettings, getNotificationSettings } from "../../../redux/actions/adminActions";
import { Loader } from "../../common";

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
  .custom-switch {
    padding: 0;
    justify-content: left;
    align-items: center;
    display: flex;
    min-height: 38px;
    .custom-control-label::after {
      right: -11px;
      left: auto;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 100%;
      top: 2px;
    }

    input[type="checkbox"]:checked + .custom-control-label::after {
      right: -23px;
    }

    .custom-control-label::before {
      right: -2.35rem;
      left: auto;
      width: 3rem;
      height: 1.5rem;
      border-radius: 48px;
      top: 0;
    }

    input {
      cursor: pointer;
    }
    label {
      cursor: pointer;
      width: auto;
      min-height: 25px;
      display: flex;
      align-items: center;

      span {
        display: block;
        margin-right: 2rem;
      }
    }
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

function StylingSettingsBody() {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const pickerRefPrimary = useRef(null);
  const pickerRefSecondary = useRef(null);
  const pickerRefThird = useRef(null);
  const pickerRefFourth = useRef(null);
  const pickerRefFifth = useRef(null);
  const pickerRefSidebarTextColor = useRef(null);
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
    toasterStylingSuccess: _t("TOASTER.UPDATE_STYLING_SUCCESS", "Successfully updated styling"),
    primaryLabel: _t("LABEL.PRIMARY_COLOR", "Primary color"),
    secondaryLabel: _t("LABEL.SECONDARY_COLOR", "Secondary color"),
    thirdLabel: _t("LABEL.TERTIARY_COLOR", "Tertiary color"),
    fourthLabel: _t("LABEL.CTA_COLOR", "CTA color"),
    fifthLabel: _t("LABEL.FIFTH_COLOR", "Sidebar logo background color"),
    sidebarTextColorLabel: _t("LABEL.SIDEBAR_TEXT_COLOR", "Sidebar text color"),
    submitBtn: _t("BTN.SUBMIT", "Submit"),
    resetPreviewBtn: _t("BTN.RESET_DEFAULT_COLORS", "Reset default colors"),
    email: _t("EMAIL", "Email"),
    webPush: _t("WEBPUSH", "Web push"),
    apn: _t("APN_IOS", "Apple push notification"),
    saveNotification: _t("BUTTON.SAVE_NOTIFICATION", "Save notification"),
    notifications: _t("NOTIFICATIONS", "Notifications"),
    styling: _t("STYLING", "Styling"),
    dashboardBg: _t("LABEL.DASHBOARD_BACKGROUND", "Dashboard background"),
    uploadBg: _t("BUTTON.UPLOAD_BACKGROUND", "Upload background"),
    faviconImg: _t("LABEL.FAVICON", "Favicon"),
    uploadFavicon: _t("BUTTON.UPLOAD_FAVICON", "Upload favicon"),
    languageLabel: _t("SETTINGS.LANGUAGE_LABEL", "Language"),
    companyLanguage: _t("SETTINGS.COMPANY_LANGUAGE_LABEL", "Company language"),
    updateLanguage: _t("BUTTON.UPDATE_LANGUAGE", "Update language"),
    toasterSettingsUpdated: _t("TOASTER.COMPANY_SETTINGS_UPDATED", "Successfully updated company settings"),
  };

  const iconDropZone = useRef(null);
  const faviconDropZone = useRef(null);
  const [showIconDropzone, setShowIconDropzone] = useState(false);
  const bgDropZone = useRef(null);
  const [showBgDropzone, setShowBgDropzone] = useState(false);
  const toast = useToaster();
  const { uploadLogo, resetLogo, uploadDashboardBackground, fetchLoginSettings, uploadFaviconImage } = useAdminActions();
  const logo = useSelector((state) => state.settings.driff.logo);
  const theme = useSelector((state) => state.settings.driff.theme);
  const origTheme = useSelector((state) => state.settings.origTheme);
  const loginFetched = useSelector((state) => state.admin.loginFetched);
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
  const notificationSettings = useSelector((state) => state.admin.notifications);
  const notificationsLoaded = useSelector((state) => state.admin.notificationsLoaded);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    if (!notificationsLoaded) {
      dispatch(
        getNotificationSettings({}, (err, res) => {
          if (err) return;
          setNotifications(res.data);
        })
      );
    }
    if (!loginFetched) {
      fetchLoginSettings({});
    }
  }, []);

  useEffect(() => {
    setSettings(loginSettings);
  }, [loginSettings]);

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

  const handleUploadDashboardBg = (file) => {
    let payload = {
      file: file,
      code: "code",
    };
    let cb = (err, res) => {
      if (err) return;
      toast.success(dictionary.uploadSuccess);
    };
    uploadDashboardBackground(payload, cb);
  };
  const handleUploadFavicon = (file) => {
    setUploadingFavicon(true);
    let payload = {
      file: file,
      code: "code",
    };
    let cb = (err, res) => {
      setUploadingFavicon(false);
      if (err) return;
      toast.success(dictionary.uploadSuccess);

      const favicon = document.getElementById("favicon");
      favicon.href = res.data.path.image_link;
    };
    uploadFaviconImage(payload, cb);
  };

  const dropBgAction = (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      toast.error(dictionary.fileTypeError);
    } else if (uploadedFiles.length > 1) {
      toast.warning(dictionary.multipleFileError);
    }
    handleUploadDashboardBg(uploadedFiles[0]);
  };
  const dropFaviconAction = (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      toast.error(dictionary.fileTypeError);
    } else if (uploadedFiles.length > 1) {
      toast.warning(dictionary.multipleFileError);
    }
    handleUploadFavicon(uploadedFiles[0]);
  };

  const handleOpenBgDropzone = () => {
    if (bgDropZone.current) bgDropZone.current.open();
  };

  const handleHideBgDropzone = () => {
    setShowBgDropzone(false);
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

  const handleChangeSidebarTextColor = (e) => {
    setColors({ ...colors, sidebarTextColor: e.target.value });
    dispatch(updateThemeColors({ colors: { sidebarTextColor: e.target.value } }));
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
    if (payload.domains) delete payload.domains;
    dispatch(
      putLoginSettings(payload, (err, res) => {
        if (err) return;
        toast.success(dictionary.toasterSettingsUpdated);
      })
    );
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
  useOutsideClick(pickerRefSidebarTextColor, () => setShowColorPicker({ ...showColorPicker, sidebarTextColor: !showColorPicker.sidebarTextColor }), showColorPicker.sidebarTextColor);

  const handleToggleEmailNotification = () => {
    setNotifications({
      ...notifications,
      email: !notifications.email,
    });
    //toast.success(notifications.email ? "Email notifications are now disabled" : "Email notifications are now enabled");
  };
  const handleToggleWebpushNotification = () => {
    setNotifications({
      ...notifications,
      webpush: !notifications.webpush,
    });
    //toast.success(notifications.webpush ? "Web push notifications are now disabled" : "Web push notifications are now enabled");
  };
  const handleToggleApnNotification = () => {
    setNotifications({
      ...notifications,
      apn: !notifications.apn,
    });
    // toast.success(notifications.apn ? "APN notifications are now disabled" : "APN notifications are now enabled");
  };
  const handleSaveNotificationSettings = () => {
    setSavingNotifications(true);
    dispatch(
      putNotificationSettings(notifications, (err, res) => {
        setSavingNotifications(false);
        if (err) return;
        if (res) {
          toast.success("Notification settings updated");
        }
      })
    );
  };

  return (
    <Wrapper theme={theme}>
      {!loginFetched && (
        <LoaderContainer className={"initial-load"}>
          <Loader />
        </LoaderContainer>
      )}
      {loginFetched && (
        <>
          <h4 className="mt-2">{dictionary.companyLogo}</h4>
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
          <h4 className="mt-3">{dictionary.dashboardBg}</h4>
          <div>
            <DropDocument
              acceptType="imageOnly"
              hide={!showBgDropzone}
              ref={bgDropZone}
              onDragLeave={handleHideBgDropzone}
              onDrop={({ acceptedFiles }) => {
                dropBgAction(acceptedFiles);
              }}
              onCancel={handleHideBgDropzone}
            />
            <button className="btn btn-primary" onClick={handleOpenBgDropzone}>
              {dictionary.uploadBg}
            </button>
          </div>
          <h4 className="mt-3">{dictionary.faviconImg}</h4>
          <div>
            <DropDocument
              acceptType="imageOnly"
              hide
              ref={faviconDropZone}
              onDrop={({ acceptedFiles }) => {
                dropFaviconAction(acceptedFiles);
              }}
            />
            <button className="btn btn-primary" onClick={() => faviconDropZone.current.open()} disabled={uploadingFavicon}>
              {dictionary.uploadFavicon} {uploadingFavicon && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            </button>
          </div>
          <h4 className="mt-3">{dictionary.styling}</h4>
          {/* <p>Purple theme colors: primary: "#7a1b8b", secondary: "#8c3b9b", third: "#3f034a", fourth: "#4d075a", fifth: "#FFC856"</p>
        <p>New theme colors: primary: "#29323F", secondary: "#4E5D72", third: "#192536", fourth: "#29323F", fifth: "#FFC856"</p> */}
          <ColorInputWrapper>
            <span>
              {dictionary.primaryLabel} (current:{" "}
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
              {dictionary.secondaryLabel} (current:{" "}
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
              {dictionary.thirdLabel} (current:{" "}
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
              {dictionary.fourthLabel} (current:{" "}
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
              {dictionary.fifthLabel} (current:{" "}
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
          <ColorInputWrapper>
            <span>
              {dictionary.sidebarTextColorLabel} (current:{" "}
              <ColorSpan color={theme.colors.sidebarTextColor}>
                {theme.colors.sidebarTextColor}
                {showColorPicker.sidebarTextColor && (
                  <PickerWrapper ref={pickerRefSidebarTextColor}>
                    <BlockPicker
                      colors={["#cbd4db", "#000", ...blockColors]}
                      color={colors.sidebarTextColor}
                      onChange={(color) => {
                        handleColorChange(color, "sidebarTextColor");
                      }}
                    />
                  </PickerWrapper>
                )}
              </ColorSpan>
              )
              <ColorWheelIcon className="color-picker ml-2" src={colorWheel} alt="color picker" onClick={(e) => handleShowColorPicker(e, "sidebarTextColor")} />
            </span>
            <Inputfields className="w-100 form-control mt-2" id="sidebarTextColorcolor" onChange={handleChangeSidebarTextColor} value={colors.sidebarTextColor}></Inputfields>
          </ColorInputWrapper>

          <div className="d-flex align-items-center">
            <SubmitButton className="btn btn-primary mr-2" id="SubmitColors" onClick={handleSubmit}>
              {dictionary.submitBtn}
            </SubmitButton>
            {/* <SubmitButton className="btn btn-primary mr-2" onClick={handlePreviewTheme}>
            Preview
          </SubmitButton> */}
            <SubmitButton className="btn btn-primary" onClick={handleResetPreview}>
              {dictionary.resetPreviewBtn}
            </SubmitButton>
          </div>
          <h4 className="mt-3">{dictionary.notifications}</h4>
          <CustomInput
            className="cursor-pointer text-muted"
            checked={notifications.email}
            type="switch"
            id="email"
            name="email"
            data-success-message={`${notifications.email ? "Email notifications are now enabled" : "Email notifications are now disabled"}`}
            onChange={handleToggleEmailNotification}
            label={<span>{dictionary.email}</span>}
            disabled={notificationsLoaded === false}
          />
          <CustomInput
            className="cursor-pointer text-muted"
            checked={notifications.webpush}
            type="switch"
            id="webpush"
            name="webpush"
            //data-success-message={`${sentry ? "Logs are now enabled" : "Logs are now disabled"}`}
            onChange={handleToggleWebpushNotification}
            label={<span>{dictionary.webPush}</span>}
            disabled={notificationsLoaded === false}
          />
          <CustomInput
            className="cursor-pointer text-muted"
            checked={notifications.apn}
            type="switch"
            id="apn"
            name="apn"
            //data-success-message={`${sentry ? "Logs are now enabled" : "Logs are now disabled"}`}
            onChange={handleToggleApnNotification}
            label={<span>{dictionary.apn}</span>}
            disabled={notificationsLoaded === false}
          />
          <div className="d-flex align-items-center mt-2">
            <SubmitButton className="btn btn-primary mr-2" id="SubmitColors" onClick={handleSaveNotificationSettings} disabled={savingNotifications || !notificationsLoaded}>
              {dictionary.saveNotification}
            </SubmitButton>
          </div>
        </>
      )}
    </Wrapper>
  );
}

export default StylingSettingsBody;
