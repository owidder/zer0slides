import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';

interface HtmlSlideProps {
    slide?: Slide,
    slideIn?: Slide,
    slideOut?: Slide,
    safeMode: boolean,
    action: "transform-out" | "transform-in" | "show" | "transform-in-out",
    transformReadyCallback?: () => void,
    transformType?: string,
    transformOutType?: string,
    transformInType?: string,
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    private container = React.createRef<HTMLDivElement>();
    private containerOut = React.createRef<HTMLDivElement>();
    private containerIn = React.createRef<HTMLDivElement>();
    private containersToClear = [];

    public async componentDidMount() {
        this.mountedOrUpdated(true);
    }

    public async componentDidUpdate() {
        this.mountedOrUpdated();
    }

    private clearContainers = () => {
        this.containersToClear.forEach(container => {
            this.clear(container);
        })
        this.containersToClear.length = 0;
    }

    private async mountedOrUpdated(withShow = false) {
        this.clearContainers();
        const {transformType, transformInType, transformOutType, slide, slideIn, slideOut, transformReadyCallback} = this.props;
        switch(this.props.action) {
            case "transform-out":
                withShow && await this.show(this.container.current, slide);
                await this.transformOut(this.container.current, transformType);
                transformReadyCallback && transformReadyCallback();
                break;

            case "transform-in":
                await this.transformIn(this.container.current, this.props.slide, transformType);
                transformReadyCallback && transformReadyCallback();
                break;

            case "transform-in-out":
                this.transformInOut(transformInType, transformOutType);
                break;

            default:
                this.show(this.container.current, slide);
        }
    }

    private addClass(className, container: any) {
        $(container).addClass(className);
    }

    private removeClass(className, container: any) {
        $(container).removeClass(className);
    }

    private transformOut(container: any, transformType: string | undefined) {
        const _transformType = transformType || "Z";
        return new Promise(resolve => {
            this.addClass(this.createTransformClassName(_transformType, "Out"), container);
            setTimeout(() => {
                this.clear(container);
                this.removeClass(this.createTransformClassName(_transformType, "Out"), container);
                resolve();
            }, 400)
        })
    }

    private transformIn(container: any, slide: Slide, transformType: string | undefined) {
        const _transformType = transformType || "Left";
        return new Promise(async resolve => {
            this.addClass(this.createTransformInitClassName(_transformType, "In"), container);
            await this.show(container, slide);
            this.addClass(this.createTransformClassName(_transformType, "In"), container);
            this.removeClass(this.createTransformInitClassName(_transformType, "In"), container);
            setTimeout(() => {
                this.removeClass(this.createTransformClassName(_transformType, "In"), container);
                resolve();
            }, 400)
        })
    }

    private clear(container: any) {
        container && $(container).empty();
    }

    private show(container: any, slide: Slide) {
        return new Promise(resolve => {
            resetSlideReadyPromise(slide.name);

            this.clear(container);
            $(container).load(slide.getPathToHtml());

            slideReadyPromise(slide.name).then(() => {
                resolve();
                setTimeout(() => {
                    showHideStepCtr(slide.steps.length > 0);
                    slide.performToCurrentStep();
                }, this.props.safeMode ? 3000 : 100)
            })
        })
    }

    private createTransformClassName = (transformType: string, inOut: "In" | "Out") => {
        const className = `move${inOut}${transformType}`;
        return className;
    }

    private createTransformInitClassName = (transformType: string, inOut: "In" | "Out") => {
        return `${this.createTransformClassName(transformType, inOut)}Init`;
    }

    private async transformInOut(transformInType: string | undefined, transformOutType: string | undefined) {
        const {slideIn, slideOut, transformReadyCallback} = this.props;
        if(slideIn && slideOut) {
            await this.show(this.containerOut.current, slideOut);
            await Promise.all([
                this.transformIn(this.containerIn.current, slideIn, transformInType),
                this.transformOut(this.containerOut.current, transformOutType)
            ]);
            this.clear(this.containerIn.current);
            this.clear(this.containerOut.current);
            transformReadyCallback && transformReadyCallback();
        }
        else {
            throw new Error("props 'slideIn' or 'slideOut' not set");
        }
    }

    public render() {
        if(this.props.action === "transform-in-out") {
            this.container && this.containersToClear.push(this.container.current);
            return (
                <div id={`${this.props.slideIn.name}---${this.props.slideOut.name}`}>
                    <div id={this.props.slideIn.name} ref={this.containerIn} className="html-slide in"></div>
                    <div id={this.props.slideOut.name} ref={this.containerOut} className="html-slide out"></div>
                </div>
            );
        }

        this.containerOut && this.containersToClear.push(this.containerOut.current);
        this.containerIn && this.containersToClear.push(this.containerIn.current);
        return (
            <div id={this.props.slide.name} ref={this.container} className="html-slide inout"></div>
        );
    }
}