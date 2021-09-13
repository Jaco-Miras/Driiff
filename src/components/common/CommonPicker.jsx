import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, { useState } from "react";
import styled from "styled-components";
import { useOutsideClick } from "../hooks";
import PickerGif from "./PickerGif";
import { SvgIconFeather } from "./SvgIcon";

const Wrapper = styled.div`
  position: absolute;
  bottom: ${(props) => (props.orientation === "top" ? "75px" : null)};
  right: 5px;
  top: ${(props) => (props.orientation === "bottom" ? "75px" : null)};
  z-index: 9999;
  background-color: transparent;
`;

const SwitchButton = styled.div`
  cursor: hand;

  svg {
    position: relative;
    top: 1px;
  }
`;

const EmojiPicker = styled(Picker)``;

const GifPicker = styled(PickerGif)``;

const CommonPicker = React.forwardRef((props, ref) => {
  const { className = "", handleShowEmojiPicker, handleShowGifPicker } = props;
  const [switcher, setSwitcher] = useState(false);

  const handleOnMouseLeave = () => {
    if (props.onMouseLeave) {
      props.onMouseLeave();
    }
  };

  const togglePicker = () => {
    setSwitcher(!switcher);
  };

  useOutsideClick(ref, handleShowEmojiPicker, true);
  useOutsideClick(ref, handleShowGifPicker, true);

  return (
    <Wrapper ref={ref} orientation={props.orientation} className={`common-picker ${className}`} onMouseLeave={handleOnMouseLeave}>
      {switcher === false ? (
        <EmojiPicker
          className="emoji-picker"
          title="Emoji"
          set="apple"
          onSelect={props.onSelectEmoji}
          theme="light"
          showSkinTones={false}
          showPreview={false}
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
      ) : (
        <GifPicker onSelectGif={props.onSelectGif} orientation={props.orientation} />
      )}
      <div className={"block mt-2 common-picker-btn"}>
        <SwitchButton onClick={togglePicker} className="btn btn-primary">
          Switch to
          {switcher === false ? <> Gif</> : <> Emoji</>}
          <SvgIconFeather className="ml-2" icon="play" />
        </SwitchButton>
      </div>
    </Wrapper>
  );
});

export default CommonPicker;
