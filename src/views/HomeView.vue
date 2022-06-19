<template>
  <div class="home">
    <div class="container central">
      <div class="row">
        <div class="col">
          <h1>รายการรถ</h1>
          <hr />

          <section>
            <div>
              <b-container fluid>
                <b-skeleton-wrapper :loading="loading">
                  <template #loading>
                    <b-skeleton-table
                      :rows="5"
                      :columns="6"
                      :table-props="{ bordered: false, striped: true }"
                      animation="throb"
                    ></b-skeleton-table>
                  </template>
                  <!-- User Interface controls -->
                  <div class="row">
                    <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                      <div class="mb-3">
                        <label class="form-label">เลือกคำค้นหายี่ห้อรถ</label>
                        <multiselect
                          placeholder="เลือกคำค้นหายี่ห้อรถ"
                          v-model="search.brandId"
                          :options="
                            viewbrand.map((viewbrand) => viewbrand.brandId)
                          "
                          :custom-label="
                            (opt) =>
                              viewbrand.find((x) => x.brandId == opt).brandName
                          "
                        >
                        </multiselect>
                      </div>
                    </div>

                    <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                      <div class="mb-3">
                        <label class="form-label">คำค้นหารหัสรุ่นรถ</label>
                        <input
                          maxlength="20"
                          type="text"
                          class="form-control"
                          v-model="search.modelCode"
                          placeholder="คำค้นหารหัสรุ่นรถ"
                        />
                      </div>
                    </div>

                    <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                      <div class="mb-3">
                        <label class="form-label">คำค้นหาชื่อรุ่นรถ</label>
                        <input
                          maxlength="45"
                          type="text"
                          class="form-control"
                          v-model="search.name"
                          placeholder="คำค้นหาชื่อรุ่นรถ"
                        />
                      </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                      <button
                        class="btn btn-primary float-end m-1"
                        @click.prevent="Listcar"
                      >
                        ค้นหา
                      </button>
                      <div>
                        <router-link
                          to="/Create"
                          type="button"
                          class="btn btn-success float-end m-1"
                          ><i class="bi bi-plus-circle"></i> สร้าง</router-link
                        >
                      </div>
                    </div>
                    แสดงผล
                    <div class="col-6 col-sm-2 col-md-2 col-lg-1">
                      <b-form-select
                        class="form-select"
                        id="per-page-select"
                        v-model="perPage"
                        :options="pageOptions"
                        @change="changecurrentPage"
                        size="sm"
                      ></b-form-select>
                    </div>
                    รายการ
                  </div>

                  <!-- Main table element :filter="test" -->
                  <div class="table-responsive">
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
                        <span v-if="view.item.fuel === 'D'">{{
                          viewfuel.D
                        }}</span>
                        <span v-if="view.item.fuel === 'S'">{{
                          viewfuel.S
                        }}</span>
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
                  </div>
                  แสดงผล {{ viewtotal }} หน้า {{ currentPage }} จาก
                  {{ perPage }} รายการ

                  <b-pagination
                    v-model="currentPage"
                    :total-rows="viewtotal"
                    :per-page="perPage"
                    @change="changePage"
                    align="right"
                    size="sm"
                    class="my-0"
                  ></b-pagination>
                </b-skeleton-wrapper>
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
import Multiselect from "vue-multiselect";
export default {
  name: "home",
  components: { Multiselect },
  data() {
    return {
      view: [],
      viewfuel: "",
      viewtotal: 0,
      viewsearch: [],
      viewbrand: [],
      loading: false,
      url: "https://dms-backend-dev-dxvb7izyka-as.a.run.app",
      erroredview: false,
      search: {
        brandId: "",
        modelCode: "",
        name: "",
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
    this.Listbrand();
  },
  methods: {
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
      this.loading = true;
      axios
        .get(`${this.url}/api/vehicle-model`, {
          params: {
            page: this.currentPage,
            perPage: this.perPage,
            brandId: this.search.brandId,
            modelCode: this.search.modelCode,
            name: this.search.name,
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
        })
        .then(() => {
          this.loading = false;
          console.log(this.loading);
        });
    },

    Listbrand() {
      axios
        .get(`${this.url}/api/vehicle-model/brand`)
        .then((response) => {
          this.viewbrand = response.data;
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
          });
          console.log(error.message);
        });
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
        .delete(`${this.url}/api/vehicle-model/delete?`, {
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
