 /* Load setting data */
 chrome.storage.sync.get({
    "api_base": "https://ppgmed.patche.me/translate.php",
    "api_id": "",
    "api_key": "",
    "dest_lang": "ko",
}, (data) => {
    if (data.api_base.length !== 0) {
        document.querySelector("#ApiBase").value = data.api_base;
    }

    if (data.api_id.length !== 0) {
        document.querySelector("#ApiID").value = data.api_id;
    }

    if (data.api_key.length !== 0) {
        document.querySelector("#ApiKey").value = data.api_key;
    }

    if (data.dest_lang.length !== 0) {
        document.querySelector("#DestLang").value = data.dest_lang;
    }
});

let saveBtn = document.querySelector("#SaveButton");

if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        chrome.storage.sync.set({
            "api_base": document.querySelector("#ApiBase").value,
            "api_id": document.querySelector("#ApiID").value,
            "api_key": document.querySelector("#ApiKey").value,
            "dest_lang": document.querySelector("#DestLang").value,
        }, () => {
            saveBtn.innerHTML = "Save complete! Please refresh livechat page.";
            setTimeout( () => {
                saveBtn.innerText = "Save";
             }, 1750);
        });
    });
}