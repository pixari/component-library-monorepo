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