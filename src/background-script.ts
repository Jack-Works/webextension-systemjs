/// <reference path="../node_modules/web-ext-types/global/index.d.ts" />

import { Message } from './type'

const root = browser.runtime.getURL('')
const previousRequests = new Map<string, Promise<unknown>>()
browser.runtime.onMessage.addListener((message: object, sender: browser.runtime.MessageSender) => {
    if (!isOurMessage(message)) return undefined
    const [, ...url] = message.url.split(root)
    const { id } = sender.tab!
    const { frameId } = sender
    const key = `${id}-${frameId}`
    const previousReq = Promise.resolve(previousRequests.get(key))
    const p = previousReq
        .finally(() => browser.tabs.executeScript(id, { frameId, file: url.join(root) }))
        .then(
            () => {},
            (e) => [e.message, e.stack]
        )
    p.catch(console.error)
    previousRequests.set(key, p)
    return p
})
function isOurMessage(o: object): o is Message {
    // @ts-ignore
    const parentURL = typeof o.parentURL
    return (
        typeof o === 'object' &&
        // @ts-ignore
        o?.key === 'system-js-loader' &&
        // @ts-ignore
        typeof o.url === 'string' &&
        (parentURL === 'string' || parentURL === 'undefined')
    )
}
