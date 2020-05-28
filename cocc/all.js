var COCookieConsent = function () {
    this.init = function (gaId, gaDomain) {
        this._gaId = gaId
        this._gaDomain = gaDomain
        this._gaSrc = "https://www.googletagmanager.com/gtag/js?id=" + gaId
        this.addListener("cocc-banner-accept", "click", this.onBannerAcceptClicked.bind(this))
        this.addListener("cocc-pref-save", "click", this.onPreferenceSaveClicked.bind(this))
        this.setupGoogleAnalyticsTagIfOptedIn()
    }

    // Common
    this.addListener = function (name, event, callback) {
        var element = document.getElementById(name)
        if (element) {
            element.addEventListener("click", callback, false)
        }
    }

    this.show = function (name) {
        var element = document.getElementById(name)
        if (element) {
            element.classList.remove("cocc-hidden")
        }
    }

    this.hide = function (name) {
        var element = document.getElementById(name)
        if (element) {
            element.classList.add("cocc-hidden")
        }
    }

    this.focus = function (name) {
        var element = document.getElementById(name)
        if (element) {
            element.focus()
        }
    }

    // Banner
    this.onBannerAcceptClicked = function () {
        this.hide("cocc-banner-unconfirm")
        this.show("cocc-banner-confirm")
        this.addListener("cocc-banner-hide", "click", this.onBannerHideClicked.bind(this))

        this.storeCookiePolicy(true, true, true)
        this.storeSeenCookieMessage(true)
        this.setupGoogleAnalyticsTagIfOptedIn()
    }

    this.onBannerHideClicked = function () {
        this.hide("cocc-banner")
    }

    // Preference
    this.onPreferenceSaveClicked = function () {
        var prefConsetYes = document.getElementById("cocc-pref-consent")
        var prefConsetNo = document.getElementById("cocc-pref-consent-2")
        if (prefConsetYes && prefConsetNo) {
            this.hide("cocc-banner")
            this.show("cocc-preference-saved")
            this.focus("cocc-preference-saved-heading")

            if (prefConsetYes.checked) {
                this.storeCookiePolicy(true, true, true)
                this.setupGoogleAnalyticsTagIfOptedIn()
            }
            if (prefConsetNo.checked) {
                this.clearGoogleAnalyticsCookies()
                this.storeCookiePolicy(true, true, false)
            }
            this.storeSeenCookieMessage(true)
        }
    }

    // Cookie
    this.createCookie = function (key, value, date) {
        var expiration = date
            ? new Date(date).toUTCString()
            : new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)).toUTCString()
        var cookie = escape(key) + "=" + escape(value) + ";expires=" + expiration + "; path=/"
        document.cookie = cookie
    }

    this.readCookie = function (name) {
        var key = name + "="
        var cookies = document.cookie.split(";")
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i]
            while (cookie.charAt(0) === " ") {
                cookie = unescape(cookie.substring(1, cookie.length))
            }
            if (cookie.indexOf(key) === 0) {
                return unescape(cookie.substring(key.length, cookie.length))
            }
        }
        return null
    }

    this.storeCookiePolicy = function (essential, settings, usage) {
        this.createCookie("cookie_policy", JSON.stringify({
            "essential": essential,
            "settings": settings,
            "usage": usage
        }))
    }

    this.storeSeenCookieMessage = function (seen) {
        var threeMonths = new Date();
        threeMonths.setMonth(threeMonths.getMonth() + 3);
        this.createCookie("seen_cookie_message", JSON.stringify({
            "seen": seen
        }), threeMonths.getTime())
    }

    this.deleteCookiePolicy = function () {
        this.createCookie("cookie_policy", "", new Date(2000, 1, 1))
    }

    this.retrieveCookiePolicy = function () {
        var cookiePolicy = this.readCookie("cookie_policy")
        if (cookiePolicy) {
            try {
                return JSON.parse(cookiePolicy)
            } catch (e) {
                console.log(e)
            }
        }
        return {
            "essential": false,
            "settings": false,
            "usage": false
        }
    }

    // Google Analytics
    this.gtag = function () {
        if (dataLayer) {
            dataLayer.push(arguments)
        }
    }

    this.isGoogleAnalyticsLoaded = function () {
        var scripts = document.getElementsByTagName("script")
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === this._gaSrc) {
                return true
            }
        }
        return false
    }

    this.deleteGoogleAnalyticsCookie = function (key) {
        var expiration = new Date(2000, 1, 1)
        var cookie = escape(key) + "=;expires=" + expiration + "; path=/; domain=" + this._gaDomain + ";"
        document.cookie = cookie
    }

    this.clearGoogleAnalyticsCookies = function () {
        this.deleteGoogleAnalyticsCookie("_ga")
        this.deleteGoogleAnalyticsCookie("_gid")
        this.deleteGoogleAnalyticsCookie("_gat_gtag_" + this._gaId.replace(/-/g, "_"))
    }

    this.setupGoogleAnalyticsTagIfOptedIn = function () {
        var cookiePolicy = this.retrieveCookiePolicy()
        if (!cookiePolicy || !cookiePolicy.usage || this.isGoogleAnalyticsLoaded()) {
            return
        }

        window.dataLayer = window.dataLayer || []
        this.gtag("js", new Date())
        this.gtag("config", this._gaId)

        var head = document.getElementsByTagName("head")[0]
        var js = document.createElement("script")
        js.async = "true"
        js.src = this._gaSrc
        head.appendChild(js)
    }
}

window.COCookieConsent = new COCookieConsent()