import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { LinkItem } from "./index";
import { useSettings } from "../../hooks";

const FONT_COLOR_DARK_MODE = "#CBD4DB";

const Wrapper = styled.li`
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};
    display: flex;
    color: #fff;
    height: 40px;
    justify-content: flex-start;
    align-items: center;
    margin: 0 15px;
    border-radius: 8px 8px 0 0;
  }
  .sub-menu-arrow {
    margin-right: 10px;
  }
  .quick-links {
    .feather-pencil {
      display: none;
    }
    &:hover {
      .sub-menu-arrow {
        margin-left: ${(props) => (props.showEditIcon ? "10px" : "auto")};
      }
      .feather-pencil {
        display: ${(props) => (props.showEditIcon ? "block" : "none")};
      }
    }
  }
`;

const LinkNav = styled.ul`
  overflow: hidden;
  transition: all 0.3s ease;
  display: block !important;
  margin: 0 15px !important;
  border-radius: 0 0 8px 8px;

  &.enter-active {
    max-height: 250px;
    overflow: scroll;
  }
  // &.enter-active {
  //   max-height: ${(props) => props.maxHeight}px !important;
  // }
  &.leave-active {
    max-height: 0;
  }
  li.personal-link {
    min-height: 40px;
    width: 100%;
    padding: 0 10px;
    font-weight: 400;
    color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
    background: #ffffff14;

    > div {
      position: relative;
      min-height: 40px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;

      &.shorcut-title {
        padding-left: 0.5rem;
        font-weight: 500;
      }

      > div {
        display: flex;
      }

      a {
        background-color: transparent;
      }
    }

    .action {
      display: none;
      align-items: center;
    }

    &:hover {
      .action {
        display: flex;
      }
    }

    svg {
      height: 14px;
      width: 14px;
      margin-right: 4px;
    }
  }
  li.shorcut-title-link {
    padding: 0;

    // .shorcut-title {
    //   background: #ffffff10;
    // }
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  margin: 0 8px 0 15px;
  width: 1rem !important;
  height: 1rem !important;
`;

const EditIcon = styled(SvgIconFeather)`
  height: 12px !important;
  width: 12px !important;
  cursor: pointer;
  margin-left: auto;
  color: #fff8;
`;

const QuickLinks = (props) => {
  const { className = "", user, dictionary } = props;

  const { generalSettings, showModal } = useSettings();
  const { dark_mode } = generalSettings;
  const links = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));

  const httpsPattern = new RegExp("^(http|https)://");
  const ref = {
    container: useRef(),
    arrow: useRef(),
    nav: useRef(),
  };

  const [showLinks, setShowLinks] = useState(false);
  //const [maxHeight, setMaxHeight] = useState(0);

  const handleShowLinks = (e) => {
    e.preventDefault();
    setShowLinks((prevState) => !prevState);
  };

  const handleAddItemClick = () => {
    showModal("personal_link_create");
  };

  const handleEditLinks = () => {
    window.open(`${process.env.REACT_APP_apiProtocol}${localStorage.getItem("slug")}.driff.io/admin/quick-links`, "_blank");
  };

  const handleEditItemClick = (e) => {
    const id = e.currentTarget.dataset.index;
    showModal("personal_link_edit", {
      ...generalSettings.personal_links[id],
      index: id,
    });
  };

  // useEffect(() => {
  //   if (ref.nav.current !== null) {
  //     let maxHeight = window.innerHeight * 5;
  //     maxHeight = maxHeight < ref.nav.current.offsetHeight ? ref.nav.current.offsetHeight : maxHeight;
  //     setMaxHeight(maxHeight);
  //   }
  // }, [ref.nav, maxHeight]);

  return (
    <Wrapper ref={ref.container} className={`fadeIn ${className} ${showLinks && "folder-open"}`} selected={showLinks} showEditIcon={user && user.role && (user.role.name === "admin" || user.role.name === "owner")}>
      <a className="quick-links" href="/" onClick={handleShowLinks}>
        <NavIcon icon="link" />
        <div>{dictionary.shortcuts}</div>
        {user && user.role && (user.role.name === "admin" || user.role.name === "owner") && <EditIcon icon="pencil" onClick={handleEditLinks} />}
        <i ref={ref.arrow} className={`sub-menu-arrow ti-angle-up ${showLinks ? "ti-minus rotate-in" : "ti-plus"}`} />
      </a>

      <LinkNav ref={ref.nav} className={showLinks ? "enter-active" : "leave-active"} dark_mode={dark_mode}>
        <li className="personal-link shorcut-title-link">
          <div className="shorcut-title">{dictionary.personalLinks}</div>
        </li>
        {generalSettings.personal_links.map((link, index) => {
          return (
            <li key={index} className="personal-link">
              <div>
                <div>
                  <a href={!httpsPattern.test(link.web_address) ? `https://${link.web_address}` : link.web_address} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </div>
                <div className="action">
                  <SvgIconFeather className="cursor-pointer" data-index={index} icon="pencil" onClick={handleEditItemClick} />
                </div>
              </div>
            </li>
          );
        })}
        {generalSettings.personal_links.length < 5 && (
          <li className="personal-link nav-action cursor-pointer" onClick={handleAddItemClick}>
            <div className="justify-content-start">
              <SvgIconFeather icon="circle-plus" width={24} height={24} /> {dictionary.addPersonalShortcut}
            </div>
          </li>
        )}
        {user.type !== "external" &&
          links.map((link, index) => {
            return (
              <React.Fragment key={link.id}>
                {index === 0 && (
                  <li className="personal-link shorcut-title-link pt-2">
                    <div className="shorcut-title">{dictionary.companyLinks}</div>
                  </li>
                )}
                <LinkItem link={link} className="quick-links" />
              </React.Fragment>
            );
          })}
      </LinkNav>
    </Wrapper>
  );
};

export default QuickLinks;
