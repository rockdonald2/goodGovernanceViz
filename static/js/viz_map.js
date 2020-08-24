(function (viz) {
    'use strict';

    /* general selectors and margins-dimensions */
    const chartContainer = d3.select('#map');
    const margin = {
        'left': 25,
        'right': 25,
        'top': 0,
        'bottom': 0
    };
    const width = viz.calculateWidth(chartContainer, margin);

    /* path-projection */
    const outline = {
        'type': 'Sphere'
    };
    const projection = d3.geoEquirectangular();
    const path = d3.geoPath(projection);
    const height = function () {
        const [
            [x0, y0],
            [x1, y1]
        ] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
        const dy = Math.ceil(y1 - y0),
            l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
        return dy;
    }();

    /* svg-container and chart-holder */
    const svg = viz.makeSvg(chartContainer, width, height, margin).style('cursor', 'zoom-in');
    const chartHolder = viz.makeHolder(svg, margin);

    /* scales */
    const colorScale = viz.colorScale;

    /* zoom */
    function zoomed() {
        const {transform} = d3.event;
        const mapHolder = chartHolder.select('.mapHolder');
        mapHolder.attr('transform', transform);
        mapHolder.attr('stroke-width', 1 / transform.k);
    }

    const zoom = d3.zoom()
        .scaleExtent([1, 4])
        .on('zoom', zoomed);

    viz.initMap = function () {
        const data = viz.data.popul;

        const mapHolder = chartHolder.append('g').attr('class', 'mapHolder');

        const countries = mapHolder.selectAll('.country').data(topojson.feature(viz.data.map, viz.data.map.objects.countries).features);
        countries.enter().append('path').attr('class', 'country')
            .attr('id', (d) => viz.data.codes[d.properties.name] ? viz.data.codes[d.properties.name].Code : null)
            .attr('d', (d) => d.properties.name !== 'Antarctica' ? path(d) : null)
            .attr('stroke-width', 1).attr('stroke', '#FFFCF6').attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round')
            .attr('stroke-opacity', .5)
            .attr('fill', '#707070');

        const tooltip = chartContainer.select('.tooltip');

        data.forEach((d) => {
            chartHolder.select('.country#' + d.Code).attr('fill', colorScale(d.Size))
                .on('mouseenter', function () {
                    tooltip.select('.tooltip--heading').html(d.Country).style('background-color', colorScale(d.Size));
                    tooltip.select('.tooltip--info__value').html(d3.format('.2s')(d.Value));
                })
                .on('mousemove', function () {
                    tooltip.style('left', (d3.event.pageX - parseInt(tooltip.style('width')) / 2) + 'px');
                    tooltip.style('top', (d3.event.pageY + 50) + 'px');
                })
                .on('mouseleave', function () {
                    tooltip.style('left', '-9999px');
                });
        });

        svg.call(zoom);
    }
}(window.viz = window.viz || {}));