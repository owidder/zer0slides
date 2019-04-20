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
        steps.left = _0.combine(_0.removeTooltipStep(".top", true), createTooltipStep("left"));
        steps.right = _0.combine(_0.removeTooltipStep(".left", true), createTooltipStep("right"));
        steps.bottom = _0.combine(_0.removeTooltipStep(".right", true), createTooltipStep("bottom"));
        steps.front = _0.combine(_0.removeTooltipStep(".bottom", true), createTooltipStep("front"));

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

        steps.left1 = animeStep(
            createAnimationObject(".left", {translateY: window.innerHeight/2}),
            createAnimationObject(".left", {translateY: -window.innerHeight/2})
        );
        steps.left2 = animeStep(
            createAnimationObject(".left", {rotateY: "-90deg", translateZ: "2.5em",}),
            createAnimationObject(".left", {rotateY: "0deg", translateZ: "0em"})
        );

        steps.right1 = animeStep(
            createAnimationObject(".right", {translateY: window.innerHeight/2}),
            createAnimationObject(".right", {translateY: -window.innerHeight/2})
        );
        steps.right2 = animeStep(
            createAnimationObject(".right", {rotateY: "90deg", translateZ: "2.5em",}),
            createAnimationObject(".right", {rotateY: "0deg", translateZ: "0em"})
        );

        steps.bottom1 = animeStep(
            createAnimationObject(".bottom", {translateY: window.innerHeight/2}),
            createAnimationObject(".bottom", {translateY: -window.innerHeight/2})
        );
        steps.bottom2 = animeStep(
            createAnimationObject(".bottom", {rotateX: "-90deg", translateZ: "2.5em",}),
            createAnimationObject(".bottom", {rotateX: "0deg", translateZ: "0em"})
        );

        steps.front1 = animeStep(
            createAnimationObject(".front", {translateY: window.innerHeight/2}),
            createAnimationObject(".front", {translateY: -window.innerHeight/2})
        );
        steps.front2 = animeStep(
            createAnimationObject(".front", {translateZ: "2.5em",}),
            createAnimationObject(".front", {translateZ: "0em"})
        );

        return  steps;
    }

    window.createTooltipSteps = createTooltipsSteps;
    window.createAnimeSteps = createAnimeSteps;
})()
