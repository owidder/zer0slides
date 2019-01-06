import {steps} from '../steps/steps';
import {Step} from '../core/Step';
import {q} from '../selector/selector';

const {createReverseStep} = steps;

// from: https://github.com/MetaMask/metamask-logo

const ModelViewer = require('metamask-logo')

interface Viewer {
    stopAnimation: () => void;
    setFollowMouse: (boolean) => void;
}

export const create = (selector: string): Viewer => {
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
    const container = document.querySelector(q(selector))
    container.appendChild(viewer.container)

// look at something on the page
    viewer.lookAt({
        x: 100,
        y: 100,
    })

    return viewer
}

export const start = (viewer: Viewer) => {
// enable mouse follow
    viewer.setFollowMouse(true)
}

export const startStepWithReverse = (viewer: Viewer) => {
    const step = new Step(() => start(viewer), () => stop(viewer));

    return createReverseStep(step);
}

export const stop = (viewer: Viewer) =>  {
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
