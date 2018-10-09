import * as React from 'react';
import * as $ from 'jquery';

import {Slide} from '../core/Slide';
import {resetSlideReadyPromise, slideReadyPromise} from '../lifecycle/lifecycle';
import {showHideDown, showHideStepCtr, showHideUp} from './controlElements';

interface HtmlSlideProps {
    slide: Slide
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    private container = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        this.loadHtml();
    }

    public componentDidUpdate() {
        this.loadHtml();
    }

    private loadHtml() {
        const {slide} = this.props;

        resetSlideReadyPromise(slide.name);

        $(this.container.current as any).empty();
        $(this.container.current as any).load(slide.getPathToHtml());

        slideReadyPromise(slide.name).then(() => {
            setTimeout(() => {
                showHideStepCtr(slide.steps.length > 0);
                slide.performToCurrentStep();
            }, 100)
        })
    }

    public render() {
        return (
            <div id={this.props.slide.name} ref={this.container} className="html-slide"></div>
        );
    }
}