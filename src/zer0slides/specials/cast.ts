import * as d3 from 'd3';

import {q} from '../selector/selector';

interface JobName {
    job: string;
    jobHref?: string;
    name: string;
    nameHref?: string;
}

const create = (selection: string, movie: string, cast: JobName[], upper = true, small = true) => {
    const data = cast.reduce((agg, jobName) => {
        return [...agg, {class: 'job', text: jobName.job, href: jobName.jobHref}, {class: 'name', text: jobName.name, href: jobName.nameHref}]
    }, [{class: 'movie', text: movie}])

    const screen = d3.select(q(selection))
        .append("div")
        .attr("class", "screen __cast");

    const enter = screen.append("div")
        .attr("class", "wrapper" + (upper ? " upper" : ""))
        .selectAll(".__entry")
        .data(data)
        .enter()
        .append("div")
        .attr("class", d => `__entry ${d.class} ${small ? "small" : "big"}`);

    enter.filter(d => !!d.href)
        .append("a")
        .attr("href", d => d.href)
        .attr("target", "_blank")
        .text(d => d.text);

    enter.filter(d => !d.href)
        .text(d => d.text);
}

export const cast = {
    create
}
