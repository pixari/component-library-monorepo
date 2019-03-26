# Monorepo solution for multiple VueJs Apps and a shared component library. 
> This is still a "work in progress" tutorial. It actually already works, but I still have to refine some steps. Feel free to help me / send me your suggestions.

## Getting Started

### Install Lerna
Let's start by installing Lerna globally with npm:

```bash
$ npm install --global lerna
```
****
Next we have to create a new git repository:

```bash
$ git init component-library-monorepo && cd component-library-monorepo 
```

And then, following Lerna's official documentation, will turn it into a Lerna repo:

```bash
lerna init
```

The repository should look lihe this:

```bash
component-library-monorepo/
  packages/
  lerna.json
  package.json
```

If you'd like to learn something more about this process, you can check the official [Lerna documentation](https://github.com/lerna/lerna#readme).

### Install Storybook
Let's start by installing Lerna globally with npm:

```bash
$ npm install @storybook/vue --save-dev
```

Add peer dependencies

```bash
$ npm install vue --save
$ npm install vue-loader vue-template-compiler @babel/core babel-loader babel-preset-vue --save-dev 
```

Add a npm script

```json
{
  "scripts": {
    "storybook": "start-storybook"
  }
}
```

For a basic Storybook configuration, the only thing you need to do is tell Storybook where to find stories.

To do that, create a file at .storybook/config.js with the following content:

```js
import { configure } from '@storybook/vue';

const req = require.context('../packages', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
configure(loadStories, module);
```

## Add the first component to the component library

We create in the root a packages/index.stories.js file and write our first story:

```js
import Vue from 'vue';
import { storiesOf } from '@storybook/vue';
import MyButton from './Button/src/Button.vue';

storiesOf('Button', module)
  .add('as a component', () => ({
    components: { MyButton },
    template: '<my-button>with text</my-button>'
  }))
  .add('with emoji', () => ({
    components: { MyButton },
    template: '<my-button>😀 😎 👍 💯</my-button>'
  }))
  .add('with text', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }));
```

Now we create the real "Button" component:

```bash
/packages/Button
  /src
    Button.vue
```

```html
<template>
  <button type="button"><slot /></button>
</template>

<script>
export default {
  name: 'MyButton',
}
</script>
```

The index.js
```bash
/packages/Button
  src/index.js
```

```bash
import MyButton from './Button.vue';
export default MyButton;
```

And the package.json:

```json
{
  "name": "@mylibrary/my-button",
  "version": "0.2.0",
  "description": "Just a simple button component",
  "main": "dist/index.js",
  "module": "src/index.js",
  "scripts": {
    "transpile": "vue-cli-service build --target lib ./src/index.js"
  }
}
```

### Start Storybook
Now you are ready to start Storybook and play with your first component:

```bash
$ npm run storybook
```

And you should see it running here:
```url
http://localhost:51368
```

## Create a VueJs App

### Installation
To install the Vue CLI, use this command:

```bash
$ npm install -g @vue/cli
$ npm install --save-dev @vue/cli-service
```

### Create a new project
To create a new project, run:

```bash
$ cd packages && vue create my-app
```

And please choose the easiest option:

```bash
> default (babel, eslint)
```

In this tutorial we don't want to build the best VueJs App possible, but just show how to share a component library between VueJs Apps.

## Add eslint configuration

Create ./packages/my-app/.eslintrc.js

```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
};
```

### Run the App
Let's run our new app:

```bash
$ cd my-app && npm run serve
```

And now you should see here your app, up&running:

```url
http://localhost:8080/
```

## Using Lerna to link dependencies

Add the following dependency to your packages/my-app/package.json:

```json
{
  "dependencies": {
    "@mylibrary/my-button": "*"
  }
}
```

## Fix eslint

```js
const path = require('path');
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .tap(options => {
        options.configFile = path.resolve(__dirname, ".eslintrc.js");
        return options;
      })
  },
  css: {
    loaderOptions: {
      postcss: {
        config:{
          path:__dirname
        }
      }
    }
  }
}
```

And now we can "bootstrap" the packages in the current Lerna repo, install all of their dependencies and links any cross-dependencies:

In the root:
```bash
$ lerna bootstrap
```

## Update the Vue App

Change the content of ./packages/my-app/src/main.js:

```js
import Vue from 'vue'
import App from './App.vue'
import MyButton from '@mylibrary/my-button';

Vue.config.productionTip = false
Vue.component('my-button', MyButton);
new Vue({
  render: h => h(App),
}).$mount('#app')
```

and change the content of our HelloWorld component (./packages/my-app/src/components/HelloWorld.vue):

```js
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <my-button>It Works!</my-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
```

We now transpile our components:

```bash
$ lerna run transpile
```

run again..

```bash
$ cd packages/my-app && npm run serve
```

Go to http://localhost:8080 and you should se the button in the middle of the HelloWorld page :)

