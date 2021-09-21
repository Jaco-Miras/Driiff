import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
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
  };

  const componentIsMounted = useRef(true);

  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;

  const loginSettings = useSelector((state) => state.admin.login);
  const loginFetched = useSelector((state) => state.admin.loginFetched);
  const filters = useSelector((state) => state.admin.filters);
  const domains = useSelector((state) => state.settings.driff.domains);

  const { fetchLoginSettings, updateLoginSettings, setAdminFilter, updateDomains } = useAdminActions();

  const [settings, setSettings] = useState({ ...loginSettings });
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
      domains: selectedDomains.map((d) => d.value).toString(),
    };

    updateLoginSettings(payload, (err, res) => {
      if (componentIsMounted.current) setSaving(false);
      if (err) return;
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

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.loginSettings}</h4>
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
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={passwordLoginOptions.find((o) => o.value === settings.password_login)} onChange={handleSelect} options={passwordLoginOptions} />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.googleLogin}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.googleLoginInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={googleOptions.find((o) => o.value === settings.google_login)} onChange={handleSelect} options={googleOptions} />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.magicLink}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.magicLinkInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={magicOptions.find((o) => o.value === settings.magic_link)} onChange={handleSelect} options={magicOptions} />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.signUp}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.signupInfo}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={signUpOptions.find((o) => o.value === settings.sign_up)} onChange={handleSelect} options={signUpOptions} />
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
                classNamePrefix="react-select"
                placeholder="Domain..."
              />
            </div>
          )}

          <div className="mt-2">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !loginFetched}>
              {dictionary.saveLogin}
            </button>
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default LoginSettingsBody;
