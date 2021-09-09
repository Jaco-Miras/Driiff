import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";

const Wrapper = styled.div``;

const GrippBotBody = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    grippLabel: _t("ADMIN.GRIPP_LABEL", "Gripp"),
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
      <h5 className="mb-3">{dictionary.grippLabel}</h5>
    </Wrapper>
  );
};

export default GrippBotBody;
