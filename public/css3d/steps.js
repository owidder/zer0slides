(function () {
    function animeStep(animationObject, _deAnimationObject) {
        const deAnimationObject = _deAnimationObject;
        return _0.step(
            function () {
                anime(animationObject);
            },
            function () {
                anime(deAnimationObject);
            }
        )
    }

    function createTooltipsSteps() {
        const steps = {};

        steps.back = _0.tooltipStep(".back", "class='back'<br>height: 100px;<br>width: 100px;", undefined, undefined, true);

        return steps;
    }

    function createAnimeSteps() {
        const steps = {};

        steps.back = animeStep({
            targets: "#__0__ .back",
            translateY: window.innerHeight/2,
            duration: 2000,
        }, {
            targets: "#__0__ .back",
            translateY: -window.innerHeight/2,
            duration: 2000,
        });

        return  steps;
    }

    window.createTooltipSteps = createTooltipsSteps;
    window.createAnimeSteps = createAnimeSteps;
})()
