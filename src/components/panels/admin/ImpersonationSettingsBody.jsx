import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useTranslationActions } from "../../hooks";
import UserList from "./impersonation/UserList";

const Wrapper = styled.div`
  & h4 {
    padding: 1rem;
  }
`;

const ImpersonationSettingsBody = () => {
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();
  const { usersLoaded } = useSelector((state) => state.users);

  const dictionary = {
    title: _t("ADMIN.IMPERSONATION_SETTINGS", "Impersonation Settings"),
  };

  return (
    <Wrapper>
      <h4>{dictionary.title}</h4>
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
    </Wrapper>
  );
};

export default ImpersonationSettingsBody;
