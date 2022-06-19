<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>รายการรถ</h1>
          <hr />

          <section v-if="erroredview">
            <p>
              ขออภัย เราไม่สามารถเรียกข้อมูลนี้ได้ในขณะนี้
              โปรดลองอีกครั้งในภายหลัง
            </p>
          </section>

          <section v-else>
            <div v-if="loadingview">Loading...</div>

            <div v-else>
              <b-container fluid>
                <!-- User Interface controls -->
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                    <div class="mb-3">
                      <label class="form-label">brandId (multiselect)</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="search.brandIds"
                      />
                    </div>
                  </div>

                  <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                    <div class="mb-3">
                      <label class="form-label">modelCode</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="search.modelCodes"
                      />
                    </div>
                  </div>

                  <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                    <div class="mb-3">
                      <label class="form-label">name</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="search.names"
                      />
                    </div>
                  </div>

                  <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                    <button class="btn btn-primary float-end m-1" @click="Searchdata(search.brandIds, search.modelCodes, search.names)">
                      ค้นหา
                    </button>
                    <div>
                      <router-link
                        to="/Create"
                        type="button"
                        class="btn btn-success float-end m-1"
                        ><i class="bi bi-plus-circle"></i> Add</router-link
                      >
                    </div>
                  </div>

                  <div class="col-6 col-sm-2 col-md-2 col-lg-2">
                    <b-form-select
                      class="form-select"
                      id="per-page-select"
                      v-model="perPage"
                      :options="pageOptions"
                      @change="changecurrentPage"
                      size="sm"
                    ></b-form-select>
                  </div>
                  <!-- <b-col sm="5" md="6" class="my-1">
                    <b-form-group
                      label="Per page"
                      label-for="per-page-select"
                      label-cols-sm="6"
                      label-cols-md="4"
                      label-cols-lg="3"
                      label-align-sm="right"
                      label-size="sm"
                      class="mb-0"
                    >
                      <b-form-select
                        class="form-select"
                        id="per-page-select"
                        v-model="perPage"
                        :options="pageOptions"
                        @change="changecurrentPage"
                        size="sm"
                      ></b-form-select>
                    </b-form-group>
                  </b-col> -->

                  <!-- <b-col lg="6" class="my-1">
                    <b-form-group
                      label="Search"
                      label-for="filter-input"
                      label-cols-sm="3"
                      label-align-sm="right"
                      label-size="sm"
                      class="mb-0"
                    >
                      <b-input-group size="sm">
                        <b-form-input
                          id="filter-input"
                          v-model="filter"
                          type="search"
                          placeholder="Type to Search"
                        ></b-form-input>

                        <b-input-group-append>
                          <b-button :disabled="!filter" @click="filter = ''"
                            >Clear</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col> -->
                </div>

                <!-- Main table element :filter="test" -->
                <b-table
                  :items="view"
                  :fields="fields"
                  :current-page="currentPage"
                  :per-page="0"
                  
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  stacked="md"
                  small
                >
                  <template #cell(fuel)="view">
                    <span v-if="view.item.fuel === 'D'">{{ viewfuel.D }}</span>
                    <span v-if="view.item.fuel === 'S'">{{ viewfuel.S }}</span>
                  </template>

                  <template #cell(actions)="view">
                    <button
                      class="btn btn-secondary"
                      type="button"
                      @click="Update(view.item.modelId)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    &nbsp;<button
                      type="button"
                      class="btn btn-danger"
                      @click="Deletealert(view.item.modelId)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </template>
                </b-table>

                <b-pagination
                  v-model="currentPage"
                  :total-rows="viewtotal"
                  :per-page="perPage"
                  @change="changePage"
                  align="right"
                  size="sm"
                  class="my-0"
                ></b-pagination>
              </b-container>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "home",
  data() {
    return {
      view: [],
      viewfuel: "",
      viewtotal: 0,
      url: "https://dms-backend-dev-dxvb7izyka-as.a.run.app",
      loadingview: true,
      erroredview: false,
      search: {
        brandIds: "",
        modelCodes: "",
        names: "",
      },
      
      fields: [
        {
          key: "modelId",
          label: "รหัส (ระบบ) รุ่นรถ",
        },
        {
          key: "modelCode",
          label: "รหัสรุ่นรถ",
        },
        {
          key: "name",
          label: "ชื่อรุ่นรถ",
        },
        {
          key: "brandName",
          label: "ยี่ห้อรถ",
        },

        {
          key: "modelYear",
          label: "ปีรถ",
          sortable: true,
        },
        {
          key: "fuel",
          label: "การใช้น้ำมัน",
        },
        {
          key: "actions",
          label: "",
        },
      ],

      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, 20, 25, 50],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
    };
  },
  mounted() {
    this.Listcar();
  },
  methods: {
    Searchdata(brandIds, modelCodes, names){
      this.search = brandIds, modelCodes, names;
      console.log(this.search);

    },

    changecurrentPage(currentPages) {
      this.perPage = currentPages;
      console.log(this.perPage);
      this.Listcar();
    },

    changePage(page) {
      this.currentPage = page;
      //console.log(this.currentPage);
      this.Listcar();
    },

    Listcar() {
      this.loadingview = true;
      axios
        .get(this.url + "/api/vehicle-model", {
          params: {
            page: this.currentPage,
            perPage: this.perPage,
          },
        })
        .then((response) => {
          this.view = response.data.data;
          this.viewfuel = response.data.statusLabel.fuel;
          this.viewtotal = response.data.total;

          //console.log(this.view);
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
          });
          //console.log(error.message);
          this.erroredview = true;
        })
        .finally(() => (this.loadingview = false));
    },

    Update(id) {
      this.$router.push({ name: "Update", params: { id: id } });
    },

    Deletealert(id) {
      this.$swal
        .fire({
          title: "ต้องการที่จะลบข้อมูล หรือไม่ ?",
          text: "คุณจะไม่สามารถย้อนกลับได้!!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ใช่ ลบออก!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.Delete(id);
          }
        });
    },
    Delete(id) {
      axios
        .delete(this.url + "/api/vehicle-model/delete?", {
          params: {
            modelId: id,
          },
        })
        .then((response) => {
          this.view = response.data;
          this.$swal.fire(response.data.message);
          this.Listcar();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
          });
        });
    },
  },
};
</script>
