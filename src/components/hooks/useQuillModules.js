import {useEffect, useRef, useState} from "react";
import {osName} from "react-device-detect";
import {useSelector} from "react-redux";
import {Quill} from "react-quill";

const useQuillModules = (mode, callback, mentionOrientation = "top", quillRef) => {

    const [modules, setModules] = useState({});
    const [mentionValues, setMentionValues] = useState([]);
    // const [mentionOpen, setMentionOpen] = useState(false)
    const userMentions = useSelector(state => state.users.mentions);

    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    const handleSubmit = () => {
        savedCallback.current();
    };

    const handleSetModule = () => {
        const all = {
            id: require("shortid").generate(),
            profile_image_link: require("../../assets/icon/teams/r/secundary.svg"),
            value: "All",
            name: "All users in this channel",
            class: "all-pic",
        };
        const newAtValues = [...Object.entries(userMentions).map(([id, user], index) => {
            return Object.assign({}, user, {
                value: user.first_name,
                id: user.id,
                type_id: user.id,
                class: "user-pic",
            });
        }), all];
        setMentionValues(newAtValues);
        const modules = {
            mention: {
                allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                defaultMenuOrientation: mentionOrientation,
                spaceAfterInsert: true,
                fixMentionsToQuill: false,
                mentionDenotationChars: ["@"],
                minChars: 0,
                linkTarget: "_blank",
                source: function (searchTerm, renderList, mentionChar) {
                    let values;

                    if (mentionChar === "@") {
                        values = newAtValues;
                    }

                    if (searchTerm.length === 0) {
                        renderList(values, searchTerm);
                    } else {
                        let matches = [];
                        let i;
                        for (i = 0; i < values.length; i++)
                            if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
                        renderList(matches, searchTerm);
                    }
                },
                renderItem: function (item, searchTerm) {
                    let avatarStyling = "position: relative; width: 30px; height: 30px; min-width: 30px; min-height: 30px; border-radius: 50%; margin-right: 10px; z-index: 1; pointer-events: auto; border: none; overflow: hidden; cursor: pointer;";
                    let avatarImgStyling = "width: 100%; height: 100%; position: absolute; left: 0; top: 0;";
                    let listDisplay = "<span class=\"" + item.class + "\" style=\"" + avatarStyling + "\"><img src=\"" + item.profile_image_link + "\" draggable=\"false\" style=\"" + avatarImgStyling + "\" alt=\"" + item.value + "\"></span>&nbsp; <span style=\"width: auto; line-height: 1.35;\">" + item.name + "</span>";
                    return listDisplay;
                },
            },
            toolbar: ["bold", "italic", "underline", "link", "image"],
            keyboard: {
                bindings: {
                    tab: false,
                    handleEnter: {
                        key: 13,
                        metaKey: osName.includes("Mac") && mode !== "chat" ? true : false,
                        ctrlKey: (osName.includes("Windows") || osName.includes("Linux")) && mode !== "chat" ? true : false,
                        handler: () => {
                            handleSubmit();
                        },
                    },
                    linebreak: {
                        key: 13,
                        metaKey: true,
                        handler: function (range, context) {
                                if (osName.includes("Mac") && mode === "chat") {
                                    quillRef.current.getEditor().insertEmbed(range.index + 1, 'block', true, 'user');
                                    quillRef.current.getEditor().setSelection(range.index + 1, Quill.sources.SILENT);
                                }
                        }
                    }
                },
            },
        };
        setModules(modules);
    };

    useEffect(() => {
        handleSetModule();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (Object.keys(userMentions).length && (Object.keys(userMentions).length + 1) !== mentionValues.length) {
            handleSetModule();
        }
    }, [Object.keys(userMentions).length], mentionValues.length);

    return [modules];
};

export default useQuillModules;