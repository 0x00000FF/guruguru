/*
 * Guruguru LiveChat Translator
 * Main script
 * 
 * Copyright (c) 2020 P.Knowledge (0x00000FF) and contributors
 * Licensed under MIT License.
 * 
 */

const apiBase = (svc) => 
    "https://openapi.naver.com/v1/papago/" + svc;


let apiId  = "";
let apiKey = "";

let request = (method, url, data, done) => {
    
    var xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader("X-Naver-Client-Id", apiId);
    xhr.setRequestHeader("X-Naver-Client-Secret", apiKey);
    xhr.setRequestHeader("Content-Type", "jsonp");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 201) {
                done(xhr.responseText);
            }
        }
    }

    xhr.send(data);
};

let translate = (btn) => {
    const txtElem = btn.toElement;

    let srcLang = ""; 
    let dstLang = "ja";
    
    request("POST", apiBase("detectLangs"), 
            "query=" + txtElem.innerText,
            (data) => {
                srcLang = data.langCode;
                request("POST", apiBase("n2mt"),
                         "source=" + srcLang +
                         "&target=" + dstLang +  
                         "&text=" + txtElem.innerText,
                         (data) => {
                             txtElem.innerHTML = data.message
                                                     .result
                                                     .translatedText;
                         });
            });
};

(function () {
    const targetNode = document.querySelector("yt-live-chat-item-list-renderer #contents #item-scroller");
    const config = { attributes: false, childList: true, subtree: true };
    const callback = (list, obs) => {
        let extractTarget;

        for (let entity of list) {
            if (entity.type !== "childList") continue;
            let target = entity.target;

            if (target.id === "message" 
                && target.className === "style-scope yt-live-chat-text-message-renderer") {
                extractTarget = target;
                break;
            }
        }

        extractTarget.style = "cursor: pointer";
        extractTarget.addEventListener("click", translate);
    };

    const chatObserver = new MutationObserver(callback);
    chatObserver.observe(targetNode, config);
})();