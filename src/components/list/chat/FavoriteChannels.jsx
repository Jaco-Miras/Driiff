import React from "react";
import styled from "styled-components";
import ChannelIcon from "./ChannelIcon";
import { SvgIconFeather } from "../../common";
// import { useDispatch, useSelector } from "react-redux";
// import { showUnreadChannels } from "../../../redux/actions/chatActions";
import Tooltip from "react-tooltip-lite";
import { useTranslationActions, useFilterChannelActions } from "../../hooks";
//import ChannelOptions from "./ChannelOptions";

const Wrapper = styled.div`
  padding: 0 24px;
  ul {
    margin: 0;
    padding-left: 0;
    //overflow: auto;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    flex-grow: 1;
    .dark & {
      border-bottom-color: rgba(155, 155, 155, 0.2) !important;
    }
    .fav-channel {
      padding-right: 0 !important;
      cursor: pointer;
    }
  }
  // .more-options-tooltip {
  //   position: fixed;
  //   top: 240px;
  //   left: ${(props) => (props.rect && props.rect.left ? `${props.rect.left}px` : "30px")};
  //   &.orientation-left {
  //     left: ${(props) => (props.rect && props.rect.left ? `${props.rect.left - 170}px` : "30px")};
  //   }
  // }
  .feather-star,
  .feather-volume-x {
    position: absolute;
    background-color: unset;
    width: 1rem;
    height: 1rem;
    padding: 0;
    z-index: 1;
  }
  .feather-star {
    bottom: 0;
    left: 0;
    fill: rgb(255, 193, 7);
    // color: rgb(255, 193, 7);
    width: 20px;
    height: 20px;
    color: #fff;
    .dark & {
      color: #191c20;
    }
  }
  .feather-volume-x {
    bottom: 0;
    right: 0;
    background-color: #fff;
    border: 2px solid #fff;
    color: #7a1b8b;
    .dark & {
      background-color: #191c20;
      color: #fff;
      border: 2px solid #191c20;
    }
  }
  .feather-eye,
  .feather-eye-off {
    top: -2px;
    right: 0px;
  }
  .more-options {
    display: none;
  }
  :hover {
    .more-options {
      display: block;
    }
  }
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -o-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
`;

const ChannelWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-right: 0.5rem;
  .more-options {
    margin-top: 0.5rem;
    position: static;
    opacity: 0;
    svg {
      position: relative;
    }
  }
  .feather-more-horizontal {
    width: 20px;
    height: 18px;
    vertical-align: initial;
  }
  :hover {
    .more-options {
      opacity: 1;
    }
  }
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -o-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
`;

const Badge = styled.div`
  background: #7a1b8b;
  color: #fff !important;
  min-height: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  position: absolute;
  right: 0px;
  bottom: 1px;
  width: 18px;
  height: 18px;
  font-size: 11px;
  &.unread {
    color: #7a1b8b !important;
    display: none;
  }
`;

const FavoriteAndFilter = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 12px;
`;

const FilterWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  margin-left: auto;
  svg {
    cursor: pointer;
  }
`;

const FavoriteChannels = (props) => {
  const { channels, onSelectChannel } = props;
  const { _t } = useTranslationActions();

  const { filterChannel, chatSettings } = useFilterChannelActions();

  const dictionary = {
    showUnreadChats: _t("TOOLTIP.SHOW_UNREAD_CHATS", "Filter on unread chat channels only "),
    hideUnreadChats: _t("TOOLTIP.HIDE_UNREAD_CHATS", "Hide unread chats"),
  };
  //const dispatch = useDispatch();
  //const filterUnreadChannels = useSelector((state) => state.chat.filterUnreadChannels);
  const handleSelectChannel = (channel) => {
    onSelectChannel(channel);
  };

  const handleFilterClick = () => {
    //dispatch(showUnreadChannels());
    filterChannel();
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  return (
    <Wrapper className="mb-2">
      <FavoriteAndFilter>
        {channels.length > 0 && (
          <ul>
            {channels.map((c) => {
              return (
                <ChannelWrapper key={c.id}>
                  <ChannelIcon channel={c} className="fav-channel" onSelectChannel={() => handleSelectChannel(c)} showSlider={false}>
                    <SvgIconFeather icon="star" />
                    {c.is_muted && <SvgIconFeather icon="volume-x" />}
                    {!c.is_muted && (
                      <Badge className={`badge badge-pill ml-1 ${!c.is_read && c.total_unread === 0 ? "unread" : ""}`}>{c.total_unread > 9 ? `${c.total_unread}+` : c.total_unread > 0 ? c.total_unread : !c.is_read ? "0" : null}</Badge>
                    )}
                  </ChannelIcon>
                </ChannelWrapper>
              );
            })}
          </ul>
        )}
        <FilterWrapper>
          <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.showUnreadChats}>
            <SvgIconFeather icon={chatSettings.filter_channel ? "filter-active" : "filter"} onClick={handleFilterClick} />
          </Tooltip>
        </FilterWrapper>
      </FavoriteAndFilter>
    </Wrapper>
  );
};

export default FavoriteChannels;
