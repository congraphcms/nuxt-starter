import axios from 'axios'

const formMixin = {

  data () {
    return {
      formData: {},
      confirmed: false,
      sending: false,
      submited: false
    }
  },

  computed: {
    endpoint () {
      return 'http://api.maximus.asw.eu/form/contact'
    }
  },

  created () {
    this.resetFormData()
  },

  methods: {
    resetFormData () {
      const self = this
      this.formData = {}
      this.formFields.forEach(field => {
        self.$set(self.formData, field.name, '')
      })
    },
    updateFormData (fieldName, value) {
      if (fieldName in this.formData) {
        this.formData[fieldName] = value
      } else {
        this.$set(this.formData, fieldName, value)
      }
    },
    validateBeforeSubmit (e) {
      const self = this

      self.$validator
        .validateAll()
        .then((isValid) => {
          if (isValid) {
            self.submitForm()
          } else {
            console.log('Form is not valid')
          }
        })
        .catch((err) => {
          console.log('there was an error', err)
        })
    },
    submitForm (event) {
      const self = this
      if (self.sending) return
      self.sending = true

      let data = {
        // topic field
        topic: self.topic,
        // form data
        ...self.formData
      }

      // send
      axios.post(this.endpoint, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        console.log('form sent', response)
        setTimeout(() => {
          self.sending = false
        }, 300)
        self.onSuccess()
      }).catch(function (error) {
        console.error(error)
        setTimeout(() => {
          self.sending = false
        }, 300)
      })
    },
    onSuccess () {
      const self = this
      self.submited = true
      this.resetFormData()
      self.$validator.reset()
      this.$emit('form-on-success')
    }
  }
}

export default formMixin
