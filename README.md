# QuickFrontend

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-GPLv3%20and%20Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)


The mess of frontend resources and notes.

## SinriQF
A simple frontend framework is designed for quick develop with vue.js 2, iview.ui 3, axios, js-cookie.

Link from CDN:

* [Latest Version 2.0](https://www.everstray.com/cdn/QuickFrontend/SinriQF/dist/SinriQF-2.0.js)
* [1.0](https://www.everstray.com/cdn/QuickFrontend/SinriQF/dist/SinriQF-1.0.js)

Usage Sample:

```html
<script src="https://unpkg.com/axios@0.18.0/dist/axios.js"></script>
<script src="https://unpkg.com/js-cookie@2.2.0/src/js.cookie.js"></script>
<script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
<script type="text/javascript" src="https://unpkg.com/iview/dist/iview.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/iview/dist/styles/iview.css">
<script src="https://www.everstray.com/cdn/QuickFrontend/SinriQF/dist/SinriQF-2.0.js"></script>
```

```javascript
new Vue({
        el: '#app',
        data: {
        },
        methods: {
        },
        mounted: function () {
            SinriQF.config.setTokenName("test_quick_frontend");
            SinriQF.config.setVueInstance(this);
        }
    })
```