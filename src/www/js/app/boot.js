require.config({
  baseUrl: 'js',
  paths: {
    'es5-shim': '../components/es5-shim/es5-shim',
    '$': '../components/jquery/index',
    'hammer': '../components/hammerjs/dist/jquery.hammer',
    'mout': '../components/mout/src',
    'dust': '../components/dustjs-linkedin/dist/dust-full-2.0.4',
    'dust-helpers': '../components/dustjs-linkedin-helpers/dist/dust-helpers-1.1.1',
    'rdust': '../components/require-dust/require-dust',
    'iScroll': '../components/iscroll/dist/iscroll-lite-min',
    'spin': '../components/spinjs/dist/spin',
    'jquery-spin': '../components/spinjs/jquery.spin',
    'moment': '../components/momentjs/moment',
    'd3': '../components/d3/d3',
    'nv': '../components/nvd3/nv.d3',
    'lavaca': '../components/lavaca/src'
  },
  shim: {
    $: {
      exports: '$'
    },
    dust: {
      exports: 'dust'
    },
    'dust-helpers': {
      deps: ['dust']
    },
    hammer: {
      deps: ['$'],
      exports: 'Hammer'
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