<template>
  <main>
    <section class="card">
      <div class="img">
        <img :src="path(['avatar'], person)"
             :alt="`${path(['first_name'], person)}${path(['last_name'], person)}`"
        />
        <div>
        <span>{{ path(['first_name'], person) }} {{ path(['last_name'], person) }}
      </span>
        </div>
      </div>
      <div class="text">
        <div class="info">
          <div class="left">
            <i class="fa fa-female" v-if="path(['gender'], person) === 'Female'"></i>
            <i class="fa fa-male" v-if="path(['gender'], person) === 'Male'"></i>
          </div>
          <div class="right">
            <div>
              <label>phone: </label>
              <span>{{ path(['contact', 'phone'], person) }}</span>
            </div>
            <div>
              <label>email: </label>
              <span>{{ path(['contact', 'email'], person) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="action">
        <button @click="toggleEdit">
          edit
        </button>
        <button @click="remove">
          remove
        </button>
      </div>
    </section>
    <div class="edit card" v-if="edit">
      <div class="text">
        <form>
          <label>Name
            <input type="text" v-model="editPerson.first_name">
            <input type="text" v-model="editPerson.last_name">
          </label>
          <label>phone
            <input type="text" v-model="editPerson.contact.phone">
          </label>
          <label>email
            <input type="text" v-model="editPerson.contact.email">
          </label>
          <label>gender
            <select v-model="editPerson.gender">
              <option>Male</option>
              <option>FeMale</option>
            </select>
          </label>
          <label>ip_address
            <input type="text" v-model="editPerson.ip_address">
          </label>
          <hr/>
          <span>address</span>
          <label>city
            <input type="text" v-model="editPerson.address.city">
          </label>
          <label>country
            <input type="text" v-model="editPerson.address.country">
          </label>
          <label>postalCode
            <input type="text" v-model="editPerson.address.postalCode">
          </label>
          <label>state
            <input type="text" v-model="editPerson.address.state">
          </label>
          <label>street
            <input type="text" v-model="editPerson.address.street">
          </label>
        </form>
      </div>
      <div class="action">
        <button @click="save">
          save
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Person } from '~/types'
import peopleService from '~/service/peopleService'
import observer from '~/utils/observer'
import { path } from 'ramda'

@Component({
  methods: {
    path,
  }
})
export default class IdPage extends Vue {
  person: Person|null = null
  editPerson: Person|object = { contact: {}}
  edit: boolean = false

  mounted () {
    peopleService.detail(Number(this.$route.params.id), {
      ...observer, next: this.setPeople
    })
  }

  setPeople (data: Person) {
    this.person = data
    this.editPerson = data
  }

  toggleEdit () {
    this.edit = !this.edit
  }

  remove () {

  }

  save () {
    peopleService.update(this.editPerson as Person, this.setPeople)
  }

}
</script>

<style scoped lang="scss">
.card {
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  margin: 1rem;
  position: relative;
  width: 300px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);

  &.edit {
    width: 600px;
    form {
      margin-top: 0.6rem;
    }
    label {
      display: block;
      line-height: 1.8rem;
    }
  }

  .img {
    background-color: #3B8070;
    text-align: center;
    position: relative;
    span {
      color: #ffffff;
      position: absolute;
      top: 0.5rem;
      left: 1rem;
    }
  }

  .text {
    padding: 0.5rem;
    .info {
      display: flex;
      .left {
        display: flex;
        justify-content: center;
        padding: 0.5rem;
        align-items: center;
      }
      .right {
        margin-left: 5px;
        padding: 0.5rem;
      }
    }
  }

  .action {
    padding: 0.5rem;
    bottom: 0;
  }
}

main {
  display: flex;
}


</style>
