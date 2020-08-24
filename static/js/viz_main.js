(function (viz) {
    'use strict';

    d3.queue()
        .defer(d3.json, 'static/data/hdi.json')
        .defer(d3.json, 'static/data/cor.json')
        .defer(d3.json, 'static/data/gov.json')
        .defer(d3.json, 'static/data/fr.json')
        .defer(d3.json, 'static/data/ps.json')
        .defer(d3.json, 'static/data/pop.json')
        .defer(d3.json, 'static/data/countryCodes.json')
        .defer(d3.json, 'static/data/worldMap.json')
        .await(ready);

    function ready(error, hdiData, corData, govData, frData, psData, popData, codes, map) {
        if (error) {
            return console.warn(error);
        }

        viz.data.hdi = hdiData;
        viz.data.cor = corData;
        viz.data.gov = govData;
        viz.data.fr = frData;
        viz.data.ps = psData;
        viz.data.popul = popData;
        viz.data.codes = codes;
        viz.data.map = map;

        viz.init();

        setTimeout(() => {
            d3.select('body.hidden').attr('class', '');
            d3.select('body>.overlay').attr('class', 'overlay');
        }, 1000);
    }

} (window.viz = window.viz || {}));