<template>
  <button
    class="
      px-4
      py-2
      ml-2
      text-white
      transition
      duration-200
      bg-blue-500
      rounded
      hover:bg-blue-600
      focus:outline-none focus:ring-2 focus:ring-offset-2
    "
    :class="{
      'bg-gray-500 !hover:bg-gray-600': disabled,
    }"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
