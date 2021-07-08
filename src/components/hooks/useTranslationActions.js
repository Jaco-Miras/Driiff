//import { useSelector } from "react-redux";
import { isTranslationLogged } from "../../helpers/slugHelper";

export const useTranslationActions = () => {
  //const session = useSelector((state) => state.session);

  const i18n = localStorage.getItem("i18n") ? JSON.parse(localStorage.getItem("i18n")) : {};
  //const i18new = localStorage.getItem("i18new") ? JSON.parse(localStorage.getItem("i18new")) : {};

  const translate = (code, default_value, replacement = null) => {
    let translation = default_value;
    if (i18n !== null && typeof i18n[code] !== "undefined") {
      translation = i18n[code];
    }
    // else if (i18n !== null && typeof i18n[code] === "undefined" && !i18new.hasOwnProperty(code)) {
    //   if (session.authenticated && session.user && ["anthea@makedevelopment.com", "nilo@makedevelopment.com", "jessryll@makedevelopment.com", "johnpaul@makedevelopment.com"].includes(session.user.email)) {
    //     const newWords = { ...i18new, [code]: default_value };
    //     localStorage.setItem("i18new", JSON.stringify(newWords));
    //   }
    // }

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

  return {
    _t,
  };
};

export default useTranslationActions;
