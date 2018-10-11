import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';

interface HtmlSlideProps {
    slide: Slide,
    safeMode: boolean,
    action: "transform-out" | "transform-in" | "show",
    transformReadyCallback?: () => void
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
                break;

            default:
                this.show();
        }
    }

    public transformOut() {
        $(this.container.current as any).addClass("moveAwayAlongZ");
        setTimeout(() => {
            this.clear();
            $(this.container.current as any).removeClass("moveAwayAlongZ");
            if(this.props.transformReadyCallback) {
                this.props.transformReadyCallback();
            }
        }, 1000)
    }

    public componentDidUpdate() {
        switch(this.props.action) {
            case "transform-out":
                this.transformOut();
                break;

            case "transform-in":
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