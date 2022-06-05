import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { putLoginSettings, putMeetingSettings } from "../../../redux/actions/adminActions";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import Flag from "../../common/Flag";
import { Loader } from "../../common";
import { useLocation, useHistory } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
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

const SubmitButton = styled.button`
  text-align: center;
`;

const LabelInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  label {
    margin: 0 !important;
  }
  margin-bottom: 0.5rem;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;


function DriffBody() {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const dictionary = {
    companyLanguage: _t("SETTINGS.COMPANY_LANGUAGE_LABEL", "Company language"),
    settingsUpdated: _t("TOASTER.SETTINGS_UPDATED", "Successfully updated settings"),
    updateSettings: _t("BUTTON.UPDATE_SETTINGS", "Update settings"),
    videoMeeting: _t("LABEL.VIDEO_MEETING", "Video meeting"),
    updateLanguage: _t("BUTTON.UPDATE_LANGUAGE", "Update language"),
    connectGoogleDrive: _t("LAVEL.CONNECT_GOOGLEDRIVE", "Connect Google Drive"),
    connectGoogleDrive: _t("BUTTON.CONNECT_GOOGLEDRIVE", "Connect Google Drive"),
  };

  const languageOptions = [
    {
      value: "en",
      label: (
        <>
          <Flag countryAbbr="en" className="mr-2" width="18" />
          {_t("LANGUAGE.ENGLISH", "English")}
        </>
      ),
    },
    {
      value: "nl",
      label: (
        <>
          <Flag countryAbbr="nl" className="mr-2" width="18" />
          {_t("LANGUAGE.DUTCH", "Dutch")}
        </>
      ),
    },
  ];

  const videoOptions = [
    {
      value: "disable",
      label: "Disable",
    },
    {
      value: "jitsi",
      label: "Driff Talk",
    },
    {
      value: "google",
      label: "Google Meet",
    },
    {
      value: "zoom",
      label: "Zoom",
    },
  ];

  const toast = useToaster();
  const { fetchLoginSettings } = useAdminActions();
  const theme = useSelector((state) => state.settings.driff.theme);
  const loginFetched = useSelector((state) => state.admin.loginFetched);
  const loginSettings = useSelector((state) => state.admin.login);
  const meeting = useSelector((state) => state.settings.driff.meet);
  const isCompSettingsLoaded = useSelector((state) => state.settings.driff.isCompSettingsLoaded);
  const [settings, setSettings] = useState({ ...loginSettings, meeting: meeting });
  const [meetingSettings, setMeetingSettings] = useState(meeting);
  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;
  const location = useLocation();
  const history = useHistory() 

  useEffect(() => {

    if (!loginFetched) {
      fetchLoginSettings({});
    }
  }, []);

  useEffect(() => {
    setSettings(loginSettings);
  }, [loginSettings]);

  useEffect(() => {
    setMeetingSettings(meeting);
  }, [isCompSettingsLoaded]);

  const handleSubmit = () => {
    const payload = {
      ...settings,
      themes: JSON.stringify(theme.colors),
    };
    if (payload.domains) delete payload.domains;
    dispatch(
      putLoginSettings(payload, (err, res) => {
        if (err) return;
        toast.success(dictionary.settingsUpdated);
      })
    );
  };

  const handleUpdateMeeting = () => {
    dispatch(
      putMeetingSettings({ meet: meetingSettings }, (err, res) => {
        if (err) return;
        toast.success(dictionary.settingsUpdated);
      })
    );
  }; 

  const handleSelectLanguage = (e) => {
    setSettings({ ...settings, language: e.value });
  };

  const handleSelectMeeting = (e) => {
    setMeetingSettings(e.value);
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
          <h4 className="mt-3">Driff</h4>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.companyLanguage}</label>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={languageOptions.find((o) => settings.language === o.value)}
              onChange={handleSelectLanguage}
              options={languageOptions}
            />
          </div>
          <div className="d-flex align-items-center mt-2">
            <SubmitButton className="btn btn-primary mr-2" id="SubmitColors" onClick={handleSubmit}>
              {dictionary.updateLanguage}
            </SubmitButton>
          </div>
          <LabelInfoWrapper className="mt-2">
            <label>{dictionary.videoMeeting}</label>
          </LabelInfoWrapper>
          <Select
            className={"react-select-container"}
            classNamePrefix="react-select"
            styles={dark_mode === "0" ? lightTheme : darkTheme}
            value={videoOptions.find((o) => meetingSettings === o.value)}
            onChange={handleSelectMeeting}
            options={videoOptions}
          />
          <div className="d-flex align-items-center mt-2">
            <SubmitButton className="btn btn-primary mr-2" id="SubmitColors" onClick={handleUpdateMeeting}>
              {dictionary.updateSettings}
            </SubmitButton>
          </div>

          <LabelInfoWrapper className="mt-2" style={{ marginTop: "40px" }}>
            <label>{dictionary.connectGoogleDrive}</label>
          </LabelInfoWrapper>         
        </>
      )}
    </Wrapper>
  );
}

export default DriffBody;
