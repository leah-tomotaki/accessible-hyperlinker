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

const get_bad_links = () => {
  let links = document.querySelectorAll('a');
  let bad_links = [];
  for(var i = 0; i < links.length; i++) {  
    if(is_descriptive(links[i].innerText)) {
      bad_links.push(links[i].href);
    }
  }
  console.log(bad_links);
  return bad_links;
}

const replace_links = (links, titles) => {
  for(var i = 0; i < links.length; i++) {
    document.querySelectorAll("a[href='"+links[i]+"']")[0].innerHTML = titles[i];
  }
}

// console.log();
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

