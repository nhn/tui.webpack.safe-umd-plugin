var ReplaceSource = require('webpack-core/lib/ReplaceSource');
var OriginalSource = require('webpack-core/lib/OriginalSource');
var SafeUmdPlugin = require('../lib');

var TEMP_TEXT = '...something obsolete text...';

it('genReplacedSource returns new ReplaceSource with replace code', function() {
    var originalCode = 
        TEMP_TEXT + 'factory(' +
        'root["my"], ' +
        'root["my"]["comp"], ' +
        'root["my"]["another"]["comp"]' +
        ')' + TEMP_TEXT;
    var replacedCode = 
        TEMP_TEXT + 'factory(' +
        'root["my"], ' +
        '(root["my"] && root["my"]["comp"]), ' +
        '(root["my"] && root["my"]["another"] && root["my"]["another"]["comp"])' +
        ')' + TEMP_TEXT;

    var originalSource = new OriginalSource(originalCode);
    var replacedSource = SafeUmdPlugin.genReplacedSource(originalSource, originalSource.source())

    expect(replacedSource instanceof ReplaceSource).toBe(true);
    expect(replacedSource.source()).toBe(replacedCode);
});
