'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
});

import getTitleAtUrl from 'get-title-at-url';
import DomParser  from 'dom-parser';
// const { JSDOM } = jsdom;

const get_title_at_url = async (url) => {

  try {
    const response = await fetch(url);
    const html_text = await response.text()
	  const parser = new DomParser();
    const htmlDoc = parser.parseFromString(html_text, 'text/html');
    let title = htmlDoc.getElementsByTagName('title')[0];

    title = title.innerHTML;
    console.log(title);
    return title;
  } catch (error) {

    return url;
  }
}

const get_titles = async (links) => {
  let titles = [];
  for(var i = 0; i < links.length; i++) {
    let title = await get_title_at_url(links[i]);
    titles.push(title);
  }
  return titles;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'LINKS') {
    get_titles(request.payload.links).then(titles => sendResponse({
      titles,
    }));
    // Log message coming from the `request` parameter
    // console.log(titles);
    // Send a response message
    
  }
  return true;
});