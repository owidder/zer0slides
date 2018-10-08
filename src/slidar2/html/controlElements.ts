import * as d3 from 'd3';

export const setStepCtr = (currentStepNo: number, noOfSteps: number) => {
    const stepCtrString = `[${currentStepNo+1}/${noOfSteps}]`;
    d3.selectAll("#control-elements .stepctr")
        .text(stepCtrString);
}
