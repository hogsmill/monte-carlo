<template>
  <tr>
    <td>
      Delimiter
    </td>
    <td>
      <select :id="id()" @change="updateDelimiter()" :value="current.delimiter">
        <option value="tab">
          \t (tab)
        </option>
        <option value="comma">
          , (comma)
        </option>
        <option value="semicolon">
          ; (semicolon)
        </option>
        <option value="colon">
          : (colon)
        </option>
        <option value="space">
          \s (space)
        </option>
      </select>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'scope'
  ],
  computed: {
    current() {
      return this.$store.getters.getCurrent
    }
  },
  methods: {
    id() {
      return this.scope == 'load' ? 'backlog-load-file-separator' : 'backlog-save-file-separator'
    },
    updateDelimiter() {
      const delimiter = document.getElementById(this.id()).value
      this.$store.dispatch('updateCurrent', {field: 'delimiter', value: delimiter})
    }
  }
}
</script>
