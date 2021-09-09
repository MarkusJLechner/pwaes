<template>
  <div
    class="
      outline
      relative
      flex
      border-2
      rounded-lg
      border-blue-200
      bg-white
      focus-within:border-blue-500
    "
  >
    <input
      :value="modelValue"
      type="text"
      name="textfield"
      :placeholder="placeholder"
      class="block p-4 w-full appearance-none focus:outline-none bg-transparent"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <label
      for="textfield"
      class="
        absolute
        pointer-events-none
        top-0
        text-sm text-left
        bg-white
        p-2
        ml-2
        mt-1
        -z-1
        duration-300
        origin-0
      "
      >{{ label }}</label
    >
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },

    modelValue: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: ' ',
    },
  },

  emits: ['update:modelValue'],
}
</script>
