import * as React from 'react';
import {HtmlSlide} from './slidar2/html/HtmlSlide';

export class GapSlides extends React.Component {
    public render() {
        return (
            <div>
                <HtmlSlide pathToHtml={"slides/test.html"} name={"test"}/>
            </div>
        );
    }
}
