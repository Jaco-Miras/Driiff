import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useTranslationActions } from "../../hooks";
import LogList from "./impersonation/LogList";
import UserList from "./impersonation/UserList";

const Wrapper = styled.div`
  /* & h4 {
    padding: 1rem;
  } */
`;

const ImpersonationSettingsBody = () => {
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();
  const { usersLoaded } = useSelector((state) => state.users);
  const [showLogs, setShowLogs] = useState(false);

  const dictionary = {
    title: _t("ADMIN.IMPERSONATION_SETTINGS", "Impersonation Settings"),
    logButtonText: _t("ADMIN.IMPERSONATION_LOG_BUTTON_TEXT", "Logs"),
    impersonateButtonText: _t("ADMIN.IMPERSONATION_IMPERSONATE_BUTTON_TEXT", "Impersonate"),
  };

  return (
    <Wrapper>
      <div className="d-flex justify-content-between p-3">
        <h4>{dictionary.title}</h4>
        <button className="btn btn-primary" onClick={() => setShowLogs(!showLogs)}>
          {showLogs ? dictionary.impersonateButtonText : dictionary.logButtonText}
        </button>
      </div>
      {showLogs ? (
        <LogList />
      ) : (
        <div>
          <UserList />

          {!usersLoaded && (
            <div class="d-flex justify-content-center">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default ImpersonationSettingsBody;
