import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SvgIconFeather, SvgIcon } from "../../common";
import { setNavMode } from "../../../redux/actions/globalActions";
//import christmas from "../../../assets/img/christmas.png";

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
    color: #fff;
    height: 0.7rem;
    width: 0.7rem;
    min-height: 0.7rem;
    min-width: 0.7rem;
    margin: 0 5px;
  }
  .company-logo {
    height: 70%;
    max-height: 40px;
    max-width: 100px;
  }
`;

const DriffLogo = styled(SvgIcon)`
  width: 84px;
  height: 56px;
  filter: brightness(0) saturate(100%) invert(1);
  cursor: pointer;
`;

const SmallDriffLogo = styled(SvgIcon)`
  min-width: 2.5rem;
  min-height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  filter: brightness(0) saturate(100%) invert(1);
  cursor: pointer;
`;

// const Hat = styled.div`
//   position: absolute;
//   z-index: 20;
//   transform: rotate(-41deg) scaleX(-1);
//   left: ${(props) => (props.hasCompanyLogo ? "-9px" : "-7px")};
//   top: ${(props) => (props.hasCompanyLogo ? "2px" : "1px")};
// `;

const MainLogo = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const companyLogo = useSelector((state) => state.settings.driff.logo);
  const handleIconClick = (e) => {
    e.preventDefault();
    if (e.target.dataset.link) {
      dispatch(setNavMode({ mode: 3 }));
    } else {
      dispatch(setNavMode({ mode: 2 }));
    }
    history.push("/chat");
  };

  return (
    <LogoWrapper hasCompanyLogo={companyLogo.trim() !== ""}>
      {companyLogo.trim() !== "" && (
        <CompanyLogoWrapper data-link="/" onClick={handleIconClick}>
          <img className="company-logo" src={companyLogo} alt="company logo" />
          <SvgIconFeather icon="heart" />
          <div style={{ position: "relative" }}>
            <SmallDriffLogo icon="driff-logo2" />
            {/* <Hat>
              <img width={"16px"} src={christmas} alt="christmas hat" />
            </Hat> */}
          </div>
        </CompanyLogoWrapper>
      )}
      {companyLogo.trim() === "" && (
        <>
          {/* <Hat hasCompanyLogo={false}>
            <img width={"34px"} src={christmas} alt="christmas hat" />
          </Hat> */}
          <DriffLogo icon="driff-logo2" data-link="/chat" onClick={handleIconClick} />
        </>
      )}
    </LogoWrapper>
  );
};

export default MainLogo;
