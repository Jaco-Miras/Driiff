import React from "react";
import styled, { useTheme } from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather, SvgIcon } from "../../common";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { useSettings } from "../../hooks";

const LogoWrapper = styled.div`
  position: relative;
  ${(props) =>
    props.hasCompanyLogo &&
    `height: 100%;
    width: 70%;
    background-color: ${props.theme.colors.fifth}`}

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
  background-color: ${(props) => (props.dark_mode === "0" ? "#29323F" : "#f47373")};
  ${(props) =>
    props.hasCompanyLogo &&
    ` border-radius: 6px;
      .feather-heart {
        color: #fff;
      }
      .icon-driff-logo2 path {
        fill: #fff;
      }
  `}
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
  const {
    generalSettings: { dark_mode }, // driffSettings,
  } = useSettings();
  return (
    <LogoWrapper hasCompanyLogo={companyLogo.trim() !== ""} className="mb-3">
      {companyLogo.trim() !== "" && (
        <CompanyLogoWrapper hasCompanyLogo={companyLogo.trim() !== ""} dark_mode={dark_mode}>
          {companyLogo ? (
            <>
              <img className="company-logo" src={companyLogo} alt="company logo" />
              {/*   <SvgIconFeather icon="heart" /> */}
            </>
          ) : (
            <DriffLogo icon="driff-logo2" />
          )}
        </CompanyLogoWrapper>
      )}
      {/*   {companyLogo.trim() === "" && (
        <>
          <DriffLogo icon="driff-logo2" />
        </>
      )} */}
    </LogoWrapper>
  );
};

export default LoginLogo;
