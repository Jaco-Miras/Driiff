import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather, SvgIcon } from "../../common";

const LogoWrapper = styled.div`
  position: relative;
  ${(props) =>
    props.hasCompanyLogo &&
    `height: 100%;
    width: 70%;`}

  :hover {
    .feather-pencil {
      display: block;
      top: 0;
      right: -15px;
      cursor: pointer;
    }
  }
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CompanyLogoWrapper = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  cursor: pointer;
  .feather-heart {
    color: ${(props) => props.theme.colors.primary};
    height: 1.5rem;
    width: 1.5rem;
    min-height: 1.5rem;
    min-width: 1.5rem;
    margin: 0 5px;
  }
  .company-logo {
    height: 70%;
    max-height: 100px;
    max-width: 100px;
  }
`;

const DriffLogo = styled(SvgIcon)`
  width: 110px;
  height: 80px;
  cursor: pointer;
  path {
    color: ${(props) => props.theme.colors.primary};
    fill: ${(props) => props.theme.colors.primary};
  }
`;

const SmallDriffLogo = styled(SvgIcon)`
  min-width: 5rem;
  min-height: 5rem;
  min-width: 5rem;
  min-height: 5rem;
  cursor: pointer;
  path {
    color: ${(props) => props.theme.colors.primary};
    fill: ${(props) => props.theme.colors.primary};
  }
`;

const LoginLogo = (props) => {
  const companyLogo = useSelector((state) => state.settings.driff.logo);

  return (
    <LogoWrapper hasCompanyLogo={companyLogo.trim() !== ""} className="mb-3">
      {companyLogo.trim() !== "" && (
        <CompanyLogoWrapper data-link="/">
          <img className="company-logo" src={companyLogo} alt="company logo" />
          <SvgIconFeather icon="heart" />
          <div style={{ position: "relative" }}>
            <SmallDriffLogo icon="driff-logo2" />
          </div>
        </CompanyLogoWrapper>
      )}
      {companyLogo.trim() === "" && (
        <>
          <DriffLogo icon="driff-logo2" />
        </>
      )}
    </LogoWrapper>
  );
};

export default LoginLogo;
