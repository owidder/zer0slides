require('mo-js/build/mo');

/* ************************************************
**** from https://github.com/legomushroom/mojs ****
************************************************* */

const mojs = (window as any).mojs;

export const startEffect = (timeline: any) => {
    timeline.replay();
}

export const stopEffect = (timeline: any, element: any) => {
    timeline.stop();
    if(element) {
        element.style.WebkitTransform = element.style.transform = 'scale3d(1,1,1)';
    }
}

const createTimeline = (tweens: any[]) => {
    const timeline = new mojs.Timeline();
    tweens.forEach(tween => timeline.add(tween));
    return timeline;
}

export const burst = (element: any, factor: number = 1) => {
    if(!element) {return}
    const tweens = [
        // burst animation
        new mojs.Burst({
            parent: 			element,
            radius: 			{30:90},
            count: 				6,
            children : {
                fill: 			'#C0C1C3',
                opacity: 		0.6,
                radius: 		15,
                duration: 	1700 * factor,
                easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1)
            }
        }),
        // ring animation
        new mojs.Shape({
            parent: 		element,
            type: 			'circle',
            radius: 		{0: 60},
            fill: 			'transparent',
            stroke: 		'#C0C1C3',
            strokeWidth: {20:0},
            opacity: 		0.6,
            duration: 	700 * factor,
            easing: 		mojs.easing.sin.out
        }),
        // icon scale animation
        new mojs.Tween({
            duration : 1200 * factor,
            onUpdate: (progress) => {
                if(progress > 0.3) {
                    const elasticOutProgress = mojs.easing.elastic.out(1.43*progress-0.43);
                    element.style.WebkitTransform = element.style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
                }
                else {
                    element.style.WebkitTransform = element.style.transform = 'scale3d(0,0,1)';
                }
            }
        })
    ]

    return createTimeline(tweens);
}

export const colorBurst = (element: any, factor: number = 1) => {
    if(!element) {return}
    const scaleCurve4 = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
    const tweens = [
        // burst animation
        new mojs.Burst({
            parent: 	element,
            count: 		6,
            radius: 	{40:120},
            children: {
                fill : 		[ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
                opacity: 	0.6,
                radius: 	20,
                direction: [ -1, -1, -1, 1, -1 ],
                swirlSize: 'rand(10, 14)',
                duration: 1500,
                easing: 	mojs.easing.bezier(0.1, 1, 0.3, 1),
                isSwirl: 	true
            }
        }),
        // ring animation
        new mojs.Shape({
            parent: 			element,
            radius: 			50,
            scale: 				{ 0 : 1 },
            fill: 				'transparent',
            stroke: 			'#988ADE',
            strokeWidth: 	{15:0},
            opacity: 			0.6,
            duration: 		750,
            easing: 			mojs.easing.bezier(0, 1, 0.5, 1)
        }),
        // icon scale animation
        new mojs.Tween({
            duration : 900,
            onUpdate: (progress) => {
                const scaleProgress = scaleCurve4(progress);
                element.style.WebkitTransform = element.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
            }
        })
    ]

    return createTimeline(tweens);
}

export const doubleBurst = (element: any, factor: number = 1) => {
    if(!element) {return}
    const tweens = [
        // burst animation
        new mojs.Burst({
            parent: 		element,
            radius: 		{90:150},
            count: 			18,
            children: {
                fill: 			'#988ADE',
                opacity: 		0.6,
                scale:      1,
                radius: 		{'rand(5,20)':0},
                swirlSize: 	15,
                direction:  [ 1, 1, -1, -1, 1, 1, -1, -1, -1 ],
                duration: 	1200 * factor,
                delay: 			200 * factor,
                easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1),
                isSwirl: 		true

            }
        }),
        // ring animation
        new mojs.Shape({
            parent: 			element,
            radius: 			{30: 100},
            fill: 				'transparent',
            stroke: 			'#988ADE',
            strokeWidth: 	{30:0},
            opacity: 			0.6,
            duration: 		1500 * factor,
            easing: 			mojs.easing.bezier(0.1, 1, 0.3, 1)
        }),
        new mojs.Shape({
            parent: 		element,
            radius: 		{30: 80},
            fill: 			'transparent',
            stroke: 		'#988ADE',
            strokeWidth: {20:0},
            opacity: 		0.3,
            duration: 	1600 * factor,
            delay: 			320 * factor,
            easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1)
        }),
        // icon scale animation
        new mojs.Tween({
            duration : 1000 * factor,
            onUpdate: (progress) => {
                if(progress > 0.3) {
                    const elasticOutProgress = mojs.easing.elastic.out(1.43*progress-0.43);
                    element.style.WebkitTransform = element.style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
                }
                else {
                    element.style.WebkitTransform = element.style.transform = 'scale3d(0,0,1)';
                }
            }
        })
    ]

    return createTimeline(tweens);
}
