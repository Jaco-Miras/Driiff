import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";

const Wrapper = styled.div``;

const BitrixBody = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    bitrixLabel: _t("ADMIN.BITRIX_LABEL", "Import Bitrix"),
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
      <h5 className="mb-3">{dictionary.bitrixLabel}</h5>
    </Wrapper>
  );
};

export default BitrixBody;
