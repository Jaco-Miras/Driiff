import { parseEmojis } from "../../helpers/stringFormatter";

const useEnlargeEmoticons = () => {
  const enlargeEmoji = (textWithHtml) => {
    let body = "";
    let el = textWithHtml;
    if (typeof textWithHtml === "string") {
      el = document.createElement("div");
      el.innerHTML = textWithHtml;
      body = parseEmojis(textWithHtml);
    } else {
      body = parseEmojis(textWithHtml.innerHTML);
    }
    const pattern = /((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*)/g; // regex for emoji characters
    const bodyWithoutEmoji = parseEmojis(el.textContent).trim().replace(pattern, ""); //removes all emoji instance
    const isEmojiWithString = typeof bodyWithoutEmoji === "string" && bodyWithoutEmoji.trim() !== ""; //check if body has text and emoji
    const isMultipleEmojisOnly = el.textContent.trim().match(pattern) && el.textContent.trim().match(pattern).length > 1; //if message is only emoji but multiple
    if (isEmojiWithString || isMultipleEmojisOnly) {
      return body.replace(pattern, '<span class="font-size-24 line-height-32">$1</span>');
    }

    return body.replace(pattern, '<div class="mx-3 my-4 font-size-40">$1</div>');
  };

  return {
    enlargeEmoji,
  };
};

export default useEnlargeEmoticons;
