export const convertAnchor = (content) => {
  let splitByStartPTag = content.split("<p>");
  let splitByEndPTag = splitByStartPTag.join("").split("</p>");
  let newContent = splitByEndPTag.join("");
  return newContent
    .split(" ")
    .map((element) => {
      if (validURL(element)) {
        return `<a href="${element}" __target="blank">${element}</a>`;
      } else {
        return element;
      }
    })
    .join("");
};

export const getAllLink = (content) => {
  var links = [];
  var splitByStartPTag = content.split("<p>");
  var splitByEndPTag = splitByStartPTag.join("").split("</p>");
  var splitByStartATag = splitByEndPTag.join("").split("<a ");
  splitByStartATag
    .join("")
    .split("</a>")
    .forEach((element) => {
      var splitHref = element.split('href="');
      var link = splitHref.join("").split('"')[0];
      if (validURL(link)) {
        links.push(link);
      }
    });
  return links;
};
export const urlify = (text) => {
  const { REACT_APP_apiDNSName, REACT_APP_localDNSName } = process.env;
  let urls = [];
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  text.replace(urlRegex, function (url) {
    if (validURL(url)) {
      urls.push(url);
    }
  });
  //return urls.filter(u => !u.includes(REACT_APP_apiDNSName))
  if (
    urls.filter((u) => {
      return !u.includes(REACT_APP_apiDNSName) && u.includes(REACT_APP_localDNSName) && !u.includes("/profile/");
    }).length
  ) {
    return [urls.filter((u) => !u.includes(REACT_APP_apiDNSName) && u.includes(REACT_APP_localDNSName))[0]];
  } else {
    return [];
  }

  //return urls.filter(u => !u.includes(REACT_APP_apiDNSName) && u.includes(REACT_APP_localDNSName));
};
export const getGifLinks = (content) => {
  let urls = [];
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  content.replace(urlRegex, function (url) {
    if (validURL(url)) {
      //&& url.slice(url.length - 4) === ".gif"
      urls.push(url);
    }
  });
  return urls;
};

export const validURL = (string) => {
  //var pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  let pattern =
    /(?:(?:ht|f)tp(?:s?):\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |/.,*:;=]|%[a-f\d]{2})*)?/gi;
  return pattern.test(string);
};

//not working yet
export const getFileStatus = (fileUrl) => {
  let http = new XMLHttpRequest();

  http.open("GET", fileUrl, false);
  http.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
  http.send();
};
