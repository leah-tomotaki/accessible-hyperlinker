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
  // const test_regex = new RegExp('https://help.shortpixel.com/article/453-error-there-was-an-error-and-your-request-was-not-processed');
  // console.log("inner html: "+inner_text);
  if(url_regex.test(inner_text)) {
    // console.log('if: '+ inner_text);
    return inner_text.length > 25;
  }
  else {
    // console.log('else');
    let dumb_desc = ['link', 'click', 'click here', 'more', 'more info'];
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


// // Listen for message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'COUNT') {
//     console.log(`Current count is ${request.payload.count}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });



// let links = document.querySelectorAll('a');
// console.log('content: '+ links);
// const getTitle = async () => {
//   const title = await getTitleAtUrl('https://developer.chrome.com/docs/extensions/');
//   console.log(title.title);
// }

// const replace_links = async (matches) => {
//   for(var i = 0; i < matches.length; i++) {
//       // TODO: match to bad hyperlink texts
//       if(matches[i].innerHTML === "Github") {
//           let title = await getTitleAtUrl(matches[i].href);
          
//           console.log(title);
//           title = title.title;
//           console.log(title);
//           matches[i].innerHTML = title;
//       }    
//   }
// }


// replace_links(matches);