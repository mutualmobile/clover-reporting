require.config({
  baseUrl: 'js',
  paths: {
    'es5-shim': 'libs/es5-shim',
    '$': 'libs/jquery-2.0.0',
    'jquery': 'libs/jquery-2.0.0',
    'jquery-mobile': 'libs/jquery-mobile',
    'cordova': 'libs/cordova',
    'mout': 'libs/mout/src',
    'docCookies': 'libs/docCookies',
    'dust': 'libs/dust-full-1.2.4',
    'dust-helpers': 'libs/dust-helpers-1.1.1',
    'rdust': 'libs/require-dust',
    'iScroll': 'libs/iscroll-lite-4.1.6',
    'spin': 'libs/spin',
    'jquery-spin': 'libs/jquery.spin',
    'd3': 'libs/d3.v3',
    'nv': 'libs/nv.d3',
    'moment': 'libs/moment',
    'lavaca': 'lavaca'
  },
  shim: {
    $: {
      exports: '$'
    },
    jquery: {
      exports: '$'
    },
    dust: {
      exports: 'dust'
    },
    'dust-helpers': {
      deps: ['dust']
    },
    templates: {
      deps: ['dust']
    },
    d3: {
      exports: 'd3'
    },
    nv: {
      deps: ['d3'],
      exports: 'nv'
    }
  }
});
require(['es5-shim']);
require(['app/app']);