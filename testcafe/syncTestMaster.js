import {Selector} from 'testcafe';
import {endpoint} from "../src/zer0slides/sync/endpoint.ts";

const WebSocket = require("ws");
const randomstring = require("randomstring");
const syncId = randomstring.generate(7);

fixture `sync test (master)`
    .page `http://localhost:9000/smoketest/start.html?syncId=${syncId}#slide=1&step=1`;

test("get correct lastCommand after registering", async t => {
    await t
        .expect(Selector(".slideno.counter").innerText).eql("1")
        .expect(Selector(".protip-content").withText("b").with({visibilityCheck: true}).exists).ok()

    console.log(`syncId: ${syncId}`);

    const command = await new Promise(resolve => {
        const ws = new WebSocket(endpoint.dev);

        ws.on("open", () => {
            ws.send(JSON.stringify({action: "register", syncId}))
        })

        ws.on("message", (message) => {
            console.log(message);
            const command = JSON.parse(message);
            if(command.slideNo > -1) {
                resolve(command);
            }
        })
    })

    await t
        .expect(command).eql({slideNo: 1, stepNo: 1, type: "command"});
})

