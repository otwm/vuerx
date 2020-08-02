<template>
  <section>
    <h1 class="header">Nuxt TypeScript Starter</h1>
    <div>
      <label for="name">name: </label><input type="text" name="name" id="name" v-model="name"/>
      <button @click="search">search</button>
    </div>
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
  people: Person[] = []
  name: string = ''

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

  async search () {
    try {
      const res = await axios({
        url: '/server/people',
        params: {
          name: this.name,
        }
      })
      this.people = res.data
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
