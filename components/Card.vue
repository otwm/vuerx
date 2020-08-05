<template>
  <div class="card" @click="detail">
    <h2> {{ person.first_name }} {{ person.last_name }}</h2>
    <img :src="'https://robohash.org/' + person.first_name + '_' + person.last_name" />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from "nuxt-property-decorator"
import type { Person } from "~/types";

@Component({})
export default class Card extends Vue {
  @Prop() person!: Person

  detail () {
    this.$router.push(`/people/${this.person.id}`)
  }
}
</script>

<style scoped>
.card {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana,
    sans-serif;
  padding: 1rem;
  margin: 0.25rem;
  border: 0.25rem solid gainsboro;
  cursor: pointer;
}
</style>
