import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getHttpStatus} from "../../helpers/commonFunctions";
import {addTranslationObject, getTranslationObject} from "../../redux/actions/globalActions";
import {useSettings} from "./index";

let init = true;

/**
 * @returns {{_t: (function(*=, *=, *=): unknown), setLocale: (...args: any[]) => any}}
 */
export const useTranslation = () => {

    const dispatch = useDispatch();

    const {generalSettings: {language}, setGeneralSetting} = useSettings();

    const i18n = useSelector(state => state.global.i18n);

    const [dictFile, setDictFile] = useState({});
    const {REACT_APP_dictionary_file} = process.env;

    const getBrowserLanguage = useCallback(() => {
        const lang = navigator.language || navigator.userLanguage;

        return {
            main: lang.split("-")[0],
            exact: lang,
        };
    }, []);

    useEffect(() => {
        if (init) {
            init = false;
            const lang = getBrowserLanguage();

            if (localStorage.getItem(`i18n`)) {
                dispatch(
                    addTranslationObject(
                        JSON.parse(localStorage.getItem(`i18n`)),
                    ),
                );
                setGeneralSetting({
                    language: localStorage.getItem(`i18n_lang`),
                });
            } else {
                setDictFile({
                    lang: lang.exact,
                    file: `${REACT_APP_dictionary_file}/${lang.exact}`,
                });

                // @todo add slug conditions
                // let dictFile = `${getBaseUrl()}/api/lang/en`;
                // if (getHttpStatus(dictFile, false) !== false) {
                //     setDictFile(preventDefault => dictFile);
                // } else {
                //     dictFile = `${REACT_APP_dictionary_file}/${lang.exact}`;
                //     setDictFile(preventDefault => dictFile);
                // }
            }
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const lang = getBrowserLanguage();

        if (dictFile.file) {
            dispatch(
                getTranslationObject({
                    url: dictFile.file,
                }, (err, res) => {
                    if (err) {
                        console.log(err, dictFile.file, "error loading dictionary file");
                    }

                    if (res) {
                        if (res.data === "") {
                            if (dictFile === `${REACT_APP_dictionary_file}/${lang.exact}`) {
                                setDictFile({
                                    lang: lang.main,
                                    file: `${REACT_APP_dictionary_file}/${lang.main}`,
                                });
                            } else if (dictFile === `${REACT_APP_dictionary_file}/${lang.main}`) {
                                setDictFile({
                                    lang: "en",
                                    file: `${REACT_APP_dictionary_file}/en`,
                                });
                            }
                        } else {
                            setGeneralSetting({
                                language: dictFile.lang,
                            });
                        }
                    }
                }),
            );
        }
    }, [dispatch, dictFile, REACT_APP_dictionary_file]);

    const translate = useCallback((i18n, code, default_value, replacement = null) => {
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
    });

    const _t = (code, default_value, replacement = null) => {

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

    const setLocale = useCallback((lang, callback = null) => {
        const {REACT_APP_dictionary_file} = process.env;

        let dictFile = `${REACT_APP_dictionary_file}/${lang}`;
        if (getHttpStatus(dictFile, false) !== false) {
            dispatch(
                getTranslationObject({
                    url: dictFile,
                }, (err, res) => {
                    if(err) {
                        console.log(err);
                    }

                    if(res) {
                        if (callback)
                            callback();
                    }
                }),
            );
            setGeneralSetting({
                language: lang,
            });
        }
    }, []);

    /**
     * Save added text to local storage
     */
    useEffect(() => {
        localStorage.setItem(`i18n`, JSON.stringify(i18n));
    }, [i18n]);

    /**
     * Save language change to local storage
     */
    useEffect(() => {
        localStorage.setItem(`i18n_lang`, language);
    }, [language]);

    return {
        _t,
        setLocale,
    };
};

export default useTranslation;