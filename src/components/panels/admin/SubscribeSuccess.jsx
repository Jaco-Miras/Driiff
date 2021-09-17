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
  const componentIsMounted = useRef(true);

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
        <p>You have successfully subscribed to "pricing plan"</p>
      </EmptyState>
    </Wrapper>
  );
};

export default SubscribeSuccess;
