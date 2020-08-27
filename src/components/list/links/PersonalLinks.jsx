import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useSettings} from "../../hooks";

const Wrapper = styled.li`  
  position: relative;
  transition: all 0.3s ease;
  
  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};
    height: 40px;
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
`;

const LinkNav = styled.ul`
  overflow: hidden;
  transition: all 0.3s ease;
  display: block !important;
  margin: 0 15px !important;
  border-radius: 0 0 8px 8px;
  
  li {        
    height: 40px;
    width: 100%;
    padding: 0 10px;
    font-weight: 400;
    color: #cbd4db;
    background: #ffffff14;
    
    > div {
      position: relative;
      height: 40px;
      display: flex;      
      width: 100%;
      align-items: center;
      justify-content: space-between;
      
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

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px !important;
  }
  &.leave-active {
    max-height: 0;
  }
`;

const NavIcon = styled(SvgIconFeather)`
  cursor: pointer;
  cursor: hand;
  margin: 0 8px 0 15px;
`;


const PersonalLinks = (props) => {
  const {className = "", dictionary} = props;

  const {generalSettings, showModal} = useSettings();

  const ref = {
    container: useRef(),
    arrow: useRef(),
    nav: useRef(),
  };

  const [showLinks, setShowLinks] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);

  const handleShowLinks = (e) => {
    e.preventDefault();
    setShowLinks((prevState) => !prevState);
  };

  const handleEditItemClick = (e) => {
    const id = e.currentTarget.dataset.index;
    showModal("personal_link_edit", {
      ...generalSettings.personal_links[id],
      index: id
    });
  }

  const handleAddItemClick = () => {
    showModal("personal_link_create");
  }

  useEffect(() => {
    if (ref.nav.current !== null) {
      let maxHeight = window.innerHeight * 5;
      console.log(ref.nav.current)
      maxHeight = maxHeight < ref.nav.current.offsetHeight ? ref.nav.current.offsetHeight : maxHeight;
      setMaxHeight(maxHeight);
    }
  }, [ref.nav, maxHeight]);

  return (
    <Wrapper ref={ref.container} className={`fadeIn ${className} ${showLinks && "folder-open"}`} selected={showLinks}>

      <a href="/" onClick={handleShowLinks}>
        <NavIcon icon="link"/>
        <div>{dictionary.personalLinks}</div>
        <i ref={ref.arrow} className={`sub-menu-arrow ti-angle-up ${showLinks ? "ti-minus rotate-in" : "ti-plus"}`}/>
      </a>

      <LinkNav ref={ref.nav} maxHeight={maxHeight} className={showLinks ? "enter-active" : "leave-active"}>
        {
          generalSettings.personal_links.map((link, index) => {
            return <li key={index}>
              <div>
                <div>
                  <a href={link.web_address} target="_blank">{link.name}</a>
                </div>
                <div className="action">
                  <SvgIconFeather className="cursor-pointer" data-index={index} icon="pencil"
                                  onClick={handleEditItemClick}/>
                </div>
              </div>
            </li>;
          })
        }
        {
          generalSettings.personal_links.length < 5 &&
          <li className="nav-action cursor-pointer" onClick={handleAddItemClick}>
            <div><SvgIconFeather icon="circle-plus" width={24} height={24}/> {dictionary.addShortcut}</div>
          </li>
        }
      </LinkNav>
    </Wrapper>
  );
};

export default PersonalLinks;
