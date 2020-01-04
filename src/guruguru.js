/*
 * Guruguru LiveChat Translator
 * Main script
 * 
 * Copyright (c) 2020 P.Knowledge (0x00000FF) and contributors
 * Licensed under MIT License.
 * 
 */

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

        console.log(extractTarget.innerText);
    };

    const chatObserver = new MutationObserver(callback);
    chatObserver.observe(targetNode, config);
})();