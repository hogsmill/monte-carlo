<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['feedback']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Feedback</h4>
      <p class="feedback-form">
        Thanks for using {{ thisGame }}; we'd love to hear any feedback you have
        so that we can constantly improve things.
      </p>
      <div class="feedback-form">
        <input type="text" id="email" class="form-control" placeholder="Email (optional)">
        <br>
        <textarea id="comments" rows="6" class="form-control" placeholder="Your comments" />
        <br>
        <button class="btn btn-sm btn-secondary smaller-font" @click="sendFeedback()">
          Send Feedback
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import { $vfm, VueFinalModal } from 'vue-final-modal'

import mailFuns from '../../lib/mail.js'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    thisGame() {
      return this.$store.getters.thisGame
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'feedback')
    },
    sendFeedback() {
      mailFuns.post({
        action: 'Feedback from ' + this.thisGame,
        email: encodeURIComponent(document.getElementById('email').value),
        comments: encodeURIComponent(document.getElementById('comments').value)
        },
        'Thanks for your feedback - we appreciate it!'
      )
      this.hide()
    }
  }
}
</script>

<style scoped lang="scss">

  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
    width: 90%;
    max-width: 850px;
  }
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }

  .feedback {
    letter-spacing: 0;
    color: #212529;
  }

  p.feedback-form {
    margin-bottom: 12px;
  }

  .feedback-form {
    width: 80%;
    margin: 0 auto;
  }
</style>
