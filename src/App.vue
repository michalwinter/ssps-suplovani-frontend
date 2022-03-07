<template>
  <div id="body" :class="{ dark }">
    <article class="update" v-show="seenUpdate !== version">
      <div class="update-clickout" @click="seenUpdate = version"></div>
      <div class="update-content">
        <div class="header">
          <p>Verze {{ version }}</p>
          <button @click="seenUpdate = version">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="content">
          <strong>Novinky:</strong>
          <ul>
            <li>
              Vylepšení vzhledu - barvy zvýrazněné třídy
            </li>
          </ul>
        </div>
      </div>
    </article>
    <header>
      <button @click="dark = !dark">
        <i v-if="!dark" class="fas fa-moon"></i>
        <i v-else class="fas fa-lightbulb"></i>
      </button>
      <h1 v-text="settings ? 'Nastavení' : 'SSPŠaG Suplování'"></h1>
      <button @click="settings = !settings">
        <i v-if="!settings" class="fas fa-cog"></i>
        <i v-else class="fas fa-times"></i>
      </button>
    </header>
    <main v-if="!settings">
      <section class="info">
        <p>Suplování je kontrolováno serverem každou 5. minutu v hodině.</p>
      </section>
      <section v-if="today" class="day">
        <h2>Dnes, {{ getCzechDate(today.date) }}</h2>
        <div class="events">
          <div class="event" v-for="(event, i) in today.list" :key="i">
            <div class="grade" :class="{ highlight: event.grade === grade }">
              <span>{{ event.grade }}</span>
            </div>
            <!--<div class="hour">
                <span>{{ event.hour }}.h</span>
              </div>-->
            <h3>{{ event.text }}</h3>
          </div>
        </div>
      </section>
      <section v-else class="day">
        <h2>Dnes, {{ todayDate }}</h2>
        <p class="none">Žádné suplování na tento den.</p>
      </section>
      <section class="day" v-if="tomorrow">
        <h2>Zítra, {{ getCzechDate(tomorrow.date) }}</h2>
        <div class="events">
          <div class="event" v-for="(event, i) in tomorrow.list" :key="i">
            <div class="grade" :class="{ highlight: event.grade === grade }">
              <span>{{ event.grade }}</span>
            </div>
            <h3>{{ event.text }}</h3>
          </div>
        </div>
      </section>
      <section class="day" v-for="(day, i) in upcomingDays" :key="i">
        <h2>{{ getCzechDate(day.date) }}}</h2>
        <div class="events">
          <div class="event" v-for="(event, i) in day.list" :key="i">
            <div class="grade" :class="{ highlight: event.grade === grade || event.grade === (grade[0] + '.r') }">
              <span>{{ event.grade }}</span>
            </div>
            <h3>{{ event.text }}</h3>
          </div>
        </div>
      </section>
    </main>
    <main v-else>
      <section class="setting">
        <span>Zvýrazněná třída:</span>
        <p class="alert" v-show="newGrade !== grade">Upraveno. Musí se uložit!</p>
        <input type="text" v-model="newGrade" :class="{ modified: newGrade !== grade}" :placeholder="grade ? grade : 'Třída pro zvýraznění'">
        <button :disabled="newGrade === grade" @click="saveGrade">Uložit</button>
      </section>
      <section class="setting">
        <span>Nastavení notifikací:</span>
        <p>Comming soon!</p>
      </section>
    </main>
  </div>
</template>

<script>
import moment from "moment";
import { version } from "../package.json";
export default {
  name: "App",
  data: () => ({
    standalone: false,
    settings: false,
    newGrade: "",
    todayDate: "",
    version,
  }),
  mounted() {
    this.$store.dispatch("getData");
    let todayDate = moment().locale("cs").format("dddd D. M. YYYY")
    this.todayDate = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);
    this.newGrade = this.$store.state.grade || "";
  },
  computed: {
    dark: {
      get() {
        return this.$store.state.dark;
      },
      set(value) {
        this.$store.commit("setDark", value);
      },
    },
    seenUpdate: {
      get() {
        return this.$store.state.seenUpdate;
      },
      set(value) {
        this.$store.commit("setSeenUpdate", value);
      },
    },
    grade: {
      get() {
        return this.$store.state.grade;
      },
      set(value) {
        this.$store.commit("setGrade", value);
      },
    },
    today() {
      return this.$store.state.days.find((day) => {
        return moment(day.date).isSame(moment(), "day");
      });
    },
    tomorrow() {
      //Check if tomorrow is a weekend
      if (moment().add(1, "days").isoWeekday() > 5) return false;
      return this.$store.state.days.find((day) => {
        return moment(day.date).isSame(
          moment().add(1, "day"),
          "day"
        );
      });
    },
    upcomingDays() {
      // upcoming days excluding today and tomorrow
      return this.$store.state.days.filter((day) => {
        return (
          moment(day.date).isAfter(moment(), "day") &&
          moment(day.date).isAfter(moment().add(1, "days"), "day")
        );
      });
    },
  },
  methods: {
    getCzechDate(inputDate) {
      let date = moment(inputDate).locale("cs").format("dddd D. M. YYYY");
      return date.charAt(0).toUpperCase() + date.slice(1);
    },
    saveGrade() {
      if (this.newGrade === this.grade) return;
      this.$store.commit("setGrade", this.newGrade);
    },
  },
};
</script>