import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions, useTimeFormat } from "../../hooks";
import { SvgIconFeather } from "../../common";
import { getBaseUrl } from "../../../helpers/slugHelper";
const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
  .trial-label {
    font-style: italic;
    font-size: 1rem;
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  text-align: center;
  background: #3f034a;
  color: #fff;
  border: 1px solid #3f034a;
  border-radius: 8px 8px 0 0;
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

const CardPricing = styled.div`
  padding: 1rem;
  background: #f1f2f7;
  color: #3f034a;
  text-align: center;
  border: 1px solid #e6e6e6;
  border-radius: 0;
  min-height: 130px;
  &.enterprise-pricing {
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      font-weight: 700;
    }
  }
  .euro {
    font-size: 2rem;
    font-weight: 700;
    vertical-align: top;
    line-height: 2.3;
  }
  .price {
    font-size: 4rem;
    font-weight: 700;
  }
  .per-month {
    display: inline-block;
    vertical-align: super;
    line-height: 1;
    span:first-child {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }
    span {
      display: block;
    }
  }
`;

const CardFeatures = styled.div`
  padding: 1rem;
  border: 1px solid #e6e6e6;
  border-top: none;
  border-bottom: none;
  min-height: 575px;
  label {
    text-align: center;
    font-style: italic;
    width: 100%;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 0.7rem 0;
    border-top: 1px solid #e6e6e6;
  }
  .feather-check {
    color: #00c851;
    margin-right: 12px;
    height: 18px;
    width: 18px;
  }
  &.basic-feat li,
  &.pro-feat li:nth-child(-n + 2),
  &.enterprise-feat li:nth-child(1) {
    font-weight: bold;
  }
  &.pro-feat label {
    min-height: 42px;
  }
`;

const CardFooter = styled.div`
  padding: 0 1rem 1rem 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 0 0 8px 8px;
  border-top: 0;
  button.btn-primary,
  button.btn-secondary {
    width: 100%;
    text-align: center;
    justify-content: center;
    border-radius: 20px;
  }
`;

const SubscribeBody = () => {
  const { _t } = useTranslationActions();

  const timeFormat = useTimeFormat();
  const { setAdminFilter, stripeCheckout } = useAdminActions();
  const subscriptions = useSelector((state) => state.admin.subscriptions);
  const componentIsMounted = useRef(true);
  const stripe = useSelector((state) => state.admin.stripe);

  const dictionary = {
    subscriptionLabel: _t("ADMIN.SUBSCRIPTION_LABEL", "Subscription"),
    select: _t("BUTTON.SELECT", "Select"),
    contactUs: _t("BUTTON.CONTACT_US", "Contact us"),
    workspaces: _t("PRICING.FEATURE_WORKSPACES", "Workspaces"),
    realTimeChat: _t("PRICING.FEATURE_REAL_TIME_CHAT", "Real time chat"),
    messageBoard: _t("PRICING.FEATURE_MESSAGE_BOARD", "Message board"),
    todoLists: _t("PRICING.FEATURE_TODO_LISTS", "To-do lists"),
    fileStorage: _t("PRICING.FEATURE_FILE_STORAGE", "File storage"),
    emailNotifications: _t("PRICING.FEATURE_EMAIL_NOTIFICATIONS", "Email notifications"),
    unlimitedProjects: _t("PRICING.FEATURE_UNLIMITED_PROJECTS", "Unlimited projects"),
    unlimitedUsers: _t("PRICING.FEATURE_UNLIMITED_USERS", "Unlimited users"),
    zoomVideoMeetings: _t("PRICING.FEATURES_ZOOM_VIDEO_MEETINGS", "ZOOM video meetings"),
    automaticTranslations: _t("PRICING.FEATURES_AUTOMATIC_TRANSLATIONS", "Automatic translations"),
    customSoftwareIntegration: _t("PRICING.FEATURES_CUSTOM_SOFTWARE_INTEGRATION", "Custom software integration"),
    standardFeatureDescription: _t("PRICING.FEATURES_STANDARD_DESCRIPTION", "Collaborate effectively with anyone inside or outside your team or company"),
    proFeatureDescription: _t("PRICING.FEATURES_PRO_DESCRIPTION", "Gain access to additional useful features"),
    enterpriseFeatureDescription: _t("PRICING.FEATURES_ENTERPRISE_DESCRIPTION", "Spice up your Driff by integrating your favorite software tools."),
    trialSubscriptionLabel: _t("PRICING.TRIAL_SUBSCRIPTION_LABEL", "Trial subscription will end:"),
    trialSubscriptionEndedLabel: _t("PRICING.TRIAL_SUBSCRIPTION_ENDED_LABEL", "Your trial subscription has ended"),
    activeSubscriptionLabel: _t("PRICING.ACTIVE_SUBSCRIPTION_LABEL", "You are currently subscribed to:"),
    currentPlanBtn: _t("PRICING.BUTTON_CURRENT_PLAN", "Current plan"),
  };

  const filters = useSelector((state) => state.admin.filters);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, subscription: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const [loading, setLoading] = useState(false);

  //   {
  //     "success_url": "https://getdriff.com/get-started/",
  //     "cancel_url": "https://getdriff.com/pricing/",
  //     "payment_method_types": ["card"],
  //     "mode": "subscription",
  //     "line_items": [
  //         {
  //             "price": "price_1JDRQXLoW9ieUi2mdBJP8Wkp",
  //             "quantity": 1
  //         }
  //     ]
  // }

  const handleSubscribe = (type) => {
    if (loading) return;
    const standardPriceId = process.env.REACT_APP_STANDARD_PRICE_ID;
    const proPriceId = process.env.REACT_APP_PRO_PRICE_ID;
    const payload = {
      success_url: `${getBaseUrl()}/admin-settings/subscription/success`,
      cancel_url: `${getBaseUrl()}/admin-settings/subscription/subscribe`,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: type === "standard" ? standardPriceId : type === "pro" ? proPriceId : null,
          quantity: 3,
        },
      ],
    };
    setLoading(true);
    stripeCheckout(payload, (err, res) => {
      setLoading(false);
      if (err) return;
      window.location = res.data.url;
    });
  };

  const currentPricing = stripe.pricing.find((p) => subscriptions && subscriptions.plan === p.id);
  const currentPlan = currentPricing ? stripe.products.find((p) => p.id === currentPricing.product) : null;

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.subscriptionLabel}</h4>
      {subscriptions && subscriptions.status === "trialing" && (
        <label className="trial-label">
          {dictionary.trialSubscriptionLabel} <strong>{timeFormat.fromNow(subscriptions.trial_ends_at.timestamp)}</strong>
        </label>
      )}
      {subscriptions && subscriptions.status === "canceled" && <label className="trial-label">{dictionary.trialSubscriptionEndedLabel}</label>}
      {subscriptions && subscriptions.status === "active" && currentPlan && (
        <label className="trial-label">
          {dictionary.activeSubscriptionLabel}
          {currentPlan && <strong>{currentPlan.name}</strong>}
          {" plan"}
        </label>
      )}
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-wrapper">
              <CardHeader>
                <h3>Standard</h3>
                <span>For professionals with basic needs</span>
              </CardHeader>
              <CardPricing>
                <span className="euro">€</span>
                <span className="price">49</span>
                <span className="per-month">
                  <span>,00</span>
                  <span>/MO</span>
                </span>
              </CardPricing>
              <CardFeatures className="basic-feat">
                <label>{dictionary.standardFeatureDescription}</label>
                <ul>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.workspaces}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.realTimeChat}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.messageBoard}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.todoLists}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.fileStorage}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.emailNotifications}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.unlimitedProjects}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.unlimitedUsers}
                  </li>
                </ul>
              </CardFeatures>

              <CardFooter>
                {subscriptions && subscriptions.status === "active" && currentPricing && currentPricing.id === process.env.REACT_APP_STANDARD_PRICE_ID ? (
                  <button className="btn btn-secondary">{dictionary.currentPlanBtn}</button>
                ) : stripe.pricingFetched && stripe.productsFetched ? (
                  <button className="btn btn-primary" onClick={() => handleSubscribe("standard")}>
                    {dictionary.select}
                  </button>
                ) : (
                  <button className="btn btn-primary">Loading...</button>
                )}
              </CardFooter>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-wrapper">
              <CardHeader>
                <h3>Professional</h3>
                <span>All the features of Standard, plus:</span>
              </CardHeader>
              <CardPricing>
                <span className="euro">€</span>
                <span className="price">99</span>
                <span className="per-month">
                  <span>,00</span>
                  <span>/MO</span>
                </span>
              </CardPricing>
              <CardFeatures className="pro-feat">
                <label>{dictionary.proFeatureDescription}</label>
                <ul>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.zoomVideoMeetings}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.automaticTranslations}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.workspaces}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.realTimeChat}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.messageBoard}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.todoLists}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.fileStorage}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.emailNotifications}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.unlimitedProjects}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.unlimitedUsers}
                  </li>
                </ul>
              </CardFeatures>
              <CardFooter>
                {subscriptions && subscriptions.status === "active" && currentPricing && currentPricing.id === process.env.REACT_APP_PRO_PRICE_ID ? (
                  <button className="btn btn-secondary">{dictionary.currentPlanBtn}</button>
                ) : stripe.pricingFetched && stripe.productsFetched ? (
                  <button className="btn btn-primary" onClick={() => handleSubscribe("pro")}>
                    {dictionary.select}
                  </button>
                ) : (
                  <button className="btn btn-primary">Loading...</button>
                )}
              </CardFooter>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-wrapper">
              <CardHeader>
                <h3>Enterprise</h3>
                <span>For your next-level business</span>
              </CardHeader>
              <CardPricing className="enterprise-pricing">
                <h1>{dictionary.contactUs}</h1>
              </CardPricing>
              <CardFeatures className="enterprise-feat">
                <label>{dictionary.enterpriseFeatureDescription}</label>
                <ul>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.customSoftwareIntegration}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.zoomVideoMeetings}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.automaticTranslations}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.workspaces}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.realTimeChat}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.messageBoard}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.todoLists}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.fileStorage}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.emailNotifications}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.unlimitedProjects}
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    {dictionary.unlimitedUsers}
                  </li>
                </ul>
              </CardFeatures>
              <CardFooter>
                <button className="btn btn-primary">{dictionary.contactUs}</button>
              </CardFooter>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SubscribeBody;
