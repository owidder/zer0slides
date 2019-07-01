import {Selector} from 'testcafe';

fixture `url param test`
    .page `http://localhost:9000/smoketest/start.html#slide=1&step=1`;

test("slide with index 1 and step with index 1 is shown", async t => {
    await t
        .expect(Selector(".slideno.counter").innerText).eql("1")
        .expect(Selector(".protip-content").withText("b").with({visibilityCheck: true}).exists).ok()
})