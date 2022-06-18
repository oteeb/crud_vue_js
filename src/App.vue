<template>
  <div class="App">
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark"
      aria-label="Tenth navbar example"
    >
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="navbarsExample08"
          aria-controls="navbarsExample08"
          aria_expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class="collapse navbar-collapse justify-content-md-center"
          id="navbarsExample08"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <h5>
                <router-link class="nav-link" to="/"
                  >Vue js CRUD Application</router-link
                >
              </h5>
            </li>
            <li class="nav-item">
              <h5>
                <router-link class="nav-link" to="/test"
                  >test</router-link
                >
              </h5>
            </li>
          </ul>
        </div>

        <!--  Search
          <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>-->
      </div>
    </nav>
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
