<template>
  <div class="App">
  <b-navbar toggleable type="dark" variant="dark">
      <router-link class="nav-link" to="/"
                  >Vue js CRUD Application</router-link
                >

    <b-navbar-toggle target="navbar-toggle-collapse">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/">Home</b-nav-item>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
    <br />
    <div class="container">
      <div class="row">
        <!-- <div class="col col-sm col-md-2 col-lg-2"></div> -->
        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
          <router-view></router-view>
        </div>
        
      </div>
    </div>


  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style></style>
