import { Selector } from 'testcafe';

fixture `Smoketest`
    .page `http://localhost:9000/smoketest/start.html`;

test("Show bubbles", async t => {
    await t
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("One").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("Two").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("Three").with({visibilityCheck: true}).exists).ok()
})

test("Next slide", async t => {
    await t
        .click(".controlButton.right")
        .expect(Selector(".slideno.counter").innerText).eql("1");
});
