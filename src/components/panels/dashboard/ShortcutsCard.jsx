import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { SvgIconFeather, ToolTip } from "../../common";
import { FancyLink } from "../../common";
import { getQuickLinks } from "../../../redux/actions/globalActions";
import { useSettings } from "../../hooks";

const Wrapper = styled.div`
  > span {
    display: flex;
    align-items: center;
    //font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }
  .feather-link {
    margin-right: 0.5rem;
  }
  .feather-info {
    margin-left: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 190px;
    overflow: auto;
    li {
      padding-top: 10px;
    }
    li:not(:last-child) {
      border-bottom: 1px solid #f1f2f7;
      .dark & {
        border-bottom: 1px solid rgba(155, 155, 155, 0.1);
      }
    }
  }
  a {
    box-shadow: none !important;
  }
`;

const ShortcutsCard = (props) => {
  const { dictionary } = props;
  const dispatch = useDispatch();
  const links = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));
  const linksFetched = useSelector((state) => state.global.linksFetched);
  const { generalSettings, showModal } = useSettings();
  const handleAddItemClick = () => {
    showModal("personal_link_create");
  };
  useEffect(() => {
    if (!linksFetched) dispatch(getQuickLinks());
  }, []);
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="link" /> <h5 className="card-title mb-0">{dictionary.shortcuts}</h5>{" "}
        <ToolTip content={dictionary.shorcutsTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip>
      </span>
      {links.length === 0 && linksFetched && <span className="mt-3">{dictionary.noQuickLinks}</span>}
      <ul className="mt-2">
        {links.map((l) => {
          return (
            <li key={l.id}>
              <FancyLink link={l.link} title={l.menu_name} />
            </li>
          );
        })}
      </ul>
      <span className="personal-links-label d-flex mt-2">
        {dictionary.personalLinks}
        <SvgIconFeather className="ml-auto" icon="circle-plus" width={24} height={24} onClick={handleAddItemClick} />
      </span>
      {generalSettings.personal_links.length > 0 && (
        <ul className="mt-2">
          {generalSettings.personal_links.map((l, index) => {
            return (
              <li key={l.id}>
                <FancyLink link={l.web_address} title={l.name} />
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
};

export default ShortcutsCard;
