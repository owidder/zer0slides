import {Selector, ClientFunction} from 'testcafe';

fixture `Smoketest`
    .page `http://localhost:9000/smoketest/start.html`;

const getHash = ClientFunction(() => window.location.hash);

test("Show bubbles and change slides", async t => {
    await t
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("One").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("Two").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("Three").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.right")
        .expect(Selector(".slideno.counter").innerText).eql("1")
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("a").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("b").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.down")
        .expect(Selector(".protip-content").withText("c").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.left")
        .expect(Selector(".protip-content").withText("Three").with({visibilityCheck: true}).exists).ok()
        .click(".controlButton.right")
        .expect(Selector(".protip-content").withText("c").with({visibilityCheck: true}).exists).ok()
})

test("Navidate via content slide", async t => {
    await t
        .click(".controlButton.left")
        .click(".controlButton.down")
        .click(".controlButton.down")
        .pressKey("enter")
        .expect(getHash()).contains("slide=1")
})