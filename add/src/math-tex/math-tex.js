/*
Typesets math written in (La)TeX, using [MathJax](http://mathjax.org).

##### Example

    <math-tex>c = \sqrt{a^2 + b^2}</math-tex>

##### Example

    <math-tex mode="display">\sum_{k=1}^n k = \frac{n (n + 1)}{2}</math-tex>

@element math-tex
@version 0.3.2
@homepage http://github.com/janmarthedal/math-tex/
*/
(function() {
    'use strict';

    var TAG_NAME = 'math-tex',
        HANDLER_TAG_NAME = 'mathjax-loader',
        mutation_config = {childList: true, characterData: true, attributes: true, subtree: true},
        handler

    function check_handler() {
        if (handler) return;
        handler = document.querySelector(HANDLER_TAG_NAME) || document.createElement(HANDLER_TAG_NAME);
        if (!handler || typeof handler.typeset !== 'function') {
            console.warn('no %s element defined; %s element will not work', HANDLER_TAG_NAME, TAG_NAME);
            handler = undefined;
        } else if (!document.contains(handler))
            document.head.appendChild(handler);
    }


    class MathTex extends HTMLElement {
        
        constructor(){
            super()
            check_handler();
            var script = document.createElement('script');
            this.attachShadow({mode: 'open'}).appendChild(script);
            this._private = {jax: script};
        }

        connectedCallback(){
            var elem = this;
            if (this.textContent.trim())
                this.update();
            this._private.observer = new MutationObserver(function () {
                elem.update();
            });
            this._private.observer.observe(this, mutation_config);
        }

        disconnectedCallback(){
            if (this._private) {
                this._private.observer.disconnect();
                delete this._private;
            }
        }

        update(){
            var script = this._private.jax;
            script.type = this.getAttribute('display') === 'block' ? 'math/tex; mode=display' : 'math/tex';
            script.text = this.textContent;
            if (handler)
                handler.typeset(script);
        }
    }

    customElements.define('math-tex', MathTex)
})();
