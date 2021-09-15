import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { Loader } from "../../common";
import { DomainSelect } from "../../forms";
const isValidDomain = require("is-valid-domain");

const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
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
            <label>{dictionary.passwordLogin}</label>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={passwordLoginOptions.find((o) => o.value === settings.password_login)} onChange={handleSelect} options={passwordLoginOptions} />
          </div>
          <div>
            <label>{dictionary.googleLogin}</label>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={googleOptions.find((o) => o.value === settings.google_login)} onChange={handleSelect} options={googleOptions} />
          </div>
          <div>
            <label>{dictionary.magicLink}</label>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={magicOptions.find((o) => o.value === settings.magic_link)} onChange={handleSelect} options={magicOptions} />
          </div>
          <div>
            <label>{dictionary.signUp}</label>
            <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={signUpOptions.find((o) => o.value === settings.sign_up)} onChange={handleSelect} options={signUpOptions} />
            {settings.sign_up && (
              <>
                <label className="mt-1">{dictionary.allowedDomains}</label>
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
              </>
            )}
          </div>
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
