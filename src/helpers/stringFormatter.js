//import React from "react";
import { toArray } from "react-emoji-render";
import { getDriffName } from "../components/hooks/useDriff";

export const EmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//export const FindGifRegex = /(?:(?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)(?:(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)(?:jpg|gif|png)/g;
export const FindGifRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/g;
export const GifRegex = /(?:(?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)(?:(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)(?:jpg|gif|png)$/;

export const wordWrap = (value, length) => {
  if (!value) return "";
  if (value.length > length) return `${value.substring(0, length)}...`;
  return value;
};

export const clapCountAsString = (value) => {
  let clap = "";
  for (let i = 0; i < value; i++) {
    clap += "👏";
  }
  return clap;
};

export const stripHtml = (html) => {
  let temporalDivElement = document.createElement("div");
  temporalDivElement.innerHTML = html;

  return temporalDivElement.textContent || temporalDivElement.innerText || "";
  // return html.replace(/(<([^>]+)>)/gi, "")
};

export const stripImgGif = (html) => {
  return html.replace(FindGifRegex, "");
};

export const stripGif = (html) => {
  return stripImgGif(html);
};

export const stripImgTag = (html) => {
  return html.replace(/<[/]?img[^>]*>/gi, "");
};

export const parseEmojis = (value) => {
  const emojisArray = toArray(value);
  const newValue = emojisArray.reduce((previous, current) => {
    if (typeof current === "string") {
      return previous + current;
    }
    return previous + current.props.children;
  }, "");
  return newValue;
};

export const parseTaskUrl = (value) => {
  const { REACT_APP_localDNSName, REACT_APP_ENV } = process.env;
  let taskUrl = `https://${getDriffName()}.${REACT_APP_localDNSName}/task/`;
  let chatUrl = `https://${getDriffName()}.${REACT_APP_localDNSName}/chat/`;
  if (REACT_APP_ENV === "development") {
    taskUrl = `https://${REACT_APP_localDNSName}/task/`;
    chatUrl = `https://${REACT_APP_localDNSName}/chat/`;
  }
  // let matcher = new RegExp(`/^${value}`);

  if (taskUrl.startsWith(taskUrl) && value.includes(taskUrl)) {
    let newUrl = value.replace(taskUrl, "");
    return `<span class='task-url task-link' data-id='${newUrl}'>${newUrl}</span>`;
    //return `<a href='' class='task-url task-link' data-id='${newUrl}'>${newUrl}</a>`
    // return `<a href="${value}" target="_blank">${newUrl}</a>`;
  } else if (chatUrl.startsWith(chatUrl) && value.includes(chatUrl)) {
    let splitUrl = value.split("/").filter((text) => text !== "");
    let channelCode = null;
    let messageCode = null;
    if (splitUrl.length === 4) {
      channelCode = splitUrl[3];
    } else if (splitUrl.length >= 5) {
      channelCode = splitUrl[3];
      messageCode = splitUrl[4];
    }
    return `<span class='chat-url chat-link' data-cid='${channelCode}' data-mid='${messageCode}'>${value}</span>`;
  } else {
    return null;
  }
};

/*export const parseEmojisAndHtml = value => {
 const emojisArray = toArray(value);
 const newValue = emojisArray.map(node => {
 if (typeof node === "string") {
 return <span dangerouslySetInnerHTML={{__html: node}}/>;
 }
 return node.props.children;
 });
 return newValue;
 };*/

export const getEmojiRegexPattern = () => {
  return [
    "\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]",
    " ", // Also allow spaces
  ].join("|");
};

export const getOrdinalNum = (n) => {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "");
};

export const hexToRgbA = (hex) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",1)";
  }
  throw new Error("Bad Hex");
};

export const rgbAToHex = (rgb) => {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
};

export const removeMultipleSpace = (value) => {
  return value.replace(/ +(?= )/g, "");
};

export const textToLink = (text, new_window) => {
  let url_pattern =
    /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/gi;
  // let url_pattern = /^(ftp|http|https):\/\/[^ "]+$/;

  // All links should be target="_blank", i think. I don't know where new_window === true is used..
  // let target = (new_window === true || new_window === null) ? "_blank" : "";

  let target = "_blank";

  return text.replace(url_pattern, function (url) {
    if (!EmailRegex.test(url)) {
      let protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
      let href = protocol_pattern.test(url) ? url : "http://" + url;
      return `<a href="${href}" target="${target}">${url}</a>`;
    } else {
      return `<a href="mailto:${target}" target="${target}">${url}</a>`;
    }
  });
};

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime,
    lastModified: Date.now(),
  });
};

export const replaceChar = (name, char = "-") => {
  return name.toLowerCase().replace(/\s|\//g, char);
};

export const capitalizeFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const hasCurrencySymbol = (value) => {
  return /[€£$]/g.test(value);
};
