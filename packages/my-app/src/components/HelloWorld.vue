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