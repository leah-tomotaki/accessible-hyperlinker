'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts



const is_descriptive = (inner_text) => {
  const url_regex = new RegExp('https?:\/\/.+');
  if(url_regex.test(inner_text)) {
    return inner_text.length > 25;
  }
  else {
    let dumb_desc = ['link', 'click', 'click here', 'more', 'more info', "click me", "click here!", "click me!"];
    return dumb_desc.includes(inner_text); 
  }  
}

function allOccurrences(arr, value) {
  const indexes = [];

  arr.forEach((element, index) => {
    if (element === value) {
      indexes.push(index);
    }
  });

  return indexes;
}

const find_repeats = (links) => {
  const linkList = [... links];

  const innerTextMap = linkList.map(l => l.innerText);

  const textWithDuplicates = innerTextMap.filter((item, index) => innerTextMap.indexOf(item) !== index);
  const textWithDuplicatesSet = new Set(textWithDuplicates);
  const repeats = [... textWithDuplicatesSet].filter((item) => item !== "");
  
  const repeatsIndxs = repeats.map((text, i) => {
    const indexes = [];

    innerTextMap.forEach((element, index) => {
      if (element === text) {
        indexes.push(index);
      }
    });
    return indexes
  });

  return repeatsIndxs;
}

const get_bad_links = () => {
  let links = document.querySelectorAll('a');
  let bad_links = [];
  for(var i = 0; i < links.length; i++) {  
    if(is_descriptive(links[i].innerText)) {
      bad_links.push(links[i].href);
    }
    const repeats = find_repeats(links);
    repeats.forEach((r) => {
      r.forEach((i) => {
        bad_links.push(links[i].href);
      })
    });
  }
  return bad_links;
}

const replace_links = (links, titles) => {
  for(var i = 0; i < links.length; i++) {
    const linkTag = document.querySelectorAll("a[href='"+links[i]+"']")[0];
    if (linkTag.childNodes) {
      linkTag.childNodes[0].innerText = titles[i];
    } else {
      linkTag.innerHTML = titles[i];
    }
  }
}

chrome.runtime.sendMessage(
  {
    type: 'LINKS',
    payload: {
      links: get_bad_links(),
    },
  },
  (response) => {
    console.log(response.titles);
    replace_links(get_bad_links(), response.titles);
  }
);

