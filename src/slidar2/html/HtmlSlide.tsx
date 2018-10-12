import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';

interface HtmlSlideProps {
    slide: Slide,
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

    private addClass(className, container: any) {
        $(container).addClass(className);
    }

    private removeClass(className, container: any) {
        $(container).removeClass(className);
    }

    public transformOut(container?: any) {
        const _container = container ? container : this.container.current;

        this.addClass(this.transformClassName(), _container);
        setTimeout(() => {
            this.clear(_container);
            this.removeClass(this.transformClassName(), _container);
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

    public async transformIn(container?: any) {
        const _container = container ? container : this.container.current;

        this.addClass(this.transformInitClassName(), _container);
        await this.show(_container);
        this.addClass(this.transformClassName(), _container);
        this.removeClass(this.transformInitClassName(), _container);
        setTimeout(() => {
            this.removeClass(this.transformClassName(), _container);
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

    private clear(container?: any) {
        $(container ? container : this.container.current).empty();
    }

    private show(container?: any) {
        const _container = container ? container : this.container.current;

        return new Promise(resolve => {
            const {slide} = this.props;

            resetSlideReadyPromise(slide.name);

            this.clear(_container);
            $(_container).load(slide.getPathToHtml());

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