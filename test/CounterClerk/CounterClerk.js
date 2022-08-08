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
        if (options) {
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

class CounterClerkCore {
    /**
     * initialize an instance of CounterClerk
     * @param options object, see CounterClerkOptions
     */
    constructor(options) {
        this.__options = new CounterClerkOptions(options)
        this.__cookieKit = new CounterClerkForCookie()
        this.__xhrKit = new CounterClerkForXHR(this.__options.getXHRRequestDataProcessor())
    }

    cookieKit() {
        return this.__cookieKit
    }

    xhrKit() {
        return this.__xhrKit
    }

}

class CounterClerk extends CounterClerkCore {
    /**
     * 初始化。
     * @param options 用于 CounterClerkCore 的初始化。
     */
    constructor(options) {
        super(options)

        this.__call_api_function = (command) => {
            return new Promise((resolve, reject) => {
                reject(new Error(`Not Implemented for command ${command}`));
            })
        }
        this.__show_command_sent_function = (context) => {
            console.log(">", context)
        }
        this.__show_command_done_function = (context, resp) => {
            console.log("<", context, "<", resp)
        }
        this.__show_command_error_function = (context, error) => {
            console.error("!", context, "!", error)
        }
    }

    /**
     * 接收一个字符串`command`，处理（本地解析或调用API）后异步以Promise返回一个报文。
     * @param f (command)=>Promise, which might be CounterClerkForXHRResponse
     * @returns {CounterClerk}
     */
    setCallApiFunction(f) {
        this.__call_api_function = f
        return this
    }

    /**
     * 接收一个命令上下文并进行UI渲染。
     * @param f (context)=>void
     * @returns {CounterClerk}
     */
    setShowCommandSentFunction(f) {
        this.__show_command_sent_function = f
        return this
    }

    /**
     * 接收一个命令上下文和执行成功报文，进行UI渲染。
     * @param f (context,resp)=>void
     * @returns {CounterClerk}
     */
    setShowCommandDoneFunction(f) {
        this.__show_command_done_function = f
        return this
    }

    /**
     * 接收一个命令上下文和执行错误，进行UI渲染。
     * @param f (context,error)=>void
     * @returns {CounterClerk}
     */
    setShowCommandErrorFunction(f) {
        this.__show_command_error_function = f
        return this
    }

    /**
     * 接收一个命令上下文，进行处理。
     * @param command 字符串，一般来自用户输入
     */
    sendCommand(command) {
        const context = {
            command: command
        }
        this.__show_command_sent(context)
        let that = this

        this.__call_api(command)
            .then(resp => {
                // render done
                that.__show_command_done(context, resp)
            })
            .catch(error => {
                // render failure
                that.__show_command_error(context, error)
            })
    }

    __call_api(command) {
        return this.__call_api_function.call(this, command)
    }

    __show_command_sent(context) {
        this.__show_command_sent_function.call(this, context)
    }

    __show_command_done(context, resp) {
        this.__show_command_done_function.call(this, context, resp)
    }

    __show_command_error(context, error) {
        this.__show_command_error_function.call(this, context, error)
    }
}