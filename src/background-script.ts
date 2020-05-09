/// <reference path="../node_modules/web-ext-types/global/index.d.ts" />

import { Message } from "./type"

const root = browser.runtime.getURL("")
browser.runtime.onMessage.addListener(
    (message: object, sender: browser.runtime.MessageSender) => {
        if (!isOurMessage(message)) return undefined
        const [, ...url] = message.url.split(root)
        return browser.tabs
            .executeScript(sender.tab!.id, {
                frameId: sender.frameId,
                file: url.join(root),
            })
            .then(() => {})
    }
)
function isOurMessage(o: object): o is Message {
    // @ts-ignore
    const parentURL = typeof o.parentURL
    return (
        typeof o === "object" &&
        // @ts-ignore
        o?.key === "system-js-loader" &&
        // @ts-ignore
        typeof o.url === "string" &&
        (parentURL === "string" || parentURL === "undefined")
    )
}
