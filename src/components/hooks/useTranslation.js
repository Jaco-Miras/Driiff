import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHttpStatus } from "../../helpers/commonFunctions";
import { addToModals, getTranslationObject, postGenerateTranslationRaw } from "../../redux/actions/globalActions";
import { useDriff, useSettings } from "./index";
import { isTranslationLogged } from "../../helpers/slugHelper";

let cookieName = {
  dict: "i18n",
  lang: "i18n_lang",
  name: "i18n_ver",
};
let init = false;
export const useTranslation = () => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const { registeredDriff } = useDriff();
  const {
    driffSettings,
    generalSettings: { language },
    setGeneralSetting,
  } = useSettings();

  const i18n = localStorage.getItem("i18n") ? JSON.parse(localStorage.getItem("i18n")) : {};
  const i18new = localStorage.getItem("i18new") ? JSON.parse(localStorage.getItem("i18new")) : {};

  const [dictFile, setDictFile] = useState("");
  const { REACT_APP_dictionary_file } = process.env;
  const dictionaryAPIUrl = registeredDriff ? REACT_APP_dictionary_file.replace("{{driffName}}", registeredDriff) : REACT_APP_dictionary_file.replace("{{driffName}}.", "");

  const browserLang = {
    main: (navigator.language || navigator.userLanguage).split("-")[0],
    exact: navigator.language || navigator.userLanguage,
  };

  useEffect(() => {
    console.log("test useeffect");
    if (init || !session.checked || (session.authenticated && language === null)) return;

    init = true;

    localStorage.removeItem("i18n.28082020");
    localStorage.removeItem("i18n_lang.28082020");

    cookieName.ver = driffSettings.i18n;
    if (localStorage.getItem(cookieName.name) !== cookieName.ver) {
      localStorage.removeItem(cookieName.dict);
      localStorage.removeItem(cookieName.lang);
      localStorage.setItem(cookieName.name, cookieName.ver);
    }

    if (language) {
      setDictFile(`${dictionaryAPIUrl}/${language}`);
    } else {
      setDictFile(`${dictionaryAPIUrl}/${browserLang.exact}`);
    }
  });

  useEffect(() => {
    if (dictFile) {
      dispatch(
        getTranslationObject(
          {
            url: dictFile,
          },
          (err, res) => {
            if (err) {
              console.log(err, dictFile, "error loading dictionary file");
            }

            if (res) {
              if (res.data.length === 0) {
                //exact browser language
                if (dictFile === `${dictionaryAPIUrl}/${browserLang.exact}`) {
                  setDictFile(`${dictionaryAPIUrl}/${browserLang.main}`);

                  //country browser language or language setting
                } else if (dictFile === `${dictionaryAPIUrl}/${browserLang.main}`) {
                  setDictFile(`${dictionaryAPIUrl}/en`);
                }
              } else {
                setGeneralSetting({
                  language: dictFile.split("/").pop(),
                });
              }
            }
          }
        )
      );
    }
  }, [dispatch, dictFile, dictionaryAPIUrl]);
  console.log("test");

  const translate = (code, default_value, replacement = null) => {
    let translation = default_value;
    if (i18n !== null && typeof i18n[code] !== "undefined") {
      translation = i18n[code];
    } else if (i18n !== null && typeof i18n[code] === "undefined" && !i18new.hasOwnProperty(code)) {
      if (session.authenticated && session.user && ["anthea@makedevelopment.com", "nilo@makedevelopment.com", "jessryll@makedevelopment.com", "johnpaul@makedevelopment.com"].includes(session.user.email)) {
        const newWords = { ...i18new, [code]: default_value };
        localStorage.setItem("i18new", JSON.stringify(newWords));
      }
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
  };

  const _t = (code, default_value, replacement = null) => {
    return translate(code, default_value, replacement);
  };

  const setLocale = (lang, callback = null) => {
    let dictFile = `${dictionaryAPIUrl}/${lang}`;
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
  };

  const uploadTranslationToServer = (callback = () => {}) => {
    let vocabulary = [];
    let bodyText = "You are about to add the following words to the dictionary files, continue?";
    bodyText += "<table>";
    Object.keys(i18new).forEach((k) => {
      bodyText += "<tr>";
      bodyText += `<td>${k}</td>`;
      bodyText += `<td>${i18new[k]}</td>`;
      bodyText += "</tr>";
      vocabulary.push({
        [k]: i18new[k],
      });
    });
    bodyText += "</table>";

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
  };

  /**
   * Save language change to local storage
   */
  useEffect(() => {
    localStorage.setItem(cookieName.lang, language);
  }, [language]);

  return {
    init,
    _t,
    setLocale,
    uploadTranslationToServer,
  };
};

export default useTranslation;
