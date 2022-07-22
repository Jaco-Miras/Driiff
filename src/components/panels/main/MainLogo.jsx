import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SvgIconFeather, SvgIcon } from "../../common";
import { setNavMode } from "../../../redux/actions/globalActions";
import { useSettings } from "../../hooks";

const LogoWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
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
  justify-content: space-evenly;
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
    height: 100%;
    max-height: 60px;
    max-width: 110px;
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
  /* filter: brightness(0) saturate(100%) invert(1); */
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
  const [logoFill, setLogoFill] = useState("#FFFFFF");
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const {
    colors: { fifth },
  } = useSelector((state) => state.settings.driff.theme);

  const companyLogo = useSelector((state) => state.settings.driff.logo);
  const handleIconClick = (e) => {
    e.preventDefault();
    if (e.target.dataset.link) {
      dispatch(setNavMode({ mode: 3 }));
    } else {
      dispatch(setNavMode({ mode: 2 }));
    }
    history.push("/dashboard");
  };
  const checkBGColor = () => {
    if (dark_mode === "1") {
      setLogoFill("#FFFFFF");
      return;
    }
    if (lightOrDark(fifth) === "light") {
      setLogoFill("#000");
      return;
    }
    setLogoFill("#FFFFFF");
  };

  useEffect(() => {
    checkBGColor();
  }, [fifth, dark_mode]);

  return (
    <LogoWrapper hasCompanyLogo={companyLogo.trim() !== ""}>
      {companyLogo.trim() !== "" && (
        <CompanyLogoWrapper data-link="/dashboard" onClick={handleIconClick}>
          <img className="company-logo" src={companyLogo} alt="company logo" />
          <SvgIconFeather icon="heart" fill={logoFill} />
          <div style={{ position: "relative" }}>
            <SmallDriffLogo icon="driff-logo2" fill={logoFill} />
          </div>
        </CompanyLogoWrapper>
      )}
      {companyLogo.trim() === "" && (
        <>
          <DriffLogo icon="driff-logo2" data-link="/dashboard" onClick={handleIconClick} fill={logoFill} />
        </>
      )}
    </LogoWrapper>
  );
};

export default MainLogo;

function lightOrDark(color) {
  let r = null;
  let g = null;
  let b = null;
  let hsp = null;
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return "light";
  } else {
    return "dark";
  }
}
