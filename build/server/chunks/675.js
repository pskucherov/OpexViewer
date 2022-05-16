exports.id = 675;
exports.ids = [675];
exports.modules = {

/***/ 5055:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "Page_container__DWbtX",
	"main": "Page_main__OX_JW",
	"footer": "Page_footer__57xZV",
	"title": "Page_title__dGTfR",
	"description": "Page_description__W1_Lg",
	"code": "Page_code___joOa",
	"grid": "Page_grid__a0SBe",
	"card": "Page_card__82MHn",
	"logo": "Page_logo__HMyyM",
	"PageBadge": "Page_PageBadge___c3rY"
};


/***/ }),

/***/ 4675:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Page)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5055);
/* harmony import */ var _styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7269);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([reactstrap__WEBPACK_IMPORTED_MODULE_3__]);
reactstrap__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];





function Page(props) {
    const { isSandboxToken , serverStatus , accountId , pathname  } = props;
    const { 0: isMenuOpen , 1: setIsMenuOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const toggleMenu = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        setIsMenuOpen(!isMenuOpen);
    }, [
        isMenuOpen
    ]);
    // 0 нужно задать, 1 sandbox, 2 production
    const whatToken = typeof isSandboxToken === "undefined" ? 0 : isSandboxToken ? 1 : 2;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default().container),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                        children: "OpexViewer"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "description",
                        content: "\u0422\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B \u0434\u043B\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0438 \u043F\u043E\u043B\u0443\u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0438"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "icon",
                        href: "/favicon.ico"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
                className: (_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default().main),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(reactstrap__WEBPACK_IMPORTED_MODULE_3__.Navbar, {
                            color: "light",
                            expand: "md",
                            light: true,
                            animation: "false",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(reactstrap__WEBPACK_IMPORTED_MODULE_3__.NavbarBrand, {
                                    href: "/",
                                    children: "OpexViewer"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(reactstrap__WEBPACK_IMPORTED_MODULE_3__.NavbarToggler, {
                                    animation: "false",
                                    onClick: toggleMenu
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(reactstrap__WEBPACK_IMPORTED_MODULE_3__.Collapse, {
                                    animation: "false",
                                    isOpen: isMenuOpen,
                                    navbar: true,
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(reactstrap__WEBPACK_IMPORTED_MODULE_3__.Nav, {
                                            className: "me-auto",
                                            navbar: true,
                                            children: [
                                                {
                                                    url: "/accounts",
                                                    name: "\u0421\u0447\u0435\u0442\u0430"
                                                },
                                                {
                                                    url: "/instruments",
                                                    name: "\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B"
                                                },
                                                {
                                                    url: "/settings",
                                                    name: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"
                                                },
                                                {
                                                    url: "/logs",
                                                    name: "\u041B\u043E\u0433\u0438"
                                                }, 
                                            ].map((n, k)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(reactstrap__WEBPACK_IMPORTED_MODULE_3__.NavItem, {
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(reactstrap__WEBPACK_IMPORTED_MODULE_3__.NavLink, {
                                                        active: n.url === pathname,
                                                        href: n.url,
                                                        children: n.name
                                                    })
                                                }, k)
                                            )
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(HeadBadges, {
                                            whatToken: whatToken,
                                            serverStatus: serverStatus,
                                            accountId: accountId
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    props.title && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                        className: (_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default().title),
                        children: props.title
                    }),
                    props.children
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("footer", {
                className: (_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default().footer),
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                    href: "https://t.me/pskucherov",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: "pskucherov"
                })
            })
        ]
    });
};
const HeadBadges = (props)=>{
    const { whatToken , serverStatus , accountId ,  } = props;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(reactstrap__WEBPACK_IMPORTED_MODULE_3__.NavbarText, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(ServerBadge, {
                whatToken: whatToken,
                serverStatus: serverStatus
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(AccountBadge, {
                whatToken: whatToken,
                accountId: accountId,
                serverStatus: serverStatus
            }),
            serverStatus ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(reactstrap__WEBPACK_IMPORTED_MODULE_3__.Badge, {
                color: whatToken === 2 ? "success" : whatToken ? "warning" : "danger",
                href: "/settings",
                children: [
                    "\u0422\u043E\u043A\u0435\u043D: ",
                    whatToken === 2 ? "\u0431\u043E\u0435\u0432\u043E\u0439" : whatToken ? "\u043F\u0435\u0441\u043E\u0447\u043D\u0438\u0446\u0430" : "\u043D\u0435 \u0437\u0430\u0434\u0430\u043D"
                ]
            }) : ""
        ]
    });
};
const ServerBadge = (props)=>{
    const { whatToken , serverStatus ,  } = props;
    return !whatToken ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(reactstrap__WEBPACK_IMPORTED_MODULE_3__.Badge, {
        color: serverStatus ? "success" : "danger",
        href: "/settings",
        className: (_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default().PageBadge),
        children: [
            "\u0421\u0435\u0440\u0432\u0435\u0440: ",
            serverStatus ? "ok" : "\u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D"
        ]
    }) : "";
};
const AccountBadge = (props)=>{
    const { whatToken , accountId , serverStatus ,  } = props;
    return whatToken && serverStatus ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(reactstrap__WEBPACK_IMPORTED_MODULE_3__.Badge, {
        color: "primary",
        href: "/accounts",
        className: (_styles_Page_module_css__WEBPACK_IMPORTED_MODULE_4___default().PageBadge),
        children: !accountId ? "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0447\u0451\u0442" : String(accountId).substring(0, 13)
    }) : "";
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;