import React, { useEffect, useState, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { useSelector } from "react-redux";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { Loader, SvgIconFeather } from "../../common";
import { DomainSelect } from "../../forms";
import Tooltip from "react-tooltip-lite";

const isValidDomain = require("is-valid-domain");

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

const LoginSettingsBody = () => {
  const { _t } = useTranslationActions();
  const toast = useToaster();
  const theme = useTheme();
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
    loginMode: _t("ADMIN.LOGIN_MODE", "Login mode"),
    loginModeInfo: _t("ADMIN.LOGIN_MODE_INFO", "Default login mode email or mobile"),
  };

  const componentIsMounted = useRef(true);

  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;

  const loginSettings = useSelector((state) => state.admin.login);
  const loginFetched = useSelector((state) => state.admin.loginFetched);
  const filters = useSelector((state) => state.admin.filters);
  const domains = useSelector((state) => state.settings.driff.domains);
  const custom_translation = useSelector((state) => state.settings.driff.settings.custom_translation);
  const themes = useSelector((state) => state.settings.driff.theme);

  const { fetchLoginSettings, updateLoginSettings, setAdminFilter, updateDomains } = useAdminActions();

  const [settings, setSettings] = useState({ ...loginSettings, custom_translation: custom_translation });
  const [saving, setSaving] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [selectedDomains, setSelectedDomains] = useState(
    domains.map((d) => {
      return {
        value: d,
        label: d,
      };
    })
  );

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, settings: true } });
    if (!loginFetched) fetchLoginSettings({});
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setSettings(loginSettings);
  }, [loginSettings]);

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

  const googleOptions = options.map((o) => {
    return { ...o, name: "google_login" };
  });

  const magicOptions = options.map((o) => {
    return { ...o, name: "magic_link" };
  });

  const signUpOptions = options.map((o) => {
    return { ...o, name: "sign_up" };
  });

  const passwordLoginOptions = options.map((o) => {
    return { ...o, name: "password_login" };
  });

  const translationOptions = options.map((o) => {
    return { ...o, name: "custom_translation" };
  });

  const domainOptions = [
    // {
    //   value: "makedevelopment.com",
    //   label: "makedevelopment.com",
    // },
    // {
    //   value: "zuid.com",
    //   label: "zuid.com",
    // },
  ];

  const loginOptions = [
    {
      value: "mobile",
      label: "Mobile",
    },
    {
      value: "email",
      label: "Email",
    },
  ];

  const handleCreateOption = (value) => {
    setSelectedDomains([
      ...selectedDomains,
      {
        value: value,
        label: value,
      },
    ]);
  };

  const handleSelectDomain = (e) => {
    if (e === null) {
      setSelectedDomains([]);
    } else {
      setSelectedDomains(e);
    }
  };

  const handleDomainInputChange = (e) => {
    setDomainInput(e);
  };

  const handleDomainValidation = (inputValue, selectValue, selectOptions) => {
    const isExistingOption = selectOptions.some((o) => o.value === inputValue);
    const isSelectedOption = selectValue.some((o) => o.value === inputValue);
    if (!isExistingOption && !isSelectedOption && inputValue !== "") {
      //validate domain
      return isValidDomain(inputValue, { subdomain: false });
    } else {
      //reset to default
      //validateExternalEmail(null);
      return false;
    }
  };

  const formatCreateLabel = (inputValue) => {
    return `Allow ${inputValue}`;
  };

  const handleSelect = (e) => {
    if (e.name === "password_login" && e.value === false && settings.google_login === false) {
      setSettings({
        ...settings,
        [e.name]: e.value,
        google_login: true,
      });
    } else if (e.name === "google_login" && e.value === false && settings.password_login === false) {
      setSettings({
        ...settings,
        [e.name]: e.value,
        password_login: true,
      });
    } else {
      setSettings({
        ...settings,
        [e.name]: e.value,
      });
    }
  };

  const handleSubmit = () => {
    setSaving(true);
    const payload = {
      ...settings,
      // custom_translation: custom_translation,
      domains: selectedDomains.map((d) => d.value).toString(),
      themes: JSON.stringify(themes.colors),
    };

    updateLoginSettings(payload, (err, res) => {
      if (componentIsMounted.current) setSaving(false);
      if (err) {
        toast.error(dictionary.toasterUpdateLoginError);
        return;
      }
      updateDomains(selectedDomains.map((d) => d.value));
      toast.success(dictionary.loginSettingsUpdated);
    });
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const handleSelectLogin = (e) => {
    setSettings({ ...settings, login_mode: e.value });
  };

  return (
    <Wrapper>
      <h4>{dictionary.loginSettings}</h4>
      <h6 className="mb-3">{dictionary.loginSettingsDescription}</h6>
      {!loginFetched && (
        <LoaderContainer className={"initial-load"}>
          <Loader />
        </LoaderContainer>
      )}
      {loginFetched && (
        <>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.passwordLogin}</label>{" "}
              <Tooltip onToggle={toggleTooltip} content={dictionary.passwordLoginInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={passwordLoginOptions.find((o) => o.value === settings.password_login)}
              onChange={handleSelect}
              options={passwordLoginOptions}
            />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.googleLogin}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.googleLoginInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={googleOptions.find((o) => o.value === settings.google_login)}
              onChange={handleSelect}
              options={googleOptions}
              menuColor={theme.colors.primary}
            />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.magicLink}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.magicLinkInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={magicOptions.find((o) => o.value === settings.magic_link)}
              onChange={handleSelect}
              options={magicOptions}
              menuColor={theme.colors.primary}
            />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.signUp}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.signupInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={signUpOptions.find((o) => o.value === settings.sign_up)}
              onChange={handleSelect}
              options={signUpOptions}
              menuColor={theme.colors.primary}
            />
          </div>

          {settings.sign_up && (
            <div>
              <LabelInfoWrapper>
                <label className="mt-1">{dictionary.allowedDomains}</label>{" "}
                <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.allowedDomainsInfo}>
                  <SvgIconFeather icon="info" />
                </Tooltip>
              </LabelInfoWrapper>
              <DomainSelect
                styles={dark_mode === "0" ? lightTheme : darkTheme}
                value={selectedDomains}
                onChange={handleSelectDomain}
                options={domainOptions}
                inputValue={domainInput}
                isValidNewOption={handleDomainValidation}
                onCreateOption={handleCreateOption}
                onInputChange={handleDomainInputChange}
                formatCreateLabel={formatCreateLabel}
                isSearchable
                className={"react-select-container"}
                classNamePrefix="react-select"
                placeholder="Domain..."
                menuColor={theme.colors.primary}
              />
            </div>
          )}

          <div>
            <LabelInfoWrapper>
              <label>{dictionary.customTranslation}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.customTranslationInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={translationOptions.find((o) => o.value === settings.custom_translation)}
              onChange={handleSelect}
              options={translationOptions}
              menuColor={theme.colors.primary}
            />
          </div>

          <div>
            <LabelInfoWrapper>
              <label>Login mode</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.customTranslationInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={loginOptions.find((o) => o.value === settings.login_mode)}
              onChange={handleSelectLogin}
              options={loginOptions}
              menuColor={theme.colors.primary}
            />
          </div>

          <div className="mt-2">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !loginFetched}>
              {dictionary.saveLogin}
            </button>
          </div>
        </>
      )}

      <div></div>
    </Wrapper>
  );
};

export default LoginSettingsBody;
