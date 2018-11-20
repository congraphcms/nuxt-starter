import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'

// @TODO dynamically import form messages
import en from '@/locales/forms/en_US'

Validator.localize('en_US', en)

Vue.use(VeeValidate, {
  locale: en
})
