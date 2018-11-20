<template>
  <div class="gdpr">
    <div @click="closeGdpr" class="close-btn">
      <span>&#10005;</span>
    </div>
    <div ref='scroller' class="gdpr-field">
      <div class="row pt-4">
        <div class="col-12 w-100">
          <h2 class="text-white text-center" v-html="$t('gdprMessage')"></h2>
        </div>
        <div class="col-12 h-100 d-flex justify-content-center">
          <div class="col-md-6">
            <p class="text-center text-white mb-2" v-html="$t('gdprSmallHeadline')" style="margin-bottom: 0"></p>
          </div>
        </div>
        <div id="gdpr" class="col-12 h-100 d-flex justify-content-center">
          <div class="col-md-6 pl-md-4 pr-md-4 pl-2 pr-2">
            <p class="text-left text-white" v-html="$t('gdprTextMessage')"></p>
          </div>
        </div>
      </div>
      <div class="row pl-md-6 pr-md-6">
        <div class="col-md-4 p-2 p-md-4">
          <div v-html="$t('firstPara')"></div>
        </div>
        <div class="col-md-4 p-2 p-md-4">
          <div v-html="$t('secondPara')"></div>
        </div>
        <div class="col-md-4 p-2 p-md-4">
          <div v-html="$t('thirdPara')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/plugins/mixins/BasePage'
import Close from '@/assets/svg/close.svg';

export default {
  name: 'gdpr',
  components: [
    Close
  ],
  mixins: [
    BasePage
  ],
  data: () => {
    preventEvents: true
  },
  mounted() {
    this.initSmooth(this.$refs.scroller, true)
  },
  methods: {
    closeGdpr () {
      this.$store.dispatch('app/SET_STATE', {
        gdprVisible: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.gdpr {
  background: #fff;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  top: 0;
  left: 0;
  background-color: rgb(25, 69, 95);
}

.gdpr-field {
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #fff;
  text-align: center;
  line-height: 1.25rem;
  z-index: 100;
  transition: all .4s;

  span {
    transition: all .4s;
    color: #00f;
    line-height: 2.5rem;
  }

  &:hover {
    background: #0f0;
    cursor: pointer;

    span {
      color: #fff;
    }
  }
}
</style>
