'use strict';

var ReplaceSource = require('webpack-core/lib/ReplaceSource');

/* eslint-disable require-jsdoc */
function SafeUmdRootPlugin() {}

function genReplacedSource(source, srcText) {
    var matchResult = /factory\(root.+\)/.exec(srcText);
    var mText = matchResult[0];
    var mIndex = matchResult.index;
    var newSource = new ReplaceSource(source);
    var replacedText = replaceFactoryCall(mText);

    newSource.replace(mIndex, mIndex + mText.length, replacedText);

    return newSource;
}

function replaceFactoryCall(factoryCall) {
    var multiNestedRootAccessor = /root(?:\[[^\]]+\]){2,}/g;

    return factoryCall.replace(multiNestedRootAccessor, function(matched) {
        var units = matched.match(/"([^"]+)"/g);
        var len = units.length;
        var i = 0;
        var accessUnits = [];

        for (; i < len; i += 1) {
            accessUnits.push('root[' + units.slice(0, i + 1).join('][') + ']');
        }
        return '(' + accessUnits.join(' && ') + ')';
    });
}

SafeUmdRootPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation) {
        compilation.templatesPlugin('render-with-entry', function(source) {
            var srcText = source.source();

            if (srcText.indexOf('webpackUniversalModuleDefinition') < 0) {
                return source;
            }
            return genReplacedSource(source, srcText);
        });
    });
};

module.exports = SafeUmdRootPlugin;
