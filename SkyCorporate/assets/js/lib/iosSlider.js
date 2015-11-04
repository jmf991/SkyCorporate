﻿/*
* iosSlider - http://iosscripts.com/iosslider/
* 
* Touch Enabled, Responsive jQuery Horizontal Content Slider/Carousel/Image Gallery Plugin
*
* A jQuery plugin which allows you to integrate a customizable, cross-browser 
* content slider into your web presence. Designed for use as a content slider, carousel, 
* scrolling website banner, or image gallery.
* 
* Copyright (c) 2013 Marc Whitbread
* 
* Version: v1.2.19 (05/14/2013)
* Minimum requirements: jQuery v1.4+
*
* Advanced requirements:
* 1) jQuery bind() click event override on slide requires jQuery v1.6+
*
* Terms of use:
*
* 1) iosSlider is licensed under the Creative Commons – Attribution-NonCommercial 3.0 License.
* 2) You may use iosSlider free for personal or non-profit purposes, without restriction.
*	  Attribution is not required but always appreciated. For commercial projects, you
*	  must purchase a license. You may download and play with the script before deciding to
*	  fully implement it in your project. Making sure you are satisfied, and knowing iosSlider
*	  is the right script for your project is paramount.
* 3) You are not permitted to make the resources found on iosscripts.com available for
*    distribution elsewhere "as is" without prior consent. If you would like to feature
*    iosSlider on your site, please do not link directly to the resource zip files. Please
*    link to the appropriate page on iosscripts.com where users can find the download.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
* OF THE POSSIBILITY OF SUCH DAMAGE. 
*/

(function (a) { var ma = 0, W = 0, ca = 0, M = 0, Ba = "ontouchstart" in window, Ca = "onorientationchange" in window, da = !1, $ = !1, X = !1, na = !1, fa = "pointer", sa = "pointer", ga = [], S = [], ta = [], Z = [], w = [], aa = [], F = [], j = [], q = [], ua = [], ea = [], e = { showScrollbar: function (c, e) { c.scrollbarHide && a("." + e).css({ opacity: c.scrollbarOpacity, filter: "alpha(opacity:" + 100 * c.scrollbarOpacity + ")" }) }, hideScrollbar: function (a, f, b, x, d, g, j, q, G, v) { if (a.scrollbar && a.scrollbarHide) for (var w = b; w < b + 25; w++) f[f.length] = e.hideScrollbarIntervalTimer(10 * w, x[b], (b + 24 - w) / 24, d, g, j, q, G, v, a) }, hideScrollbarInterval: function (c, f, b, x, d, g, j, w, G) { M = -1 * c / q[w] * (d - g - j - x); e.setSliderOffset("." + b, M); a("." + b).css({ opacity: G.scrollbarOpacity * f, filter: "alpha(opacity:" + 100 * G.scrollbarOpacity * f + ")" }) }, slowScrollHorizontalInterval: function (c, f, b, x, d, g, T, N, G, v, K, y, r, s, E, n, k, z, h) { if (h.infiniteSlider) { if (b <= -1 * q[n]) { var B = a(c).width(); if (b <= -1 * ua[n]) { var p = -1 * K[0]; a(f).each(function (b) { e.setSliderOffset(a(f)[b], p + k); b < y.length && (y[b] = -1 * p); p += E[b] }); b += -1 * y[0]; j[n] = -1 * y[0] + k; q[n] = j[n] + B - g; F[n] = 0 } else { var m = 0, I = e.getSliderOffset(a(f[0]), "x"); a(f).each(function (a) { e.getSliderOffset(this, "x") < I && (I = e.getSliderOffset(this, "x"), m = a) }); r = j[n] + B; e.setSliderOffset(a(f)[m], r); j[n] = -1 * y[1] + k; q[n] = j[n] + B - g; y.splice(0, 1); y.splice(y.length, 0, -1 * r + k); F[n]++ } } if (b >= -1 * j[n] || 0 <= b) { B = a(c).width(); if (0 <= b) { p = -1 * K[0]; a(f).each(function (b) { e.setSliderOffset(a(f)[b], p + k); b < y.length && (y[b] = -1 * p); p += E[b] }); b -= -1 * y[0]; j[n] = -1 * y[0] + k; q[n] = j[n] + B - g; for (F[n] = s; 0 < -1 * y[0] - B + k; ) { var u = 0, t = e.getSliderOffset(a(f[0]), "x"); a(f).each(function (b) { e.getSliderOffset(this, "x") > t && (t = e.getSliderOffset(this, "x"), u = b) }); r = j[n] - E[u]; e.setSliderOffset(a(f)[u], r); y.splice(0, 0, -1 * r + k); y.splice(y.length - 1, 1); j[n] = -1 * y[0] + k; q[n] = j[n] + B - g; F[n]--; w[n]++ } } 0 > b && (u = 0, t = e.getSliderOffset(a(f[0]), "x"), a(f).each(function (b) { e.getSliderOffset(this, "x") > t && (t = e.getSliderOffset(this, "x"), u = b) }), r = j[n] - E[u], e.setSliderOffset(a(f)[u], r), y.splice(0, 0, -1 * r + k), y.splice(y.length - 1, 1), j[n] = -1 * y[0] + k, q[n] = j[n] + B - g, F[n]--) } } K = !1; g = e.calcActiveOffset(h, b, y, g, F[n], s, v, n); r = (g + F[n] + s) % s; h.infiniteSlider ? r != aa[n] && (K = !0) : g != w[n] && (K = !0); if (K && (s = new e.args("change", h, c, a(c).children(":eq(" + r + ")"), r, z), a(c).parent().data("args", s), "" != h.onSlideChange)) h.onSlideChange(s); w[n] = g; aa[n] = r; b = Math.floor(b); e.setSliderOffset(c, b); h.scrollbar && (M = Math.floor((-1 * b - j[n] + k) / (q[n] - j[n] + k) * (T - N - d)), c = d - G, b >= -1 * j[n] + k ? (c = d - G - -1 * M, e.setSliderOffset(a("." + x), 0)) : (b <= -1 * q[n] + 1 && (c = T - N - G - M), e.setSliderOffset(a("." + x), M)), a("." + x).css({ width: c + "px" })) }, slowScrollHorizontal: function (c, f, b, x, d, g, T, N, G, v, K, y, r, s, E, n, k, z, h, B, p) { var m = e.getSliderOffset(c, "x"); g = []; var I = 0, u = 25 / 1024 * N; frictionCoefficient = p.frictionCoefficient; elasticFrictionCoefficient = p.elasticFrictionCoefficient; snapFrictionCoefficient = p.snapFrictionCoefficient; d > p.snapVelocityThreshold && p.snapToChildren && !h ? I = 1 : d < -1 * p.snapVelocityThreshold && (p.snapToChildren && !h) && (I = -1); d < -1 * u ? d = -1 * u : d > u && (d = u); a(c)[0] !== a(z)[0] && (I *= -1, d *= -2); z = F[E]; if (p.infiniteSlider) var t = j[E], l = q[E]; h = []; for (var u = [], C = 0; C < r.length; C++) h[C] = r[C], C < f.length && (u[C] = e.getSliderOffset(a(f[C]), "x")); for (; 1 < d || -1 > d; ) { d *= frictionCoefficient; m += d; if ((m > -1 * j[E] || m < -1 * q[E]) && !p.infiniteSlider) d *= elasticFrictionCoefficient, m += d; if (p.infiniteSlider) { if (m <= -1 * l) { for (var l = a(c).width(), M = 0, P = u[0], C = 0; C < u.length; C++) u[C] < P && (P = u[C], M = C); C = t + l; u[M] = C; t = -1 * h[1] + B; l = t + l - N; h.splice(0, 1); h.splice(h.length, 0, -1 * C + B); z++ } if (m >= -1 * t) { l = a(c).width(); M = 0; P = u[0]; for (C = 0; C < u.length; C++) u[C] > P && (P = u[C], M = C); C = t - s[M]; u[M] = C; h.splice(0, 0, -1 * C + B); h.splice(h.length - 1, 1); t = -1 * h[0] + B; l = t + l - N; z-- } } g[g.length] = m } u = !1; d = e.calcActiveOffset(p, m, h, N, z, k, w[E], E); t = (d + z + k) % k; p.snapToChildren && (p.infiniteSlider ? t != aa[E] && (u = !0) : d != w[E] && (u = !0), 0 > I && !u ? (d++, d >= r.length && !p.infinteSlider && (d = r.length - 1)) : 0 < I && !u && (d--, 0 > d && !p.infinteSlider && (d = 0))); if (p.snapToChildren || (m > -1 * j[E] || m < -1 * q[E]) && !p.infiniteSlider) { (m > -1 * j[E] || m < -1 * q[E]) && !p.infiniteSlider ? g.splice(0, g.length) : (g.splice(0.1 * g.length, g.length), m = 0 < g.length ? g[g.length - 1] : m); for (; m < h[d] - 0.5 || m > h[d] + 0.5; ) m = (m - h[d]) * snapFrictionCoefficient + h[d], g[g.length] = m; g[g.length] = h[d] } I = 1; 0 != g.length % 2 && (I = 0); for (m = 0; m < b.length; m++) clearTimeout(b[m]); z = (d + z + k) % k; t = 0; for (m = I; m < g.length; m += 2) if (m == I || 1 < Math.abs(g[m] - t) || m >= g.length - 2) t = g[m], b[b.length] = e.slowScrollHorizontalIntervalTimer(10 * m, c, f, g[m], x, T, N, G, v, K, d, y, r, n, k, s, E, B, z, p); t = (d + F[E] + k) % k; "" != p.onSlideComplete && (b[b.length] = e.onSlideCompleteTimer(10 * (m + 1), p, c, a(c).children(":eq(" + t + ")"), z, E)); Z[E] = b; e.hideScrollbar(p, b, m, g, x, T, N, v, K, E) }, onSlideComplete: function (c, f, b, x) { b = new e.args("complete", c, a(f), b, x, x); a(f).parent().data("args", b); if ("" != c.onSlideComplete) c.onSlideComplete(b) }, getSliderOffset: function (c, e) { var b = 0; e = "x" == e ? 4 : 5; if (da && !$ && !X) { for (var b = ["-webkit-transform", "-moz-transform", "transform"], x = 0; x < b.length; x++) if (void 0 != a(c).css(b[x]) && 0 < a(c).css(b[x]).length) { var d = a(c).css(b[x]).split(","); break } b = parseInt(d[e], 10) } else b = parseInt(a(c).css("left"), 10); return b }, setSliderOffset: function (c, e) { da && !$ && !X ? a(c).css({ webkitTransform: "matrix(1,0,0,1," + e + ",0)", MozTransform: "matrix(1,0,0,1," + e + ",0)", transform: "matrix(1,0,0,1," + e + ",0)" }) : a(c).css({ left: e + "px" }) }, setBrowserInfo: function () { null != navigator.userAgent.match("WebKit") ? (fa = "-webkit-grab", sa = "-webkit-grabbing") : null != navigator.userAgent.match("Gecko") ? (fa = "move", sa = "-moz-grabbing") : null != navigator.userAgent.match("MSIE 7") ? na = $ = !0 : null != navigator.userAgent.match("MSIE 8") ? na = X = !0 : null != navigator.userAgent.match("MSIE 9") && (na = !0) }, has3DTransform: function () { var c = !1, e = a("<div />").css({ webkitTransform: "matrix(1,1,1,1,1,1)", MozTransform: "matrix(1,1,1,1,1,1)", transform: "matrix(1,1,1,1,1,1)" }); "" == e.attr("style") ? c = !1 : void 0 != e.attr("style") && (c = !0); return c }, getSlideNumber: function (a, e, b) { return (a - F[e] + b) % b }, calcActiveOffset: function (a, e, b, x, d, g) { d = !1; a = []; var j; e > b[0] && (j = 0); e < b[b.length - 1] && (j = g - 1); for (g = 0; g < b.length; g++) b[g] <= e && b[g] > e - x && (!d && b[g] != e && (a[a.length] = b[g - 1]), a[a.length] = b[g], d = !0); 0 == a.length && (a[0] = b[b.length - 1]); for (g = d = 0; g < a.length; g++) { var q = Math.abs(e - a[g]); q < x && (d = a[g], x = q) } for (g = 0; g < b.length; g++) d == b[g] && (j = g); return j }, changeSlide: function (c, f, b, x, d, g, j, q, G, v, K, y, r, s, E, n, k, z) { e.autoSlidePause(s); for (var h = 0; h < x.length; h++) clearTimeout(x[h]); var B = Math.ceil(z.autoSlideTransTimer / 10) + 1, p = e.getSliderOffset(f, "x"), m = y[c], m = m - p, I = c - (w[s] + F[s] + n) % n; if (z.infiniteSlider) { c = (c - F[s] + 2 * n) % n; h = !1; 0 == c && 2 == n && (c = n, y[c] = y[c - 1] - a(b).eq(0).outerWidth(!0), h = !0); var m = y[c], m = m - p, u = [y[c] - a(f).width(), y[c] + a(f).width()]; h && y.splice(y.length - 1, 1); for (h = 0; h < u.length; h++) Math.abs(u[h] - p) < Math.abs(m) && (m = u[h] - p); 0 > m && -1 == I ? m += a(f).width() : 0 < m && 1 == I && (m -= a(f).width()) } I = []; e.showScrollbar(z, d); for (h = 0; h <= B; h++) u = h, u /= B, u--, u = p + m * (Math.pow(u, 5) + 1), I[I.length] = u; for (h = p = 0; h < I.length; h++) { if (0 == h || 1 < Math.abs(I[h] - p) || h >= I.length - 2) p = I[h], x[h] = e.slowScrollHorizontalIntervalTimer(10 * (h + 1), f, b, I[h], d, g, j, q, G, v, c, K, y, E, n, r, s, k, c, z); 0 == h && "" != z.onSlideStart && (B = (w[s] + F[s] + n) % n, z.onSlideStart(new e.args("start", z, f, a(f).children(":eq(" + B + ")"), B, c))) } p = !1; B = (c + F[s] + n) % n; z.infiniteSlider ? B != aa[s] && (p = !0) : c != w[s] && (p = !0); p && "" != z.onSlideComplete && (x[x.length] = e.onSlideCompleteTimer(10 * (h + 1), z, f, a(f).children(":eq(" + B + ")"), B, s)); Z[s] = x; e.hideScrollbar(z, x, h, I, d, g, j, G, v, s); e.autoSlide(f, b, x, d, g, j, q, G, v, K, y, r, s, E, n, k, z) }, autoSlide: function (a, f, b, x, d, g, j, q, G, v, K, y, r, s, E, n, k) { if (!S[r].autoSlide) return !1; e.autoSlidePause(r); ga[r] = setTimeout(function () { !k.infiniteSlider && w[r] > K.length - 1 && (w[r] -= E); e.changeSlide((w[r] + F[r] + E) % E + 1, a, f, b, x, d, g, j, q, G, v, K, y, r, s, E, n, k); e.autoSlide(a, f, b, x, d, g, j, q, G, v, K, y, r, s, E, n, k) }, k.autoSlideTimer + k.autoSlideTransTimer) }, autoSlidePause: function (a) { clearTimeout(ga[a]) }, isUnselectable: function (c, e) { return "" != e.unselectableSelector && 1 == a(c).closest(e.unselectableSelector).size() ? !0 : !1 }, slowScrollHorizontalIntervalTimer: function (a, f, b, x, d, g, j, q, w, v, F, y, r, s, E, n, k, z, h, B) { return setTimeout(function () { e.slowScrollHorizontalInterval(f, b, x, d, g, j, q, w, v, F, y, r, s, E, n, k, z, h, B) }, a) }, onSlideCompleteTimer: function (a, f, b, x, d, g) { return setTimeout(function () { e.onSlideComplete(f, b, x, d, g) }, a) }, hideScrollbarIntervalTimer: function (a, f, b, x, d, g, j, q, w, v) { return setTimeout(function () { e.hideScrollbarInterval(f, b, x, d, g, j, q, w, v) }, a) }, args: function (c, f, b, j, d, g) { this.prevSlideNumber = void 0 == a(b).parent().data("args") ? void 0 : a(b).parent().data("args").prevSlideNumber; this.prevSlideObject = void 0 == a(b).parent().data("args") ? void 0 : a(b).parent().data("args").prevSlideObject; this.targetSlideNumber = g + 1; this.targetSlideObject = a(b).children(":eq(" + this.targetSlideOffset + ")"); this.slideChanged = !1; "load" == c ? this.targetSlideObject = this.targetSlideNumber = void 0 : "start" == c ? this.targetSlideObject = this.targetSlideNumber = void 0 : "change" == c ? (this.slideChanged = !0, this.prevSlideNumber = void 0 == a(b).parent().data("args") ? f.startAtSlide : a(b).parent().data("args").currentSlideNumber, this.prevSlideObject = a(b).children(":eq(" + this.prevSlideNumber + ")")) : "complete" == c && (this.slideChanged = a(b).parent().data("args").slideChanged); this.settings = f; this.data = a(b).parent().data("iosslider"); this.sliderObject = b; this.sliderContainerObject = a(b).parent(); this.currentSlideObject = j; this.currentSlideNumber = d + 1; this.currentSliderOffset = -1 * e.getSliderOffset(b, "x") }, preventDrag: function (a) { a.preventDefault() }, preventClick: function (a) { a.stopImmediatePropagation(); return !1 }, enableClick: function () { return !0 } }; e.setBrowserInfo(); var R = { init: function (c, f) { da = e.has3DTransform(); var b = a.extend(!0, { elasticPullResistance: 0.6, frictionCoefficient: 0.92, elasticFrictionCoefficient: 0.6, snapFrictionCoefficient: 0.92, snapToChildren: !1, snapSlideCenter: !1, startAtSlide: 1, scrollbar: !1, scrollbarDrag: !1, scrollbarHide: !0, scrollbarLocation: "top", scrollbarContainer: "", scrollbarOpacity: 0.4, scrollbarHeight: "4px", scrollbarBorder: "0", scrollbarMargin: "5px", scrollbarBackground: "#000", scrollbarBorderRadius: "100px", scrollbarShadow: "0 0 0 #000", scrollbarElasticPullResistance: 0.9, desktopClickDrag: !1, keyboardControls: !1, tabToAdvance: !1, responsiveSlideContainer: !0, responsiveSlides: !0, navSlideSelector: "", navPrevSelector: "", navNextSelector: "", autoSlideToggleSelector: "", autoSlide: !1, autoSlideTimer: 5E3, autoSlideTransTimer: 750, infiniteSlider: !1, snapVelocityThreshold: 5, slideStartVelocityThreshold: 0, horizontalSlideLockThreshold: 5, verticalSlideLockThreshold: 3, stageCSS: { position: "relative", top: "0", left: "0", overflow: "hidden", zIndex: 1 }, unselectableSelector: "", onSliderLoaded: "", onSliderUpdate: "", onSliderResize: "", onSlideStart: "", onSlideChange: "", onSlideComplete: "" }, c); void 0 == f && (f = this); return a(f).each(function () { function c() { e.autoSlidePause(d); va = a(D).find("a"); za = a(D).find("[onclick]"); oa = a(D).find("*"); a(z).css("width", ""); a(z).css("height", ""); a(D).css("width", ""); A = a(D).children().not("script").get(); ha = []; L = []; a(A).css("width", ""); q[d] = 0; l = []; E = a(z).parent().width(); h = a(z).outerWidth(!0); b.responsiveSlideContainer && (h = a(z).outerWidth(!0) > E ? E : a(z).outerWidth(!0)); a(z).css({ position: b.stageCSS.position, top: b.stageCSS.top, left: b.stageCSS.left, overflow: b.stageCSS.overflow, zIndex: b.stageCSS.zIndex, webkitPerspective: 1E3, webkitBackfaceVisibility: "hidden", msTouchAction: "pan-y", width: h }); a(b.unselectableSelector).css({ cursor: "default" }); for (var H = 0; H < A.length; H++) { ha[H] = a(A[H]).width(); L[H] = a(A[H]).outerWidth(!0); var x = L[H]; b.responsiveSlides && (x = L[H] > h ? h + -1 * (L[H] - ha[H]) : ha[H], a(A[H]).css({ width: x })); a(A[H]).css({ webkitBackfaceVisibility: "hidden", position: "absolute", top: 0 }); l[H] = -1 * q[d]; q[d] = q[d] + x + (L[H] - ha[H]) } b.snapSlideCenter && (k = 0.5 * (h - L[0]), b.responsiveSlides && L[0] > h && (k = 0)); ua[d] = 2 * q[d]; for (H = 0; H < A.length; H++) e.setSliderOffset(a(A[H]), -1 * l[H] + q[d] + k), l[H] -= q[d]; if (!b.infiniteSlider && !b.snapSlideCenter) { for (H = 0; H < l.length && !(l[H] <= -1 * (2 * q[d] - h)); H++) ga = H; l.splice(ga + 1, l.length); l[l.length] = -1 * (2 * q[d] - h) } for (H = 0; H < l.length; H++) C[H] = l[H]; u && (b.startAtSlide = S[d].startAtSlide > l.length ? l.length : S[d].startAtSlide, b.infiniteSlider ? (b.startAtSlide = (S[d].startAtSlide - 1 + J) % J, w[d] = S[d].startAtSlide) : (b.startAtSlide = 0 > S[d].startAtSlide - 1 ? l.length - 1 : S[d].startAtSlide, w[d] = S[d].startAtSlide - 1), aa[d] = w[d]); j[d] = q[d] + k; a(D).css({ position: "relative", cursor: fa, webkitPerspective: "0", webkitBackfaceVisibility: "hidden", width: q[d] + "px" }); V = q[d]; q[d] = 2 * q[d] - h + 2 * k; (Y = V < h ? !0 : !1) && a(D).css({ cursor: "default" }); n = a(z).parent().outerHeight(!0); B = a(z).height(); b.responsiveSlideContainer && (B = B > n ? n : B); a(z).css({ height: B }); e.setSliderOffset(D, l[w[d]]); if (b.infiniteSlider && !Y) { H = e.getSliderOffset(a(D), "x"); for (x = -1 * ((F[d] + J) % J); 0 > x; ) { var t = 0, ia = e.getSliderOffset(a(A[0]), "x"); a(A).each(function (a) { e.getSliderOffset(this, "x") < ia && (ia = e.getSliderOffset(this, "x"), t = a) }); var I = j[d] + V; e.setSliderOffset(a(A)[t], I); j[d] = -1 * l[1] + k; q[d] = j[d] + V - h; l.splice(0, 1); l.splice(l.length, 0, -1 * I + k); x++ } for (; 0 < -1 * l[0] - V + k && b.snapSlideCenter && u; ) { var M = 0, N = e.getSliderOffset(a(A[0]), "x"); a(A).each(function (a) { e.getSliderOffset(this, "x") > N && (N = e.getSliderOffset(this, "x"), M = a) }); I = j[d] - L[M]; e.setSliderOffset(a(A)[M], I); l.splice(0, 0, -1 * I + k); l.splice(l.length - 1, 1); j[d] = -1 * l[0] + k; q[d] = j[d] + V - h; F[d]--; w[d]++ } for (; H <= -1 * q[d]; ) t = 0, ia = e.getSliderOffset(a(A[0]), "x"), a(A).each(function (a) { e.getSliderOffset(this, "x") < ia && (ia = e.getSliderOffset(this, "x"), t = a) }), I = j[d] + V, e.setSliderOffset(a(A)[t], I), j[d] = -1 * l[1] + k, q[d] = j[d] + V - h, l.splice(0, 1), l.splice(l.length, 0, -1 * I + k), F[d]++, w[d]-- } e.setSliderOffset(D, l[w[d]]); b.desktopClickDrag || a(D).css({ cursor: "default" }); b.scrollbar && (a("." + G).css({ margin: b.scrollbarMargin, overflow: "hidden", display: "none" }), a("." + G + " ." + v).css({ border: b.scrollbarBorder }), p = parseInt(a("." + G).css("marginLeft")) + parseInt(a("." + G).css("marginRight")), m = parseInt(a("." + G + " ." + v).css("borderLeftWidth"), 10) + parseInt(a("." + G + " ." + v).css("borderRightWidth"), 10), r = "" != b.scrollbarContainer ? a(b.scrollbarContainer).width() : h, s = (r - p) / J, b.scrollbarHide || (R = b.scrollbarOpacity), a("." + G).css({ position: "absolute", left: 0, width: r - p + "px", margin: b.scrollbarMargin }), "top" == b.scrollbarLocation ? a("." + G).css("top", "0") : a("." + G).css("bottom", "0"), a("." + G + " ." + v).css({ borderRadius: b.scrollbarBorderRadius, background: b.scrollbarBackground, height: b.scrollbarHeight, width: s - m + "px", minWidth: b.scrollbarHeight, border: b.scrollbarBorder, webkitPerspective: 1E3, webkitBackfaceVisibility: "hidden", position: "relative", opacity: R, filter: "alpha(opacity:" + 100 * R + ")", boxShadow: b.scrollbarShadow }), e.setSliderOffset(a("." + G + " ." + v), Math.floor((-1 * l[w[d]] - j[d] + k) / (q[d] - j[d] + k) * (r - p - s))), a("." + G).css({ display: "block" }), K = a("." + G + " ." + v), y = a("." + G)); b.scrollbarDrag && !Y && a("." + G + " ." + v).css({ cursor: fa }); b.infiniteSlider && (Q = (q[d] + h) / 3); "" != b.navSlideSelector && a(b.navSlideSelector).each(function (c) { a(this).css({ cursor: "pointer" }); a(this).unbind(O).bind(O, function (H) { "touchstart" == H.type ? a(this).unbind("click.iosSliderEvent") : a(this).unbind("touchstart.iosSliderEvent"); O = H.type + ".iosSliderEvent"; e.changeSlide(c, D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b) }) }); "" != b.navPrevSelector && (a(b.navPrevSelector).css({ cursor: "pointer" }), a(b.navPrevSelector).unbind(O).bind(O, function (c) { "touchstart" == c.type ? a(this).unbind("click.iosSliderEvent") : a(this).unbind("touchstart.iosSliderEvent"); O = c.type + ".iosSliderEvent"; c = (w[d] + F[d] + J) % J; (0 < c || b.infiniteSlider) && e.changeSlide(c - 1, D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b) })); "" != b.navNextSelector && (a(b.navNextSelector).css({ cursor: "pointer" }), a(b.navNextSelector).unbind(O).bind(O, function (c) { "touchstart" == c.type ? a(this).unbind("click.iosSliderEvent") : a(this).unbind("touchstart.iosSliderEvent"); O = c.type + ".iosSliderEvent"; c = (w[d] + F[d] + J) % J; (c < l.length - 1 || b.infiniteSlider) && e.changeSlide(c + 1, D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b) })); b.autoSlide && !Y && "" != b.autoSlideToggleSelector && (a(b.autoSlideToggleSelector).css({ cursor: "pointer" }), a(b.autoSlideToggleSelector).unbind(O).bind(O, function (c) { "touchstart" == c.type ? a(this).unbind("click.iosSliderEvent") : a(this).unbind("touchstart.iosSliderEvent"); O = c.type + ".iosSliderEvent"; wa ? (e.autoSlide(D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b), wa = !1, a(b.autoSlideToggleSelector).removeClass("on")) : (e.autoSlidePause(d), wa = !0, a(b.autoSlideToggleSelector).addClass("on")) })); e.autoSlide(D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b); a(z).bind("mouseleave.iosSliderEvent", function () { e.autoSlide(D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b) }); a(z).bind("touchend.iosSliderEvent", function () { e.autoSlide(D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b) }); a(z).bind("mouseenter.iosSliderEvent", function () { e.autoSlidePause(d) }); a(z).data("iosslider", { obj: Aa, settings: b, scrollerNode: D, slideNodes: A, numberOfSlides: J, centeredSlideOffset: k, sliderNumber: d, originalOffsets: C, childrenOffsets: l, sliderMax: q[d], scrollbarClass: v, scrollbarWidth: s, scrollbarStageWidth: r, stageWidth: h, scrollMargin: p, scrollBorder: m, infiniteSliderOffset: F[d], infiniteSliderWidth: Q, slideNodeOuterWidths: L }); u = !1; return !0 } ma++; var d = ma, f = []; S[d] = b; j[d] = 0; q[d] = 0; var T = [0, 0], N = [0, 0], G = "scrollbarBlock" + ma, v = "scrollbar" + ma, K, y, r, s, E, n, k = 0, z = a(this), h, B, p, m, I, u = !0, t = -1, l, C = [], R = 0, P = 0, da = 0, D = a(this).children(":first-child"), A, ha, L, J = a(D).children().not("script").size(), U = !1, ga = 0, xa = !1, pa = void 0, Q; F[d] = 0; var Y = !1, wa = !1; ta[d] = !1; var qa, ra = !1, ja = !1, O = "touchstart.iosSliderEvent click.iosSliderEvent", V, va, za, oa; ea[d] = !1; Z[d] = []; b.scrollbarDrag && (b.scrollbar = !0, b.scrollbarHide = !1); var Aa = a(this); if (void 0 != Aa.data("iosslider")) return !0; a(this).find("img").bind("dragstart.iosSliderEvent", function (a) { a.preventDefault() }); b.infiniteSlider && (b.scrollbar = !1); b.infiniteSlider && 1 == J && (b.infiniteSlider = !1); b.scrollbar && ("" != b.scrollbarContainer ? a(b.scrollbarContainer).append("<div class = '" + G + "'><div class = '" + v + "'></div></div>") : a(D).parent().append("<div class = '" + G + "'><div class = '" + v + "'></div></div>")); if (!c()) return !0; a(this).find("a").bind("mousedown", e.preventDrag); a(this).find("[onclick]").bind("click", e.preventDrag).each(function () { a(this).data("onclick", this.onclick) }); t = e.calcActiveOffset(b, e.getSliderOffset(a(D), "x"), l, h, F[d], J, void 0, d); t = (t + F[d] + J) % J; t = new e.args("load", b, D, a(D).children(":eq(" + t + ")"), t, t); a(z).data("args", t); if ("" != b.onSliderLoaded) b.onSliderLoaded(t); if (S[d].responsiveSlides || S[d].responsiveSlideContainer) t = Ca ? "orientationchange" : "resize", a(window).bind(t + ".iosSliderEvent-" + d, function () { if (!c()) return !0; var d = a(z).data("args"); if ("" != b.onSliderResize) b.onSliderResize(d) }); (b.keyboardControls || b.tabToAdvance) && !Y && a(document).bind("keydown.iosSliderEvent", function (a) { !$ && !X && (a = a.originalEvent); if (37 == a.keyCode && b.keyboardControls) a.preventDefault(), a = (w[d] + F[d] + J) % J, (0 < a || b.infiniteSlider) && e.changeSlide(a - 1, D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b); else if (39 == a.keyCode && b.keyboardControls || 9 == a.keyCode && b.tabToAdvance) a.preventDefault(), a = (w[d] + F[d] + J) % J, (a < l.length - 1 || b.infiniteSlider) && e.changeSlide(a + 1, D, A, f, v, s, h, r, p, m, C, l, L, d, Q, J, k, b) }); if (Ba || b.desktopClickDrag) { var ba = !1, ka = a(D), la = a(D), ya = !1; b.scrollbarDrag && (ka = ka.add(K), la = la.add(y)); a(ka).bind("mousedown.iosSliderEvent touchstart.iosSliderEvent", function (c) { if (ba) return !0; ba = !0; "touchstart" == c.type ? a(la).unbind("mousedown.iosSliderEvent") : a(la).unbind("touchstart.iosSliderEvent"); if (ea[d] || Y || (ya = e.isUnselectable(c.target, b))) return U = ba = !1, !0; qa = a(this)[0] === a(K)[0] ? K : D; !$ && !X && (c = c.originalEvent); e.autoSlidePause(d); oa.unbind(".disableClick"); if ("touchstart" == c.type) eventX = c.touches[0].pageX, eventY = c.touches[0].pageY; else { if (window.getSelection) window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges(); else if (document.selection) if (X) try { document.selection.empty() } catch (h) { } else document.selection.empty(); eventX = c.pageX; eventY = c.pageY; xa = !0; pa = D; a(this).css({ cursor: sa }) } T = [0, 0]; N = [0, 0]; W = 0; U = !1; for (c = 0; c < f.length; c++) clearTimeout(f[c]); c = e.getSliderOffset(D, "x"); c > -1 * j[d] + k + V ? (c = -1 * j[d] + k + V, e.setSliderOffset(a("." + v), c), a("." + v).css({ width: s - m + "px" })) : c < -1 * q[d] && (e.setSliderOffset(a("." + v), r - p - s), a("." + v).css({ width: s - m + "px" })); c = a(this)[0] === a(K)[0] ? j[d] : 0; P = -1 * (e.getSliderOffset(this, "x") - eventX - c); e.getSliderOffset(this, "y"); T[1] = eventX; N[1] = eventY; ja = !1 }); a(la).bind("touchmove.iosSliderEvent mousemove.iosSliderEvent", function (c) { !$ && !X && (c = c.originalEvent); if (ea[d] || Y || ya) return !0; var f = 0; if ("touchmove" == c.type) eventX = c.touches[0].pageX, eventY = c.touches[0].pageY; else { if (window.getSelection) window.getSelection().empty || window.getSelection().removeAllRanges && window.getSelection().removeAllRanges(); else if (document.selection) if (X) try { document.selection.empty() } catch (x) { } else document.selection.empty(); eventX = c.pageX; eventY = c.pageY; if (!xa || !na && ("undefined" != typeof c.webkitMovementX || "undefined" != typeof c.webkitMovementY) && 0 === c.webkitMovementY && 0 === c.webkitMovementX) return !0 } T[0] = T[1]; T[1] = eventX; W = (T[1] - T[0]) / 2; N[0] = N[1]; N[1] = eventY; ca = (N[1] - N[0]) / 2; if (!U) { var g = (w[d] + F[d] + J) % J, g = new e.args("start", b, D, a(D).children(":eq(" + g + ")"), g, void 0); a(z).data("args", g); if ("" != b.onSlideStart) b.onSlideStart(g) } if ((ca > b.verticalSlideLockThreshold || ca < -1 * b.verticalSlideLockThreshold) && "touchmove" == c.type && !U) ra = !0; (W > b.horizontalSlideLockThreshold || W < -1 * b.horizontalSlideLockThreshold) && "touchmove" == c.type && c.preventDefault(); if (W > b.slideStartVelocityThreshold || W < -1 * b.slideStartVelocityThreshold) U = !0; if (U && !ra) { var g = e.getSliderOffset(D, "x"), n = a(this)[0] === a(y)[0] ? j[d] : k, u = a(this)[0] === a(y)[0] ? (j[d] - q[d] - k) / (r - p - s) : 1, t = a(this)[0] === a(y)[0] ? b.scrollbarElasticPullResistance : b.elasticPullResistance, E = b.snapSlideCenter && a(this)[0] === a(y)[0] ? 0 : k, G = b.snapSlideCenter && a(this)[0] === a(y)[0] ? k : 0; "touchmove" == c.type && (da != c.touches.length && (P = -1 * g + eventX), da = c.touches.length); if (b.infiniteSlider) { if (g <= -1 * q[d]) { var B = a(D).width(); if (g <= -1 * ua[d]) { var K = -1 * C[0]; a(A).each(function (b) { e.setSliderOffset(a(A)[b], K + k); b < l.length && (l[b] = -1 * K); K += L[b] }); P -= -1 * l[0]; j[d] = -1 * l[0] + k; q[d] = j[d] + B - h; F[d] = 0 } else { var Q = 0, S = e.getSliderOffset(a(A[0]), "x"); a(A).each(function (a) { e.getSliderOffset(this, "x") < S && (S = e.getSliderOffset(this, "x"), Q = a) }); t = j[d] + B; e.setSliderOffset(a(A)[Q], t); j[d] = -1 * l[1] + k; q[d] = j[d] + B - h; l.splice(0, 1); l.splice(l.length, 0, -1 * t + k); F[d]++ } } if (g >= -1 * j[d] || 0 <= g) if (B = a(D).width(), 0 <= g) { K = -1 * C[0]; a(A).each(function (b) { e.setSliderOffset(a(A)[b], K + k); b < l.length && (l[b] = -1 * K); K += L[b] }); P += -1 * l[0]; j[d] = -1 * l[0] + k; q[d] = j[d] + B - h; for (F[d] = J; 0 < -1 * l[0] - B + k; ) { var O = 0, R = e.getSliderOffset(a(A[0]), "x"); a(A).each(function (a) { e.getSliderOffset(this, "x") > R && (R = e.getSliderOffset(this, "x"), O = a) }); t = j[d] - L[O]; e.setSliderOffset(a(A)[O], t); l.splice(0, 0, -1 * t + k); l.splice(l.length - 1, 1); j[d] = -1 * l[0] + k; q[d] = j[d] + B - h; F[d]--; w[d]++ } } else O = 0, R = e.getSliderOffset(a(A[0]), "x"), a(A).each(function (a) { e.getSliderOffset(this, "x") > R && (R = e.getSliderOffset(this, "x"), O = a) }), t = j[d] - L[O], e.setSliderOffset(a(A)[O], t), l.splice(0, 0, -1 * t + k), l.splice(l.length - 1, 1), j[d] = -1 * l[0] + k, q[d] = j[d] + B - h, F[d]-- } else B = a(D).width(), g > -1 * j[d] + k && (f = -1 * (j[d] + -1 * (P - n - eventX + E) * u - n) * t / u), g < -1 * q[d] && (f = -1 * (q[d] + G + -1 * (P - n - eventX) * u - n) * t / u); e.setSliderOffset(D, -1 * (P - n - eventX - f) * u - n + G); b.scrollbar && (e.showScrollbar(b, v), M = Math.floor((P - eventX - f - j[d] + E) / (q[d] - j[d] + k) * (r - p - s) * u), g = s, 0 >= M ? (g = s - m - -1 * M, e.setSliderOffset(a("." + v), 0), a("." + v).css({ width: g + "px" })) : M >= r - p - m - s ? (g = r - p - m - M, e.setSliderOffset(a("." + v), M), a("." + v).css({ width: g + "px" })) : e.setSliderOffset(a("." + v), M)); "touchmove" == c.type && (I = c.touches[0].pageX); c = !1; f = e.calcActiveOffset(b, -1 * (P - eventX - f), l, h, F[d], J, void 0, d); g = (f + F[d] + J) % J; b.infiniteSlider ? g != aa[d] && (c = !0) : f != w[d] && (c = !0); if (c && (w[d] = f, aa[d] = g, ja = !0, g = new e.args("change", b, D, a(D).children(":eq(" + g + ")"), g, g), a(z).data("args", g), "" != b.onSlideChange)) b.onSlideChange(g) } ba = !1 }); t = a(window); if (X || $) t = a(document); a(ka).bind("touchend.iosSliderEvent", function (a) { a = a.originalEvent; if (ea[d] || Y || ya) return !0; if (0 != a.touches.length) for (var c = 0; c < a.touches.length; c++) a.touches[c].pageX == I && e.slowScrollHorizontal(D, A, f, v, W, ca, s, h, r, p, m, C, l, L, d, Q, J, qa, ja, k, b); else e.slowScrollHorizontal(D, A, f, v, W, ca, s, h, r, p, m, C, l, L, d, Q, J, qa, ja, k, b); ba = ra = !1 }); a(t).bind("mouseup.iosSliderEvent" + d, function () { U ? va.unbind("click.disableClick").bind("click.disableClick", e.preventClick) : va.unbind("click.disableClick").bind("click.disableClick", e.enableClick); za.each(function () { this.onclick = function (b) { if (U) return !1; a(this).data("onclick").call(this, b || window.event) } }); 1.8 <= parseFloat(a().jquery) ? oa.each(function () { var b = a._data(this, "events"); if (void 0 != b && void 0 != b.click && "iosSliderEvent" != b.click[0].namespace) { if (!U) return !1; a(this).one("click.disableClick", e.preventClick); var b = a._data(this, "events").click, c = b.pop(); b.splice(0, 0, c) } }) : 1.6 <= parseFloat(a().jquery) && oa.each(function () { var b = a(this).data("events"); if (void 0 != b && void 0 != b.click && "iosSliderEvent" != b.click[0].namespace) { if (!U) return !1; a(this).one("click.disableClick", e.preventClick); var b = a(this).data("events").click, c = b.pop(); b.splice(0, 0, c) } }); if (!ta[d]) { if (Y) return !0; a(ka).css({ cursor: fa }); xa = !1; if (void 0 == pa) return !0; e.slowScrollHorizontal(pa, A, f, v, W, ca, s, h, r, p, m, C, l, L, d, Q, J, qa, ja, k, b); pa = void 0 } ba = ra = !1 }) } }) }, destroy: function (c, f) { void 0 == f && (f = this); return a(f).each(function () { var b = a(this), f = b.data("iosslider"); if (void 0 == f) return !1; void 0 == c && (c = !0); e.autoSlidePause(f.sliderNumber); ta[f.sliderNumber] = !0; a(window).unbind(".iosSliderEvent-" + f.sliderNumber); a(document).unbind(".iosSliderEvent-" + f.sliderNumber); a(document).unbind("keydown.iosSliderEvent"); a(this).unbind(".iosSliderEvent"); a(this).children(":first-child").unbind(".iosSliderEvent"); a(this).children(":first-child").children().unbind(".iosSliderEvent"); c && (a(this).attr("style", ""), a(this).children(":first-child").attr("style", ""), a(this).children(":first-child").children().attr("style", ""), a(f.settings.navSlideSelector).attr("style", ""), a(f.settings.navPrevSelector).attr("style", ""), a(f.settings.navNextSelector).attr("style", ""), a(f.settings.autoSlideToggleSelector).attr("style", ""), a(f.settings.unselectableSelector).attr("style", "")); f.settings.scrollbar && a(".scrollbarBlock" + f.sliderNumber).remove(); for (var f = Z[f.sliderNumber], d = 0; d < f.length; d++) clearTimeout(f[d]); b.removeData("iosslider"); b.removeData("args") }) }, update: function (c) { void 0 == c && (c = this); return a(c).each(function () { var c = a(this), b = c.data("iosslider"); if (void 0 == b) return !1; b.settings.startAtSlide = c.data("args").currentSlideNumber; R.destroy(!1, this); 1 != b.numberOfSlides && b.settings.infiniteSlider && (b.settings.startAtSlide = (w[b.sliderNumber] + 1 + F[b.sliderNumber] + b.numberOfSlides) % b.numberOfSlides); R.init(b.settings, this); c = new e.args("update", b.settings, b.scrollerNode, a(b.scrollerNode).children(":eq(" + (b.settings.startAtSlide - 1) + ")"), b.settings.startAtSlide - 1, b.settings.startAtSlide - 1); a(b.stageNode).data("args", c); if ("" != b.settings.onSliderUpdate) b.settings.onSliderUpdate(c) }) }, addSlide: function (c, e) { return this.each(function () { var b = a(this), j = b.data("iosslider"); if (void 0 == j) return !1; 0 == a(j.scrollerNode).children().size() ? (a(j.scrollerNode).append(c), b.data("args").currentSlideNumber = 1) : j.settings.infiniteSlider ? (1 == e ? a(j.scrollerNode).children(":eq(0)").before(c) : a(j.scrollerNode).children(":eq(" + (e - 2) + ")").after(c), -1 > F[j.sliderNumber] && w[j.sliderNumber]--, b.data("args").currentSlideNumber >= e && w[j.sliderNumber]++) : (e <= j.numberOfSlides ? a(j.scrollerNode).children(":eq(" + (e - 1) + ")").before(c) : a(j.scrollerNode).children(":eq(" + (e - 2) + ")").after(c), b.data("args").currentSlideNumber >= e && b.data("args").currentSlideNumber++); b.data("iosslider").numberOfSlides++; R.update(this) }) }, removeSlide: function (c) { return this.each(function () { var e = a(this).data("iosslider"); if (void 0 == e) return !1; a(e.scrollerNode).children(":eq(" + (c - 1) + ")").remove(); w[e.sliderNumber] > c - 1 && w[e.sliderNumber]--; R.update(this) }) }, goToSlide: function (c, f) { void 0 == f && (f = this); return a(f).each(function () { var b = a(this).data("iosslider"); if (void 0 == b) return !1; c = c > b.childrenOffsets.length ? b.childrenOffsets.length - 1 : c - 1; e.changeSlide(c, a(b.scrollerNode), a(b.slideNodes), Z[b.sliderNumber], b.scrollbarClass, b.scrollbarWidth, b.stageWidth, b.scrollbarStageWidth, b.scrollMargin, b.scrollBorder, b.originalOffsets, b.childrenOffsets, b.slideNodeOuterWidths, b.sliderNumber, b.infiniteSliderWidth, b.numberOfSlides, b.centeredSlideOffset, b.settings); w[b.sliderNumber] = c }) }, goToPrevSlide: function () { return this.each(function () { var c = a(this).data("iosslider"); if (void 0 == c) return !1; var f = (w[c.sliderNumber] + F[c.sliderNumber] + c.numberOfSlides) % c.numberOfSlides; (0 < f || c.settings.infiniteSlider) && e.changeSlide(f - 1, a(c.scrollerNode), a(c.slideNodes), Z[c.sliderNumber], c.scrollbarClass, c.scrollbarWidth, c.stageWidth, c.scrollbarStageWidth, c.scrollMargin, c.scrollBorder, c.originalOffsets, c.childrenOffsets, c.slideNodeOuterWidths, c.sliderNumber, c.infiniteSliderWidth, c.numberOfSlides, c.centeredSlideOffset, c.settings); w[c.sliderNumber] = f }) }, goToNextSlide: function () { return this.each(function () { var c = a(this).data("iosslider"); if (void 0 == c) return !1; var f = (w[c.sliderNumber] + F[c.sliderNumber] + c.numberOfSlides) % c.numberOfSlides; (f < c.childrenOffsets.length - 1 || c.settings.infiniteSlider) && e.changeSlide(f + 1, a(c.scrollerNode), a(c.slideNodes), Z[c.sliderNumber], c.scrollbarClass, c.scrollbarWidth, c.stageWidth, c.scrollbarStageWidth, c.scrollMargin, c.scrollBorder, c.originalOffsets, c.childrenOffsets, c.slideNodeOuterWidths, c.sliderNumber, c.infiniteSliderWidth, c.numberOfSlides, c.centeredSlideOffset, c.settings); w[c.sliderNumber] = f }) }, lock: function () { return this.each(function () { var c = a(this).data("iosslider"); if (void 0 == c) return !1; ea[c.sliderNumber] = !0 }) }, unlock: function () { return this.each(function () { var c = a(this).data("iosslider"); if (void 0 == c) return !1; ea[c.sliderNumber] = !1 }) }, getData: function () { return this.each(function () { var c = a(this).data("iosslider"); return void 0 == c ? !1 : c }) }, autoSlidePause: function () { return this.each(function () { var c = a(this).data("iosslider"); if (void 0 == c) return !1; S[c.sliderNumber].autoSlide = !1; e.autoSlidePause(c.sliderNumber); return c }) }, autoSlidePlay: function () { return this.each(function () { var c = a(this).data("iosslider"); if (void 0 == c) return !1; S[c.sliderNumber].autoSlide = !0; e.autoSlide(a(c.scrollerNode), a(c.slideNodes), Z[c.sliderNumber], c.scrollbarClass, c.scrollbarWidth, c.stageWidth, c.scrollbarStageWidth, c.scrollMargin, c.scrollBorder, c.originalOffsets, c.childrenOffsets, c.slideNodeOuterWidths, c.sliderNumber, c.infiniteSliderWidth, c.numberOfSlides, c.centeredSlideOffset, c.settings); return c }) } }; a.fn.iosSlider = function (c) { if (R[c]) return R[c].apply(this, Array.prototype.slice.call(arguments, 1)); if ("object" === typeof c || !c) return R.init.apply(this, arguments); a.error("invalid method call!") } })(jQuery);