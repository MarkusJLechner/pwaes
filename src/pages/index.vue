<template>
  <div>
    <fieldset
      class="mb-3 border border-solid border-gray-400 p-3 rounded shadow-sm"
    >
      <legend class="font-bold text-sm text-left">Encrypt</legend>

      <InputTextarea v-model="inputEncode" label="Body encrypt" />

      <InputText
        v-model="inputEncodePassword"
        label="Password encrypt"
        class="my-2"
      />
    </fieldset>

    <fieldset class="border border-solid border-gray-400 p-3 rounded shadow-sm">
      <legend class="font-bold text-sm text-left">Decrypt</legend>

      <InputTextarea v-model="inputDecode" label="Body encrypt" />

      <InputText
        v-model="inputDecodePassword"
        label="Password decrypt"
        class="my-2"
      />
    </fieldset>

    <fieldset
      class="border border-solid border-gray-300 p-3 rounded shadow-sm"
      :class="{
        'border-red-500': !decodedSuccess,
        'border-green-500': decodedSuccess,
      }"
    >
      <legend class="font-bold text-sm text-left">Decoded</legend>

      <div>
        <div style="overflow-wrap: anywhere">{{ decoded }}</div>
      </div>
    </fieldset>

    <hr class="border border-gray-400 mt-5" />

    <div class="flex mt-6 mb-5">
      <InputText
        v-model="inputDescription"
        label="What do you encrypt? Explain..."
        placeholder="eg. Secrets from Wallet A"
        class="flex-grow"
      />
      <VButton
        text="Add"
        class="text-right flex-shrink"
        :disabled="isDisabledAdd()"
        @click="onSave"
      />
    </div>

    <hr class="border border-gray-400 mb-5" />

    <div class="mt-2">
      <div
        v-for="item in localStorageBody"
        :key="item"
        class="p-2 border mb-2 rounded border-gray-600"
      >
        <div class="text-sm">
          <span class="font-bold">Description: </span
          ><span>{{ item.desc }}</span>
          <div style="overflow-wrap: anywhere">{{ item.body }}</div>
        </div>

        <div class="flex justify-between">
          <VButton
            text="copy"
            class="mt-2 text-right"
            @click="copyClipboard(item)"
          />
          <VButton
            text="delete"
            class="mt-2 text-right bg-red-500"
            @click="localStorageRemove(item)"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    id="snackbar"
    class="rounded-xl text-white bg-gray-800 py-2 bg-opacity-60"
  >
    {{ snacktext }}
  </div>
</template>

<script setup>
import { useMeta } from 'vue-meta'
import { ref, watch } from 'vue'
import InputText from '~/components/InputText.vue'
import InputTextarea from '~/components/InputTextarea.vue'
import VButton from '~/components/VButton.vue'
import { aesGcmDecrypt, aesGcmEncrypt } from '~/js/crypto-aes-gcm.js'

useMeta({
  title: 'Homepage',
})

const snacktext = ref('')
const inputDescription = ref('')
const inputEncode = ref('')
const inputEncodePassword = ref('')
const inputDecode = ref('')
const inputDecodePassword = ref('')
const decoded = ref('-')
const decodedSuccess = ref(true)
const localStorageBody = ref([])

watch([inputEncode, inputEncodePassword], () => {
  encode()
})
watch([inputDecode, inputDecodePassword], () => {
  decode()
})

watch(inputEncodePassword, () => {
  inputDecodePassword.value = inputEncodePassword.value
})

function encode() {
  aesGcmEncrypt(inputEncode.value, inputEncodePassword.value).then((l) => {
    inputDecode.value = l
  })
}

function decode() {
  aesGcmDecrypt(inputDecode.value, inputDecodePassword.value)
    .then((l) => {
      decoded.value = l
      decodedSuccess.value = true
    })
    .catch(() => {
      decoded.value = 'Decode failed'
      decodedSuccess.value = false
    })
}

function isDisabledAdd() {
  return inputDecode.value === '' || inputDescription.value === ''
}

function onSave() {
  if (isDisabledAdd()) {
    return
  }
  const body = JSON.parse(localStorage.getItem('body') || '[]')
  const duplicate = body.find((itm) => itm === inputDecode.value)
  if (duplicate) {
    alert('found duplicate in saved db')
    return
  }
  body.push({ desc: inputDescription.value, body: inputDecode.value })
  localStorage.setItem('body', JSON.stringify(body))

  inputDescription.value = ''

  updateLocalStorage()

  showSnack('Added')
}

function localStorageRemove(value) {
  let body = JSON.parse(localStorage.getItem('body') || '[]')
  body = body.filter((itm) => itm.body !== value.body)
  localStorage.setItem('body', JSON.stringify(body))
  updateLocalStorage()
}

function updateLocalStorage() {
  let body = JSON.parse(localStorage.getItem('body') || '[]')
  body = body.reverse()
  localStorageBody.value = body
}

updateLocalStorage()

function copyClipboard(value) {
  navigator.clipboard.writeText(value.body)

  showSnack('copied')
}

function showSnack(text, timeout = 3000) {
  const x = document.getElementById('snackbar')
  x.className = 'show'
  snacktext.value = text
  setTimeout(function () {
    x.className = x.className.replace('show', '')
  }, timeout)
}
</script>

<style scoped>
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  text-align: center;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
