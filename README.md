# Webpack 5 Module Federation with React/Typescript

This project consist of three pieces, a host app `container` and two remotes `app1` `app2`.

Workflow:

- `app1` expose CounterAppOne component.
- `app2` expose CounterAppTwo header component.
- `container` import CounterAppOne and CounterAppTwo component.

## Running Demo

In order to run the demo I highly recommend installing lerna globally via

```bash
npm i -g lerna
```

Then,

```bash
lerna bootstrap
```

Run the command above at the root of your project. This command will make sure you have dependencies you need in order to run this project.

Finally,

```bash
npm run start
```

Lerna will start all your projects parallelly and open your browser.

- http://localhost:3000/ (container)
- http://localhost:3001/ (app1)
- http://localhost:3002/ (app2)

## Tech Stack

React, Typescript, Chakra UI, Webpack
