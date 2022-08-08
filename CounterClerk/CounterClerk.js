// let CounterClerk=window.CounterClerk || (function (){})()

class CounterClerkForCookie {
    getCookie(cookieName) {
        let name = cookieName + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return null;
    }

    setCookie(cookieName, cookieValue, lifeInSeconds) {
        let d = new Date();
        d.setTime(d.getTime() + (lifeInSeconds * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    }

    cleanCookie(cookieName) {
        this.setCookie(cookieName, "", -1)
    }
}

class CounterClerkForXHRResponse {
    constructor(status_code, response_text) {
        this.__status_code = status_code
        this.__response_text = response_text
    }

    getStatusCode() {
        return this.__status_code
    }

    getResponseText() {
        return this.__response_text
    }
}

class CounterClerkForXHRResponseAsJsonObject extends CounterClerkForXHRResponse {
    constructor(counterClerkForXHRResponse) {
        super(counterClerkForXHRResponse.getStatusCode(), counterClerkForXHRResponse.getResponseText())
        this.__response_json = JSON.parse(counterClerkForXHRResponse.getResponseText())
    }

    getResponseJson() {
        return this.__response_json
    }
}

class CounterClerkForXHR {
    /**
     *
     * @param requestDataProcessor function(object):object to format data, add token, etc.
     */
    constructor(requestDataProcessor) {
        this.requestDataProcessor = requestDataProcessor
    }

    get(url) {
        return new Promise((resolve, reject) => {
            try {
                let xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open("GET", url, true)
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState === 4) {
                        resolve(new CounterClerkForXHRResponse(xmlHttpRequest.status, xmlHttpRequest.responseText))
                    }
                }
                xmlHttpRequest.send()
            } catch (e) {
                reject(e)
            }
        });
    }

    postJson(url, body) {
        return new Promise((resolve, reject) => {
            try {
                let processedBody = body;
                if (this.requestDataProcessor) {
                    processedBody = this.requestDataProcessor.call(null, body);
                }
                let xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open("POST", url, true)
                xmlHttpRequest.setRequestHeader("Content-type", "application/json");
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState === 4) {
                        resolve(new CounterClerkForXHRResponse(xmlHttpRequest.status, xmlHttpRequest.responseText))
                    }
                }
                xmlHttpRequest.send(JSON.stringify(processedBody))
            } catch (e) {
                reject(e)
            }
        });
    }

    getForJson(url) {
        return this.get(url)
            .then(resp => {
                console.log("resp", resp)
                return new Promise((resolve, reject) => {
                    try {
                        resolve(new CounterClerkForXHRResponseAsJsonObject(resp))
                    } catch (e) {
                        reject(e)
                    }
                })
            })
    }

    postJsonForJson(url, body) {
        return this.postJson(url, body)
            .then(resp => {
                console.log("resp", resp)
                return new Promise((resolve, reject) => {
                    try {
                        resolve(new CounterClerkForXHRResponseAsJsonObject(resp))
                    } catch (e) {
                        reject(e)
                    }
                })
            })
    }
}

class CounterClerkOptions {
    constructor(options) {
        this.__options = {
            xhr: {
                requestDataProcessor: null
            }
        }
        if(options) {
            if (options.xhr) {
                this.__options.xhr.requestDataProcessor = options.xhr.requestDataProcessor
            }
        }
    }

    setXHRRequestDataProcessor(requestDataProcessor) {
        this.__options.xhr.requestDataProcessor = requestDataProcessor
    }

    getXHRRequestDataProcessor() {
        return this.__options.xhr.requestDataProcessor;
    }
}

class CounterClerkForUI {
    constructor() {
    }

    alert(message, title) {
        let modal = document.createElement("div");
        modal.style.position = "absolute"
        modal.style.top = "50px"
        modal.style.width = "200px"

        if (!title) {
            title = "ALERT"
        }
        let titleP = document.createElement("p");
        titleP.innerText = title
        modal.appendChild(titleP)

        let messageP = document.createElement("p");
        messageP.innerText = message
        modal.appendChild(messageP)

        let footerDiv = document.createElement("div");
        modal.appendChild(footerDiv)

        let closeButton = document.createElement("button")
        closeButton.innerText = "Close"
        closeButton.addEventListener("click", function () {
            modal.style.display = "none"
            modal.remove()
            modal = null
        })
        footerDiv.appendChild(closeButton)

        document.getElementsByTagName("body")[0].appendChild(modal)
    }
}

class CounterClerk {
    /**
     * initialize an instance of CounterClerk
     * @param options CounterClerkOptions
     */
    constructor(options) {
        this.__options = new CounterClerkOptions(options)
        this.__cookieKit = new CounterClerkForCookie()
        this.__xhrKit = new CounterClerkForXHR(this.__options.getXHRRequestDataProcessor())
        this.__uiKit=new CounterClerkForUI()
    }

    cookieKit() {
        return this.__cookieKit
    }

    xhrKit() {
        return this.__xhrKit
    }

    uiKit(){
        return this.__uiKit
    }
}