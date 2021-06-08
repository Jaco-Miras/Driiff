import { parseEmojis, textToLink } from "./stringFormatter";
import { validURL } from "./urlContentHelper";
//import { GoogleDriveLink, FancyLink, SvgIcon } from "../components/common";
import {SvgIcon } from "../components/common";
import React from "react";
import { renderToString } from "react-dom/server";

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
      //if (pTagQuery[index].querySelectorAll("a").length >= 1) return;

      let emojiPattern = /:(.*?):/i;
      let innerHTML = pTagQuery[index].innerHTML;

      let words = [];
      if (!innerHTML.startsWith("<span class=\"ql-mention-denotation-char\">")) {
        words = innerHTML.split(" ");
      }
      let parseText = [];
      let i = 0;
      let isSpan = false;
      let isLink = false;
      for (let word of words) {
        //mention
        if (word === "<span") {
          isSpan = true;
          parseText.push(word);
          i++;
          continue;
        } else if (word.endsWith("</a></span></span>")) {
          isSpan = false;
          parseText.push(word);
          i++;
          continue;
        } else if (isSpan && (word.length === 0 || !(word.startsWith("http") || word.length <= 3))) {
          parseText.push(word);
          i++;
          continue;
        }

        //hyperlink
        if (word === "<a") {
          isLink = true;
          parseText.push(word);
          i++;
          continue;
        } else if (word.endsWith("</a>")) {
          isLink = false;
          parseText.push(word);
          i++;
          continue;
        } else if (isLink) {
          parseText.push(word);
          i++;
          continue;
        }

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
        /*
        if (editMode !== true && validURL(word) === true) {
         /*
          const googleDriveFileUrlPattern = /^(https:\/\/(drive|docs)\.google\.com\/)(file|spreadsheets|document|presentation|forms)\/d\/([^\/]+)\/.*$/;
          const urlPattern = /^((http|https|ftp):\/\/)/;
          if (googleDriveFileUrlPattern.test(word)) {
            word = renderToString(<GoogleDriveLink link={word} />);
          } else if (!urlPattern.test(word)) {
            // if (!(word.includes("href") || word.includes("src"))) {
            //   word = parseEmojis(textToLink(word));
            // }
            
          } else {
           //word = renderToString(<FancyLink link={word} />); //`<a target="_blank" href="${word}">${word}</a>`
           word = `<a target="_blank" href="${word}">${word}</a>`;
            // let taskUrl = parseTaskUrl(word);

            // if (!taskUrl) {
            //   word = `<a target="_blank" href="${word}">${word}</a>`;
            // } else {
            //   word = taskUrl;
            // }
          }
           */ 
       // word = renderToString(<FancyLink link={word} />);
        // word = `<a target="_blank" href="${word}">${word}</a>`;
       // }

      
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
    if (body === null) return "";

    let el = document.createElement("div");
    el.innerHTML = body;

    this.convertContentByTag(el, "span", false);
    this.convertContentByTag(el, "div", false);
    this.convertContentByTag(el, "p", false);
    this.convertContentByTag(el, "li", false);
    //this.convertContentByTag(el, "a", false);
    return el.innerHTML;
  }

  static parseToText(body, options = { imageVideo: false }) {
    let tmp = document.createElement("DIV");

    if (options.imageVideo) tmp.innerHTML = body.replace(/<img[^>]*>/g, "::image::");
    else tmp.innerHTML = body;

    return tmp.textContent || tmp.innerText || "";
  }

  static parseToTextImageVideo(body) {
    return this.parseToText(body, { imageVideo: true }).replace("::image::", renderToString(<SvgIcon className="ml-1" icon="image-video" />));
  }
}

export default quillHelper;
