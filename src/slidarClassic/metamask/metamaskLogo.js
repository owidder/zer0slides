import {steps} from '../../zer0slides/steps/steps';
import {Step} from '../../zer0slides/core/Step';

const {createReverseStep} = steps;

const ModelViewer = require('metamask-logo')

export const create = (selector) => {
// To render with fixed dimensions:
    const viewer = ModelViewer({

        // Dictates whether width & height are px or multiplied
        pxNotRatio: true,
        width: 500,
        height: 400,
        // pxNotRatio: false,
        // width: 0.9,
        // height: 0.9,

        // To make the face follow the mouse.
        followMouse: false,

        // head should slowly drift (overrides lookAt)
        slowDrift: false,

    })

// add viewer to DOM
    const container = document.querySelector(selector)
    container.appendChild(viewer.container)

// look at something on the page
    viewer.lookAt({
        x: 100,
        y: 100,
    })

    return viewer
}

export const start = (viewer) => {
// enable mouse follow
    viewer.setFollowMouse(true)
}

export const startStepWithReverse = (viewer) => {
    const step = new Step(() => start(viewer), () => stop(viewer));

    return createReverseStep(step);
}

export const stop = (viewer) =>  {
// deallocate nicely
    viewer.stopAnimation();
    viewer.setFollowMouse(false);
}

export const metamaskLogo =  {
    create,
    start,
    stop,
    startStepWithReverse,
}
