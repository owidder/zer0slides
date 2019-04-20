(function () {
    function timeoutPromise() {
        return new Promise(function (resolve) {
            setTimeout(resolve, 10);
        })
    }

    function animeStep(animationObject, _deAnimationObject) {
        const deAnimationObject = _deAnimationObject;
        var animation;
        return _0.step(
            function () {
                animation = anime(animationObject)
            },
            function () {
                animation = anime(deAnimationObject)
            },
            function () {
                animation.seek(animationObject.duration);
                return timeoutPromise()
            },
            function () {
                animation.seek(deAnimationObject.duration);
                return timeoutPromise()
            },
        )
    }

    function createClassTooltip(className) {
        return "class='" + className + "'<br>height: 100px;<br>width: 100px;"
    }

    function createTooltipStep(className) {
        return _0.tooltipStep("." + className, createClassTooltip(className), undefined, undefined, true)
    }

    function createAnimationObject(selector, properties) {
        const animationObject = {
            targets: _0.q(selector),
            duration: 2000
        }

        return Object.assign(animationObject, properties)
    }

    function createTooltipsSteps() {
        const steps = {};

        steps.back = createTooltipStep("back");
        steps.top = _0.combine(_0.removeTooltipStep(".back", true), createTooltipStep("top"));

        return steps;
    }

    function createAnimeSteps() {
        const steps = {};

        steps.back1 = animeStep(
            createAnimationObject(".back", {translateY: window.innerHeight/2}),
            createAnimationObject(".back", {translateY: -window.innerHeight/2})
        );
        steps.back2 = animeStep(
            createAnimationObject(".back", {rotateY: "-180deg", translateZ: "2.5em",}),
            createAnimationObject(".back", {rotateY: "0deg", translateZ: "0em"})
        );

        steps.top1 = animeStep(
            createAnimationObject(".top", {translateY: window.innerHeight/2}),
            createAnimationObject(".top", {translateY: -window.innerHeight/2})
        );
        steps.top2 = animeStep(
            createAnimationObject(".top", {rotateX: "90deg", translateZ: "2.5em",}),
            createAnimationObject(".top", {rotateX: "0deg", translateZ: "0em"})
        );

        return  steps;
    }

    window.createTooltipSteps = createTooltipsSteps;
    window.createAnimeSteps = createAnimeSteps;
})()
