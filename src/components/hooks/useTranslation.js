import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getHttpStatus} from "../../helpers/commonFunctions";
import {addTranslationObject, getTranslationObject} from "../../redux/actions/globalActions";

const useTranslation = () => {

    const dispatch = useDispatch();

    const i18n = useSelector(state => state.global.i18n);
    //const language = useSelector(state => state.settings.userSettings.LANGUANGE);
    const [dictFile, setDictFile] = useState("");

    const getBrowserLanguage = useCallback(() => {
        const lang = navigator.language || navigator.userLanguage;
        return {
            main: lang.split("-")[0],
            exact: lang,
        };
    }, []);

    useEffect(() => {
        if (localStorage.getItem(`i18n`)) {
            dispatch(
                addTranslationObject(
                    JSON.parse(localStorage.getItem(`i18n`)),
                ),
            );
        } else {
            const {REACT_APP_dictionary_file} = process.env;
            const lang = getBrowserLanguage();
            let valid = false;

            let dictFile = `${REACT_APP_dictionary_file}/${lang.main}`;
            if (!valid && getHttpStatus(dictFile, false) !== false) {
                setDictFile(preventDefault => dictFile);
            }
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (dictFile) {
            dispatch(
                getTranslationObject({
                    url: dictFile,
                }, (err, res) => {
                    localStorage.setItem(`i18n`, JSON.stringify(res.data));
                }),
            );
        }
    }, [dispatch, dictFile]);

    /**
     * Save added text to local storage
     */
    useEffect(() => {
        localStorage.setItem(`i18n`, JSON.stringify(i18n));
    }, [i18n]);
};

export const translate = (i18n, code, default_value, replacement = null) => {

    let translation = default_value;
    if (i18n !== null && typeof i18n[code] !== "undefined") {
        translation = i18n[code];
    }

    if (replacement !== null) {
        for (const key in replacement) {
            let specialPattern = new RegExp("::" + key + "::", "ig");

            if (replacement[key] === null) {
                translation = translation.replace(specialPattern, "");
            } else {
                translation = translation.replace(specialPattern, replacement[key]);
            }
        }
    }

    return translation;
};

export const t = (code, default_value, replacement = null) => {
    return translate(JSON.parse(localStorage.getItem(`i18n`)), code, default_value, replacement);
};

export const _t = (code, default_value, replacement = null) => {

    const dispatch = useDispatch();
    const i18n = useSelector(state => state.global.i18n);
    const [translation, setTranslation] = useState(default_value);

    useEffect(() => {
        if (i18n === null || typeof i18n[code] === "undefined") {
            dispatch(
                addTranslationObject({
                    [code]: default_value,
                }),
            );
        }

        setTranslation(translate(i18n, code, default_value, replacement));
    }, [dispatch, i18n, code, default_value, replacement]);

    return translation;
};

export const setLocale = (lang, dispatch, callback = null) => {
    const {REACT_APP_dictionary_file} = process.env;
    let valid = false;

    let dictFile = `${REACT_APP_dictionary_file}/${lang}`;
    if (!valid && getHttpStatus(dictFile, false) !== false) {
        dispatch(
            getTranslationObject({
                url: dictFile,
            }, (err, res) => {
                localStorage.setItem(`i18n`, JSON.stringify(res.data));
                if(callback)
                    callback()
            }),
        );
    }
};

export default useTranslation;