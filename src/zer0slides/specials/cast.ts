import * as d3 from 'd3';

import {q} from '../selector/selector';

interface JobName {
    job: string;
    name: string;
}

const create = (selection: string, movie: string, cast: JobName[]) => {
    const data = cast.reduce((agg, jobName) => {
        return [...agg, {class: 'job', text: jobName.job}, {class: 'name', text: jobName.name}]
    }, [{class: 'movie', text: movie}])

    const screen = d3.select(q(selection))
        .append("div")
        .attr("class", "screen __cast");

    screen.append("div")
        .attr("class", "wrapper")
        .selectAll(".__entry")
        .data(data)
        .enter()
        .append("div")
        .attr("class", d => `__entry ${d.class}`)
        .text(d => d.text);
}

export const cast = {
    create
}
