import { run, testSuite } from 'waverunner';

run(testSuite(
  require('./schema.test'),
));
