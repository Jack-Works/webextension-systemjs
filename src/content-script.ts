/// <reference path="../node_modules/web-ext-types/global/index.d.ts" />
import 'systemjs/dist/s.js'
import type { Message } from './type'
// https://github.com/systemjs/systemjs/blob/master/docs/hooks.md
System.constructor.prototype.createScript = function () {
    throw new Error('Unreachable case')
}
// System.constructor.prototype.createContext
// System.constructor.prototype.prepareImport
let previousReq: Promise<void> = Promise.resolve()
System.constructor.prototype.instantiate = function (url: string, parentURL: string) {
    return (previousReq = previousReq.finally(() =>
        browser.runtime
            .sendMessage<Message>({ key: 'system-js-loader', url, parentURL })
            .then((e: undefined | [string, string]) => {
                if (e) {
                    const E = new Error(e[0])
                    E.stack = e[1]
                    throw E
                }
                return this.getRegister()
            })
    ))
}
const root = browser.runtime.getURL('/')
// System.constructor.prototype.getRegister
const origResolve: (this: typeof System, url: string, parentURL: string) => string =
    System.constructor.prototype.resolve
System.constructor.prototype.resolve = ((url, parentURL) =>
    origResolve.call(System, url, parentURL ?? root)) as typeof origResolve
