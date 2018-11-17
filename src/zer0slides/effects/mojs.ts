const mojs = (window as any).mojs;

const startEffect = (tweens: any[]) => {
    const timeline = new mojs.Timeline();
    tweens.forEach(tween => timeline.add(tween));
    timeline.replay();
}

export const burst = (element: any) => {
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
                duration: 	3400,
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
            duration: 	1400,
            easing: 		mojs.easing.sin.out
        }),
        // icon scale animation
        new mojs.Tween({
            duration : 2400,
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

    startEffect(tweens);
}

export const colorBurst = (element: any) => {
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
                duration: 3000,
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
            duration: 		1500,
            easing: 			mojs.easing.bezier(0, 1, 0.5, 1)
        }),
        // icon scale animation
        new mojs.Tween({
            duration : 1800,
            onUpdate: (progress) => {
                const scaleProgress = scaleCurve4(progress);
                element.style.WebkitTransform = element.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
            }
        })
    ]

    startEffect(tweens)
}

export const doubleBurst = (element: any) => {
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
                duration: 	1200,
                delay: 			200,
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
            duration: 		1500,
            easing: 			mojs.easing.bezier(0.1, 1, 0.3, 1)
        }),
        new mojs.Shape({
            parent: 		element,
            radius: 		{30: 80},
            fill: 			'transparent',
            stroke: 		'#988ADE',
            strokeWidth: {20:0},
            opacity: 		0.3,
            duration: 	1600,
            delay: 			320,
            easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1)
        }),
        // icon scale animation
        new mojs.Tween({
            duration : 1000,
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

    startEffect(tweens);
}
