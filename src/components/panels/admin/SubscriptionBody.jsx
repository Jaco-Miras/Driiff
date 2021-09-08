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

const SubscriptionBody = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    subscriptionLabel: _t("ADMIN.SUBSCRIPTION_LABEL", "Subscription"),
  };

  const filters = useSelector((state) => state.admin.filters);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, subscription: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.subscriptionLabel}</h4>
    </Wrapper>
  );
};

export default SubscriptionBody;
