import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';

interface HtmlSlideProps {
    slide: Slide,
    safeMode: boolean,
    action: "transform-out" | "transform-in" | "show",
    transformReadyCallback?: () => void,
    transformType?: string
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    private container = React.createRef<HTMLDivElement>();

    public async componentDidMount() {
        switch(this.props.action) {
            case "transform-out":
                await this.show();
                this.transformOut();
                break;

            case "transform-in":
                this.transformIn();
                break;

            default:
                this.show();
        }
    }

    private addClass(className) {
        $(this.container.current as any).addClass(className);
    }

    private removeClass(className) {
        $(this.container.current as any).removeClass(className);
    }

    public transformOut() {
        this.addClass(this.transformClassName());
        setTimeout(() => {
            this.clear();
            this.removeClass(this.transformClassName());
            if(this.props.transformReadyCallback) {
                this.props.transformReadyCallback();
            }
        }, 400)
    }

    private transformClassName = () => {
        const inOut = this.props.action === "transform-out" ? "Out" : "In";
        const className = `move${inOut}${this.props.transformType}`;
        console.log(className);
        return className;
    }

    private transformInitClassName = () => {
        return `${this.transformClassName}Init`;
    }

    public async transformIn() {
        this.addClass(this.transformInitClassName());
        await this.show();
        this.addClass(this.transformClassName());
        this.removeClass(this.transformInitClassName());
        setTimeout(() => {
            this.removeClass(this.transformClassName());
        }, 400)
    }

    public componentDidUpdate() {
        switch(this.props.action) {
            case "transform-out":
                this.transformOut();
                break;

            case "transform-in":
                this.transformIn();
                break;

            default:
                this.show();
        }
    }

    private clear() {
        $(this.container.current as any).empty();
    }

    private show() {
        return new Promise(resolve => {
            const {slide} = this.props;

            resetSlideReadyPromise(slide.name);

            this.clear();
            $(this.container.current as any).load(slide.getPathToHtml());

            slideReadyPromise(slide.name).then(() => {
                resolve();
                setTimeout(() => {
                    showHideStepCtr(slide.steps.length > 0);
                    slide.performToCurrentStep();
                }, this.props.safeMode ? 3000 : 100)
            })
        })
    }

    public render() {
        return (
            <div id={this.props.slide.name} ref={this.container} className="html-slide"></div>
        );
    }
}