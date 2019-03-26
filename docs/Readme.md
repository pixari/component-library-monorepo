# Foo
> adasd

## Getting Started

### Install Lerna
Let's start by installing Lerna globally with npm:

```bash
$ npm install --global lerna
```

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

We create a ../stories/index.stories.js file and write our first story:

```js
import Vue from 'vue';
import { storiesOf } from '@storybook/vue';
import MyButton from './Button/Button.vue';

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
./packages/Button/Button.vue
```

Button.vue: 
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

And we create the package.json of the component: 

```json
{
  "name": "@mylibrary/my-button",
  "version": "0.1.0",
  "description": "Just a simple button component",
  "main": "dist/index.js",
  "module": "src/index.js",
  "scripts": {
    "transpile": "babel src -d dist --ignore '**/*.spec.js,**/*.stories.js'"
  },
  "babel": {
    "presets": [
      "@babel/preset-env",
      "vue"
    ],
    "env": {
      "test": {
        "plugins": [
          "transform-es2015-modules-commonjs"
        ]
      }
    }
  }
}
```



### Start Storybook
Now you are ready to start Storybook and play with your first component:

```bash
$ npm run storybook
```

[IMG Storybook 1]

## Create a VueJs App

### Installation
To install the Vue CLI, use this command:

```bash
$ npm install -g @vue/cli
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

And now we can "bootstrap" the packages in the current Lerna repo, install all of their dependencies and links any cross-dependencies:

```bash
$ lerna bootstrap
```

## Babel

Type the following command to install the babel-cli and babel-core modules:

```bash
$ npm install babel-cli babel-core --save-dev
```

Type the following command to install the ECMAScript 2015 preset:

```bash
$ npm install babel-preset-es2015 --save-dev
$ npm install @babel/cli --save-dev
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

## Update the Vue App

now..
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

and update your HelloWorld component (my-app/src/components/HelloWorld.vue)

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
