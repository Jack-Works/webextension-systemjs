/// <reference path="../node_modules/web-ext-types/global/index.d.ts" />
import "systemjs/dist/s.js"
import { Message } from "./type"
// https://github.com/systemjs/systemjs/blob/master/docs/hooks.md
System.constructor.prototype.createScript = function () {
    throw new Error("Unreachable case")
}
// System.constructor.prototype.createContext
// System.constructor.prototype.prepareImport
System.constructor.prototype.instantiate = function (
    url: string,
    parentURL: string
) {
    return browser.runtime
        .sendMessage<Message>({ key: "system-js-loader", url, parentURL })
        .then(() => this.getRegister())
}
const root = browser.runtime.getURL("/")
// System.constructor.prototype.getRegister
const origResolve: (
    this: typeof System,
    url: string,
    parentURL: string
) => string = System.constructor.prototype.resolve
System.constructor.prototype.resolve = ((url, parentURL) =>
    origResolve.call(System, url, parentURL ?? root)) as typeof origResolve
