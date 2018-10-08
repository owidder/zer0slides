import * as React from 'react';
import * as $ from 'jquery';

interface HtmlSlideProps {
    pathToHtml: string,
    name: string,
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
        $(this.container.current as any).empty();
        $(this.container.current as any).load(this.props.pathToHtml);
    }

    public render() {
        return (
            <div id={this.props.name} ref={this.container} className="html-slide"></div>
        );
    }
}