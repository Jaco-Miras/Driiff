import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";
import { SvgEmptyState } from "../../common";

const Wrapper = styled.div`
  padding: 1rem;
  height: 100%;
  > div {
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.2rem;
    margin-top: 1.5rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  height: 100%;
  svg {
    max-width: 50%;
    max-height: 40%;
  }
`;

const SubscribeSuccess = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter } = useAdminActions();
  const subscriptions = useSelector((state) => state.admin.subscriptions);
  const componentIsMounted = useRef(true);
  const stripe = useSelector((state) => state.admin.stripe);

  const currentPricing = stripe.pricing.find((p) => subscriptions && subscriptions.plan === p.id);
  const currentPlan = currentPricing ? stripe.products.find((p) => p.id === currentPricing.product) : null;

  const dictionary = {
    successSubscriptionLabel: _t("PRICING.SUCCESS_SUBSCRIPTION_LABEL", "Congrats! You have successfully subscribed to"),
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
      <EmptyState>
        <SvgEmptyState icon={1} />
        {subscriptions && subscriptions.status === "active" && stripe.pricingFetched && stripe.productsFetched && currentPlan && (
          <p>
            {dictionary.successSubscriptionLabel} {currentPlan && currentPlan.name}
          </p>
        )}
      </EmptyState>
    </Wrapper>
  );
};

export default SubscribeSuccess;
