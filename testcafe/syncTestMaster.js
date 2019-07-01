import {Selector} from 'testcafe';
import {endpoint} from "../src/zer0slides/sync/endpoint.ts";

const WebSocket = require("ws");
const randomstring = require("randomstring");
const syncId = randomstring.generate(7);

fixture `sync test`
    .page `http://localhost:9000/smoketest/start.html?syncId=${syncId}`;

test("move to correct slideNo and stepNo", async t => {
    await t
        .expect(Selector(".slideno.counter").innerText).eql("0")

    console.log(`syncId: ${syncId}`);

    await new Promise(resolve => {
        const ws = new WebSocket(endpoint.dev);

        ws.on("open", () => {
            ws.send(JSON.stringify({action: "register", syncId}))
        })

        ws.on("message", () => {
            ws.send(JSON.stringify({action: "sendCommand", command: {slideNo: 1, stepNo: 1}}))
            resolve();
        })
    })

    await t
        .expect(Selector(".slideno.counter").innerText).eql("1")
        .expect(Selector(".protip-content").withText("b").with({visibilityCheck: true}).exists).ok()
})

