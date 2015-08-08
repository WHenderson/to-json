var coffeeCoverage = require('coffee-coverage');
coffeeCoverage.register({
    instrumentor: 'istanbul',
    basePath: __dirname + '/../lib',
    _exclude: ['/test', '/node_modules', '/.git'],
    coverageVar: coffeeCoverage.findIstanbulVariable(),
    writeOnExit: false,
    initAll: false
});
