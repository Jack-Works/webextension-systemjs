# Use SystemJS in content script of Web Extension

## Motivation

[To use ES Module in Web Extension](https://jack-works.github.io/bayesian-conspiracy/#/./experiments/2019/sept-web-ext-with-esm.md).

But it is blocked by [Firefox Bug 1536094: Dynamic module import doesn't work in webextension content scripts](https://bugzilla.mozilla.org/show_bug.cgi?id=1536094)

## Perquisite

If not running on the Firefox, you have to include a polyfill: [webextension-polyfill](https://github.com/DimensionDev/webextension-polyfill).

-   Build all your code into `ESModule` format and `SystemJS` format.

## Usage

1. Install `@magic-works/webextension-systemjs`
2. Load `@magic-works/webextension-systemjs/background-script.js` in the background script
3. Load `@magic-works/webextension-systemjs/content-script.js` **before** your code.
4. Transpile all your code into SystemJS format.
5. Run you content script by

```js
// Chrome support native ES Module in content script
import(browser.runtime.getURL("./es/content-script.js")).catch(() => {
    // Firefox fallback to SystemJS
    System.import("./system/content-script.js")
})
```

## An example repo

https://github.com/Jack-Works/web-extension-esmodule-test/tree/master/mixed
