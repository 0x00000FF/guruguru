/*
 * Guruguru LiveChat Translator
 * Main script
 * 
 * Copyright (c) 2020 P.Knowledge (0x00000FF) and contributors
 * Licensed under MIT License.
 * 
 */

const apiBase = "https://ppgmed.patche.me/translate.php";

let apiId  = "";
let apiKey = "";
let destLang = "ja";

let request = (method, url, data, done) => {
    
    var xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 201) {
                done(xhr.responseText);
            }
        }
    }


    xhr.send(data);
};

/* need to be refactored */
let swap = (txtElem) => {
    if (txtElem.hasAttribute("original")) {
        txtElem.setAttribute("translated", txtElem.innerText);
        txtElem.innerText = txtElem.getAttribute("original");
        
        txtElem.removeAttribute("original");
        return true;
    }

    if (txtElem.hasAttribute("translated")) {
        txtElem.setAttribute("original", txtElem.innerText);
        txtElem.innerText = txtElem.getAttribute("translated");
        
        txtElem.removeAttribute("translated");
        return true;
    }
}

let translate = (btn) => {
    const txtElem = btn.toElement;

    if (swap(txtElem)) return;

    let reqData = {
        "api_id": apiId,
        "api_key": apiKey,
        "dest_lang": destLang,
        "text": txtElem.innerText
    };

    console.log(reqData);
    
    request("POST", apiBase, 
            JSON.stringify(reqData),
            (data) => {
                let ttext = JSON.parse(data)
                                .message
                                .result
                                .translatedText;

                txtElem.setAttribute("original", txtElem.innerText);
                txtElem.innerText = ttext;
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
})();
