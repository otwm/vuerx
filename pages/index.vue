<template>
  <section>
    <h1 class="header">Nuxt TypeScript Starter</h1>
    <div class="cards">
      <Card
        v-for="person in people"
        :key="person.id"
        :person="person"
      ></Card>
    </div>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import type { Person } from "~/types";
import Card from "~/components/Card.vue"
import axios from 'axios'

@Component({
  components: {
    Card
  }
})
export default class extends Vue {
  @State people!: Person[]

  async mounted () {
    console.log(await this.getRandomData())
  }

  async getRandomData () {
    try {
      const res = await axios({
        url: '/random-data.json'
      })
      return res.data
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.header {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.cards {
  display: flex;
  flex-wrap: wrap;
}
</style>
