import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { FolderSelect } from "../../forms";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { useTranslationActions, useToaster } from "../../hooks";
import { Loader } from "../../common";
//import Tooltip from "react-tooltip-lite";
import { putPostAccess } from "../../../redux/actions/adminActions";

const Wrapper = styled.div`
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const LabelInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  label {
    margin: 0 !important;
  }
  margin-bottom: 0.5rem;
`;

const PageSettingsBody = () => {
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();
  const toast = useToaster();

  const dictionary = {
    loginSettings: _t("ADMIN.LOGIN_SETTINGS", "Login settings"),
    googleLogin: _t("ADMIN.GOOGLE_LOGIN", "Google login"),
    magicLink: _t("ADMIN.MAGIC_LINK", "Magic link"),
    signUp: _t("ADMIN.SIGN_UP", "Sign up"),
    passwordLogin: _t("ADMIN.PASSWORD_LOGIN", "Password login"),
    saveLogin: _t("ADMIN.SAVE_LOGIN", "Save login"),
    enable: _t("LABEL.ENABLE", "Enable"),
    disable: _t("LABEL.DISABLE", "Disable"),
    loginSettingsUpdated: _t("TOAST.LOGIN_SETTINGS_SUCCESS", "Login settings updated"),
    allowedDomains: _t("ADMIN.ALLOWED_DOMAINS", "Allowed domains"),
    passwordLoginInfo: _t("ADMIN.PASSWORD_LOGIN_INFO", "If disabled only external users can login using the login form"),
    googleLoginInfo: _t("ADMIN.GOOGLE_LOGIN_INFO", "Show/Hide google login button"),
    magicLinkInfo: _t("ADMIN.MAGIC_LINK_INFO", "Show/Hide magic link button"),
    signupInfo: _t("ADMIN.SIGN_UP_INFO", "Show/Hide register button"),
    allowedDomainsInfo: _t("ADMIN.ALLOWED_DOMAINS_INFO", "Domain list allowed when signing up in driff"),
    loginSettingsDescription: _t("ADMIN.LOGIN_SETTINGS_DESCRIPTION", "Edit login/signup settings for Driff. More info can be found here (External link icon)"),
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

  //const componentIsMounted = useRef(true);

  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;

  const postAccess = useSelector((state) => state.admin.postAccess);
  const loaded = useSelector((state) => state.admin.postAccess.loaded);
  const usersLoaded = useSelector((state) => state.users.usersLoaded);

  const users = useSelector((state) => state.users.users);

  const [settings, setSettings] = useState({
    post: null,
  });
  const [postUsers, setPostUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  const options = [
    {
      value: false,
      label: dictionary.disable,
    },
    {
      value: true,
      label: dictionary.enable,
    },
  ];

  const postOptions = options.map((o) => {
    return { ...o, name: "sign_up" };
  });

  const userSort = Object.values(users)
    .filter((user) => {
      if (["gripp_project_bot", "gripp_account_activation", "gripp_offerte_bot", "gripp_invoice_bot", "gripp_police_bot", "driff_webhook_bot", "huddle_bot"].includes(user.email)) return false;

      if (user.active !== 1) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const usersOptions = userSort.map((u) => {
    return {
      ...u,
      icon: "user-avatar",
      value: u.id,
      label: u.name,
    };
  });

  const postUserAccessOptions = [
    {
      value: "all",
      label: "All users",
      icon: "home",
    },
    // {
    //   value: "admin",
    //   label: "Administrators",
    //   icon: "users",
    // },
    ...usersOptions,
  ];

  useEffect(() => {
    if (postAccess.loaded && usersLoaded) {
      setSettings({
        post: postAccess.post,
      });
      if (postAccess.post_user_ids.some((id) => id === 0)) {
        setPostUsers(postUserAccessOptions.filter((p) => p.value === "all"));
      } else {
        setPostUsers(usersOptions.filter((o) => postAccess.post_user_ids.some((id) => id === o.id)));
      }
    }
  }, [postAccess, usersLoaded]);

  const handlePostSelect = (e) => {
    setSettings({
      ...settings,
      post: e ? e.value : null,
    });
  };

  const handleSelectUsers = (e) => {
    if (e && e.some((v) => v.value === "all")) {
      // remove users
      setPostUsers(e.filter((v) => v.value === "all"));
    } else {
      setPostUsers(e);
    }
  };

  const handleSubmit = () => {
    setSaving(true);
    let payload = {
      post_access: settings.post,
      user_ids: [],
    };
    if (postUsers.find((pu) => pu.value === "all")) {
      payload = {
        ...payload,
        user_ids: [0],
      };
    } else {
      payload = {
        ...payload,
        user_ids: postUsers.map((pu) => pu.value),
      };
    }
    dispatch(
      putPostAccess(payload, (err, res) => {
        setSaving(false);
        if (err) return;
        toast.success("Settings updated");
      })
    );
  };

  // const toggleTooltip = () => {
  //   let tooltips = document.querySelectorAll("span.react-tooltip-lite");
  //   tooltips.forEach((tooltip) => {
  //     tooltip.parentElement.classList.toggle("tooltip-active");
  //   });
  // };

  return (
    <Wrapper>
      <h4>Page settings</h4>
      <h6 className="mb-3">Page settings description</h6>
      {!loaded && (
        <LoaderContainer className={"initial-load"}>
          <Loader />
        </LoaderContainer>
      )}
      {loaded && (
        <>
          <div>
            <LabelInfoWrapper>
              <label>Post page</label>
              {/* <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.signupInfo}>
            <SvgIconFeather icon="info" />
          </Tooltip> */}
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={postOptions.find((o) => o.value === settings.post)}
              onChange={handlePostSelect}
              options={postOptions}
              //isClearable={true}
            />
          </div>

          {settings.post && (
            <div>
              <LabelInfoWrapper>
                <label className="mt-1">Allowed users</label>
                {/* <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.allowedDomainsInfo}>
              <SvgIconFeather icon="info" />
            </Tooltip> */}
              </LabelInfoWrapper>
              <FolderSelect value={postUsers} onChange={handleSelectUsers} options={postUserAccessOptions} isMulti={true} />
            </div>
          )}

          <div className="mt-2">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {dictionary.saveLogin}
            </button>
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default PageSettingsBody;
