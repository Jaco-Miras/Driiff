import {Picker} from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, {useState} from "react";
import styled from "styled-components";
import {useOutsideClick} from "../hooks";
import PickerGif from "./PickerGif";

const PickerContainer = styled.div`
    position: absolute;
    bottom: ${props => props.orientation === "top" ? "75px" : null};
    right: 5px;
    top: ${props => props.orientation === "bottom" ? "75px" : null};
    z-index: 9999;
    background-color: transparent;
`;

const SwitchButton = styled.div`
    cursor: hand;
    cursor: pointer;
`;

const PickerEmoji = React.forwardRef((props, ref) => {

    const {className = "", handleShowEmojiPicker, handleShowGifPicker} = props;
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

    return (
        <PickerContainer
            ref={ref}
            orientation={props.orientation}
            className={className}
            onMouseLeave={handleOnMouseLeave}
        >
            {
                switcher === false ?
                    <Picker
                        title="Emoji"
                        set='apple'
                        onSelect={props.onSelectEmoji}
                        theme='dark'
                        showSkinTones={false}
                        i18n={
                            {
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
                            }
                        }
                    />
                    :
                    <PickerGif
                        handleShowGifPicker={handleShowGifPicker}
                        onSelectGif={props.onSelectGif}
                        orientation={props.orientation}/>
            }
            <div className={`container`}>
                <SwitchButton onClick={togglePicker} className="btn btn-primary">
                    {
                        switcher === false ?
                            <>Gif</>
                            :
                            <>Emoji</>
                    }
                </SwitchButton>
            </div>
        </PickerContainer>
    );
});

export default PickerEmoji;