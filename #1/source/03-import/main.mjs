import { info, log } from './name.mjs';
import substack from './substack';
import My from './class';
import path from 'path';

info('name');
log('name');

substack('substack');
substack.log('sub');

const my = new My('My');
my.info('class');
my.log('class');

const __dirname = path.dirname(new URL(import.meta.url).pathname);

console.log(__dirname);
