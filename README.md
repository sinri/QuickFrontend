# QuickFrontend
The mess of frontend resources and notes.

## SinriQF
A simple frontend framework is designed for quick develop with vue.js 2, iview.ui 3, axios, js-cookie.

CDN: https://www.everstray.com/cdn/QuickFrontend/SinriQF/SinriQF.js

Usage Sample:

```html
<script src="https://unpkg.com/axios@0.18.0/dist/axios.js"></script>
<script src="https://unpkg.com/js-cookie@2.2.0/src/js.cookie.js"></script>
<script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
<script type="text/javascript" src="https://unpkg.com/iview/dist/iview.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/iview/dist/styles/iview.css">
<script src="SinriQF.js"></script>
```

```javascript
new Vue({
        el: '#app',
        data: {
        },
        methods: {
        },
        mounted: function () {
            SinriQF.config.TokenName = "test_quick_frontend";
            SinriQF.config.vueInstance = this;
        }
    })
```