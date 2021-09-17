import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions } from "../../hooks";
import { Route, Switch, Redirect } from "react-router-dom";
import SubscribeBody from "./SubscribeBody";
import SubscribeSuccess from "./SubscribeSuccess";

const Wrapper = styled.div`
  padding: 1rem;
  height: 100%;
  > div {
    margin-bottom: 1rem;
  }
`;

const SubscriptionBody = () => {
  const { setAdminFilter } = useAdminActions();
  const componentIsMounted = useRef(true);

  const filters = useSelector((state) => state.admin.filters);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, subscription: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <Wrapper>
      <Switch>
        <Route component={SubscribeBody} path={["/admin-settings/subscription/subscribe"]} />
        <Route component={SubscribeSuccess} path={["/admin-settings/subscription/success"]} />
        <Redirect
          from="*"
          to={{
            pathname: "/admin-settings/subscription/subscribe",
          }}
        />
      </Switch>
    </Wrapper>
  );
};

export default SubscriptionBody;
