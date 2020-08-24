(function (viz) {
    'use strict';

    /* margins */
    const margin = {
        'top': 50,
        'left': 25,
        'right': 25,
        'bottom': 50
    };

    /* scales */
    /* y-axis for height-effect*/
    const scaleGroup = d3.scaleBand().domain(viz.groups).paddingInner(1);

    /* group data */
    function groupData(group, data) {
        const g = [];

        group.forEach((d) => {
            const e = data.filter((f) => f.Code === d.Code);

            if (e.length > 0) {
                g.push(e[0].Value);
            }
        });

        return g;
    }
    
    viz.initRidge3 = function () {
        const data = function () {
            const ps = viz.data.ps.filter((d) => d.Year === 2018 && d.Value !== null);
            
            /* needed for data */
            const small = viz.data.popul.filter((d) => d.Size === 'small');
            const midsize = viz.data.popul.filter((d) => d.Size === 'midsize');
            const big = viz.data.popul.filter((d) => d.Size === 'big');

            return {
                'small': groupData(small, ps),
                'midsize': groupData(midsize, ps),
                'big': groupData(big, ps)
            };
        }();

        /* general selectors and dimensions */
        const chartContainer = d3.select('#psRidge');
        /* idk, why they're a little bit off */
        const width = viz.calculateWidth(chartContainer, margin);
        const height = viz.calculateHeight(chartContainer, margin) - 6;

        /* svg and container */
        const svg = viz.makeSvg(chartContainer, width, height, margin);
        const chartHolder = viz.makeHolder(svg, margin);

        /* scales */
        const scalePs = d3.scaleLinear().domain([-3, 1.5]).range([0, width]);
        /* y-axis for densities */
        const scaleDensity = d3.scaleLinear().domain([0, 0.7]).range([height / 1.25, 0]);
        scaleGroup.range([height / 2, 0]);

        const axis = viz.makeAxis(svg, width, height, margin, scalePs, [-3, -2, -1, 0, 1], 'Political Stability (2018)', d3.format('d'));
        const title = viz.makeTitle(svg, width, height, margin, 'Small states tend to be more politically stable');

        const allDensity = [];

        for (const g of viz.groups) {
            const densityFunc = ss.kernelDensityEstimation(data[g]);
            const densities = scalePs.ticks(viz.densityAcc).map((d) => [d, densityFunc(d)]);

            allDensity.push({
                'key': g,
                'density': densities
            });
        }

        viz.makeJoyPlot(chartHolder, allDensity, scalePs, scaleDensity, scaleGroup, height, width, margin);
    }   

    viz.initRidge4 = function () {
        const data = function () {
            const cor = viz.data.cor.filter((d) => d.Year === 2018 && d.Value !== null);
            
            /* needed for data */
            const small = viz.data.popul.filter((d) => d.Size === 'small');
            const midsize = viz.data.popul.filter((d) => d.Size === 'midsize');
            const big = viz.data.popul.filter((d) => d.Size === 'big');

            return {
                'small': groupData(small, cor),
                'midsize': groupData(midsize, cor),
                'big': groupData(big, cor)
            };
        }();

        /* general selectors and dimensions */
        const chartContainer = d3.select('#corRidge');
        const width = viz.calculateWidth(chartContainer, margin);
        const height = viz.calculateHeight(chartContainer, margin);

        /* svg and holder */
        const svg = viz.makeSvg(chartContainer, width, height, margin);
        const chartHolder = viz.makeHolder(svg, margin);

        /* scales */
        const scaleCor = d3.scaleLinear().domain([-2.25, 2.25]).range([0, width]);
        /* y-axis for densities */
        const scaleDensity = d3.scaleLinear().domain([0, .7]).range([height / 1.25, 0]);
        scaleGroup.range([height / 2, 0]);

        const allDensity = [];

        for (const g of viz.groups) {
            const densityFunc = ss.kernelDensityEstimation(data[g]);
            const densities = scaleCor.ticks(viz.densityAcc).map((d) => [d, densityFunc(d)]);

            allDensity.push({
                'key': g,
                'density': densities
            });
        }

        const axis = viz.makeAxis(svg, width, height, margin, scaleCor, [-2, -1, 0, 1, 2], 'Control of Corruption (2018)', d3.format('d'));
        const title = viz.makeTitle(svg, width, height, margin, 'and have lower levels of corruption');

        viz.makeJoyPlot(chartHolder, allDensity, scaleCor, scaleDensity, scaleGroup, height, width, margin);
    }

    viz.initRidge5 = function () {
        const data = function () {
            const fr = viz.data.fr;

            /* needed for data */
            const small = viz.data.popul.filter((d) => d.Size === 'small');
            const midsize = viz.data.popul.filter((d) => d.Size === 'midsize');
            const big = viz.data.popul.filter((d) => d.Size === 'big');

            return {
                'small': groupData(small, fr),
                'midsize': groupData(midsize, fr),
                'big': groupData(big, fr)
            };
        }();

        /* general selectors and dimensions */
        const chartContainer = d3.select('#frRidge');
        const width = viz.calculateWidth(chartContainer, margin);
        const height = viz.calculateHeight(chartContainer, margin) - 4;

        /* svg and holder */
        const svg = viz.makeSvg(chartContainer, width, height, margin);
        const chartHolder = viz.makeHolder(svg, margin);

        /* scales */
        const scaleFr = d3.scaleLinear().domain([1, 7]).range([0, width]);
        /* y-axis for densities */
        const scaleDensity = d3.scaleLinear().domain([0, 0.3]).range([height / 1.25, 0]);
        scaleGroup.range([height / 2, 0]);

        const allDensity = [];

        for (const g of viz.groups) {
            const densityFunc = ss.kernelDensityEstimation(data[g]);
            const densities = scaleFr.ticks(viz.densityAcc).map((d) => [d, densityFunc(d)]);

            allDensity.push({
                'key': g,
                'density': densities
            });
        }

        const axis = viz.makeAxis(svg, width, height, margin, scaleFr, d3.range(1, 8), 'Freedom Rating [1=Free] (2020)', d3.format('d'));
        const title = viz.makeTitle(svg, width, height, margin, 'and enjoy more political freedoms.');

        viz.makeJoyPlot(chartHolder, allDensity, scaleFr, scaleDensity, scaleGroup, height, width, margin);
    }
} (window.viz = window.viz || {}));