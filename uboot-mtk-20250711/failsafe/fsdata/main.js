/* SPDX-License-Identifier: GPL-2.0 */
/*
 * Copyright (C) 2026 Yuzhii0718
 *
 * All rights reserved.
 *
 * This file is part of the project bl-mt798x-dhcpd
 * You may not use, copy, modify or distribute this file except in compliance with the license agreement.
 */

function normalizeLang(n) {
    if (!n) return "en";
    var t = String(n).toLowerCase();
    return t.indexOf("zh") === 0 ? "zh-cn" : "en"
}

function detectLang() {
    var t, n;
    try {
        if (t = localStorage.getItem("lang"), t) return normalizeLang(t)
    } catch (i) { }
    return n = [], navigator.languages && navigator.languages.length ? n = navigator.languages : navigator.language && (n = [navigator.language]), normalizeLang(n[0])
}

function detectTheme() {
    try {
        var n = localStorage.getItem("theme");
        if (n) return n
    } catch (t) { }
    return "auto"
}

function isI18nAvailable() {
    return typeof I18N !== "undefined" && I18N
}

function isI18nEnabled() {
    return APP_STATE.i18nEnabled !== false
}

function t(n, fallback) {
    var r = APP_STATE.lang || "en";
    if (!isI18nEnabled() || !isI18nAvailable())
        return fallback !== undefined ? fallback : n;
    return I18N[r] && I18N[r][n] !== undefined ? I18N[r][n] : I18N.en && I18N.en[n] !== undefined ? I18N.en[n] : (fallback !== undefined ? fallback : n)
}

function applyI18n(n) {
    var s = n || document;
    var enabled = isI18nEnabled() && isI18nAvailable();
    var h = s.querySelectorAll("[data-i18n]");
    for (var o = 0; o < h.length; o++) {
        var el = h[o];
        var key = el.getAttribute("data-i18n");
        if (!el.hasAttribute("data-i18n-fallback"))
            el.setAttribute("data-i18n-fallback", el.textContent || "");
        var fallback = el.getAttribute("data-i18n-fallback") || "";
        el.textContent = enabled ? t(key, fallback) : fallback;
    }
    var u = s.querySelectorAll("[data-i18n-html]");
    for (var i = 0; i < u.length; i++) {
        var elh = u[i];
        var keyh = elh.getAttribute("data-i18n-html");
        if (!elh.hasAttribute("data-i18n-html-fallback"))
            elh.setAttribute("data-i18n-html-fallback", elh.innerHTML || "");
        var fallbackh = elh.getAttribute("data-i18n-html-fallback") || "";
        elh.innerHTML = enabled ? t(keyh, fallbackh) : fallbackh;
    }
    var f = s.querySelectorAll("[data-i18n-attr]");
    for (var r = 0; r < f.length; r++) {
        var el2 = f[r];
        var a = el2.getAttribute("data-i18n-attr");
        if (!a) continue;
        var e = a.split(":");
        if (e.length < 2) continue;
        var v = e[0];
        var y = e.slice(1).join(":");
        var fbAttr = "data-i18n-attr-fallback-" + v;
        if (!el2.hasAttribute(fbAttr))
            el2.setAttribute(fbAttr, el2.getAttribute(v) || "");
        var fallbackAttr = el2.getAttribute(fbAttr) || "";
        el2.setAttribute(v, enabled ? t(y, fallbackAttr) : fallbackAttr)
    }
}

function setLang(n) {
    APP_STATE.lang = normalizeLang(n);
    try {
        localStorage.setItem("lang", APP_STATE.lang)
    } catch (t) { }
    applyI18n(document);
    typeof backupRefreshI18n == "function" && APP_STATE.page === "backup" && backupRefreshI18n();
    typeof renderSysInfo == "function" && renderSysInfo();
    updateDocumentTitle()
}

function setTheme(n) {
    APP_STATE.theme = n || "auto";
    try {
        localStorage.setItem("theme", APP_STATE.theme)
    } catch (i) { }
    var t = document.documentElement;
    APP_STATE.theme === "auto" ? t.removeAttribute("data-theme") : t.setAttribute("data-theme", APP_STATE.theme)
}

function updateDocumentTitle() {
    if (!isI18nEnabled() || !isI18nAvailable())
        return;
    if (APP_STATE.page) {
        var n = APP_STATE.page + ".title";
        if (I18N[APP_STATE.lang] && I18N[APP_STATE.lang][n]) {
            document.title = t(n);
            return
        }
        APP_STATE.page === "flashing" ? document.title = t("flashing.title.in_progress") : APP_STATE.page === "booting" && (document.title = t("booting.title.in_progress"))
    }
}

function ensureBranding() {
    var t = document.getElementById("version"),
        n, i;
    t && ((n = t.nextElementSibling, n && n.classList && n.classList.contains("brand") && n.parentNode && n.parentNode.removeChild(n), t.querySelector && t.querySelector(".brand-inline")) || (i = document.createElement("span"), i.className = "brand-inline", i.textContent = "💡Yuzhii", t.appendChild(document.createTextNode(" ")), t.appendChild(i)))
    if (!t) return;
    if (t.querySelector && t.querySelector("#project-info")) return;
    var m = document.createElement("div");
    m.id = "project-info";
    m.innerHTML = 'You can find more infomation about this project: <a href="https://github.com/Yuzhii0718/bl-mt798x-dhcpd" target="_blank">Github</a>';
    t.appendChild(m);
}

function ensureSidebar() {
    function o(n, i, r) {
        var u = document.createElement("a"),
            s, o, e, h;
        return u.className = "nav-link", u.href = n, u.setAttribute("data-nav-id", r), s = document.createElement("span"), s.className = "dot", u.appendChild(s), o = document.createElement("span"), o.setAttribute("data-i18n", i), o.textContent = t(i), u.appendChild(o), e = n, e !== "/" && e.charAt(0) !== "/" && (e = "/" + e), h = e === f || e === "/" && (f === "/" || f === "/index.html"), h && u.classList.add("active"), u
    }
    var i = document.getElementById("sidebar"),
        f, k, s, h, c, d, r, l, g, n, a, v, y, p, e, w, u, b, gptLink, simgLink;
    i && i.getAttribute("data-rendered") !== "1" && (i.setAttribute("data-rendered", "1"), f = location && location.pathname ? location.pathname : "", f === "" && (f = "/"), i.innerHTML = "", k = document.createElement("div"), k.className = "sidebar-brand", s = document.createElement("div"), s.className = "title", s.setAttribute("data-i18n", "app.name"), s.textContent = t("app.name"), k.appendChild(s), i.appendChild(k), h = document.createElement("div"), h.className = "sidebar-controls", c = document.createElement("div"), c.className = "control-row", d = document.createElement("div"), d.setAttribute("data-i18n", "control.language"), d.textContent = t("control.language"), c.appendChild(d), r = document.createElement("select"), r.id = "lang_select", r.innerHTML = '<option value="en">English<\/option><option value="zh-cn">简体中文<\/option>', r.value = APP_STATE.lang, r.onchange = function () {
        setLang(this.value)
    }, c.appendChild(r), h.appendChild(c), l = document.createElement("div"), l.className = "control-row", g = document.createElement("div"), g.setAttribute("data-i18n", "control.theme"), g.textContent = t("control.theme"), l.appendChild(g), n = document.createElement("select"), n.id = "theme_select", a = document.createElement("option"), a.value = "auto", a.setAttribute("data-i18n", "theme.auto"), a.textContent = t("theme.auto"), v = document.createElement("option"), v.value = "light", v.setAttribute("data-i18n", "theme.light"), v.textContent = t("theme.light"), y = document.createElement("option"), y.value = "dark", y.setAttribute("data-i18n", "theme.dark"), y.textContent = t("theme.dark"), n.appendChild(a), n.appendChild(v), n.appendChild(y), n.value = APP_STATE.theme, n.onchange = function () {
        setTheme(this.value)
    }, l.appendChild(n), h.appendChild(l), i.appendChild(h), p = document.createElement("div"), p.className = "nav", e = document.createElement("div"), e.className = "nav-section", w = document.createElement("div"), w.className = "nav-section-title", w.setAttribute("data-i18n", "nav.basic"), w.textContent = t("nav.basic"), e.appendChild(w), e.appendChild(o("/", "nav.firmware", "firmware")), e.appendChild(o("/uboot.html", "nav.uboot", "uboot")), p.appendChild(e), u = document.createElement("div"), u.className = "nav-section", b = document.createElement("div"), b.className = "nav-section-title", b.setAttribute("data-i18n", "nav.advanced"), b.textContent = t("nav.advanced"), u.appendChild(b), u.appendChild(o("/bl2.html", "nav.bl2", "bl2")), gptLink = o("/gpt.html", "nav.gpt", "gpt"), gptLink.style.display = "none", u.appendChild(gptLink), simgLink = o("/simg.html", "nav.simg", "simg"), simgLink.style.display = "none", u.appendChild(simgLink), u.appendChild(o("/factory.html", "nav.factory", "factory")), u.appendChild(o("/initramfs.html", "nav.initramfs", "initramfs")), p.appendChild(u), u = document.createElement("div"), u.className = "nav-section", b = document.createElement("div"), b.className = "nav-section-title", b.setAttribute("data-i18n", "nav.system"), b.textContent = t("nav.system"), u.appendChild(b), u.appendChild(o("/backup.html", "nav.backup", "backup")), u.appendChild(o("/flash.html", "nav.flash", "flash")), u.appendChild(o("/env.html", "nav.env", "env")), u.appendChild(o("/console.html", "nav.console", "console")), r = o("/reboot.html", "nav.reboot", "reboot"), u.appendChild(r), p.appendChild(u), i.appendChild(p), applyI18n(i), updateGptNavVisibility(), updateSimgNavVisibility())
}

function ajax(n) {
    var t, i;
    t = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
    t.upload.addEventListener("progress", function (t) {
        n.progress && n.progress(t)
    });
    t.onreadystatechange = function () {
        t.readyState == 4 && t.status == 200 && n.done && n.done(t.responseText)
    };
    n.timeout && (t.timeout = n.timeout);
    i = "GET";
    n.data && (i = "POST");
    t.open(i, n.url);
    t.send(n.data)
}

function consoleInit() {
    var out = document.getElementById("console_out");
    var cmd = document.getElementById("console_cmd");
    var status = document.getElementById("console_status");
    var token = document.getElementById("console_token");
    var persistKey = "failsafe_console_output";
    var persistMax = 200000;

    APP_STATE.console = APP_STATE.console || {
        running: false,
        pollTimer: null,
        history: [],
        histPos: -1,
        tokenKey: "failsafe_console_token"
    };

    function loadToken() {
        try {
            var t = localStorage.getItem(APP_STATE.console.tokenKey);
            token && t && (token.value = t);
        } catch (e) { }
    }

    function saveToken() {
        try {
            token && localStorage.setItem(APP_STATE.console.tokenKey, token.value || "");
        } catch (e) { }
    }

    function setStatus(t) {
        status && (status.textContent = t || "");
    }

    function loadPersistedOutput() {
        if (!out) return;
        try {
            var s = sessionStorage.getItem(persistKey);
            if (s) out.textContent = s;
        } catch (e) { }
    }

    function savePersistedOutput() {
        if (!out) return;
        try {
            var s = out.textContent || "";
            if (s.length > persistMax)
                s = s.slice(s.length - persistMax);
            sessionStorage.setItem(persistKey, s);
        } catch (e) { }
    }

    function appendText(t) {
        if (!out) return;
        if (!t) return;
        out.textContent += t;
        if (out.textContent.length > persistMax)
            out.textContent = out.textContent.slice(out.textContent.length - persistMax);
        savePersistedOutput();
        out.scrollTop = out.scrollHeight;
    }

    async function pollOnce() {
        if (!APP_STATE.console.running) return;
        try {
            var fd = new FormData();
            if (token && token.value) fd.append("token", token.value);
            var r = await fetch("/console/poll", { method: "POST", body: fd });
            if (!r.ok) {
                setStatus(t("console.status.http") + " " + r.status);
                return;
            }
            var txt = await r.text();
            var j;
            try {
                j = JSON.parse(txt);
            } catch (e) {
                setStatus(t("console.status.parse"));
                return;
            }
            j && j.data && appendText(j.data);
        } catch (e) {
            setStatus(t("console.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    }

    function schedulePoll() {
        APP_STATE.console.pollTimer && clearTimeout(APP_STATE.console.pollTimer);
        APP_STATE.console.pollTimer = setTimeout(async function () {
            await pollOnce();
            schedulePoll();
        }, 300);
    }

    window.consoleSend = async function () {
        if (!cmd || !cmd.value) return;
        saveToken();
        var line = String(cmd.value);
        cmd.value = "";
        APP_STATE.console.history.unshift(line);
        APP_STATE.console.history.length > 50 && (APP_STATE.console.history.length = 50);
        APP_STATE.console.histPos = -1;

        try {
            var fd = new FormData();
            fd.append("cmd", line);
            if (token && token.value) fd.append("token", token.value);
            setStatus(t("console.status.running"));
            var r = await fetch("/console/exec", { method: "POST", body: fd });
            var txt = await r.text();
            if (!r.ok) {
                setStatus(t("console.status.http") + " " + r.status + (txt ? ": " + txt : ""));
                return;
            }
            try {
                var j = JSON.parse(txt);
                setStatus(t("console.status.ret") + " " + (j && typeof j.ret !== "undefined" ? j.ret : "?"));
            } catch (e) {
                setStatus(t("console.status.done"));
            }
        } catch (e) {
            setStatus(t("console.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    window.consoleClear = async function () {
        saveToken();
        try {
            var fd = new FormData();
            if (token && token.value) fd.append("token", token.value);
            var r = await fetch("/console/clear", { method: "POST", body: fd });
            if (r.ok) {
                out && (out.textContent = "");
                try { sessionStorage.removeItem(persistKey); } catch (e) { }
                setStatus(t("console.status.cleared"));
            } else {
                setStatus(t("console.status.http") + " " + r.status);
            }
        } catch (e) {
            setStatus(t("console.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    if (cmd) {
        cmd.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                window.consoleSend();
                return;
            }
            if (e.key === "ArrowUp") {
                var h = APP_STATE.console.history;
                if (!h || !h.length) return;
                APP_STATE.console.histPos = Math.min(h.length - 1, APP_STATE.console.histPos + 1);
                cmd.value = h[APP_STATE.console.histPos] || "";
                e.preventDefault();
                return;
            }
            if (e.key === "ArrowDown") {
                var h2 = APP_STATE.console.history;
                if (!h2 || !h2.length) return;
                APP_STATE.console.histPos = Math.max(-1, APP_STATE.console.histPos - 1);
                cmd.value = APP_STATE.console.histPos >= 0 ? (h2[APP_STATE.console.histPos] || "") : "";
                e.preventDefault();
            }
        });
    }

    APP_STATE.console.running = true;
    loadToken();
    loadPersistedOutput();
    setStatus(t("console.status.ready"));
    schedulePoll();
}

function envInit() {
    var list = document.getElementById("env_list");
    var name = document.getElementById("env_name");
    var value = document.getElementById("env_value");
    var status = document.getElementById("env_status");
    var count = document.getElementById("env_count");
    var file = document.getElementById("env_file");

    function setStatus(t) {
        status && (status.textContent = t || "");
    }

    function countLines(txt) {
        if (!txt) return 0;
        var lines = txt.split("\n");
        var c = 0;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] && lines[i].indexOf("=") > 0)
                c++;
        }
        return c;
    }

    window.envRefresh = async function () {
        try {
            setStatus(t("env.status.loading"));
            var r = await fetch("/env/list", { method: "GET" });
            if (!r.ok) {
                setStatus(t("env.status.http") + " " + r.status);
                return;
            }
            var txt = await r.text();
            list && (list.textContent = txt || "");
            count && (count.textContent = t("env.count") + " " + countLines(txt));
            setStatus(t("env.status.ready"));
        } catch (e) {
            setStatus(t("env.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    window.envSet = async function () {
        if (!name || !name.value) {
            alert(t("env.error.no_name"));
            return;
        }
        try {
            var fd = new FormData();
            fd.append("name", name.value);
            fd.append("value", value ? value.value : "");
            setStatus(t("env.status.saving"));
            var r = await fetch("/env/set", { method: "POST", body: fd });
            var txt = await r.text();
            if (!r.ok) {
                setStatus(t("env.status.error") + " " + (txt || r.status));
                return;
            }
            setStatus(t("env.status.saved"));
            window.envRefresh();
        } catch (e) {
            setStatus(t("env.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    window.envUnset = async function () {
        if (!name || !name.value) {
            alert(t("env.error.no_name"));
            return;
        }
        if (!confirm(t("env.confirm.delete") + " " + name.value + " ?"))
            return;
        try {
            var fd = new FormData();
            fd.append("name", name.value);
            setStatus(t("env.status.saving"));
            var r = await fetch("/env/unset", { method: "POST", body: fd });
            var txt = await r.text();
            if (!r.ok) {
                setStatus(t("env.status.error") + " " + (txt || r.status));
                return;
            }
            setStatus(t("env.status.deleted"));
            window.envRefresh();
        } catch (e) {
            setStatus(t("env.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    window.envReset = async function () {
        if (!confirm(t("env.confirm.reset")))
            return;
        try {
            setStatus(t("env.status.saving"));
            var r = await fetch("/env/reset", { method: "POST" });
            var txt = await r.text();
            if (!r.ok) {
                setStatus(t("env.status.error") + " " + (txt || r.status));
                return;
            }
            setStatus(t("env.status.reset"));
            window.envRefresh();
        } catch (e) {
            setStatus(t("env.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    window.envRestore = async function () {
        if (!file || !file.files || !file.files.length) {
            alert(t("env.error.no_file"));
            return;
        }
        if (!confirm(t("env.confirm.restore")))
            return;
        try {
            var fd = new FormData();
            fd.append("envfile", file.files[0]);
            setStatus(t("env.status.saving"));
            var r = await fetch("/env/restore", { method: "POST", body: fd });
            var txt = await r.text();
            if (!r.ok) {
                setStatus(t("env.status.error") + " " + (txt || r.status));
                return;
            }
            setStatus(t("env.status.restored"));
            window.envRefresh();
        } catch (e) {
            setStatus(t("env.status.error") + " " + (e && e.message ? e.message : String(e)));
        }
    };

    window.envRefresh();
}

function appInit(n) {
    APP_STATE.page = n || "";
    APP_STATE.i18nEnabled = isI18nAvailable();
    APP_STATE.lang = detectLang();
    APP_STATE.theme = detectTheme();
    setTheme(APP_STATE.theme);
    setLang(APP_STATE.lang);
    ensureSidebar();
    ensureBranding();
    applyI18n(document);
    updateDocumentTitle();
    setTimeout(function () {
        document.body.classList.add("ready")
    }, 0);
    getversion();
    // Fetch system info and storage/partition info for display
    getSysInfo();
    getStorageInfoForSysinfo();
    // getCurrentMtdLayout();
    (n === "index" || n === "initramfs") && getmtdlayoutlist();
    n === "backup" && backupInit();
    n === "flash" && flashInit();
    n === "console" && consoleInit();
    n === "env" && envInit()

    const Yuzhii_VERSION = 'UBOOT-MTK-20250711';
    const Yuzhii_LINK = 'https://github.com/Yuzhii0718/';
    console.log('\n%c Yuzhii0718 ' + Yuzhii_VERSION + ' %c ' + Yuzhii_LINK + ' ', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');
}

function updateGptNavVisibility() {
    // Hide GPT update entry when no MMC is present (runtime detection).
    // If backupinfo is unavailable, keep it visible (fallback behavior).
    var el = document.querySelector("#sidebar [data-nav-id='gpt']");
    if (!el) return;
    var bi = APP_STATE.backupinfo;
    if (!bi || !bi.mmc || typeof bi.mmc.present === "undefined") {
        el.style.display = "none";
        return;
    }
    el.style.display = bi.mmc.present === false ? "none" : "";
    console.warn("GPT nav visibility updated based on MMC presence:", bi.mmc.present);
}

function updateSimgNavVisibility() {
    // Hide Single Image entry unless the page is actually served.
    var el = document.querySelector("#sidebar [data-nav-id='simg']");
    if (!el) return;
    el.style.display = "none";

    // Avoid repeated probes.
    if (APP_STATE._simg_probe_done) return;
    APP_STATE._simg_probe_done = true;

    try {
        fetch("/simg.html?_probe=1", { method: "GET", cache: "no-store" })
            .then(function (r) {
                if (r && r.ok) {
                    el.style.display = "";
                    return;
                }
                console.warn("SIMG probe HTTP status:", r ? r.status : "unknown");
                console.info("If SIMG feature is not enabled, this warning is expected.");
            })
            .catch(function () { });
    } catch (e) {
        console.warn("Unexpected error during SIMG probe:", e);
    }
}

function renderSysInfo() {
    var n = document.getElementById("sysinfo"), i, u, f;
    if (!n) return;
    i = APP_STATE.sysinfo;
    if (!i) {
        n.textContent = t("sysinfo.loading");
        return
    }
    u = i.board || {};
    f = i.ram || {};

    while (n.firstChild) n.removeChild(n.firstChild);
    n.classList.remove("sysinfo-expanded");

    var summary = document.createElement("div");
    summary.className = "sysinfo-summary";

    var boardLine = document.createElement("div");
    boardLine.className = "sysinfo-line";
    boardLine.textContent = t("sysinfo.board") + " " + (u.model || t("sysinfo.unknown"));
    summary.appendChild(boardLine);

    var ramLine = document.createElement("div");
    ramLine.className = "sysinfo-line";
    ramLine.textContent = t("sysinfo.ram") + " " + (f.size !== undefined && f.size !== null && f.size !== 0 ? bytesToHuman(f.size) : t("sysinfo.unknown"));
    summary.appendChild(ramLine);

    if (i.storage && i.storage.mtd_layout) {
        var mtdSummary = i.storage.mtd_layout || {};
        if (mtdSummary.current) {
            var curLayoutLine = document.createElement("div");
            curLayoutLine.className = "sysinfo-line";
            curLayoutLine.textContent = t("sysinfo.mtd.current", "MTD layout") + " " + mtdSummary.current;
            summary.appendChild(curLayoutLine);
        }
    }

    n.appendChild(summary);

    var details = document.createElement("details");
    details.className = "sysinfo-details";

    var summaryNode = document.createElement("summary");
    summaryNode.textContent = t("sysinfo.more", "More info");
    details.appendChild(summaryNode);

    var extra = document.createElement("div");
    extra.className = "sysinfo-extra";

    if (i.storage && i.storage.mtd_layout) {
        if (mtdSummary.current_parts) {
            var curPartsLine = document.createElement("div");
            curPartsLine.className = "sysinfo-line sysinfo-mtdparts";
            curPartsLine.textContent = t("sysinfo.mtd.parts", "MTD parts") + " " + mtdSummary.current_parts;
            extra.appendChild(curPartsLine);
        }
    }

    if (i.build_variant) {
        var variantLine = document.createElement("div");
        variantLine.className = "sysinfo-line";
        variantLine.textContent = t("sysinfo.variant", "Variant") + " " + i.build_variant;
        extra.appendChild(variantLine);
    }

    if (u.compatible) {
        var compatLine = document.createElement("div");
        compatLine.className = "sysinfo-line";
        compatLine.textContent = t("sysinfo.compat", "Compatible") + " " + u.compatible;
        extra.appendChild(compatLine);
    }

    if (i.storage && i.storage.mtd_layout) {
        var mtd = i.storage.mtd_layout || {};
        var layouts = mtd.layouts || [];
        if (layouts && layouts.length) {
            var layoutTitle = document.createElement("div");
            layoutTitle.className = "sysinfo-line sysinfo-section";
            layoutTitle.textContent = t("sysinfo.mtd.layouts", "MTD layouts");
            extra.appendChild(layoutTitle);

            var layoutList = document.createElement("ul");
            layoutList.className = "sysinfo-list";
            for (var li = 0; li < layouts.length; li++) {
                var item = layouts[li] || {};
                var entry = document.createElement("li");
                var parts = item.parts ? " " + item.parts : "";
                entry.textContent = (item.label || "-") + ":" + parts;
                layoutList.appendChild(entry);
            }
            extra.appendChild(layoutList);
        }
    }

    if (i.storage && i.storage.mmc && i.storage.mmc.present) {
        var mmc = i.storage.mmc;
        var mmcTitle = document.createElement("div");
        mmcTitle.className = "sysinfo-line sysinfo-section";
        mmcTitle.textContent = t("sysinfo.mmc", "MMC partitions");
        extra.appendChild(mmcTitle);

        if (mmc.parts && mmc.parts.length) {
            var list = document.createElement("ul");
            list.className = "sysinfo-list";
            for (var iPart = 0; iPart < mmc.parts.length; iPart++) {
                var p = mmc.parts[iPart];
                var li = document.createElement("li");
                var sizeTxt = p.size ? bytesToHuman(p.size) : t("sysinfo.unknown");
                li.textContent = (p.name || "-") + " (" + sizeTxt + ")";
                list.appendChild(li);
            }
            extra.appendChild(list);
        } else {
            var empty = document.createElement("div");
            empty.className = "sysinfo-line";
            empty.textContent = t("sysinfo.mmc.none", "No partitions");
            extra.appendChild(empty);
        }
    }

    if (extra.childNodes.length) {
        details.appendChild(extra);
        n.appendChild(details);

        var toggleExpanded = function () {
            details.open ? n.classList.add("sysinfo-expanded") : n.classList.remove("sysinfo-expanded");
        };
        details.addEventListener("toggle", toggleExpanded);
        toggleExpanded();
    }
}

function getSysInfo() {
    // Always fetch sysinfo into APP_STATE (used by features like backup filename),
    // but only render when the sysinfo element exists on current page.
    var n = document.getElementById("sysinfo");
    n && renderSysInfo();
    ajax({
        url: "/sysinfo",
        done: function (txt) {
            try {
                APP_STATE.sysinfo = JSON.parse(txt)
            } catch (t) {
                return
            }
            n && renderSysInfo()
        }
    })
}

async function ensureSysInfoLoaded() {
    // On pages without #sysinfo (e.g. backup.html), we still need board model.
    if (APP_STATE.sysinfo && APP_STATE.sysinfo.board && APP_STATE.sysinfo.board.model)
        return APP_STATE.sysinfo;

    if (APP_STATE._sysinfo_promise)
        return await APP_STATE._sysinfo_promise;

    APP_STATE._sysinfo_promise = (async function () {
        try {
            var r = await fetch("/sysinfo", { method: "GET" });
            if (!r || !r.ok) return null;
            var j = await r.json();
            j && (APP_STATE.sysinfo = j);
            return j;
        } catch (e) {
            return null;
        } finally {
            // allow retry later
            APP_STATE._sysinfo_promise = null;
        }
    })();

    return await APP_STATE._sysinfo_promise;
}

function getStorageInfoForSysinfo() {
    // Pull /backup/info to render current partition table in the sysinfo box
    if (APP_STATE.backupinfo) {
        updateGptNavVisibility();
        return;
    }
    ajax({
        url: "/backup/info",
        done: function (txt) {
            try {
                APP_STATE.backupinfo = JSON.parse(txt);
            } catch (e) { return; }
            updateGptNavVisibility();
            renderSysInfo();
        }
    });
}

function getCurrentMtdLayout() {
    // Get current mtd layout label if multi-layout is enabled
    ajax({
        url: "/getmtdlayout",
        done: function (resp) {
            if (!resp || resp === "error") return;
            var parts = resp.split(";");
            if (parts.length > 0 && parts[0]) {
                APP_STATE.mtd_layout_current = parts[0];
                renderSysInfo();
            }
        }
    });
}

function startup() {
    appInit("index")
}

function getmtdlayoutlist() {
    ajax({
        url: "/getmtdlayout",
        done: function (n) {
            var i, f, e, u, r, o;
            if (n != "error" && (i = n.split(";"), f = document.getElementById("current_mtd_layout"), f && (f.innerHTML = t("label.current_mtd") + i[0]), e = document.getElementById("choose_mtd_layout"), e && (e.textContent = t("label.choose_mtd")), u = document.getElementById("mtd_layout_label"), u)) {
                for (u.options.length = 0, r = 1; r < i.length; r++) i[r].length > 0 && u.options.add(new Option(i[r], i[r]));
                o = document.getElementById("mtd_layout");
                o && (o.style.display = "")
            }
        }
    })
}

function getversion() {
    ajax({
        url: "/version",
        done: function (n) {
            var t = document.getElementById("version");
            t && (t.innerHTML = n);
            ensureBranding()
        }
    })
}

function upload(n) {
    var o = document.getElementById("file").files[0],
        u, f, e, r, i, s, a;
    o && (a = o.name || "", u = document.getElementById("form"), u && (u.style.display = "none"), f = document.getElementById("hint"), f && (f.style.display = "none"), e = document.getElementById("bar"), e && (e.style.display = "block"), r = new FormData, r.append(n, o), i = document.getElementById("mtd_layout_label"), i && i.options.length > 0 && (s = i.selectedIndex, r.append("mtd_layout", i.options[s].value)), ajax({
        url: "/upload",
        data: r,
        done: function (n) {
            var i, r, u, f, e, l;
            n == "fail" ? location = "/fail.html" : (i = n.split(" "), l = document.getElementById("filename"), l && a && (l.style.display = "block", l.innerHTML = "<span class=\"filename-label\">" + t("label.file") + "</span><span class=\"filename-value\">" + a + "</span>"), r = document.getElementById("size"), r && (r.style.display = "block", r.innerHTML = t("label.size") + i[0]), u = document.getElementById("md5"), u && (u.style.display = "block", u.innerHTML = t("label.md5") + i[1]), f = document.getElementById("mtd"), f && i[2] && (f.style.display = "block", f.innerHTML = t("label.mtd") + i[2]), e = document.getElementById("upgrade"), e && (e.style.display = "block"))
        },
        progress: function (n) {
            if (n.total) {
                var i = parseInt(n.loaded / n.total * 100),
                    t = document.getElementById("bar");
                t && (t.style.display = "block", t.style.setProperty("--percent", i))
            }
        }
    }))
}

function bytesToHuman(n) {
    var t;
    return n === null || n === undefined ? "" : (t = Number(n), !isFinite(t) || t < 0) ? "" : t >= 1024 * 1024 * 1024 ? (t / (1024 * 1024 * 1024)).toFixed(2) + " GiB" : t >= 1024 * 1024 ? (t / (1024 * 1024)).toFixed(2) + " MiB" : t >= 1024 ? (t / 1024).toFixed(2) + " KiB" : String(Math.floor(t)) + " B"
}

function parseFilenameFromDisposition(n) {
    var t, i;
    return n ? (t = /filename\s*=\s*"([^"]+)"/i.exec(n), t && t[1]) ? t[1] : (i = /filename\s*=\s*([^;\s]+)/i.exec(n), i && i[1] ? i[1].replace(/^"|"$/g, "") : "") : ""
}

function sanitizeFilenameComponent(n) {
    return n ? String(n).replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48) : ""
}

function getNowYYYYMMDD() {
    var n = new Date, t = n.getFullYear(), i = n.getMonth() + 1, r = n.getDate();
    return String(t) + String(i).padStart(2, "0") + String(r).padStart(2, "0")
}

function makeBackupDownloadName(n) {
    var u = (APP_STATE.sysinfo && APP_STATE.sysinfo.board && APP_STATE.sysinfo.board.model) ? APP_STATE.sysinfo.board.model : "";
    var t = sanitizeFilenameComponent(u) || "board";
    var i = getNowYYYYMMDD();
    var r = String(n || "backup.bin");

    // Ensure it starts with backup_
    r.indexOf("backup_") === 0 || (r = "backup_" + r.replace(/^_+/, ""));

    // Insert board right after backup_ if not already
    r.indexOf("backup_" + t + "_") === 0 || (r = r.replace(/^backup_/, "backup_" + t + "_"));

    // Ensure .bin extension
    /\.[A-Za-z0-9]+$/.test(r) || (r = r + ".bin");

    // Append date before extension if not already present
    /_\d{8}\.[A-Za-z0-9]+$/.test(r) || (r = r.replace(/(\.[A-Za-z0-9]+)$/, "_" + i + "$1"));

    return r
}

function parseUserLen(n) {
    var t, i, r;
    if (!n) return null;
    if (n = String(n).trim(), n === "") return null;
    t = /^\s*(0x[0-9a-fA-F]+|\d+)\s*([a-zA-Z]*)\s*$/.exec(n);
    if (!t) return null;
    i = t[1].toLowerCase().indexOf("0x") === 0 ? parseInt(t[1], 16) : parseInt(t[1], 10);
    if (!isFinite(i) || i < 0) return null;
    r = (t[2] || "").toLowerCase();
    return r === "" ? i : r === "k" || r === "kb" || r === "kib" ? i * 1024 : null
}

function flashSetStatus(n) {
    var s = document.getElementById("flash_status");
    var txt = document.getElementById("flash_status_text");
    var spin = document.getElementById("flash_spinner");
    var busy = n === t("flash.status.uploading") || n === t("flash.status.restoring");
    if (!s) return;
    s.style.display = n ? "flex" : "none";
    txt && (txt.textContent = n || "");
    spin && (spin.style.display = busy ? "block" : "none");
}

function flashSetProgress(n) {
    var t = document.getElementById("flash_restore_bar"), i;
    if (!t) return;
    if (n === null || n === undefined) {
        t.style.display = "none";
        return;
    }
    i = Math.max(0, Math.min(100, parseInt(n || 0)));
    t.style.display = "block";
    t.style.setProperty("--percent", i)
}

function flashUpdateRangeHint() {
    var u = document.getElementById("flash_range_hint"), n, i, r;
    if (!u) return;
    n = parseUserLen(document.getElementById("flash_start").value);
    i = parseUserLen(document.getElementById("flash_end").value);
    n === null || i === null ? u.textContent = t("backup.range.hint") : (r = i >= n ? i - n : 0, u.textContent = "Start=" + bytesToHuman(n) + ", End=" + bytesToHuman(i) + ", Size=" + bytesToHuman(r))
}

function flashPadHex(n, w) {
    var s = n.toString(16).toUpperCase();
    while (s.length < w) s = "0" + s;
    return s
}

function flashExtractBytes(text) {
    var bytes = [];
    if (!text) return bytes;
    var m = text.match(/[0-9a-fA-F]{2}/g);
    if (!m) return bytes;
    for (var i = 0; i < m.length; i++) bytes.push(parseInt(m[i], 16));
    return bytes
}

function flashPosToByteIndex(text, pos) {
    var i, hex = 0;
    if (!text || pos <= 0) return 0;
    for (i = 0; i < pos && i < text.length; i++) {
        if (/[0-9a-fA-F]/.test(text[i])) hex++;
    }
    return Math.floor(hex / 2)
}

function flashByteIndexToPos(byteIndex) {
    if (!isFinite(byteIndex) || byteIndex < 0) return 0;
    var line = Math.floor(byteIndex / 16);
    var col = byteIndex % 16;
    return line * 48 + col * 3
}

function flashSetCaretToByte(byteIndex) {
    var data = document.getElementById("flash_data");
    if (!data) return;
    var pos = flashByteIndexToPos(byteIndex);
    data.focus();
    data.setSelectionRange(pos, pos);
    flashSyncScroll()
}

function flashFormatHexLines(bytes) {
    var out = [];
    for (var i = 0; i < bytes.length; i++) {
        if (i && i % 16 === 0) out.push("\n");
        out.push(flashPadHex(bytes[i], 2));
        if (i % 16 !== 15 && i !== bytes.length - 1) out.push(" ");
    }
    return out.join("")
}

function flashRenderHexViews() {
    var data = document.getElementById("flash_data");
    var off = document.getElementById("flash_offset");
    var asc = document.getElementById("flash_ascii");
    var start = document.getElementById("flash_start");
    if (!data || !off || !asc) return;
    var bytes = flashExtractBytes(data.value || "");
    var base = start ? parseUserLen(start.value) : 0;
    base = base === null ? 0 : base;
    var asciiLines = [];
    var offLines = [];
    var i, j, rowBytes, c;
    for (i = 0; i < bytes.length; i += 16) {
        rowBytes = bytes.slice(i, i + 16);
        offLines.push("0x" + flashPadHex(base + i, 8));
        for (j = 0; j < rowBytes.length; j++) {
            c = rowBytes[j];
            asciiLines.push(c >= 0x20 && c <= 0x7E ? String.fromCharCode(c) : ".");
        }
        if (rowBytes.length < 16) {
            for (j = rowBytes.length; j < 16; j++) asciiLines.push(" ");
        }
        asciiLines.push("\n");
    }
    off.textContent = offLines.join("\n");
    asc.textContent = asciiLines.join("").replace(/\n$/, "");
}

function flashNormalizeHexInput() {
    var data = document.getElementById("flash_data");
    if (!data) return;
    var bytes = flashExtractBytes(data.value || "");
    data.value = flashFormatHexLines(bytes);
    flashRenderHexViews()
}

function flashAlignInput(keepCaret) {
    var data = document.getElementById("flash_data");
    if (!data) return;
    var caret = data.selectionStart || 0;
    var byteIndex = flashPosToByteIndex(data.value || "", caret);
    var bytes = flashExtractBytes(data.value || "");
    data.value = flashFormatHexLines(bytes);
    if (keepCaret)
        flashSetCaretToByte(byteIndex);
    flashRenderHexViews()
}

function flashFormatData() {
    if (!confirm(t("flash.confirm.format"))) return;
    flashAlignInput(false);
    flashSetStatus(t("flash.status.formatted"))
}

function flashSnapCaret() {
    var data = document.getElementById("flash_data");
    if (!data) return;
    var caret = data.selectionStart || 0;
    var byteIndex = flashPosToByteIndex(data.value || "", caret);
    flashSetCaretToByte(byteIndex)
}

function flashSyncScroll() {
    var data = document.getElementById("flash_data");
    var off = document.getElementById("flash_offset");
    var asc = document.getElementById("flash_ascii");
    if (!data || !off || !asc) return;
    off.scrollTop = data.scrollTop;
    asc.scrollTop = data.scrollTop
}

function flashJumpToOffset() {
    var jump = document.getElementById("flash_jump");
    var start = document.getElementById("flash_start");
    var data = document.getElementById("flash_data");
    if (!jump || !data) return;
    var target = parseUserLen(jump.value);
    if (target === null) {
        flashSetStatus(t("flash.error.jump"));
        return
    }
    var base = start ? parseUserLen(start.value) : 0;
    base = base === null ? 0 : base;
    var bytes = flashExtractBytes(data.value || "");
    var byteIndex = target - base;
    if (byteIndex < 0 || byteIndex >= bytes.length) {
        flashSetStatus(t("flash.error.jump"));
        return
    }
    flashSetCaretToByte(byteIndex);
    var lineHeight = parseFloat(getComputedStyle(data).lineHeight) || 18;
    var line = Math.floor(byteIndex / 16);
    data.scrollTop = line * lineHeight;
    flashSyncScroll();
    flashSetStatus("")
}

function flashFindLastBefore(str, sub, limit) {
    var idx = -1, cur = str.indexOf(sub);
    while (cur !== -1 && cur < limit) {
        idx = cur;
        cur = str.indexOf(sub, cur + 1)
    }
    return idx
}

function flashParseBackupFilename(name) {
    if (!name) return null;
    var rangeIdx = name.indexOf("_0x"), dashIdx, startStr, endStr, start, end;
    if (rangeIdx < 0) return null;
    dashIdx = name.indexOf("-0x", rangeIdx);
    if (dashIdx < 0) return null;
    startStr = name.slice(rangeIdx + 1, dashIdx);
    endStr = name.slice(dashIdx + 1);
    start = /^0x[0-9a-fA-F]+/.exec(startStr);
    end = /^0x[0-9a-fA-F]+/.exec(endStr);
    if (!start || !end) return null;
    start = parseInt(start[0], 16);
    end = parseInt(end[0], 16);
    if (!isFinite(start) || !isFinite(end) || end <= start) return null;
    var mtdIdx = flashFindLastBefore(name, "_mtd_", rangeIdx);
    var mmcIdx = flashFindLastBefore(name, "_mmc_", rangeIdx);
    var stypeIdx = mtdIdx >= 0 && mmcIdx >= 0 ? (mtdIdx > mmcIdx ? mtdIdx : mmcIdx) : (mtdIdx >= 0 ? mtdIdx : mmcIdx);
    if (stypeIdx < 0) return null;
    var storage = stypeIdx === mtdIdx ? "mtd" : "mmc";
    var seg = name.slice(stypeIdx + 5, rangeIdx);
    if (!seg) return null;
    var parts = seg.split("_");
    var target = parts[parts.length - 1];
    if (!target) return null;
    return { storage: storage, target: target, start: start, end: end }
}

function flashSelectTarget(val) {
    var sel = document.getElementById("flash_target"), i;
    if (!sel) return false;
    for (i = 0; i < sel.options.length; i++) if (sel.options[i].value === val) {
        sel.selectedIndex = i;
        return true
    }
    return false
}

function flashInit() {
    var target = document.getElementById("flash_target");
    var start = document.getElementById("flash_start");
    var end = document.getElementById("flash_end");
    var data = document.getElementById("flash_data");
    var info = document.getElementById("flash_info");
    var restoreInfo = document.getElementById("flash_restore_info");
    var backup = document.getElementById("flash_backup");

    start && (start.oninput = function () { flashUpdateRangeHint(); flashRenderHexViews(); });
    end && (end.oninput = flashUpdateRangeHint);
    flashUpdateRangeHint();
    flashRenderHexViews();

    flashSetStatus("");

    if (data) {
        data.addEventListener("input", function () { flashAlignInput(true); });
        data.addEventListener("blur", function () { flashAlignInput(false); });
        data.addEventListener("click", flashSnapCaret);
        data.addEventListener("keyup", flashSnapCaret);
        data.addEventListener("scroll", flashSyncScroll);
    }

    backup && (backup.onchange = function () {
        var f = backup.files && backup.files.length ? backup.files[0] : null;
        var d = f ? flashParseBackupFilename(f.name) : null;
        if (!d) {
            restoreInfo && (restoreInfo.textContent = t("flash.detected.none"));
            return
        }
        restoreInfo && (restoreInfo.textContent = d.storage + ":" + d.target + " 0x" + d.start.toString(16) + "-0x" + d.end.toString(16));
        flashSelectTarget(d.storage + ":" + d.target);
        start && (start.value = "0x" + d.start.toString(16));
        end && (end.value = "0x" + d.end.toString(16));
        flashUpdateRangeHint();
        flashRenderHexViews();
    });

    ajax({
        url: "/backup/info",
        done: function (u) {
            var r, e, o, s, f;
            try {
                r = JSON.parse(u)
            } catch (h) {
                flashSetStatus("backupinfo parse failed");
                return
            }
            info && (o = [], r.mmc && r.mmc.present ? o.push("MMC: " + (r.mmc.vendor || "") + " " + (r.mmc.product || "")) : o.push("MMC: " + t("backup.storage.not_present")), r.mtd && r.mtd.present ? o.push("MTD: " + (r.mtd.model || "")) : o.push("MTD: " + t("backup.storage.not_present")), info.textContent = o.join(" | "));
            if (!target) return;
            target.options.length = 0;
            s = document.createElement("option");
            s.value = "";
            s.dataset.i18nKey = "backup.target.placeholder";
            target.appendChild(s);
            r.mmc && r.mmc.present && (f = document.createElement("option"), f.value = "mmc:raw", f.textContent = "[MMC] raw", target.appendChild(f), r.mmc.parts && r.mmc.parts.length && r.mmc.parts.forEach(function (t) {
                var i;
                t && t.name && (i = document.createElement("option"), i.value = "mmc:" + t.name, i.textContent = "[MMC] " + t.name + (t.size ? " (" + bytesToHuman(t.size) + ")" : ""), target.appendChild(i))
            }));
            r.mtd && r.mtd.present && r.mtd.parts && r.mtd.parts.length && r.mtd.parts.forEach(function (t) {
                var i;
                t && t.name && (i = document.createElement("option"), i.value = "mtd:" + t.name, i.textContent = "[MTD] " + t.name + (t.size ? " (" + bytesToHuman(t.size) + ")" : ""), target.appendChild(i))
            });
            target.options.length > 1 && (target.selectedIndex = 1);
            applyI18n(target)
        }
    })
}

async function flashRead() {
    var target = document.getElementById("flash_target");
    var start = document.getElementById("flash_start");
    var end = document.getElementById("flash_end");
    var data = document.getElementById("flash_data");
    if (!target || !start || !end) return;
    if (!target.value) {
        alert(t("flash.error.no_target"));
        return
    }
    if (!start.value || !end.value) {
        alert(t("flash.error.bad_range"));
        return
    }
    try {
        flashSetStatus(t("flash.status.reading"));
        var fd = new FormData();
        fd.append("op", "read");
        fd.append("storage", "auto");
        fd.append("target", target.value);
        fd.append("start", start.value);
        fd.append("end", end.value);
        var r = await fetch("/flash/read", { method: "POST", body: fd });
        var txt = await r.text();
        if (!r.ok) {
            flashSetStatus(t("flash.status.http") + " " + r.status + (txt ? ": " + txt : ""));
            return
        }
        var j;
        try { j = JSON.parse(txt); } catch (e) { flashSetStatus(t("flash.status.error") + " parse"); return; }
        if (!j || !j.ok) {
            flashSetStatus(t("flash.status.error") + " " + (j && j.error ? j.error : ""));
            return
        }
        data && (data.value = j.data || "");
        flashNormalizeHexInput();
        flashSetStatus(t("flash.status.done"))
    } catch (e) {
        flashSetStatus(t("flash.status.error") + " " + (e && e.message ? e.message : String(e)))
    }
}

async function flashWrite() {
    var target = document.getElementById("flash_target");
    var start = document.getElementById("flash_start");
    var data = document.getElementById("flash_data");
    if (!target || !start || !data) return;
    if (!target.value) {
        alert(t("flash.error.no_target"));
        return
    }
    if (!start.value) {
        alert(t("flash.error.bad_range"));
        return
    }
    if (!data.value || !data.value.trim()) {
        alert(t("flash.error.no_data"));
        return
    }
    if (!confirm(t("flash.confirm.write"))) return;
    try {
        flashSetStatus(t("flash.status.writing"));
        var fd = new FormData();
        fd.append("op", "write");
        fd.append("storage", "auto");
        fd.append("target", target.value);
        fd.append("start", start.value);
        fd.append("data", data.value);
        var r = await fetch("/flash/write", { method: "POST", body: fd });
        var txt = await r.text();
        if (!r.ok) {
            flashSetStatus(t("flash.status.http") + " " + r.status + (txt ? ": " + txt : ""));
            return
        }
        var j;
        try { j = JSON.parse(txt); } catch (e) { flashSetStatus(t("flash.status.error") + " parse"); return; }
        if (!j || !j.ok) {
            flashSetStatus(t("flash.status.error") + " " + (j && j.error ? j.error : ""));
            return
        }
        flashSetStatus(t("flash.status.done"))
    } catch (e) {
        flashSetStatus(t("flash.status.error") + " " + (e && e.message ? e.message : String(e)))
    }
}

async function flashRestore() {
    var target = document.getElementById("flash_target");
    var start = document.getElementById("flash_start");
    var end = document.getElementById("flash_end");
    var backup = document.getElementById("flash_backup");
    var file, baseStart, baseEnd, totalSize;
    var chunkSize = 4 * 1024 * 1024;
    var useChunked;

    function toHex(n) {
        return "0x" + n.toString(16);
    }

    async function sendChunk(blob, chunkOffset, chunkEnd, totalSize, baseStart) {
        return await new Promise(function (resolve, reject) {
            var fd = new FormData();
            fd.append("op", "restore");
            fd.append("backup", blob, "restore_chunk.bin");
            target && target.value && fd.append("target", target.value);
            fd.append("start", toHex(baseStart + chunkOffset));
            fd.append("end", toHex(baseStart + chunkEnd));
            fd.append("storage", "auto");

            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (evt) {
                if (!evt || !evt.lengthComputable) return;
                flashSetProgress((chunkOffset + evt.loaded) / totalSize * 100);
            };
            xhr.upload.onload = function () {
                flashSetProgress((chunkOffset + (chunkEnd - chunkOffset)) / totalSize * 100);
                flashSetStatus(t("flash.status.restoring"));
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) {
                    flashSetStatus(t("flash.status.http") + " " + xhr.status + (xhr.responseText ? ": " + xhr.responseText : ""));
                    flashSetProgress(null);
                    reject(new Error("http"));
                    return;
                }
                var j;
                try { j = JSON.parse(xhr.responseText); } catch (e) {
                    flashSetStatus(t("flash.status.error") + " parse");
                    flashSetProgress(null);
                    reject(e);
                    return;
                }
                if (!j || !j.ok) {
                    flashSetStatus(t("flash.status.error") + " " + (j && j.error ? j.error : ""));
                    flashSetProgress(null);
                    reject(new Error("bad"));
                    return;
                }
                resolve();
            };
            xhr.open("POST", "/flash/restore");
            xhr.send(fd);
        });
    }

    if (!backup || !backup.files || !backup.files.length) {
        alert(t("flash.error.no_file"));
        return
    }
    if (!confirm(t("flash.confirm.restore"))) return;
    try {
        file = backup.files[0];
        totalSize = file ? file.size : 0;
        baseStart = start ? parseUserLen(start.value) : null;
        baseEnd = end ? parseUserLen(end.value) : null;
        if ((baseStart === null || baseEnd === null) && file && file.name) {
            var parsed = flashParseBackupFilename(file.name);
            if (parsed) {
                baseStart = parsed.start;
                baseEnd = parsed.end;
                if (target && !target.value && parsed.storage && parsed.target)
                    flashSelectTarget(parsed.storage + ":" + parsed.target);
                start && (start.value = toHex(baseStart));
                end && (end.value = toHex(baseEnd));
            }
        }
        if (baseStart === null || baseEnd === null || baseEnd <= baseStart) {
            flashSetStatus(t("flash.error.bad_range"));
            return;
        }
        if ((baseEnd - baseStart) !== totalSize) {
            flashSetStatus(t("flash.error.bad_range"));
            return;
        }

        useChunked = totalSize > chunkSize;
        flashSetProgress(0);
        flashSetStatus(t("flash.status.uploading"));

        if (!useChunked) {
            await sendChunk(file, 0, totalSize, totalSize, baseStart);
        } else {
            var offset = 0;
            while (offset < totalSize) {
                var next = Math.min(offset + chunkSize, totalSize);
                var blob = file.slice(offset, next);
                await sendChunk(blob, offset, next, totalSize, baseStart);
                offset = next;
            }
        }

        flashSetProgress(100);
        flashSetStatus(t("flash.status.done"));
    } catch (e) {
        flashSetStatus(t("flash.status.error") + " " + (e && e.message ? e.message : String(e)))
    }
}

function setBackupStatus(n) {
    var t = document.getElementById("backup_status");
    t && (t.style.display = n ? "block" : "none", t.textContent = n || "")
}

function setBackupProgress(n) {
    var t = document.getElementById("bar"), i;
    t && (i = Math.max(0, Math.min(100, parseInt(n || 0))), t.style.display = "block", t.style.setProperty("--percent", i))
}

function backupUpdateRangeHint() {
    var u = document.getElementById("backup_range_hint"), n, i, r;
    u && (n = parseUserLen(document.getElementById("backup_start").value), i = parseUserLen(document.getElementById("backup_end").value), n === null || i === null ? u.textContent = t("backup.range.hint") : (r = i >= n ? i - n : 0, u.textContent = "Start=" + bytesToHuman(n) + ", End=" + bytesToHuman(i) + ", Size=" + bytesToHuman(r)))
}

function backupRefreshI18n() {
    var n = document.getElementById("backup_target"), t, r, u;
    if (!n) return;
    for (t = 0; t < n.options.length; t++) r = n.options[t], r && r.dataset && r.dataset.i18nKey && (r.textContent = window.t(r.dataset.i18nKey));
    for (t = 0; t < n.options.length; t++) {
        r = n.options[t];
        if (!r || !r.dataset) continue;
        r.dataset.kind === "mtd-full" && (u = r.dataset.mtdName || "", r.textContent = "[MTD] " + window.t("backup.target.full_disk") + (u ? " (" + u + ")" : "") + (r.dataset.size ? " (" + bytesToHuman(parseInt(r.dataset.size, 10)) + ")" : ""))
    }
}

function backupInit() {
    var u = document.getElementById("backup_mode"), r = document.getElementById("backup_range"), n = document.getElementById("backup_target"), s = document.getElementById("backup_target_field"), c = document.getElementById("backup_mode_target_row"), updateBackupUi, f, e;
    function o(t) {
        for (var i = 0; i < n.options.length; i++) if (n.options[i].value === t) return n.selectedIndex = i, true;
        return false
    }
    function h(t) {
        for (var i = 0; i < n.options.length; i++) if (n.options[i].dataset && n.options[i].dataset.kind === t) return n.selectedIndex = i, true;
        return false
    }
    function l() {
        for (var t = 0; t < n.options.length; t++) if (n.options[t].value) {
            n.selectedIndex = t;
            return true
        }
        return false
    }
    function a() {
        var t, i;
        if (!n || n.options.length <= 1) return;
        t = n.options[n.selectedIndex];
        i = t && t.dataset ? t.dataset.kind : "";
        (i === "mmc-part" || i === "mtd-part" || !n.value) && (o("mmc:raw") || h("mtd-full") || l())
    }
    u && r && n && (updateBackupUi = function () {
        var t = u.value === "range";
        t ? (r.style.display = "block", a(), backupUpdateRangeHint()) : (r.style.display = "none");
        s && (s.style.display = t ? "none" : "");
        c && (c.style.gridTemplateColumns = t ? "1fr" : "")
    }, u.onchange = updateBackupUi, f = document.getElementById("backup_start"), e = document.getElementById("backup_end"), f && (f.oninput = backupUpdateRangeHint), e && (e.oninput = backupUpdateRangeHint), updateBackupUi(), setBackupStatus(""), ajax({
        url: "/backup/info",
        done: function (u) {
            var r, e, o, s, f;
            try {
                r = JSON.parse(u)
            } catch (h) {
                setBackupStatus("backupinfo parse failed");
                return
            }
            e = document.getElementById("backup_info");
            e && (o = [], r.mmc && r.mmc.present ? o.push("MMC: " + (r.mmc.vendor || "") + " " + (r.mmc.product || "")) : o.push("MMC: " + t("backup.storage.not_present")), r.mtd && r.mtd.present ? o.push("MTD: " + (r.mtd.model || "")) : o.push("MTD: " + t("backup.storage.not_present")), e.textContent = o.join(" | "));
            n.options.length = 0;
            s = document.createElement("option");
            s.value = "";
            s.dataset.i18nKey = "backup.target.placeholder";
            n.appendChild(s);
            r.mmc && r.mmc.present && (f = document.createElement("option"), f.value = "mmc:raw", f.textContent = "[MMC] raw", f.dataset.kind = "mmc-raw", n.appendChild(f), r.mmc.parts && r.mmc.parts.length && r.mmc.parts.forEach(function (t) {
                var i;
                t && t.name && (i = document.createElement("option"), i.value = "mmc:" + t.name, i.textContent = "[MMC] " + t.name + (t.size ? " (" + bytesToHuman(t.size) + ")" : ""), i.dataset.kind = "mmc-part", n.appendChild(i))
            }));

            if (r.mtd && r.mtd.present && r.mtd.parts && r.mtd.parts.length) {
                var c = r.mtd.type, l = c === 3 || c === 4 || c === 8, a = [];
                l && r.mtd.parts.forEach(function (n) {
                    n && n.name && n.master && a.push(n)
                });

                l && a.length && a.forEach(function (p) {
                    var i = document.createElement("option");
                    i.value = "mtd:" + p.name;
                    i.dataset.mtdName = p.name;
                    i.dataset.size = p.size ? String(p.size) : "";
                    i.dataset.kind = "mtd-full";
                    n.appendChild(i)
                });

                r.mtd.parts.forEach(function (t) {
                    var i;
                    if (!t || !t.name) return;
                    if (l && t.master) return;
                    i = document.createElement("option");
                    i.value = "mtd:" + t.name;
                    i.textContent = "[MTD] " + t.name + (t.size ? " (" + bytesToHuman(t.size) + ")" : "");
                    i.dataset.kind = "mtd-part";
                    n.appendChild(i)
                })
            }
            n.options.length > 1 && (n.selectedIndex = 1);
            backupRefreshI18n();
            updateBackupUi && updateBackupUi()
        }
    }))
}

async function startBackup() {
    var u = document.getElementById("backup_mode"), f = document.getElementById("backup_target"), i, r, e, o, s, h, c, l, a, v, y, p, w, b, k;
    if (!u || !f) return;
    if (i = u.value, r = f.value, !r) {
        alert(t("backup.error.no_target"));
        return
    }
    e = new FormData;
    e.append("mode", i);
    e.append("storage", "auto");
    e.append("target", r);
    if (i === "range") {
        o = document.getElementById("backup_start");
        s = document.getElementById("backup_end");
        if (!o || !s || !o.value || !s.value) {
            alert(t("backup.error.bad_range"));
            return
        }
        e.append("start", o.value);
        e.append("end", s.value)
    }
    setBackupProgress(0);
    setBackupStatus(t("backup.status.starting"));
    try {
        h = await fetch("/backup/main", { method: "POST", body: e });
        if (!h.ok) {
            setBackupStatus(t("backup.error.http") + " " + h.status);
            return
        }
        c = h.headers.get("Content-Length");
        l = c ? parseInt(c, 10) : 0;
        a = parseFilenameFromDisposition(h.headers.get("Content-Disposition"));
        a || (a = "backup.bin");
        // Ensure we have board info for filename even on pages without #sysinfo
        await ensureSysInfoLoaded();
        a = makeBackupDownloadName(a);
        v = 0;
        if (window.showSaveFilePicker) {
            y = await window.showSaveFilePicker({ suggestedName: a, types: [{ description: "Binary", accept: { "application/octet-stream": [".bin"] } }] });
            p = await y.createWritable();
            w = h.body.getReader();
            while (true) {
                b = await w.read();
                if (b.done) break;
                await p.write(b.value);
                v += b.value.length;
                l ? setBackupProgress(v / l * 100) : setBackupProgress(0);
                setBackupStatus(t("backup.status.downloading") + " " + bytesToHuman(v) + (l ? " / " + bytesToHuman(l) : ""))
            }
            await p.close();
            setBackupProgress(100);
            setBackupStatus(t("backup.status.done") + " " + a)
        } else {
            k = [];
            w = h.body.getReader();
            while (true) {
                b = await w.read();
                if (b.done) break;
                k.push(b.value);
                v += b.value.length;
                l ? setBackupProgress(v / l * 100) : setBackupProgress(0);
                setBackupStatus(t("backup.status.downloading") + " " + bytesToHuman(v) + (l ? " / " + bytesToHuman(l) : ""))
            }
            setBackupProgress(100);
            setBackupStatus(t("backup.status.preparing"));
            p = new Blob(k, { type: "application/octet-stream" });
            y = document.createElement("a");
            y.href = URL.createObjectURL(p);
            y.download = a;
            document.body.appendChild(y);
            y.click();
            document.body.removeChild(y);
            setBackupStatus(t("backup.status.done") + " " + a)
        }
    } catch (d) {
        setBackupStatus(t("backup.error.exception") + " " + (d && d.message ? d.message : String(d)))
    }
}

APP_STATE = {
    lang: "en",
    theme: "auto",
    page: ""
}