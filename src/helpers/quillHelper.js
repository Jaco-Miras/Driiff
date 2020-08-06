import {parseEmojis, parseTaskUrl, textToLink} from "./stringFormatter";
import {validURL} from "./urlContentHelper";
import {GoogleDriveLink} from "../components/common";
import React from "react";
import {renderToString} from "react-dom/server";

class quillHelper {
  static generate(body) {
    body = quillHelper.convertColon(body);
    return body;
  }

  static convertContentByTag(el, tag, editMode = true) {
    let pTagQuery = el.querySelectorAll(tag);

    let index = 0,
      length = pTagQuery.length;
    for (; index < length; index++) {
      if (pTagQuery[index].querySelectorAll("a").length >= 1) return;

      let emojiPattern = /:(.*?):/i;
      let innerHTML = pTagQuery[index].innerHTML.replace(">http", "> http");
      let words = innerHTML.split(" ");
      let parseText = [];
      let i = 0;
      for (let word of words) {
        switch (word) {
          case ":S":
            word = ":worried:";
            break;
          default:
        }

        if (word === "☺️️") {
          word = "😊";
        } else if (emojiPattern.test(word)) {
          switch (word) {
            case ":thinking_face:":
              word = "🤔";
              break;
            case ":relaxed:":
              word = "😊";
              break;
            default:
              word = parseEmojis(word);
          }
        } else if (word.length <= 4 && word.length >= 2) {
          let emojiText = parseEmojis(word);

          //not last in the paragraph
          if (editMode !== true) {
            //|| pCount != (el.querySelectorAll('p').length-1)) {
            if (emojiText !== word) {
              word = emojiText;
            }
          } else {
            if (i !== words.length - 1 && emojiText !== word) {
              word = emojiText;
            }
          }
        }

        if (editMode !== true && validURL(word) === true) {
          const googleDriveFileUrlPattern = /^(https:\/\/drive\.google\.com\/)file\/d\/([^\/]+)\/.*$/;
          const urlPattern = /^((http|https|ftp):\/\/)/;
          if (googleDriveFileUrlPattern.test(word)) {

            word = renderToString(<GoogleDriveLink link={word}/>);
          } else if (!urlPattern.test(word)) {
            if (!(word.includes("href") || word.includes("src"))) {
              word = parseEmojis(textToLink(word));
            }
          } else {
            let taskUrl = parseTaskUrl(word);

            if (!taskUrl) {
              word = `<a target="_blank" href="${word}">${word}</a>`;
            } else {
              word = taskUrl;
            }
          }
        }

        parseText.push(word);
        i++;
      }

      //pCount++;

      pTagQuery[index].innerHTML = parseText.join(" ");
    }
  }

  static convertColon(body) {
    let el = document.createElement("div");
    el.innerHTML = body;

    this.convertContentByTag(el, "span", false);
    this.convertContentByTag(el, "div");
    this.convertContentByTag(el, "p");
    this.convertContentByTag(el, "li");

    return el.innerHTML;
  }

  static parseEmoji(body) {
    let el = document.createElement("div");
    el.innerHTML = body;

    this.convertContentByTag(el, "span", false);
    this.convertContentByTag(el, "div", false);
    this.convertContentByTag(el, "p", false);
    this.convertContentByTag(el, "li", false);

    return el.innerHTML;
  }
}

export default quillHelper;
