import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  ${(props) => props.hide && "display: none;"}
  position: absolute;
  z-index: 9999;
  background-color: transparent;

  &.orientation-top {
    bottom: -10px;
  }
  &.orientation-bottom {
    top: calc(100% - 25px);
    bottom: auto;
  }
  &.orientation-left {
    right: calc(100% + 5px);
    left: auto;
  }
  &.orientation-right {
    left: calc(100% + 25px);
    right: auto;
  }
`;
const PickerEmoji = React.forwardRef((props, ref) => {
  const { className = "", orientation, onSelectEmoji, ...otherProps } = props;

  return (
    <Wrapper ref={ref} hide={orientation.vertical === null || orientation.horizontal === null} className={`picker-emoji orientation-${orientation.vertical} orientation-${orientation.horizontal} ${className}`} {...otherProps}>
      <Picker
        className={className}
        title="Emoji"
        set="apple"
        onSelect={onSelectEmoji}
        theme="light"
        //autoFocus
        showPreview={false}
        showSkinTones={false}
        perLine={6}
        i18n={{
          search: "Search",
          clear: "Clear",
          emojilist: "List of emoji",
          notfound: "No Emoji Found",
          skintext: "Choose your default skin tone",
          categories: {
            search: "Search Results",
            recent: "Frequently Used",
            people: "Smileys & People",
            nature: "Animals & Nature",
            foods: "Food & Drink",
            activity: "Activity",
            places: "Travel & Places",
            objects: "Objects",
            symbols: "Symbols",
            flags: "Flags",
            custom: "Custom",
          },
          categorieslabel: "Emoji categories", // Accessible title for the list of categories
          skintones: {
            1: "Default Skin Tone",
            2: "Light Skin Tone",
            3: "Medium-Light Skin Tone",
            4: "Medium Skin Tone",
            5: "Medium-Dark Skin Tone",
            6: "Dark Skin Tone",
          },
        }}
      />
    </Wrapper>
  );
});

export default React.memo(PickerEmoji);
