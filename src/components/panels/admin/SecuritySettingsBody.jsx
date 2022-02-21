import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { useTranslationActions, useToaster } from "../../hooks";
import { Loader, SvgIconFeather } from "../../common";
import Tooltip from "react-tooltip-lite";
import { putSecuritySettings, sendRequestPassword } from "../../../redux/actions/adminActions";
import { addToModals } from "../../../redux/actions/globalActions";

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

const SecuritySettingsBody = () => {
  const { _t } = useTranslationActions();
  const toast = useToaster();

  const dispatch = useDispatch();
  const dictionary = {
    securitySettings: _t("ADMIN.SECURITY_SETTINGS", "Security settings"),
    securitySettingsDescription: _t("ADMIN.SECURITY_SETTINGS_DESCRIPTION", "Security settings description"),
    passwordRefreshPolicy: _t("ADMIN.PASSWORD_POLICY", "Password refresh policy"),
    passwordRefreshPolicyTooltip: _t("TOOLTIP.PASSWORD_POLICY", "Password refresh policy"),
    whoCanInviteUsers: _t("ADMIN.WHO_CAN_INVITE_USERS", "Who can invite users?"),
    whoCanInviteUsersTooltip: _t("TOOLTIP.WHO_CAN_INVITE_USERS", "Who can invite users?"),
    whoCanInviteGuests: _t("ADMIN.WHO_CAN_INVITE_GUESTS", "Who can invite guests?"),
    whoCanInviteGuestsTooltip: _t("TOOLTIP.WHO_CAN_INVITE_GUESTS", "Who can invite guests?"),
    saveLogin: _t("ADMIN.SAVE_LOGIN", "Save login"),
    closeButton: _t("BUTTON.CLOSE", "Close"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    sendRequest: _t("BUTTON.SEND_REQUEST_MANUALLY", "Send request now"),
    sendRequestHeaderText: _t("MODAL.HEADER_PASSWORD_REQUEST_MANUALLY", "Send password reset"),
    sendRequestBodyText: _t("MODAL.BODY_PASSWORD_REQUEST_MANUALLY", "Are you sure you want to send password reset manually?"),
    sendRequestSuccess: _t("TOASTER.PASSWORD_REQUEST_SUCCESS", "Successfully sent password reset request."),
    never: _t("OPTIONS.NEVER", "Never"),
    thirtyDays: _t("OPTIONS.THIRTY_DAYS", "30 days"),
    sixtyDays: _t("OPTIONS.SIXTY_DAYS", "60 days"),
    ninetyDays: _t("OPTIONS.NINETYY_DAYS", "90 days"),
    adminOnly: _t("OPTIONS.ADMIN_ONLY", "Admin only"),
    managerHigher: _t("OPTIONS.MANAGER_HIGHER", "Manager + higher"),
    employeesHigher: _t("OPTIONS.EMPLOYEES_HIGHER", "Employees higher"),
    securitySettingsUpdated: _t("TOASTER.SECURITY_SETTINGS_UPDATED", "Security settings updated"),
    whoCanCreateWorkspace: _t("ADMIN.WHO_CAN_CREATE_WORKSPACE", "Who can create workspace?"),
  };

  //const componentIsMounted = useRef(true);

  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;

  const securityLoaded = useSelector((state) => state.admin.securityLoaded);
  //const filters = useSelector((state) => state.admin.filters);
  const securitySettings = useSelector((state) => state.admin.security);

  //const { fetchLoginSettings, setAdminFilter } = useAdminActions();

  const [settings, setSettings] = useState({
    password_policy: null,
    invite_internal: null,
    invite_guest: null,
    add_workspace: null,
  });

  useEffect(() => {
    if (securityLoaded) setSettings(securitySettings);
  }, [securityLoaded, securitySettings]);

  const [saving, setSaving] = useState(false);

  const passwordPolicyOptions = [
    {
      value: 0,
      label: dictionary.never,
    },
    {
      value: 30,
      label: dictionary.thirtyDays,
    },
    {
      value: 60,
      label: dictionary.sixtyDays,
    },
    {
      value: 90,
      label: dictionary.ninetyDays,
    },
  ];

  const roleOptions = [
    {
      value: 1,
      label: dictionary.adminOnly,
    },
    {
      value: 2,
      label: dictionary.managerHigher,
    },
    {
      value: 3,
      label: dictionary.employeesHigher,
    },
  ];

  const handleSelectPasswordPolicy = (e) => {
    setSettings({
      ...settings,
      password_policy: e.value,
    });
  };

  const handleSelectInviteUsers = (e) => {
    setSettings({
      ...settings,
      invite_internal: e.value,
    });
  };
  const handleSelectInviteGuests = (e) => {
    setSettings({
      ...settings,
      invite_guest: e.value,
    });
  };

  const handleSelectCreateWs = (e) => {
    setSettings({
      ...settings,
      add_workspace: e.value,
    });
  };

  const handleSubmit = () => {
    setSaving(true);
    dispatch(
      putSecuritySettings(settings, () => {
        toast.success(dictionary.securitySettingsUpdated);
        setSaving(false);
      })
    );
  };

  const handleSendManually = () => {
    const onConfirm = () => {
      dispatch(
        sendRequestPassword({}, (err, res) => {
          if (err) return;
          toast.success(dictionary.sendRequestSuccess);
        })
      );
    };
    let modal = {
      type: "confirmation",
      headerText: dictionary.sendRequestHeaderText,
      submitText: dictionary.sendRequest,
      cancelText: dictionary.closeButton,
      bodyText: dictionary.sendRequestBodyText,
      actions: {
        onSubmit: onConfirm,
      },
    };

    dispatch(addToModals(modal));
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  return (
    <Wrapper>
      <h4>{dictionary.securitySettings}</h4>
      <h6 className="mb-3">{dictionary.securitySettingsDescription}</h6>
      {!securityLoaded && (
        <LoaderContainer className={"initial-load"}>
          <Loader />
        </LoaderContainer>
      )}
      {securityLoaded && (
        <>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.passwordRefreshPolicy}</label>{" "}
              <Tooltip onToggle={toggleTooltip} content={dictionary.passwordRefreshPolicyTooltip}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={passwordPolicyOptions.find((o) => o.value === settings.password_policy)}
              onChange={handleSelectPasswordPolicy}
              options={passwordPolicyOptions}
            />
            <div className="mt-2">
              <button className="btn btn-primary" onClick={handleSendManually}>
                {dictionary.sendRequest}
              </button>
            </div>
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.whoCanInviteUsers}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.whoCanInviteUsersTooltip}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={roleOptions.find((o) => o.value === settings.invite_internal)}
              onChange={handleSelectInviteUsers}
              options={roleOptions}
            />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.whoCanInviteGuests}</label>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.whoCanInviteGuestsTooltip}>
                <SvgIconFeather icon="info" />
              </Tooltip>
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={roleOptions.find((o) => o.value === settings.invite_guest)}
              onChange={handleSelectInviteGuests}
              options={roleOptions}
            />
          </div>
          <div>
            <LabelInfoWrapper>
              <label>{dictionary.whoCanCreateWorkspace}</label>
              {/* <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.whoCanInviteGuestsTooltip}>
                <SvgIconFeather icon="info" />
              </Tooltip> */}
            </LabelInfoWrapper>
            <Select
              className={"react-select-container"}
              classNamePrefix="react-select"
              styles={dark_mode === "0" ? lightTheme : darkTheme}
              value={roleOptions.find((o) => o.value === settings.add_workspace)}
              onChange={handleSelectCreateWs}
              options={roleOptions}
            />
          </div>

          <div className="mt-2">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !securityLoaded}>
              {dictionary.saveLogin}
            </button>
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default SecuritySettingsBody;
