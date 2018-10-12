import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';

interface HtmlSlideProps {
    slide: Slide,
    slideIn?: Slide,
    slideOut?: Slide,
    safeMode: boolean,
    action: "transform-out" | "transform-in" | "show" | "transform-in-out",
    transformReadyCallback?: () => void,
    transformType?: string
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    private container = React.createRef<HTMLDivElement>();
    private containerOut = React.createRef<HTMLDivElement>();
    private containerIn = React.createRef<HTMLDivElement>();

    public async componentDidMount() {
        switch(this.props.action) {
            case "transform-out":
                await this.show(this.container.current, this.props.slide);
                await this.transformOut(this.container.current);
                this.props.transformReadyCallback && this.props.transformReadyCallback();
                break;

            case "transform-in":
                this.transformIn(this.container.current, this.props.slide);
                break;

            default:
                this.show(this.container.current, this.props.slide);
        }
    }

    public async componentDidUpdate() {
        switch(this.props.action) {
            case "transform-out":
                await this.transformOut(this.container.current);
                this.props.transformReadyCallback && this.props.transformReadyCallback();
                break;

            case "transform-in":
                this.transformIn(this.container.current, this.props.slide);
                break;

            default:
                this.show(this.container.current, this.props.slide);
        }
    }

    private addClass(className, container: any) {
        $(container).addClass(className);
    }

    private removeClass(className, container: any) {
        $(container).removeClass(className);
    }

    public transformOut(container: any) {
        return new Promise(resolve => {
            this.addClass(this.createTransformClassName(), container);
            setTimeout(() => {
                this.clear(container);
                this.removeClass(this.createTransformClassName(), container);
                resolve();
            }, 400)
        })
    }

    public transformIn(container: any, slide: Slide) {
        return new Promise(async resolve => {
            this.addClass(this.createTransformInitClassName(), container);
            await this.show(container, slide);
            this.addClass(this.createTransformClassName(), container);
            this.removeClass(this.createTransformInitClassName(), container);
            setTimeout(() => {
                this.removeClass(this.createTransformClassName(), container);
                resolve();
            }, 400)
        })
    }

    private clear(container: any) {
        $(container).empty();
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

    private createTransformClassName = () => {
        const inOut = this.props.action === "transform-out" ? "Out" : "In";
        const className = `move${inOut}${this.props.transformType}`;
        console.log(className);
        return className;
    }

    private createTransformInitClassName = () => {
        return `${this.createTransformClassName}Init`;
    }

    private transformInOut() {

    }

    public render() {
        if(this.props.action === "transform-in-out") {
            return (
                <div>
                    <div id={`${this.props.slide.name}-in`} ref={this.containerIn} className="html-slide"></div>
                    <div id={`${this.props.slide.name}-out`} ref={this.containerOut} className="html-slide"></div>
                </div>
            );
        }

        return (
            <div id={this.props.slide.name} ref={this.container} className="html-slide"></div>
        );
    }
}