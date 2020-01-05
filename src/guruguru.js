/*
 * Guruguru LiveChat Translator
 * Main script
 * 
 * Copyright (c) 2020 P.Knowledge (0x00000FF) and contributors
 * Licensed under MIT License.
 * 
 */

 /* this variables will be set after setting is loaded */
let apiBase, apiId, apiKey, destLang;

 /* XMLHttpRequest utility function */
const request = (url, data, done) => {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 201) {
                done(xhr.responseText);
            }
        }
    }

    xhr.send(data);
};

 /* swap with original/translated text */ 
const swap = (txtElem) => {
    if (txtElem.hasAttribute("swap-text")) {
        let tmp = txtElem.innerText;
        txtElem.innerText = txtElem.getAttribute("swap-text");
        
        txtElem.setAttribute("swap-text", tmp);
        return true;
    }
}

 /* request translation */
const translate = (btn) => {
    const txtElem = btn.toElement;

    if (swap(txtElem)) {
        return;
    }

    let reqData = {
        "api_id": apiId,
        "api_key": apiKey,
        "dest_lang": destLang,
        "text": txtElem.innerText
    };

    request(apiBase, 
            JSON.stringify(reqData),
            (data) => {
                let ttext = JSON.parse(data)
                                .message
                                .result
                                .translatedText;

                txtElem.setAttribute("swap-text", txtElem.innerText);
                txtElem.innerText = ttext;
            });
};

 /* begin observer */
(function () {
    const targetNode = document.querySelector("yt-live-chat-item-list-renderer #contents #item-scroller");
    const config = { attributes: false, childList: true, subtree: true };
    const callback = (list, obs) => {
        let extractTarget;

        for (let entity of list) {
            if (entity.type !== "childList") {
                continue;
            }

            let target = entity.target;

            if (target.id === "message" 
                && ( target.className === "style-scope yt-live-chat-text-message-renderer"
                     || target.className === "style-scope yt-live-chat-paid-message-renderer")
               ) {
                extractTarget = target;
                break;
            }
        }

        extractTarget.style = "cursor: pointer";
        extractTarget.addEventListener("click", translate);
    };

    const chatObserver = new MutationObserver(callback);
    chatObserver.observe(targetNode, config);

    /* Load setting data */
    chrome.storage.sync.get({
        "api_base": "https://ppgmed.patche.me/translate.php",
        "api_id": "",
        "api_key": "",
        "dest_lang": "ko",
    }, (data) => {
        if (data.api_base.length !== 0) {
            apiBase = data.api_base;
        }

        if (data.api_id.length !== 0) {
            apiId = data.api_id;
        } 
        
        if (data.api_key.length !== 0) {
            apiKey = data.api_key;
        }

        if (data.dest_lang.length !== 0) {
            destLang = data.dest_lang;
        }
    });
})();

