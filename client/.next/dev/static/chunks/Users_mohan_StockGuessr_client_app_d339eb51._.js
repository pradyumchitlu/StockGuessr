(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Users/mohan/StockGuessr/client/app/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authAPI",
    ()=>authAPI,
    "default",
    ()=>__TURBOPACK__default__export__,
    "matchesAPI",
    ()=>matchesAPI,
    "scenariosAPI",
    ()=>scenariosAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Users/mohan/StockGuessr/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Users/mohan/StockGuessr/client/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Add token to requests
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
const authAPI = {
    register: (email, username, password)=>api.post('/auth/register', {
            email,
            username,
            password
        }),
    login: (email, password)=>api.post('/auth/login', {
            email,
            password
        }),
    getCurrentUser: ()=>api.get('/auth/me')
};
const scenariosAPI = {
    getRandomScenario: ()=>api.get('/scenarios/random'),
    getAllScenarios: ()=>api.get('/scenarios'),
    getScenarioById: (id)=>api.get(`/scenarios/${id}`)
};
const matchesAPI = {
    createMatch: (scenarioId, opponentId)=>api.post('/matches', {
            scenarioId,
            opponentId
        }),
    getMatch: (id)=>api.get(`/matches/${id}`),
    updateMatch: (id, data)=>api.put(`/matches/${id}`, data),
    getUserMatches: (userId)=>api.get(`/matches/history/${userId}`),
    getAnalysis: (id)=>api.get(`/matches/${id}/analysis`),
    addNote: (matchId, note)=>api.patch(`/matches/${matchId}/note`, {
            note
        }),
    deleteMatch: (id)=>api.delete(`/matches/${id}`)
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Users/mohan/StockGuessr/client/app/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Users/mohan/StockGuessr/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Users/mohan/StockGuessr/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Users/mohan/StockGuessr/client/app/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const fetchUser = {
                "AuthProvider.useEffect.fetchUser": async ()=>{
                    try {
                        const token = localStorage.getItem('token');
                        if (token) {
                            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authAPI"].getCurrentUser();
                            setUser(response.data);
                        }
                    } catch (error) {
                        console.error('Failed to fetch user:', error);
                        localStorage.removeItem('token');
                    } finally{
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.fetchUser"];
            fetchUser();
        }
    }["AuthProvider.useEffect"], []);
    const logout = ()=>{
        localStorage.removeItem('token');
        setUser(null);
    };
    const refetchUser = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authAPI"].getCurrentUser();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to refetch user:', error);
        }
    };
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        refetchUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Users/mohan/StockGuessr/client/app/context/AuthContext.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Users$2f$mohan$2f$StockGuessr$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Users_mohan_StockGuessr_client_app_d339eb51._.js.map