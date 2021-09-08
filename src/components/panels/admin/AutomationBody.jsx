import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
`;

const AutomationBody = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    automationLabel: _t("ADMIN.AUTOMATION_LABEL", "Automation"),
  };

  const filters = useSelector((state) => state.admin.filters);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, automation: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.automationLabel}</h4>
    </Wrapper>
  );
};

export default AutomationBody;
