function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {
    ref: "card",
    staticClass: "card",
    class: {
      active: _vm.active,
      interacting: _vm.interacting,
      loading: _vm.loading
    },
    style: _vm.styles,
    attrs: {
      "data-number": _vm.number,
      "data-subtypes": _vm.subtypes,
      "data-supertype": _vm.supertype,
      "data-rarity": _vm.rarity,
      "data-gallery": _vm.gallery
    }
  }, [_c('div', {
    staticClass: "card__translater"
  }, [_c('button', {
    ref: "rotator",
    staticClass: "card__rotator",
    attrs: {
      "aria-label": "Expand the Pokemon Card; {name}."
    },
    on: {
      "pointermove": _vm.interact,
      "mouseout": _vm.interactEnd
    }
  }, [_c('img', {
    staticClass: "card__back",
    attrs: {
      "src": _vm.back_img,
      "alt": "The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "card__front"
  }, [_c('img', {
    attrs: {
      "src": _vm.front_img,
      "alt": "Front design of the " + _vm.name + " Pokemon Card, with the stats and info around the edge"
    },
    on: {
      "load": _vm.imageLoader
    }
  }), _vm._v(" "), _c('card-shine', {
    attrs: {
      "subtypes": _vm.subtypes,
      "supertype": _vm.supertype
    }
  }), _vm._v(" "), _c('card-glare', {
    attrs: {
      "subtypes": _vm.subtypes,
      "rarity": _vm.rarity
    }
  })], 1)])])]);
};
var __vue_staticRenderFns__ = [];

/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-17e73d72_0", {
    source: "@charset \"UTF-8\";body[data-v-17e73d72]{background-color:#393c42}.card__shine[data-v-17e73d72]{--grain:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+CjxmaWx0ZXIgaWQ9Im4iPgo8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjEwIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIj48L2ZlVHVyYnVsZW5jZT4KPC9maWx0ZXI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuMyI+PC9yZWN0Pgo8L3N2Zz4=\");--space:5%;--angle:133deg;--imgsize:500px;--red:#f80e7b;--yel:#eedf10;--gre:#21e985;--blu:#0dbde9;--vio:#c929f1}.card[data-rarity=\"rare holo\"] .card__shine[data-v-17e73d72]{--space:1.5%;--h:21;--s:70%;--l:50%;--bars:4%;--bar-color:rgba(255, 255, 255, 0.6);--bar-bg:rgb(10, 10, 10);clip-path:inset(10% 8.5% 52.5% 8.5%);background-image:repeating-linear-gradient(90deg,hsl(calc(var(--h) * 0),var(--s),var(--l)) calc(var(--space) * 0),hsl(calc(var(--h) * 0),var(--s),var(--l)) calc(var(--space) * 1),#000 calc(var(--space) * 1.001),#000 calc(var(--space) * 1.999),hsl(calc(var(--h) * 1),var(--s),var(--l)) calc(var(--space) * 2),hsl(calc(var(--h) * 1),var(--s),var(--l)) calc(var(--space) * 3),#000 calc(var(--space) * 3.001),#000 calc(var(--space) * 3.999),hsl(calc(var(--h) * 2),var(--s),var(--l)) calc(var(--space) * 4),hsl(calc(var(--h) * 2),var(--s),var(--l)) calc(var(--space) * 5),#000 calc(var(--space) * 5.001),#000 calc(var(--space) * 5.999),hsl(calc(var(--h) * 3),var(--s),var(--l)) calc(var(--space) * 6),hsl(calc(var(--h) * 3),var(--s),var(--l)) calc(var(--space) * 7),#000 calc(var(--space) * 7.001),#000 calc(var(--space) * 7.999),hsl(calc(var(--h) * 4),var(--s),var(--l)) calc(var(--space) * 8),hsl(calc(var(--h) * 4),var(--s),var(--l)) calc(var(--space) * 9),#000 calc(var(--space) * 9.001),#000 calc(var(--space) * 9.999),hsl(calc(var(--h) * 5),var(--s),var(--l)) calc(var(--space) * 10),hsl(calc(var(--h) * 5),var(--s),var(--l)) calc(var(--space) * 11),#000 calc(var(--space) * 11.001),#000 calc(var(--space) * 11.999),hsl(calc(var(--h) * 6),var(--s),var(--l)) calc(var(--space) * 12),hsl(calc(var(--h) * 6),var(--s),var(--l)) calc(var(--space) * 13),#000 calc(var(--space) * 13.001),#000 calc(var(--space) * 13.999),hsl(calc(var(--h) * 7),var(--s),var(--l)) calc(var(--space) * 14),hsl(calc(var(--h) * 7),var(--s),var(--l)) calc(var(--space) * 15),#000 calc(var(--space) * 15.001),#000 calc(var(--space) * 15.999),hsl(calc(var(--h) * 8),var(--s),var(--l)) calc(var(--space) * 16),hsl(calc(var(--h) * 8),var(--s),var(--l)) calc(var(--space) * 17),#000 calc(var(--space) * 17.001),#000 calc(var(--space) * 17.999),hsl(calc(var(--h) * 9),var(--s),var(--l)) calc(var(--space) * 18),hsl(calc(var(--h) * 9),var(--s),var(--l)) calc(var(--space) * 19),#000 calc(var(--space) * 19.001),#000 calc(var(--space) * 19.999),hsl(calc(var(--h) * 10),var(--s),var(--l)) calc(var(--space) * 20),hsl(calc(var(--h) * 10),var(--s),var(--l)) calc(var(--space) * 21),#000 calc(var(--space) * 21.001),#000 calc(var(--space) * 21.999),hsl(calc(var(--h) * 11),var(--s),var(--l)) calc(var(--space) * 22),hsl(calc(var(--h) * 11),var(--s),var(--l)) calc(var(--space) * 23),#000 calc(var(--space) * 23.001),#000 calc(var(--space) * 23.999),hsl(calc(var(--h) * 12),var(--s),var(--l)) calc(var(--space) * 24),hsl(calc(var(--h) * 12),var(--s),var(--l)) calc(var(--space) * 25),#000 calc(var(--space) * 25.001),#000 calc(var(--space) * 25.999),hsl(calc(var(--h) * 13),var(--s),var(--l)) calc(var(--space) * 26),hsl(calc(var(--h) * 13),var(--s),var(--l)) calc(var(--space) * 27),#000 calc(var(--space) * 27.001),#000 calc(var(--space) * 27.999),hsl(calc(var(--h) * 14),var(--s),var(--l)) calc(var(--space) * 28),hsl(calc(var(--h) * 14),var(--s),var(--l)) calc(var(--space) * 29),#000 calc(var(--space) * 29.001),#000 calc(var(--space) * 29.999),hsl(calc(var(--h) * 15),var(--s),var(--l)) calc(var(--space) * 30),hsl(calc(var(--h) * 15),var(--s),var(--l)) calc(var(--space) * 31),#000 calc(var(--space) * 31.001),#000 calc(var(--space) * 31.999)),repeating-linear-gradient(90deg,var(--vio),var(--blu),var(--gre),var(--yel),var(--red),var(--vio)),repeating-linear-gradient(90deg,var(--bar-bg) calc(var(--bars) * 2),var(--bar-color) calc(var(--bars) * 3),var(--bar-bg) calc(var(--bars) * 3.5),var(--bar-color) calc(var(--bars) * 4),var(--bar-bg) calc(var(--bars) * 5),var(--bar-bg) calc(var(--bars) * 12)),repeating-linear-gradient(90deg,var(--bar-bg) calc(var(--bars) * 2),var(--bar-color) calc(var(--bars) * 3),var(--bar-bg) calc(var(--bars) * 3.5),var(--bar-color) calc(var(--bars) * 4),var(--bar-bg) calc(var(--bars) * 5),var(--bar-bg) calc(var(--bars) * 9)),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(230,230,230,.85) 0,rgba(200,200,200,.1) 25%,#000 90%);background-blend-mode:soft-light,soft-light,screen,overlay;background-position:center,calc((50% - var(--posx)) * 25 + 50%) center,calc(var(--posx) * -1.2) var(--posy),var(--pos),center;background-size:100px 100px,200% 200%,237% 237%,195% 195%,120% 120%;filter:brightness(calc((var(--hyp) + .7) * .7)) contrast(3) saturate(.35)}.card[data-rarity=\"rare holo galaxy\"] .card__glare[data-v-17e73d72]{background-image:radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(222,245,250,.7) 10%,rgba(255,255,255,.5) 20%,rgba(0,0,0,.5) 90%)}.card[data-rarity=\"rare holo galaxy\"] .card__glare[data-v-17e73d72]:after,.card[data-rarity=\"rare holo\"]:not([data-gallery=true]) .card__glare[data-v-17e73d72]:after{content:\"\";clip-path:inset(10% 8.5% 52.5% 8.5%);background-image:radial-gradient(farthest-corner circle at var(--mx) var(--my),#e5efff 5%,rgba(100,100,100,.5) 35%,rgba(0,0,0,.9) 80%)}.card[data-rarity=\"rare holo galaxy\"] .card__shine[data-v-17e73d72]{--space:4%;clip-path:inset(10% 8.5% 52.5% 8.5%);background-image:url(~@/assets/img/galaxy.jpg),url(~@/assets/img/galaxy.jpg),url(~@/assets/img/galaxy.jpg),repeating-linear-gradient(82deg,#dbcc56 calc(var(--space) * 1),#79c73a calc(var(--space) * 2),#3ac0b7 calc(var(--space) * 3),#4762cf calc(var(--space) * 4),#aa45d1 calc(var(--space) * 5),#ff5ab4 calc(var(--space) * 6),#ff5ab4 calc(var(--space) * 7),#aa45d1 calc(var(--space) * 8),#4762cf calc(var(--space) * 9),#3ac0b7 calc(var(--space) * 10),#79c73a calc(var(--space) * 11),#dbcc56 calc(var(--space) * 12)),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(255,255,255,.6) 5%,rgba(150,150,150,.3) 40%,#000 100%);background-blend-mode:color-dodge,color-burn,saturation,screen;background-position:var(--galaxybg,cover),var(--galaxybg,cover),var(--galaxybg,cover),calc((50% - var(--posx)) * 2.5 + 50%) calc((50% - var(--posy)) * 2.5 + 50%),center;background-size:cover,cover,cover,400% 900%,cover;filter:brightness(.75) contrast(1.2) saturate(1.5);mix-blend-mode:color-dodge}.card[data-rarity=\"rare holo galaxy\"][data-subtypes^=stage] .card__glare[data-v-17e73d72]:after,.card[data-rarity=\"rare holo galaxy\"][data-subtypes^=stage] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare holo\"][data-subtypes^=stage] .card__glare[data-v-17e73d72]:after,.card[data-rarity=\"rare holo\"][data-subtypes^=stage] .card__shine[data-v-17e73d72]{clip-path:polygon(91.78% 10%,57% 10%,53.92% 12%,17% 12%,16% 14%,12% 16%,8.5% 16%,7.93% 47.41%,92.07% 47.41%)}.card[data-rarity=\"rare holo galaxy\"][data-subtypes^=supporter] .card__glare[data-v-17e73d72]:after,.card[data-rarity=\"rare holo galaxy\"][data-subtypes^=supporter] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare holo\"][data-subtypes^=supporter] .card__glare[data-v-17e73d72]:after,.card[data-rarity=\"rare holo\"][data-subtypes^=supporter] .card__shine[data-v-17e73d72]{clip-path:inset(14.5% 7.9% 48.2% 8.7%)}.card[data-rarity*=\"rare holo v\"] .card__shine[data-v-17e73d72],.card[data-rarity*=\"rare holo v\"] .card__shine[data-v-17e73d72]:after{--space:5%;--angle:133deg;--imgsize:500px;background-image:var(--grain),repeating-linear-gradient(0deg,#ff7773 calc(var(--space) * 1),#ffed5f calc(var(--space) * 2),#a8ff5f calc(var(--space) * 3),#83fff7 calc(var(--space) * 4),#7894ff calc(var(--space) * 5),#d875ff calc(var(--space) * 6),#ff7773 calc(var(--space) * 7)),repeating-linear-gradient(var(--angle),#0e152e 0,hsl(180deg,10%,60%) 3.8%,hsl(180deg,29%,66%) 4.5%,hsl(180deg,10%,60%) 5.2%,#0e152e 10%,#0e152e 12%),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(0,0,0,.1) 12%,rgba(0,0,0,.15) 20%,rgba(0,0,0,.25) 120%);background-blend-mode:screen,hue,hard-light;background-size:var(--imgsize) 100%,200% 700%,300% 100%,200% 100%;background-position:center,0 var(--posy),var(--posx) var(--posy),var(--posx) var(--posy);filter:brightness(.8) contrast(2.95) saturate(.5)}.card[data-rarity=\"rare holo v\"] .card__shine[data-v-17e73d72]:after{content:\"\";background-position:center,0 var(--posy),calc(var(--posx) * -1) calc(var(--posy) * -1),var(--posx) var(--posy);background-size:var(--imgsize) 100%,200% 400%,195% 100%,200% 100%;filter:brightness(1) contrast(2.5) saturate(1.75);mix-blend-mode:soft-light}.card[data-rarity=\"rare holo vmax\"] .card__shine[data-v-17e73d72]{--space:6%;--angle:133deg;--imgsize:60% 30%;background-image:url(~@/assets/img/vmaxbg.jpg),repeating-linear-gradient(-33deg,#ce2a24 calc(var(--space) * 1),#9daadf calc(var(--space) * 2),#2d9992 calc(var(--space) * 3),#1d9724 calc(var(--space) * 4),#b540e4 calc(var(--space) * 5),#ce2a24 calc(var(--space) * 6)),repeating-linear-gradient(var(--angle),rgba(14,21,46,.5) 0,hsl(180deg,10%,50%) 2.5%,hsl(83deg,50%,35%) 5%,hsl(180deg,10%,50%) 7.5%,rgba(14,21,46,.5) 10%,rgba(14,21,46,.5) 15%),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(6,218,255,.6) 0,rgba(38,235,127,.6) 25%,rgba(155,78,228,.6) 50%,rgba(228,78,90,.6) 75%);background-blend-mode:color-burn,screen,soft-light;background-size:var(--imgsize),1100% 1100%,600% 600%,200% 200%;background-position:center,0 var(--posy),var(--posx) var(--posy),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .3 + .5)) contrast(2.5) saturate(.6)}.card[data-rarity=\"rare holo vstar\"][data-supertype=pokémon] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare holo vstar\"][data-supertype=pokémon] .card__shine[data-v-17e73d72]:after{--space:5%;--angle:133deg;--imgsize:18% 15%;background-image:url(~@/assets/img/ancient.png),repeating-linear-gradient(0deg,#ff7773 calc(var(--space) * 1),#ffed5f calc(var(--space) * 2),#a8ff5f calc(var(--space) * 3),#83fff7 calc(var(--space) * 4),#7894ff calc(var(--space) * 5),#d875ff calc(var(--space) * 6),#ff7773 calc(var(--space) * 7)),repeating-linear-gradient(var(--angle),#0e152e 0,hsl(180deg,10%,60%) 3.8%,hsl(180deg,29%,66%) 4.5%,hsl(180deg,10%,60%) 5.2%,#0e152e 10%,#0e152e 12%),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(0,0,0,.1) 12%,rgba(0,0,0,.15) 20%,rgba(0,0,0,.25) 120%);background-blend-mode:soft-light,hue,hard-light;background-size:var(--imgsize),200% 700%,300% 100%,200% 100%;background-position:center,0 var(--posy),var(--posx) var(--posy),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .5 + .5)) contrast(2) saturate(.75)}.card[data-rarity=\"rare holo vstar\"][data-supertype=pokémon] .card__shine[data-v-17e73d72]:after{content:\"\";background-size:var(--imgsize),200% 400%,195% 100%,200% 100%;background-position:center,0 var(--posy),calc(var(--posx) * -1) calc(var(--posy) * -1),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .5 + .8)) contrast(1.5) saturate(1.75);mix-blend-mode:exclusion}.card[data-rarity=\"rare ultra\"][data-supertype=pokémon] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare ultra\"][data-supertype=pokémon] .card__shine[data-v-17e73d72]:after{--space:5%;--angle:133deg;--imgsize:50% 42%;background-image:url(~@/assets/img/illusion.png),repeating-linear-gradient(0deg,#ff7773 calc(var(--space) * 1),#ffed5f calc(var(--space) * 2),#a8ff5f calc(var(--space) * 3),#83fff7 calc(var(--space) * 4),#7894ff calc(var(--space) * 5),#d875ff calc(var(--space) * 6),#ff7773 calc(var(--space) * 7)),repeating-linear-gradient(var(--angle),#0e152e 0,hsl(180deg,10%,60%) 3.8%,hsl(180deg,29%,66%) 4.5%,hsl(180deg,10%,60%) 5.2%,#0e152e 10%,#0e152e 12%),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(0,0,0,.1) 12%,rgba(0,0,0,.15) 20%,rgba(0,0,0,.25) 120%);background-blend-mode:exclusion,hue,hard-light;background-size:var(--imgsize),200% 700%,300% 100%,200% 100%;background-position:center center,0 var(--posy),var(--posx) var(--posy),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .3 + .5)) contrast(2) saturate(1.5)}.card[data-rarity=\"rare ultra\"][data-supertype=pokémon] .card__shine[data-v-17e73d72]:after{content:\"\";background-size:var(--imgsize),200% 400%,195% 100%,200% 100%;background-position:center center,0 var(--posy),calc(var(--posx) * -1) calc(var(--posy) * -1),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .5 + .8)) contrast(1.6) saturate(1.4);mix-blend-mode:exclusion}.card[data-rarity=\"rare ultra\"][data-subtypes*=supporter] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare ultra\"][data-subtypes*=supporter] .card__shine[data-v-17e73d72]:after{--space:5%;--angle:133deg;--imgsize:25% 20%;background-image:url(~@/assets/img/trainerbg.png),repeating-linear-gradient(0deg,#ff7773 calc(var(--space) * 1),#ffed5f calc(var(--space) * 2),#a8ff5f calc(var(--space) * 3),#83fff7 calc(var(--space) * 4),#7894ff calc(var(--space) * 5),#d875ff calc(var(--space) * 6),#ff7773 calc(var(--space) * 7)),repeating-linear-gradient(var(--angle),#0e152e 0,hsl(180deg,10%,60%) 3.8%,hsl(180deg,29%,66%) 4.5%,hsl(180deg,10%,60%) 5.2%,#0e152e 10%,#0e152e 12%),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(0,0,0,.1) 12%,rgba(0,0,0,.15) 20%,rgba(0,0,0,.25) 120%);background-blend-mode:difference,hue,hard-light;background-size:var(--imgsize),200% 700%,300% 100%,200% 100%;background-position:center,0 var(--posy),var(--posx) var(--posy),var(--posx) var(--posy);filter:brightness(.75) contrast(2.5) saturate(.75)}.card[data-rarity=\"rare ultra\"][data-subtypes*=supporter] .card__shine[data-v-17e73d72]:after{content:\"\";background-size:var(--imgsize),200% 400%,195% 100%,200% 100%;background-position:center,0 var(--posy),calc(var(--posx) * -1) calc(var(--posy) * -1),var(--posx) var(--posy);filter:brightness(1.2) contrast(1) saturate(1.75);mix-blend-mode:exclusion}.card[data-rarity^=\"rare rainbow\"] .card__shine[data-v-17e73d72],.card[data-rarity^=\"rare rainbow\"] .card__shine[data-v-17e73d72]:after{--rainbowspace:9%;--overlayspace:12%;--angle:-20deg;--angle2:130deg;--imgsize:130% 180%;background-image:url(~@/assets/img/glitter.png),repeating-linear-gradient(var(--angle),#fd4741 calc(var(--rainbowspace) * 1),#fff397 calc(var(--rainbowspace) * 2),#5fffb4 calc(var(--rainbowspace) * 3),#83fff7 calc(var(--rainbowspace) * 4),#4bc6ff calc(var(--rainbowspace) * 5),#ff49f6 calc(var(--rainbowspace) * 6),#ff3831 calc(var(--rainbowspace) * 7)),repeating-linear-gradient(var(--angle2),rgba(89,46,80,.5) calc(var(--overlayspace) * 1),hsl(263deg,43%,76%) calc(var(--overlayspace) * 2),#df60ca calc(var(--overlayspace) * 3),hsl(180deg,57%,56%) calc(var(--overlayspace) * 4),rgba(14,21,46,.5) calc(var(--overlayspace) * 5),rgba(14,21,46,.5) calc(var(--overlayspace) * 6)),url(~@/assets/img/illusion2.png);background-size:20% 15%,500% 500%,1000% 1000%,var(--imgsize);background-position:center,calc(var(--posx) * 1.5) calc(var(--posy) * 1.5),calc(var(--posx) * 1.5) var(--posy),bottom left;background-blend-mode:color-burn,soft-light,normal;filter:brightness(calc(var(--hyp) * .25 + .66)) contrast(2.2) saturate(.9)}.card[data-rarity^=\"rare rainbow\"] .card__shine[data-v-17e73d72]:after{content:\"\";background-position:center,0 calc(var(--posy) * -1.75),calc(var(--posx) * -1.75) calc(var(--posy) * -1),bottom left;mix-blend-mode:exclusion}.card[data-rarity=\"rare rainbow alt\"] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare rainbow alt\"] .card__shine[data-v-17e73d72]:after{filter:brightness(calc(var(--hyp) * .25 + .66)) contrast(3) saturate(.7)}.card[data-rarity=\"rare secret\"] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare secret\"] .card__shine[data-v-17e73d72]:after{--angle:110deg;--imgsize:28% 23%;background-image:url(~@/assets/img/glitter.png),repeating-linear-gradient(var(--angle),rgba(89,46,80,.5) 0,hsl(39deg,37%,60%) 2.5%,#d8b75c 5%,hsl(39deg,37%,60%) 7.5%,rgba(14,21,46,.5) 10%,rgba(14,21,46,.5) 15%),url(~@/assets/img/metal.png);background-size:25% 25%,600% 100%,var(--imgsize);background-position:center,var(--posx) var(--posy),center;background-blend-mode:color-burn,darken;filter:brightness(calc(var(--hyp) * .4 + .7)) contrast(3) saturate(.66)}.card[data-rarity=\"rare secret\"] .card__shine[data-v-17e73d72]:after{content:\"\";background-image:url(~@/assets/img/glitter.png),repeating-linear-gradient(var(--angle),rgba(89,46,80,.5) 0,hsl(39deg,37%,60%) 2.5%,#d8b75c 5%,hsl(39deg,37%,60%) 7.5%,rgba(14,21,46,.5) 10%,rgba(14,21,46,.5) 15%);background-position:center,calc(var(--posx) * -1) calc(var(--posy) * -1),center;filter:brightness(calc(var(--hyp) * .3 + .7)) contrast(2.5) saturate(.66);mix-blend-mode:exclusion}.card[data-rarity*=radiant] .card__shine[data-v-17e73d72]{--barwidth:1.2%;--space:200px;clip-path:inset(2.8% 4% round 2.55%/1.5%);background-image:repeating-linear-gradient(0deg,hsl(180deg,70%,50%) calc(var(--space) * 1),hsl(110deg,80%,50%) calc(var(--space) * 2),hsl(80deg,90%,50%) calc(var(--space) * 3),hsl(50deg,90%,50%) calc(var(--space) * 4),hsl(80deg,90%,50%) calc(var(--space) * 5),hsl(110deg,80%,50%) calc(var(--space) * 6),hsl(180deg,70%,50%) calc(var(--space) * 7)),repeating-linear-gradient(45deg,hsl(0deg,0%,10%) 0,hsl(0deg,0%,10%) 1%,hsl(0deg,0%,10%) var(--barwidth),hsl(0deg,0%,20%) calc(var(--barwidth) + .01%),hsl(0deg,0%,20%) calc(var(--barwidth) * 2),hsl(0deg,0%,35%) calc(var(--barwidth) * 2 + .01%),hsl(0deg,0%,35%) calc(var(--barwidth) * 3),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 3 + .01%),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 4),hsl(0deg,0%,50%) calc(var(--barwidth) * 4 + .01%),hsl(0deg,0%,50%) calc(var(--barwidth) * 5),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 5 + .01%),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 6),hsl(0deg,0%,35%) calc(var(--barwidth) * 6 + .01%),hsl(0deg,0%,35%) calc(var(--barwidth) * 7),hsl(0deg,0%,20%) calc(var(--barwidth) * 7 + .01%),hsl(0deg,0%,20%) calc(var(--barwidth) * 8),hsl(0deg,0%,10%) calc(var(--barwidth) * 8 + .01%),hsl(0deg,0%,10%) calc(var(--barwidth) * 9),hsl(0deg,0%,0%) calc(var(--barwidth) * 9 + .01%),hsl(0deg,0%,0%) calc(var(--barwidth) * 10)),repeating-linear-gradient(-45deg,hsl(0deg,0%,10%) 0,hsl(0deg,0%,10%) 1%,hsl(0deg,0%,10%) var(--barwidth),hsl(0deg,0%,20%) calc(var(--barwidth) + .01%),hsl(0deg,0%,20%) calc(var(--barwidth) * 2),hsl(0deg,0%,35%) calc(var(--barwidth) * 2 + .01%),hsl(0deg,0%,35%) calc(var(--barwidth) * 3),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 3 + .01%),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 4),hsl(0deg,0%,50%) calc(var(--barwidth) * 4 + .01%),hsl(0deg,0%,50%) calc(var(--barwidth) * 5),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 5 + .01%),hsl(0deg,0%,42.5%) calc(var(--barwidth) * 6),hsl(0deg,0%,35%) calc(var(--barwidth) * 6 + .01%),hsl(0deg,0%,35%) calc(var(--barwidth) * 7),hsl(0deg,0%,20%) calc(var(--barwidth) * 7 + .01%),hsl(0deg,0%,20%) calc(var(--barwidth) * 8),hsl(0deg,0%,10%) calc(var(--barwidth) * 8 + .01%),hsl(0deg,0%,10%) calc(var(--barwidth) * 9),hsl(0deg,0%,0%) calc(var(--barwidth) * 9 + .01%),hsl(0deg,0%,0%) calc(var(--barwidth) * 10));background-size:400% 400%,210% 210%,210% 210%;background-position:calc((var(--posx) - 50%) * -2.5 + 50%) calc((var(--posy) - 50%) * -2.5 + 50%),calc((var(--posx) - 50%) * 1.5 + 50%) calc((var(--posy) - 50%) * 1.5 + 50%),calc((var(--posx) - 50%) * 1.5 + 50%) calc((var(--posy) - 50%) * 1.5 + 50%);background-blend-mode:exclusion,darken,color-dodge;filter:brightness(.95) contrast(4) saturate(.75);mix-blend-mode:color-dodge}.card[data-rarity*=radiant] .card__shine[data-v-17e73d72]:after{content:\"\";background-image:url(~@/assets/img/glitter.png),repeating-linear-gradient(55deg,#ffa19e calc(var(--space) * 1),#55b2ff calc(var(--space) * 2),#ffc792 calc(var(--space) * 3),#82ffd5 calc(var(--space) * 4),#fdaaf0 calc(var(--space) * 5),#94f1ff calc(var(--space) * 6),#ffa19e calc(var(--space) * 7));background-size:25% 25%,400% 100%;background-position:center,calc((var(--posx) - 50%) * -2.5 + 50%) calc((var(--posy) - 50%) * -2.5 + 50%);filter:brightness(1) contrast(1) saturate(0);mix-blend-mode:soft-light;background-blend-mode:multiply}.card[data-rarity*=radiant] .card__shine[data-v-17e73d72]:before{content:\"\";z-index:7;grid-area:1/1;background-image:radial-gradient(farthest-corner ellipse at calc((var(--mx)) * .5 + 25%) calc((var(--my)) * .5 + 25%),rgba(100,100,100,.5) 5%,rgba(50,50,50,.4) 15%,rgba(0,0,0,.6) 30%);background-image:radial-gradient(farthest-corner ellipse at calc((var(--mx)) * .5 + 25%) calc((var(--my)) * .5 + 25%),rgba(100,100,100,.8) 10%,rgba(50,50,50,.34) 20%,#000 50%);background-position:center;background-size:350% 350%;mix-blend-mode:multiply}.card[data-rarity=\"rare holo\"][data-gallery=true] .card__shine[data-v-17e73d72]{--space:5%;--angle:-22deg;--imgsize:200% 400%;clip-path:inset(2.8% 4% round 2.55%/1.5%);background-image:repeating-linear-gradient(var(--angle),rgba(174,102,202,.75) calc(var(--space) * 1),rgba(228,77,72,.75) calc(var(--space) * 2),rgba(216,197,55,.75) calc(var(--space) * 3),rgba(124,201,62,.75) calc(var(--space) * 4),rgba(80,177,170,.75) calc(var(--space) * 5),rgba(136,160,255,.75) calc(var(--space) * 6),rgba(176,105,204,.75) calc(var(--space) * 7));background-blend-mode:color-dodge;background-size:var(--imgsize);background-position:0 calc(var(--posy) * 1),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .3 + .6)) contrast(2.3) saturate(1.1)}.card[data-rarity=\"rare holo\"][data-gallery=true] .card__shine[data-v-17e73d72]:after{content:\"\";background-image:radial-gradient(farthest-corner ellipse at calc((var(--mx)) * .5 + 25%) calc((var(--my)) * .5 + 25%),#fff 5%,rgba(55,0,55,.6) 25%,#373737 90%);background-position:center;background-size:200% 200%;filter:brightness(calc(var(--hyp) * .2 + .4)) contrast(.85) saturate(1.1);mix-blend-mode:hard-light}.card[data-rarity=\"rare holo v\"][data-gallery=true] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare holo v\"][data-gallery=true] .card__shine[data-v-17e73d72]:after{--space:5%;--angle:133deg;--img:url(\"~@/assets/img/illusion.png\");--imgsize:60% 52%;background-image:var(--img),repeating-linear-gradient(0deg,#ff7773 calc(var(--space) * 1),#ffed5f calc(var(--space) * 2),#a8ff5f calc(var(--space) * 3),#83fff7 calc(var(--space) * 4),#7894ff calc(var(--space) * 5),#d875ff calc(var(--space) * 6),#ff7773 calc(var(--space) * 7)),repeating-linear-gradient(var(--angle),#0e152e 0,hsl(180deg,10%,60%) 3.8%,hsl(180deg,29%,66%) 4.5%,hsl(180deg,10%,60%) 5.2%,#0e152e 10%,#0e152e 12%),radial-gradient(farthest-corner circle at var(--mx) var(--my),rgba(0,0,0,.1) 12%,rgba(0,0,0,.15) 20%,rgba(0,0,0,.25) 120%);background-blend-mode:exclusion,hue,hard-light;background-size:var(--imgsize),200% 700%,300% 100%,200% 100%;background-position:center,0 var(--posy),var(--posx) var(--posy),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .4 + .5)) contrast(2.5) saturate(1)}.card[data-rarity=\"rare holo v\"][data-gallery=true] .card__shine[data-v-17e73d72]:after{content:\"\";background-size:var(--imgsize),200% 400%,195% 100%,200% 100%;background-position:center,0 var(--posy),calc(var(--posx) * -1) calc(var(--posy) * -1),var(--posx) var(--posy);filter:brightness(calc(var(--hyp) * .5 + .7)) contrast(2) saturate(1);mix-blend-mode:exclusion}.card[data-rarity=\"rare holo v\"][data-gallery=true][data-subtypes*=vmax] .card__shine[data-v-17e73d72],.card[data-rarity=\"rare holo v\"][data-gallery=true][data-subtypes*=vmax] .card__shine[data-v-17e73d72]:after{--img:url(\"~@/assets/img/stylish.png\");--imgsize:30% 26%}[data-v-17e73d72]:root{--mx:50%;--my:50%;--s:1;--o:0;--tx:0px;--ty:0px;--rx:0deg;--ry:0deg;--pos:50% 50%;--posx:50%;--posy:50%;--hyp:0}.card[data-v-17e73d72]{--radius:4.55%/3.5%;--back:#004177;--glow:#69d1e9;z-index:calc(var(--s) * 100);transform:translate3d(0,0,.1px);will-change:transform,visibility;transform-style:preserve-3d;width:300px}.card.interacting[data-v-17e73d72]{z-index:calc(var(--s) * 120)}.card.active .card__rotator[data-v-17e73d72],.card.active .card__translater[data-v-17e73d72]{touch-action:none}.card.active .card__rotator[data-v-17e73d72]{box-shadow:0 0 10px 0 var(--glow),0 0 10px 0 var(--glow),0 0 30px 0 var(--glow)}.card.active .card__rotator[data-v-17e73d72]:focus{box-shadow:0 10px 30px 3px #000}.card.loading .card__front[data-v-17e73d72]{opacity:0}.card.loading .card__back[data-v-17e73d72]{transform:rotateY(0)}.card__rotator[data-v-17e73d72],.card__translater[data-v-17e73d72]{display:grid;perspective:600px;transform-origin:center;-webkit-transform-origin:center;will-change:transform}.card__translater[data-v-17e73d72]{width:auto;position:relative;transform:translate3d(var(--tx),var(--ty),0) scale(var(--s));-webkit-transform:translate3d(var(--tx),var(--ty),0) scale(var(--s))}.card__rotator[data-v-17e73d72]{transform:rotateY(var(--rx)) rotateX(var(--ry));transform-style:preserve-3d;box-shadow:0 10px 20px -5px #000;border-radius:var(--radius);outline:0;transition:box-shadow .4s ease,outline .2s ease;appearance:none;border:none;background:top;padding:0}.card__rotator[data-v-17e73d72]:focus{box-shadow:0 0 10px 0 var(--glow),0 0 10px 0 var(--glow),0 0 30px 0 var(--glow)}.card__rotator *[data-v-17e73d72]{width:100%;display:grid;grid-area:1/1;border-radius:var(--radius);image-rendering:optimizeQuality;transform-style:preserve-3d}.card__rotator img[data-v-17e73d72]{outline:1px solid transparent;aspect-ratio:.716;height:auto}.card__rotator .card__back[data-v-17e73d72]{background-color:var(--back);transform:rotateY(180deg) translateZ(1px);backface-visibility:visible}.card__rotator .card__front[data-v-17e73d72]{opacity:1;transition:opacity .33s ease-out}",
    map: undefined,
    media: undefined
  });
};
/* scoped */
const __vue_scope_id__ = "data-v-17e73d72";
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, {}, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);
var component = __vue_component__;

// Import vue component
// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var entry_esm = /*#__PURE__*/(() => {
  // Assign InstallableComponent type
  const installable = component;
  // Attach install function executed by Vue.use()
  installable.install = Vue => {
    Vue.component('VuePokemonCardsCss', installable);
  };
  return installable;
})();
// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
