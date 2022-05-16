"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 8484:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Page_Page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4675);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_serverStatus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5813);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_Page_Page__WEBPACK_IMPORTED_MODULE_1__]);
_components_Page_Page__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







const defaultServerUri = "http://localhost:8000";
/* eslint-disable sonarjs/cognitive-complexity */ function MyApp({ Component , pageProps  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const routerPush = router.push;
    const { isReady , pathname  } = router;
    const [ready, setReady] = react__WEBPACK_IMPORTED_MODULE_3___default().useState(false);
    const [title, setTitle] = react__WEBPACK_IMPORTED_MODULE_3___default().useState("");
    const [serverStatus, setServerStatus] = react__WEBPACK_IMPORTED_MODULE_3___default().useState();
    const [isSandboxToken, setIsSandboxToken] = react__WEBPACK_IMPORTED_MODULE_3___default().useState();
    const [accountId, setAccountId] = react__WEBPACK_IMPORTED_MODULE_3___default().useState();
    const checkToken = react__WEBPACK_IMPORTED_MODULE_3___default().useCallback(async ()=>{
        const t = await (0,_utils_serverStatus__WEBPACK_IMPORTED_MODULE_4__/* .getSelectedToken */ .wg)(defaultServerUri);
        if (!t) {
            setIsSandboxToken();
            if (await (0,_utils_serverStatus__WEBPACK_IMPORTED_MODULE_4__/* .checkServer */ ._p)(defaultServerUri)) {
                setServerStatus(true);
            } else {
                setServerStatus(false);
            }
        } else {
            setServerStatus(true);
            if (t.accountId && t.accountId !== accountId) {
                setAccountId(t.accountId);
            } else if (!t.accountId && pathname !== "/settings") {
                routerPush("/accounts");
            }
        }
        if (t && typeof t.isSandbox === "boolean") {
            setIsSandboxToken(t.isSandbox);
        } else if (pathname !== "/settings") {
            routerPush("/settings");
        }
    }, [
        routerPush,
        pathname,
        accountId
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        typeof document !== undefined ? __webpack_require__(7064) : null;
        let interval;
        if (isReady && ready) {
            interval = setInterval(checkToken, 15000);
            checkToken();
        }
        setReady(true);
        return ()=>{
            interval && clearInterval(interval);
        };
    // checkToken в deps специально не добавлен, чтобы не было лишних запросов.
    }, [
        ready,
        isReady
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    return typeof isSandboxToken !== "undefined" && typeof accountId !== "undefined" || pathname === "/settings" || pathname === "/accounts" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Page_Page__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, {
        title: title,
        isSandboxToken: isSandboxToken,
        serverStatus: serverStatus,
        accountId: accountId,
        pathname: pathname,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
            ...pageProps,
            isSandboxToken: isSandboxToken,
            serverUri: defaultServerUri,
            setTitle: setTitle,
            checkToken: checkToken,
            accountId: accountId
        })
    }) : null;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7064:
/***/ ((module) => {

module.exports = require("bootstrap/dist/js/bootstrap");

/***/ }),

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 7269:
/***/ ((module) => {

module.exports = import("reactstrap");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [675,813], () => (__webpack_exec__(8484)));
module.exports = __webpack_exports__;

})();