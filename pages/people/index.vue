<template>
  <section>
    <h1 class="header">Nuxt TypeScript Starter</h1>
    <div>
      <label for="name">name: </label><input type="text" name="name" id="name" v-model="name"/>
      <label for="size">size: </label>
      <select name="size" id="size" v-model="size">
        <option>5</option>
        <option>10</option>
        <option>20</option>
      </select>
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
import type { Person } from "~/types";
import Card from "~/components/Card.vue"
import normalRx from '~/service/peopleService/impl/normalRx'
import observer from '~/utils/observer'

const { log } = console

@Component({
  components: {
    Card
  },
})
export default class extends Vue {
  people: Person[] = []
  name: string = ''
  size = 10

  search () {
    const { name, size } = this
    normalRx.search({ name, size }, {
      ...observer, next: this.setPeople
    })
  }

  setPeople (data: Person[]) {
    this.people = data
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
