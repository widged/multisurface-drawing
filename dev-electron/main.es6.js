/* jshint esnext: true */

import {linkStylesheet} from './lib/StyleInjector.es6.js';

linkStylesheet([
	'../etc/style/spectre.min.css',
	'../etc/style/app.css',
	'../etc/style/tabs.css',
	'../etc/style/sections-grid.css',
]);

require('../es6/app/main.js');
