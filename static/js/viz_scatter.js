(function (viz) {
    'use strict';

    /* general selectors and margins-dimensions */
    const chartContainer = d3.select('#scatterPlot');
    const margin = {
        'top': 30,
        'left': 40,
        'right': 0,
        'bottom': 30
    };

    if (window.innerWidth <= 425) {
        margin.left = 15;
    }

    const width = viz.calculateWidth(chartContainer, margin);
    const height = viz.calculateHeight(chartContainer, margin);

    /* svg-container and chartholder-group */
    const svg = viz.makeSvg(chartContainer, width, height, margin);
    const chartHolder = viz.makeHolder(svg, margin);

    /* scales */
    const colorScale = viz.colorScale;
    const scaleGov = d3.scaleLinear().domain([-2.6, 2.5]).range([0, width]);
    const scaleHdi = d3.scaleLinear().domain([0.3, 1.05]).range([height, 0]);
    let radius = 12.5;

    if (window.innerWidth <= 425) {
        radius = 10;
    }

    /* axis-generator */
    const makeAxis = function () {
        let axisFontSize = '2rem';
        const axisFontColor = '#707070';
        const axisStrokeWidth = 1;
        const axisStrokeOpacity = .25;
        let axisDy = '.32em';
        let xY = 25;
        let xText = 25;
        let rotateY = null;
        let yY = -9;

        if (window.innerWidth <= 1600) {
            axisFontSize = '1.5rem';
        }

        if (window.innerWidth <= 425) {
            axisFontSize = '1rem';
            xY = 10;
            yY = -2;
        }

        const xAxis = svg.append('g').attr('class', 'x-axis')
            .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
        const xTicks = xAxis.selectAll('.x-tick').data([-2, -1, 0, 1, 2]);
        xTicks.enter().append('g').attr('class', 'x-tick')
            .call((g) => {
                g.append('line')
                    .attr('stroke', axisFontColor).attr('stroke-opacity', axisStrokeOpacity).attr('stroke-width', axisStrokeWidth)
                    .attr('x1', scaleGov).attr('x2', scaleGov)
                    .attr('y1', 0).attr('y2', -height);
                g.append('text').text((d) => d !== 0 ? d : 'Government Effectiveness (2018)')
                    .attr('text-anchor', 'middle')
                    .style('font-size', axisFontSize)
                    .attr('fill', axisFontColor)
                    .attr('x', scaleGov).attr('y', (d) => d !== 0 ? xY : xText);
            });

        const yAxis = svg.append('g').attr('class', 'y-axis')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
        const yTicks = yAxis.selectAll('.y-tick').data([0.4, 0.6, 0.8, 1.0]);
        yTicks.enter().append('g').attr('class', 'y-tick')
            .call((g) => {
                g.append('line')
                    .attr('stroke', axisFontColor).attr('stroke-opacity', axisStrokeOpacity).attr('stroke-width', axisStrokeWidth)
                    .attr('x1', 0).attr('x2', width)
                    .attr('y1', scaleHdi).attr('y2', scaleHdi);
                g.append('text').text((d) => (d !== 0.6 && d !== 0.8) ? d3.format('.1f')(d) : '')
                    .attr('text-anchor', 'end')
                    .style('font-size', axisFontSize)
                    .attr('fill', axisFontColor)
                    .attr('x', yY).attr('y', scaleHdi)
                    .attr('dy', axisDy);
            });
        yAxis.append('text').text('Human Development Index (2018)')
            .style('font-size', axisFontSize)
            .attr('fill', axisFontColor)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('x', () => {
                return -height / 2;
            }).attr('y', yY);
    }();

    /* legend-generator */
    const makeLegend = function () {
        let legendWidth = 300;
        let legendHeight = 300;
        const legendPoz = {
            'left': width * 0.75,
            'top': height * 0.75
        };
        let legendFontSize = '1.2rem';
        const legendRectSize = {
            'width': 24,
            'height': 24
        };
        let legendRectMargin = 10;
        let dy = '.5em';
        const halfOpacity = .85;

        const legendData = [{
                'Size': 'big',
                'Text': '> 35 million population'
            },
            {
                'Size': 'midsize',
                'Text': '35 > million population > 5'
            },
            {
                'Size': 'small',
                'Text': '< 5 million population'
            }
        ];

        if (window.innerWidth <= 1366) {
            legendRectSize.width = legendRectSize.height = 16;
            dy = '.25em';
        }

        if (window.innerWidth <= 425) {
            legendPoz.top = height * 0.85;
            legendPoz.left = width * 0.55;
            legendFontSize = '1rem';
        }

        if (window.innerWidth <= 320) {
            legendFontSize = '.9rem';
            legendRectSize.width = legendRectSize.height = 12;
            dy = '.33em';
            legendRectMargin = 5;
        }

        const legend = svg.append('g').attr('class', 'legend')
            .attr('transform', 'translate(' + legendPoz.left + ', ' + legendPoz.top + ')');

        const legendRects = legend.selectAll('.rect').data(legendData);
        legendRects.enter().append('rect').attr('class', 'rect')
            .attr('width', legendRectSize.width).attr('height', legendRectSize.height)
            .attr('opacity', halfOpacity)
            .attr('fill', (d) => colorScale(d.Size))
            .attr('x', legendRectMargin)
            .attr('y', (d, i) => i * (legendRectMargin + legendRectSize.height));

        const legendLabels = legend.selectAll('.label').data(legendData);
        legendLabels.enter().append('text').attr('class', 'label')
            .text((d) => d.Text)
            .style('font-size', legendFontSize)
            .style('font-weight', 600)
            .attr('opacity', halfOpacity)
            .attr('x', legendRectSize.width + 2 * legendRectMargin)
            .attr('y', (d, i) => i * (legendRectSize.height + legendRectMargin) + legendRectMargin)
            .attr('dy', dy)
    }();

    /* innertext-generator */
    const innerText = function () {
        const innerMargins = {
            'left': margin.left + 40,
            'top': margin.top + 30
        };
        let innerWidth = 550;
        let innerHeight = 100;
        let innerFontSize = '1.5rem';
        const innerElemMargins = {
            'left': 20,
            'top': 25
        };
        let innerElemMultiple = 20;

        if (window.innerWidth <= 1600) {
            innerFontSize = '1.3rem';
            innerWidth = 500;
        } 
        
        if (window.innerWidth <= 1366) {
            innerMargins.left = margin.left + 20;
            innerMargins.top = margin.top + 10;
        }

        if (window.innerWidth <= 425) {
            innerFontSize = '1rem';
            innerMargins.left = margin.left + 5;
            innerMargins.top = margin.top;
            innerWidth = 350;
            innerHeight = 75;
            innerElemMargins.top = 10;
            innerElemMargins.left = 10;
        }

        if (window.innerWidth <= 375) {
            innerFontSize = '.9rem';
            innerWidth = 325;
            innerMargins.top = margin.top - 10;
            innerElemMultiple = 15;
        }

        if (window.innerWidth <= 320) {
            innerFontSize = '.8rem';
            innerWidth = 275;
            innerElemMargins.top = 0;
            innerElemMargins.left = 10;
        }

        const innerGroup = svg.append('g').attr('class', 'innerText')
            .attr('transform', 'translate(' + innerMargins.left + ', ' + innerMargins.top + ')');
        const innerRect = innerGroup.append('rect')
            .attr('x', 0).attr('y', 0).attr('width', innerWidth).attr('height', innerHeight)
            .attr('fill', '#FFFCF6');
        const innerData = ['There are more than 77 ', 'small states', ' that account for more than ', '1.5%', ' of ',
            ' the world population and for close to ', '3%', ' of global wealth. Some ',
            ' small states', ' are amongst the most developed nations with heighest levels ',
            ' of government effectiveness.'
        ]
        const innerT = innerGroup.append('text')
            .attr('x', 0).attr('y', 0)
            .selectAll('tspan')
            .data(innerData).enter().append('tspan')
            .attr('fill', (d) => {
                if (d === 'small states' || d === ' small states' || d === '1.5%' || d === '3%') return viz.colors[0];
            })
            .text((d) => d)
            .style('font-size', innerFontSize)
            .attr('x', (d) => {
                const index = innerData.indexOf(d);
                if (index === 0 || index === 5 || index === 8 || index === 10) return innerElemMargins.left;
            })
            .attr('y', (d, i) => {
                const index = innerData.indexOf(d);
                if (index <= 4) {
                    return innerElemMargins.top + 0 * innerElemMultiple;
                } else if (index > 4 && index <= 7) {
                    return innerElemMargins.top + 1 * innerElemMultiple;
                } else if (index > 7 && index <= 9) {
                    return innerElemMargins.top + 2 * innerElemMultiple;
                } else {
                    return innerElemMargins.top + 3 * innerElemMultiple;
                }
            })
    }();

    /* scatterplot generator */
    viz.initScatterPlot = function () {
        const currentYear = 2018;
        const hdiData = viz.data.hdi.filter((d) => d.Year === currentYear);
        const govData = viz.data.gov.filter((d) => d.Year === currentYear);
        const populData = viz.data.popul;
        const halfOpacity = .85;
        const fullOpacity = 1;
        const halfFontSize = '.8rem';
        const fullFontSize = '1.2rem';
        const dy = '.35em';

        const data = [];
        hdiData.forEach((d) => {
            const govValue = govData.filter((e) => e.Code === d.Code);
            const populValue = populData.filter((e) => e.Code === d.Code);
            if (govValue.length !== 0 && populValue.length !== 0) {
                data.push({
                    'Country': d.Country,
                    'Code': d.Code,
                    'HDI': d.Value,
                    'GOV': govValue[0].Value,
                    'Size': populValue[0].Size
                });
            }
        });

        const tooltip = chartContainer.select('.tooltip');

        const bubbles = chartHolder.selectAll('.bubble').data(data);
        bubbles.enter().append('g')
            .on('mouseenter', function (d) {
                d3.select(this).raise();
                d3.select(this).select('.bubble#' + d.Code).transition().attr('opacity', fullOpacity).attr('r', radius * 1.5);
                d3.select(this).select('.label#' + d.Code).transition().style('font-size', fullFontSize);
            })
            .on('mousemove', function (d) {
                tooltip.select('.tooltip--heading').html(d.Country).style('background-color', colorScale(d.Size));
                tooltip.select('.tooltip--hdi__score').html(d.HDI);
                tooltip.select('.tooltip--gov__score').html(d.GOV.toFixed(3));

                if (window.innerWidth <= 1024) {
                    if (d3.event.pageX <= width * 0.25) {
                        tooltip.style('left', (d3.event.pageX - parseInt(tooltip.style('width')) / 2 + 50) + 'px');
                    } else if (d3.event.pageX >= width * 0.75) {
                        tooltip.style('left', (d3.event.pageX - parseInt(tooltip.style('width')) / 2 - 50) + 'px');
                    } else {
                        tooltip.style('left', (d3.event.pageX - parseInt(tooltip.style('width')) / 2) + 'px');
                    }
                    tooltip.style('top', (d3.event.pageY + 40) + 'px');
                } else {
                    tooltip.style('left', (d3.event.pageX + 20) + 'px');
                    tooltip.style('top', (d3.event.pageY + 20) + 'px');
                }
            })
            .on('mouseleave', function (d) {
                d3.select(this).select('.bubble#' + d.Code).transition().attr('opacity', halfOpacity).attr('r', radius);
                d3.select(this).select('.label#' + d.Code).transition().style('font-size', halfFontSize);
                tooltip.style('left', '-9999px');
            })
            .call((g) => {
                g.append('circle').attr('class', 'bubble').attr('id', (d) => d.Code)
                    .attr('r', 0)
                    .attr('cx', width / 2)
                    .attr('cy', height / 2)
                    .attr('fill', (d) => colorScale(d.Size))
                    .attr('opacity', halfOpacity)
                    .transition()
                    .attr('r', radius)
                    .attr('cx', (d) => scaleGov(d.GOV))
                    .attr('cy', (d) => scaleHdi(d.HDI));

                g.append('text').attr('class', 'label').attr('id', (d) => d.Code)
                    .text((d) => d.Code)
                    .attr('text-anchor', 'middle')
                    .style('font-size', halfFontSize)
                    .attr('opacity', halfOpacity)
                    .style('font-weight', 600)
                    .attr('x', width / 2)
                    .attr('y', height / 2)
                    .attr('dy', dy)
                    .style('pointer-events', 'none')
                    .transition()
                    .attr('x', (d) => scaleGov(d.GOV))
                    .attr('y', (d) => scaleHdi(d.HDI));
            });

        chartHolder.raise();
    };

    /* scatterplot updater -- no update needed -- static chart w/ minimal interactivity */

}(window.viz = window.viz || {}));