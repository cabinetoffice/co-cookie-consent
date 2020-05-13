var COCookieConsent = function () {
    this.init = function (gaId) {
        this._gaId = gaId;
        this._addListener("cocs-banner-accept", "click", this.onBannerAcceptClicked.bind(this));
        this._addListener("cocs-pref-save", "click", this.onPreferenceSaveClicked.bind(this));
        this.setupGoogleAnalyticsTagIfOptedIn(this._gaId);
    };

    // Common
    this._addListener = function (name, event, callback) {
        var element = document.getElementById(name);
        if (element) {
            element.addEventListener("click", callback, false);
        }
    };

    this._show = function (name) {
        var element = document.getElementById(name);
        if (element) {
            element.classList.remove("cocs-hidden");
        }
    };

    this._hide = function (name) {
        var element = document.getElementById(name);
        if (element) {
            element.classList.add("cocs-hidden");
        }
    };

    // Banner
    this.onBannerAcceptClicked = function () {
        this._hide("cocs-banner-unconfirm");
        this._show("cocs-banner-confirm");
        this._addListener("cocs-banner-hide", "click", this.onBannerHideClicked.bind(this));

        this.storeCookiePolicy(true, true, true);
        this.storeSeenCookieMessage(true);
        this.setupGoogleAnalyticsTagIfOptedIn(this._gaId);
    };

    this.onBannerHideClicked = function () {
        this._hide("cocs-banner");
    };

    // Preference
    this.onPreferenceSaveClicked = function () {
        var prefConsetYes = document.getElementById("cocs-pref-consent");
        var prefConsetNo = document.getElementById("cocs-pref-consent-2");
        if (prefConsetYes && prefConsetNo) {
            this._hide("cocs-banner");
            this._show("cocs-preference-saved");
            window.scrollTo(0, 0);

            if (prefConsetYes.checked) {
                this.storeCookiePolicy(true, true, true);
                this.setupGoogleAnalyticsTagIfOptedIn(this._gaId);
            }
            if (prefConsetNo.checked) {
                this.storeCookiePolicy(true, true, false);
            }
            this.storeSeenCookieMessage(true);
        }
    };

    // Cookie
    this.createCookie = function (key, value, date) {
        var expiration = date
            ? new Date(date).toUTCString()
            : new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
        var cookie = escape(key) + "=" + escape(value) + ";expires=" + expiration + "; path=/";
        document.cookie = cookie;
    };

    this.readCookie = function (name) {
        var key = name + "=";
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === " ") {
                cookie = unescape(cookie.substring(1, cookie.length));
            }
            if (cookie.indexOf(key) === 0) {
                return unescape(cookie.substring(key.length, cookie.length));
            }
        }
        return null;
    };

    this.storeCookiePolicy = function (essential, settings, usage) {
        this.createCookie("cookie_policy", JSON.stringify({
            "essential": essential,
            "settings": settings,
            "usage": usage
        }));
    };

    this.storeSeenCookieMessage = function (seen) {
        this.createCookie("seen_cookie_message", JSON.stringify({
            "seen": seen
        }));
    };

    this.deleteCookiePolicy = function () {
        this.createCookie("cookie_policy", "", new Date(2000, 1, 1));
    };

    this.retrieveCookiePolicy = function () {
        var cookiePolicy = this.readCookie("cookie_policy");
        if (cookiePolicy) {
            try {
                return JSON.parse(cookiePolicy);
            } catch (e) {
                console.log(e);
            }
        }
        return {
            "essential": false,
            "settings": false,
            "usage": false
        };
    };

    // Google Analytics
    this.gtag = function () {
        dataLayer.push(arguments);
    };

    this.setupGoogleAnalyticsTagIfOptedIn = function (gaId) {
        var cookiePolicy = this.retrieveCookiePolicy();
        if (!cookiePolicy || !cookiePolicy.usage) {
            return;
        }

        window.dataLayer = window.dataLayer || [];
        this.gtag("js", new Date());
        this.gtag("config", gaId);

        var head = document.getElementsByTagName("head")[0];
        var js = document.createElement("script");
        js.async = "true";
        js.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
        head.appendChild(js);
    };
};

window.COCookieConsent = new COCookieConsent();