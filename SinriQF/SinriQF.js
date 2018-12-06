/*
 *
 * <script src="https://unpkg.com/axios@0.18.0/dist/axios.js"></script>
 * <script src="https://unpkg.com/js-cookie@2.2.0/src/js.cookie.js"></script>
 * <script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
 * <script type="text/javascript" src="https://unpkg.com/iview/dist/iview.min.js"></script>
 * <link rel="stylesheet" type="text/css" href="https://unpkg.com/iview/dist/styles/iview.css">
 *
 */

let SinriQF = {
    config: {
        ApiBase: '../api/',
        TokenName: 'token',
        vueInstance: null,
    },
    cookies: {
        getCookie: (cookieName) => {
            return Cookies.get(cookieName);
        },
        setCookie: (cookieName, cookieValue, expireTimestamp) => {
            Cookies.set(cookieName, cookieValue, {
                expires: typeof expireTimestamp === 'object' ? expireTimestamp : new Date(expireTimestamp * 1000)
            });
        },
        cleanCookie: (cookieName) => Cookies.remove(cookieName)
    },
    api: {
        getTokenFromCookie: () => {
            return SinriQF.cookies.getCookie(SinriQF.config.TokenName);
        },
        /**
         *
         * @param apiPath a string
         * @param data an object to package
         * @param callbackForData (data)=>{}
         * @param callbackForError (error,status)=>{}
         */
        call: (apiPath, data, callbackForData, callbackForError) => {
            if (!data) {
                data = {};
            }
            data.token = SinriQF.api.getTokenFromCookie();
            axios.post(SinriQF.config.ApiBase + apiPath, data)
                .then((response) => {
                    console.log("then", response);
                    if (response.status !== 200 || !response.data) {
                        callbackForError(response.data, response.status);
                        return;
                    }
                    let body = response.data;
                    if (body.code && body.code === 'OK') {
                        console.log("success with data", body.data);
                        callbackForData(body.data);
                        return;
                    }
                    callbackForError((body.data ? body.data : 'Unknown Error'), response.status);
                })
                .catch((error) => {
                    console.log("catch", error);
                    callbackForError(error, -1);
                })
        }
    },
    page: {
        getParameterByName: function (name, defaultValue) {
            let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            let v = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
            return v ? v : defaultValue;
        },
        getSiteRoot: function () {
            let x1 = document.location.pathname.lastIndexOf("/frontend/");
            return document.location.protocol + "//" + document.location.host + document.location.pathname.substr(0, x1);
        }
    },
    iview: {
        showErrorMessage: function (message, delay) {
            SinriQF.config.vueInstance.$Message.error({
                content: message,
                duration: delay ? delay : 0,
                closable: true
            });
        },
        showInfoMessage: function (message, delay) {
            SinriQF.config.vueInstance.$Message.info({
                content: message,
                duration: delay ? delay : 0,
                closable: true
            });
        },
        showSuccessMessage: function (message, delay) {
            SinriQF.config.vueInstance.$Message.success({
                content: message,
                duration: delay ? delay : 0,
                closable: true
            });
        },
        showWarningMessage: function (message, delay) {
            SinriQF.config.vueInstance.$Message.warning({
                content: message,
                duration: delay ? delay : 0,
                closable: true
            });
        },
        showNotice: function (title, desc, delay) {
            SinriQF.config.vueInstance.$Notice.open({
                title: title,
                desc: desc,
                duration: delay ? delay : 0,
            });
        },
        showInfoNotice: function (title, desc, delay) {
            SinriQF.config.vueInstance.$Notice.info({
                title: title,
                desc: desc,
                duration: delay ? delay : 0,
            });
        },
        showSuccessNotice: function (title, desc, delay) {
            SinriQF.config.vueInstance.$Notice.success({
                title: title,
                desc: desc,
                duration: delay ? delay : 0,
            });
        },
        showWarningNotice: function (title, desc, delay) {
            SinriQF.config.vueInstance.$Notice.warning({
                title: title,
                desc: desc,
                duration: delay ? delay : 0,
            });
        },
        showErrorNotice: function (title, desc, delay) {
            SinriQF.config.vueInstance.$Notice.error({
                title: title,
                desc: desc,
                duration: delay ? delay : 0,
            });
        },
        startLoadingBar: function () {
            SinriQF.config.vueInstance.$Loading.start();
        },
        finishLoadingBar: function () {
            SinriQF.config.vueInstance.$Loading.finish();
        },
        finishLoadingBarWithError: function () {
            SinriQF.config.vueInstance.$Loading.error();
        },
        updateLoadingBar: function (percent) {
            SinriQF.config.vueInstance.$Loading.update(percent);
        },
    },
    data: {
        copy: function (object) {
            return JSON.parse(JSON.stringify(object));
        },
        unifyJSON: function (string) {
            return JSON.stringify(JSON.parse(string));
        }
    }
};