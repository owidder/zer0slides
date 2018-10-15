import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';
import {Transformation} from './transformations/Transformation';

import "./transformations/transformations.less";

interface HtmlSlideProps {
    slide: Slide,
    slideOut?: Slide,
    safeMode: boolean,
    action: "transform-out" | "transform-in" | "show" | "transform-in-out" | "refresh",
    transformReadyCallback?: () => void,
    transformType?: Transformation,
    transformOutType?: Transformation,
}

type OneOrTwo = "1" | "2";

const SLIDECONTAINER_ID = "slidecontainer";
const SLIDE_CLASS = "_slide"

const selector = (container: OneOrTwo) => {
    return `#${SLIDECONTAINER_ID} ._${container}`;
}

const slideSelector = (container: OneOrTwo, slide: Slide) => {
    return `${selector(container)} .${slide.name}`;
}

const createTransformClassName = (transformType: Transformation, inOut: "In" | "Out") => {
    const className = `move${inOut}${transformType}`;
    return className;
}

const createTransformInitClassName = (transformType: Transformation, inOut: "In" | "Out") => {
    return `${createTransformClassName(transformType, inOut)}Init`;
}

const addClass = (container: OneOrTwo, className: string) => {
    $(selector(container)).addClass(className);
}

const removeClass = (container: OneOrTwo, className: string) => {
    $(selector(container)).removeClass(className);
}

const checkIfContentAlreadyExists = (container: OneOrTwo, slide: Slide) => {
    return $(slideSelector(container, slide)).length > 0;
}

const removeSlide = (container: OneOrTwo, slide: Slide) => {
    $(slideSelector(container, slide)).remove();
}

const clean = (container: OneOrTwo) => {
    $(`${selector(container)} .${SLIDE_CLASS}`).remove();
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    private currentContainer: OneOrTwo = "1";

    private otherContainer(): OneOrTwo {
        if(this.currentContainer === "1") {
            return "2";
        }

        return "1";
    }

    private switchContainers() {
        this.currentContainer = this.otherContainer();
    }

    public async componentDidMount() {
        this.mountedOrUpdated();
    }

    public async componentDidUpdate() {
        this.mountedOrUpdated();
    }

    private async mountedOrUpdated() {
        const {transformType, transformOutType, slide, transformReadyCallback} = this.props;
        switch(this.props.action) {
            case "transform-out":
                await this.transformOut(this.currentContainer, slide, transformType);
                transformReadyCallback && transformReadyCallback();
                break;

            case "transform-in":
                await this.transformIn(this.currentContainer, slide, transformType);
                transformReadyCallback && transformReadyCallback();
                break;

            case "transform-in-out":
                this.transformInOut(transformType, transformOutType);
                break;

            case "refresh":
                clean(this.currentContainer);
                this.show(this.currentContainer, slide);
                break;

            default:
                this.show(this.currentContainer, slide);
        }
    }

    private transformOut(container: OneOrTwo, slide: Slide, transformType: Transformation | undefined) {
        const _transformType = transformType || "Z";
        return new Promise(async resolve => {
            await this.show(container, slide);
            addClass(container, createTransformClassName(_transformType, "Out"));
            setTimeout(() => {
                removeSlide(container, slide);
                removeClass(container, createTransformClassName(_transformType, "Out"));
                resolve();
            }, 400)
        })
    }

    private transformIn(container: OneOrTwo, slide: Slide, transformType: Transformation| undefined) {
        const _transformType = transformType || "Left";
        return new Promise(async resolve => {
            addClass(container, createTransformInitClassName(_transformType, "In"));
            await this.show(container, slide);
            addClass(container, createTransformClassName(_transformType, "In"));
            removeClass(container, createTransformInitClassName(_transformType, "In"));
            setTimeout(() => {
                removeClass(container, createTransformClassName(_transformType, "In"));
                resolve();
            }, 400)
        })
    }

    private show(container: OneOrTwo, slide: Slide) {
        if(checkIfContentAlreadyExists(container, slide)) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            resetSlideReadyPromise(slide.name);

            clean(container);
            $(selector(container)).append(`<div id="${slide.name}" class="${slide.name} ${SLIDE_CLASS}"></div>`);
            $(`${selector(container)} .${slide.name}`).load(slide.getPathToHtml());

            slideReadyPromise(slide.name).then(() => {
                resolve();
                setTimeout(() => {
                    showHideStepCtr(slide.steps.length > 0);
                    slide.performToCurrentStep();
                }, this.props.safeMode ? 3000 : 100)
            })
        })
    }

    private transformInOut(transformInType: Transformation | undefined, transformOutType: Transformation | undefined) {
        const {slide, slideOut, transformReadyCallback} = this.props;
        Promise.all([
            this.transformIn(this.otherContainer(), slide, transformInType),
            this.transformOut(this.currentContainer, slideOut, transformOutType)
        ]).then(() => {
            transformReadyCallback && transformReadyCallback();
        })
        this.switchContainers();
    }

    public render() {
        const {slide, slideOut} = this.props;
        const className = `__${slide.name}` + (slideOut ? `__${slideOut.name}` : "");
        return (
            <div id={SLIDECONTAINER_ID} className={className}>
                <div className="html-slide _1"></div>
                <div className="html-slide _2"></div>
            </div>
        );
    }
}