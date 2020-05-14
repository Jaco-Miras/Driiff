import {Picker} from "emoji-mart";
import 'emoji-mart/css/emoji-mart.css'
import React, {useEffect} from "react";
import styled from "styled-components";

const PickerContainer = styled.div`
    position: absolute;
    bottom: ${props => props.orientation === "top" ? "75px" : null};
    right: 5px;
    top: ${props => props.orientation === "bottom" ? "75px" : null};
    z-index: 9999;
    background-color: #fff;
`;
const PickerEmoji = React.forwardRef((props, ref) => {

    const handleOnMouseLeave = () => {
        if (props.onMouseLeave) {
            props.onMouseLeave();
        }
    };
    useEffect(() => {
        const handleEscapeKey = e => {
            if (e.keyCode === 27) {
                props.handleShowEmojiPicker();
                document.removeEventListener("keydown", handleEscapeKey, false);
            }
        };
        const handleOutsideClick = e => {
            if (ref) {
                let pickerBtn = document.querySelector(".picker-btn");
                if (ref.current.contains(e.target) || e.target.contains(pickerBtn)) {

                } else {
                    props.handleShowEmojiPicker();
                    document.removeEventListener("mousedown", handleOutsideClick, false);
                }
            }
        };
        document.addEventListener("mousedown", handleOutsideClick, false);
        document.addEventListener("keydown", handleEscapeKey, false);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick, false);
            document.removeEventListener("keydown", handleEscapeKey, false);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PickerContainer
            ref={ref}
            orientation={props.orientation}
            className={props.className}
            onMouseLeave={handleOnMouseLeave}
        >
            <Picker
                title="Emoji"
                set='apple'
                onSelect={props.onSelectEmoji}
                theme='dark'
                //autoFocus
                //showPreview={false}
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
        </PickerContainer>
    );
});

export default PickerEmoji;