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
run `npm run dev`, or use IntelliJ built-in integration with `npm`. 

This rebuilds the `./demo-page/index.js` file as you change it (and dependencies). you still need to reload the webpage manually.

#### To run test
run `npm test`. This uses `jest` and watches the folder for '.test*' and '.spec*' files. 

