## Usage

### ot-reducers
```js
import {reducer} from 'ot/string';

reducer('Mary has a little lamb.', {ot: [5, 4]}); // 'Mary a little lamb.'
```
### applying operations
```js
import {apply} from 'ot/string';

apply('Mary has a little lamb.', [23, " Bob is awesome"]);// 'Mary ... Bot ... awesome'
apply('Mary has a little lamb.', [0, 4]);// 'has a little lamb';
apply('Mary has a little lamb.', [0, [5, 17]]);// 'has a little Mary lamb';
```
### transforms
```js
import {transform} from 'ot/string';

transform('Mary ', [0, 5], [2, 'r']); // [0, 'r']
```

## Development

first install npm. Then install the following tools globally
```sh
npm install -g babel-cli karma-cli jest-cli
```
Then install local packages
```bash
npm install
```
### To develop
First run `watch-build` in workspace/package.json, to have babel watch and compile from workspace root.
Then run `start` under demo-page, or use IntelliJ built-in integration with `npm`. 

This rebuilds the `./demo-page/index.js` file as you change it (and dependencies). you still need to reload the webpage manually.

#### To run test
run `npm test` to test once. To develop and test while developing, run `npm run test-watch`. This uses `jest --watch`, which watches the folder for '.test*' and '.spec*' files. 

