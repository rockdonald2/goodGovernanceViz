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
    let maxHeight = 15;

    if (window.innerWidth <= 1920) {
        maxHeight = 30;
    }

    if (window.innerWidth <= 1024) {
        maxHeight = 60;
    }

    function calculateDifferences (data, firstYear, secondYear) {
        const differences = [];

        data.forEach((d) => {
            const first = firstYear.filter((e) => e.Code === d.Code);
            const second = secondYear.filter((e) => e.Code === d.Code);

            if (first.length > 0 && second.length > 0) {
                if (first[0].Value && second[0].Value) {
                    differences.push(first[0].Value - second[0].Value);
                }
            }
        });

        return differences;
    }

    viz.initRidge1 = function () {
        const data = function () {
            const returns = [];

            const hdi2018 = viz.data.hdi.filter((d) => d.Year === 2018);
            const hdi2000 = viz.data.hdi.filter((d) => d.Year === 2000);

            /* needed for data */
            const small = viz.data.popul.filter((d) => d.Size === 'small');
            const midsize = viz.data.popul.filter((d) => d.Size === 'midsize');
            const big = viz.data.popul.filter((d) => d.Size === 'big');

            const smallDifferences = calculateDifferences(small, hdi2018, hdi2000);
            const midsizeDifferences = calculateDifferences(midsize, hdi2018, hdi2000);
            const bigDifferences = calculateDifferences(big, hdi2018, hdi2000);

            return {
                'small': smallDifferences,
                'midsize': midsizeDifferences,
                'big': bigDifferences
            };
        }();

        /* general selectors and dimensions */
        const chartContainer = d3.select('#hdiRidge');
        const width = viz.calculateWidth(chartContainer, margin);
        const height = viz.calculateHeight(chartContainer, margin);

        /* svg and chartholder */
        const svg = viz.makeSvg(chartContainer, width, height, margin);
        const chartHolder = viz.makeHolder(svg, margin);

        /* scales */
        const scaleChange = d3.scaleLinear().domain([-0.06, 0.17]).range([0, width]);
        /* y-axis for densities */
        const scaleDensity = d3.scaleLinear().domain([0, 11]).range([height / 1.25, maxHeight]);
        scaleGroup.range([height / 2, 0]);

        const axis = viz.makeAxis(svg, width, height, margin, scaleChange, [-0.05, 0.00, 0.05, 0.10, 0.15], 'Change in HDI, 2018-2000', d3.format('.2f'));
        const title = viz.makeTitle(svg, width, height, margin, 'But small states have improved less');

        const allDensity = [];

        /* gaussian kernel function */
        for (const g of viz.groups) {
            const densityFunc = ss.kernelDensityEstimation(data[g]);
            const densities = scaleChange.ticks(viz.densityAcc).map((d) => [d, densityFunc(d)]);

            allDensity.push({
                key: g,
                density: densities
            });
        }

        /* making the ridge-plot */
        viz.makeJoyPlot(chartHolder, allDensity, scaleChange, scaleDensity, scaleGroup, height, width, margin);
    }

    viz.initRidge2 = function () {
        const data = function () {
            const gov2018 = viz.data.gov.filter((d) => d.Year === 2018);
            const gov2000 = viz.data.gov.filter((d) => d.Year === 2000);
            
            /* needed for data */
            const small = viz.data.popul.filter((d) => d.Size === 'small');
            const midsize = viz.data.popul.filter((d) => d.Size === 'midsize');
            const big = viz.data.popul.filter((d) => d.Size === 'big');

            const smallDifferences = calculateDifferences(small, gov2018, gov2000);
            const midsizeDifferences = calculateDifferences(midsize, gov2018, gov2000);
            const bigDifferences = calculateDifferences(big, gov2018, gov2000);

            return {
                'small': smallDifferences,
                'midsize': midsizeDifferences,
                'big': bigDifferences
            };
        }();

        /* general selectors and dimensions */
        const chartContainer = d3.select('#govRidge');
        const width = viz.calculateWidth(chartContainer, margin);
        const height = viz.calculateHeight(chartContainer, margin);

        /* svg-context and chartholder */
        const svg = viz.makeSvg(chartContainer, width, height, margin);
        const chartHolder = viz.makeHolder(svg, margin);

        const allDensity = [];

        /* scales */
        const scaleChange = d3.scaleLinear().domain([-1.25, 1.25]).range([0, width]);
        /* y-scale for densities */
        const scaleDensity = d3.scaleLinear().domain([0, 1]).range([height / 1.25, maxHeight]);

        const axis = viz.makeAxis(svg, width, height, margin, scaleChange, [-0.5, 0, 0.5], 'Change in Gov. Effectiveness, 2018-2000', d3.format('.2f'));
        const title = viz.makeTitle(svg, width, height, margin, 'and have even lost some ground.');

        /* gaussian kernel function */
        for (const g of viz.groups) {
            const densityFunc = ss.kernelDensityEstimation(data[g]);
            const densities = scaleChange.ticks(viz.densityAcc).map((d) => [d, densityFunc(d)]);

            allDensity.push({
                key: g,
                density: densities
            });
        }

        viz.makeJoyPlot(chartHolder, allDensity, scaleChange, scaleDensity, scaleGroup, height, width, margin);
    }
}(window.viz = window.viz || {}));