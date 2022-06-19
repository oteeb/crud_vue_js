<template>
  <div class="Updates">
    <!--Update-->
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-10">
          <b-skeleton-wrapper :loading="loading">
            <template #loading>
              <b-card>
                <b-skeleton animation="wave" width="85%"></b-skeleton>
                <b-skeleton animation="wave" width="55%"></b-skeleton>
                <b-skeleton animation="wave" width="70%"></b-skeleton>
              </b-card>
            </template>
            <form @submit.prevent="Update">
              <h1>แก้ไข</h1>
              <hr />
              <div class="row g-3">
                <div class="col-md-6">
                  <code> * </code
                  ><label for="form-label">เลือกยี่ห้อรถ :</label>

                  <multiselect
                    v-model="applicantUpdate.brandId"
                    :options="viewbrand"
                    label="brandName"
                    placeholder="เลือกยี่ห้อรถ"
                  >
                  </multiselect>
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.brandId.required"
                  >
                    กรุณาเลือกยี่ห้อรถ
                  </small>
                </div>
                <div
                  class="col-md-6"
                  :class="{
                    'form-group--error': $v.applicantUpdate.modelCode.$error,
                  }"
                >
                  <code> * </code><label for="form-label">รหัสรุ่นรถ :</label>
                  <input
                    maxlength="20"
                    type="text"
                    class="form-control"
                    placeholder="MD-"
                    v-model="applicantUpdate.modelCode"
                    v-model.trim="$v.applicantUpdate.modelCode.$model"
                  />
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.modelCode.required"
                  >
                    กรุณากรอกรหัสรุ่นรถ
                  </small>
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.modelCode.minLength"
                  >
                    รหัสรุ่นรถต้องมีอย่างน้อย
                    {{ $v.applicantUpdate.modelCode.$params.minLength.min }}
                    ตัวอักษร
                  </small>
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.modelCode.maxLength"
                  >
                    รหัสรุ่นรถต้องไม่เกิน
                    {{ $v.applicantUpdate.modelCode.$params.maxLength.max }}
                    ตัวอักษร
                  </small>
                </div>
              </div>

              <div class="row g-3">
                <div
                  class="col-md-6"
                  :class="{
                    'form-group--error': $v.applicantUpdate.name.$error,
                  }"
                >
                  <code> * </code><label class="form-label">ชื่อรุ่นรถ :</label>
                  <input
                    maxlength="45"
                    type="text"
                    class="form-control"
                    placeholder="Name"
                    v-model.trim="$v.applicantUpdate.name.$model"
                  />
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.name.required"
                  >
                    กรุณากรอกชื่อรุ่นรถ
                  </small>
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.name.minLength"
                  >
                    ชื่อรุ่นรถต้องมีอย่างน้อย
                    {{ $v.applicantUpdate.name.$params.minLength.min }} ตัวอักษร
                  </small>
                  <small
                    class="text-danger"
                    v-if="!$v.applicantUpdate.name.maxLength"
                  >
                    ชื่อรุ่นรถต้องไม่เกิน
                    {{ $v.applicantUpdate.name.$params.maxLength.max }} ตัวอักษร
                  </small>
                </div>

                <div class="col-md-2">
                  <label class="form-label">ปีรถ :</label>
                  <multiselect
                    v-model="applicantUpdate.modelYear"
                    :options="years"
                    :multiple="false"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    placeholder="เลือกปีรถ"
                    :preselect-first="true"
                  >
                  </multiselect>
                </div>

                <div class="col-md-4">
                  <code> * </code><label for="form-label">การใช้น้ำมัน :</label>
                  <b-form-radio-group
                    v-model="applicantUpdate.fuel"
                    :options="optionsfuel"
                    class="mb-3"
                    value-field="item"
                    text-field="name"
                    disabled-field="notEnabled"
                  ></b-form-radio-group>
                </div>
              </div>
              <p
                class="alert alert-success"
                role="alert"
                v-if="submitStatus === 'OK'"
              >
                ข้อมูลถูกต้อง
              </p>
              <p
                class="alert alert-danger"
                role="alert"
                v-if="submitStatus === 'ERROR'"
              >
                กรุณากรอกแบบฟอร์มให้ถูกต้อง !!
              </p>
              <p
                class="alert alert-primary"
                role="alert"
                v-if="submitStatus === 'PENDING'"
              >
                Loading...
              </p>

              <button
                :disabled="submitStatus === 'PENDING'"
                type="submit"
                class="btn btn-primary"
              >
                แก้ไข
              </button>
              <button type="button" class="btn btn-danger m-2" @click="Clear">
                ล้างข้อมูล
              </button>
            </form>
          </b-skeleton-wrapper>
        </div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import VueSkeletonLoader from "skeleton-loader-vue";
export default {
  name: "Updates",
  components: { Multiselect, VueSkeletonLoader },
  data() {
    return {
      loading: false,
      viewbrand: [],
      url: "https://dms-backend-dev-dxvb7izyka-as.a.run.app",
      optionsfuel: [
        { item: "D", name: " ดีเซล" },
        { item: "S", name: " เบนซิน" },
      ],
      submitStatus: null,
      applicantUpdate: {
        modelId: "",
        brandId: "",
        modelCode: "",
        name: "",
        modelYear: "",
        fuel: "",
      },
    };
  },

  validations: {
    applicantUpdate: {
      brandId: {
        required,
      },
      modelCode: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20),
      },
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(45),
      },
    },
  },

  computed: {
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 1900 },
        (value, index) => 1901 + index
      );
    },
  },

  mounted() {
    //console.log(this.$route.params.id);
    this.carbrand();
    this.cardetails();
  },
  methods: {
    Clear() {
      this.applicantUpdate.brandId = "";
      this.applicantUpdate.modelCode = "";
      this.applicantUpdate.name = "";
      this.applicantUpdate.modelYear = "";
      this.applicantUpdate.fuel = "";
    },
    Update() {
      console.log("submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.submitStatus = "PENDING";
        axios
          .put(this.url + "/api/vehicle-model/update", {
            modelId: this.applicantUpdate.modelId,
            brandId: this.applicantUpdate.brandId.brandId,
            modelCode: this.applicantUpdate.modelCode,
            name: this.applicantUpdate.name,
            modelYear: this.applicantUpdate.modelYear,
            fuel: this.applicantUpdate.fuel,
          })
          .then((response) => {
            this.applicantUpdate = response.data;
            console.log(this.applicantUpdate);
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            //alert(response.data.message);
            this.$router.push({ name: "home" });
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: error.message,
            });
          });
      }
    },
    carbrand() {
      axios
        .get(`${this.url}/api/vehicle-model/brand`, {})
        .then((response) => {
          this.viewbrand = response.data;
          //console.log(this.viewbrand);
        })
        .catch((error) => {
          console.log(error.message);
          this.erroredview = true;
        });
    },
    cardetails() {
      this.loading = true;
      axios
        .get(`${this.url}/api/vehicle-model/show`, {
          params: {
            modelId: this.$route.params.id,
          },
        })
        .then((response) => {
          this.applicantUpdate.modelId = response.data.data.modelId;
          this.applicantUpdate.brandId = {
            brandId: response.data.data.brandId,
            brandName: response.data.data.brandName,
          };
          this.applicantUpdate.modelCode = response.data.data.modelCode;
          this.applicantUpdate.name = response.data.data.name;
          this.applicantUpdate.modelYear = response.data.data.modelYear;
          this.applicantUpdate.fuel = response.data.data.fuel;
          //console.log(this.response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .then(() => {
          this.loading = false;
          console.log(this.loading);
        });
    },
  },
};
</script>

<style scoped></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
