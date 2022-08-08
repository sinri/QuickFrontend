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
    constructor(boxID) {
        this.__box=document.getElementById(boxID)
        this.__headerDiv = document.createElement("div")
        this.__historyDiv=document.createElement("div")
        this.__commandDiv=document.createElement("div")

        this.__headerDivRender=function (headerDiv){
            let h1=document.createElement("h1")
            h1.innerText="Counter Clerk"
            headerDiv.appendChild(h1)
        }

        this.__commandHandler=function (command){
            return new Promise((resolve,reject)=>{
                reject("TODO")
            })
        }

        this.__commandSentHandler=function (){

        }
    }

    /**
     *
     * @param headerDivRender function(headerDiv)
     */
    setHeaderDivRender(headerDivRender){
        this.__headerDivRender=headerDivRender
    }

    /**
     *
     * @param commandHandler function (command) : resp
     */
    setCommandHandler(commandHandler){
        this.__commandHandler=commandHandler
    }



    init(){
        this.__headerDivRender.call(null,this.__headerDiv)


        let command_input=document.createElement("input")
        command_input.placeholder="command"
        this.__commandDiv.appendChild(command_input)

        let command_send_button=document.createElement("button")
        command_send_button.innerText="send"
        let that=this
        command_send_button.addEventListener("click",function (event){
            that.__commandHandler.call(null,command_input.value)
                .then(resp=>{

                })
                .catch(error=>{

                })
        })

        this.__commandDiv.appendChild()
    }
}

class CounterClerk {
    /**
     * initialize an instance of CounterClerk
     * @param options object
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