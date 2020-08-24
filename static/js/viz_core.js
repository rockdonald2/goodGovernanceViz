(function (viz) {
     'use strict';

     /*
     ! adattároló 
     */
     viz.data = {};

     viz.densityAcc = 100;

     /* common colors */
     viz.colors = ['#E84E4E', '#FFE36F', '#5383B5'];
     viz.groups = ['small', 'midsize', 'big'];
     viz.colorScale = d3.scaleOrdinal().domain(viz.groups).range(viz.colors);

     /* common functions */
     viz.calculateWidth = function(cont, margin) {
          return parseInt(cont.style('width')) - margin.left - margin.right;
     }

     viz.calculateHeight = function(cont, margin) {
          return parseInt(cont.style('height')) - margin.top - margin.bottom;
     }

     viz.makeSvg = function(cont, width, height, margin) {
          return cont.append('svg')
               .attr('width', width + margin.left + margin.right)
               .attr('height', height + margin.top + margin.bottom);
     }

     viz.makeHolder = function(svg, margin) {
          return svg.append('g')
               .attr('class', 'chartHolder')
               .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
     }

     /* axis-generator for ridges */
     viz.makeAxis = function (svg, width, height, margin, scaleX, ticksX, titleX, formatX) {
          const axisFontSize = '1.4rem';
          const axisFontColor = '#707070';
          const axisStrokeWidth = 1;
          const axisStrokeOpacity = .25;
          const axisFontWeight = 600;

          const xAxis = svg.append('g').attr('class', 'x-axis')
               .attr('transform', 'translate(' + margin.left + ', ' + (margin.top + height) + ')');
          const xTicks = xAxis.selectAll('.x-tick').data(ticksX);
          xTicks.enter().append('g').attr('class', 'x-tick')
               .call((g) => {
                    g.append('line').attr('stroke', axisFontColor).attr('stroke-width', axisStrokeWidth)
                         .attr('stroke-opacity', axisStrokeOpacity)
                         .attr('y1', 0).attr('y2', -height).attr('x1', scaleX).attr('x2', scaleX);
                    g.append('text').text((d) => formatX(d))
                         .attr('text-anchor', 'middle').style('font-size', axisFontSize)
                         .attr('fill', axisFontColor)
                         .attr('x', scaleX).attr('y', 20);
               });
          const xTitle = xAxis.append('text').text(titleX).attr('class', 'x-title')
               .attr('text-anchor', 'middle').style('font-size', axisFontSize)
               .attr('fill', axisFontColor)
               .style('font-weight', axisFontWeight)
               .attr('x', width / 2).attr('y', 45);

          return {
               'x-axis': xAxis,
               'x-ticks': xTicks,
               'x-title': xTitle
          };
     };

     /* title-generator for ridges */
     viz.makeTitle = function (svg, width, height, margin, title) {
          const titleColor = '#707070';
          let titleFontSize = '1.7rem';
          let titleMargin = 17.5;

          if (window.innerWidth <= 1600) {
               titleFontSize = '1.4rem';
               titleMargin = 20;
          }

          return svg.append('text').text(title)
               .attr('text-anchor', 'middle').style('font-size', titleFontSize)
               .attr('fill', titleColor)
               .attr('x', width / 2 + margin.left).attr('y', titleMargin);
     }

     viz.makeJoyPlot = function (chartHolder, allDensity, scaleChange, scaleDensity, scaleGroup, height, width, margin) {
          const halfOpacity = 0.75;
          const stroke = '#121212';
          const strokeOpacity = 0.1;
          const joys = chartHolder.selectAll('.joy').data(allDensity);
          joys.enter().append('path').attr('class', 'joy').attr('id', (d) => d.key)
               .attr('transform', (d) => 'translate(0, ' + (scaleGroup(d.key) - height / 3.5) + ')')
               .attr('fill', (d) => viz.colorScale(d.key))
               .datum((d) => d.density)
               .attr('opacity', halfOpacity)
               .attr('stroke', stroke)
               .attr('stroke-opacity', strokeOpacity)
               .attr('d', d3.area().x((d) => scaleChange(d[0])).y0(height / 1.25).y1((d) => scaleDensity(d[1])));

          for (let g = viz.groups.length - 1; g > -1; g--) {
               chartHolder.select('.joy#' + viz.groups[g]).raise();
          }

          chartHolder.raise();
     }

     /* visualization starts here */
     viz.init = function () {
          /* scatterplot chart */
          viz.initScatterPlot();
          /* map chart */
          viz.initMap();
          /* ridge 1 */
          viz.initRidge1();
          /* ridge 2 */
          viz.initRidge2();
          /* ridge 3 */
          viz.initRidge3();
          /* ridge 4 */
          viz.initRidge4();
          /* ridge 5 */
          viz.initRidge5();
     }

}(window.viz = window.viz || {}));