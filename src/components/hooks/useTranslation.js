import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHttpStatus } from "../../helpers/commonFunctions";
import { addToModals, addTranslationObject, getTranslationObject, postGenerateTranslationRaw } from "../../redux/actions/globalActions";
import { useDriff, useSettings } from "./index";
import { isTranslationLogged } from "../../helpers/slugHelper";

let init = true;
let cookieName = {
  dict: "i18n",
  lang: "i18n_lang",
  name: "i18n_ver",
  ver: "150920201106",
};

localStorage.removeItem("i18n.28082020");
localStorage.removeItem("i18n_lang.28082020");

if (localStorage.getItem(cookieName.name) !== cookieName.ver) {
  localStorage.removeItem(cookieName.dict);
  localStorage.removeItem(cookieName.lang);
  localStorage.setItem(cookieName.name, cookieName.ver);
}

export const useTranslation = () => {
  const dispatch = useDispatch();

  const { registeredDriff } = useDriff();
  const {
    generalSettings: { language },
    setGeneralSetting,
  } = useSettings();

  const i18n = useSelector((state) => state.global.i18n);

  const [dictFile, setDictFile] = useState({});
  const { REACT_APP_dictionary_file } = process.env;
  const dictionaryFile = REACT_APP_dictionary_file.replace("{{driffName}}", registeredDriff);

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

      if (localStorage.getItem(cookieName.dict)) {
        dispatch(addTranslationObject(JSON.parse(localStorage.getItem(cookieName.dict))));
      } else {
        setDictFile({
          lang: lang.exact,
          file: `${dictionaryFile}/${lang.exact}`,
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
        getTranslationObject(
          {
            url: dictFile.file,
          },
          (err, res) => {
            if (err) {
              console.log(err, dictFile.file, "error loading dictionary file");
            }

            if (res) {
              if (res.data === "") {
                if (dictFile === `${dictionaryFile}/${lang.exact}`) {
                  setDictFile({
                    lang: lang.main,
                    file: `${dictionaryFile}/${lang.main}`,
                  });
                } else if (dictFile === `${dictionaryFile}/${lang.main}`) {
                  setDictFile({
                    lang: "en",
                    file: `${dictionaryFile}/en`,
                  });
                }
              } else {
                setGeneralSetting({
                  language: dictFile.lang,
                });
              }
            }
          }
        )
      );
    }
  }, [dispatch, dictFile, dictionaryFile]);

  const translate = useCallback((i18n, code, default_value, replacement = null) => {
    let translation = default_value;
    if (i18n !== null && typeof i18n[code] !== "undefined") {
      translation = i18n[code];
    }

    if (replacement !== null) {
      for (const key in replacement) {
        if (replacement.hasOwnProperty(key)) {
          let specialPattern = new RegExp("::" + key + "::", "ig");

          if (replacement[key] === null) {
            translation = translation.replace(specialPattern, "");
          } else {
            translation = translation.replace(specialPattern, replacement[key]);
          }
        }
      }
    }

    if (isTranslationLogged()) {
      return `** ${translation} **`;
    } else {
      return translation;
    }
  });

  const _t = (code, default_value, replacement = null) => {
    const dispatch = useDispatch();
    const i18n = useSelector((state) => state.global.i18n);
    const [translation, setTranslation] = useState(default_value);

    useEffect(() => {
      if (i18n === null || typeof i18n[code] === "undefined") {
        dispatch(
          addTranslationObject({
            [code]: default_value,
          })
        );
      }

      setTranslation(translate(i18n, code, default_value, replacement));
    }, [dispatch, i18n, code, default_value, replacement]);

    return translation;
  };

  const setLocale = useCallback((lang, callback = null) => {
    let dictFile = `${dictionaryFile}/${lang}`;
    if (getHttpStatus(dictFile, false) !== false) {
      dispatch(
        getTranslationObject(
          {
            url: dictFile,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              if (callback) callback();
            }
          }
        )
      );
      setGeneralSetting({
        language: lang,
      });
    }
  }, []);

  const uploadTranslationToServer = useCallback(
    (callback = () => { }) => {
      let vocabulary = [];
      let bodyText = `You are about to add the following words to the dictionary files, continue?`;
      bodyText += `<table>`;
      Object.keys(i18n).forEach((k) => {
        bodyText += `<tr>`;
        bodyText += `<td>${k}</td>`;
        bodyText += `<td>${i18n[k]}</td>`;
        bodyText += `</tr>`;
        vocabulary.push({
          [k]: i18n[k],
        });
      });
      bodyText += `</table>`;

      const cb = () => {
        dispatch(postGenerateTranslationRaw(vocabulary, callback));
      };

      let payload = {
        type: "confirmation",
        headerText: "Translation - Add",
        submitText: "Add",
        cancelText: "Cancel",
        bodyText: bodyText,
        size: "lg",
        actions: {
          onSubmit: cb,
        },
      };

      dispatch(addToModals(payload));
    },
    [i18n]
  );

  /**
   * Save added text to local storage
   */
  useEffect(() => {
    localStorage.setItem(cookieName.dict, JSON.stringify(i18n));
  }, [i18n]);

  /**
   * Save language change to local storage
   */
  useEffect(() => {
    localStorage.setItem(cookieName.lang, language);
  }, [language]);

  return {
    _t,
    setLocale,
    uploadTranslationToServer,
  };
};

export default useTranslation;
