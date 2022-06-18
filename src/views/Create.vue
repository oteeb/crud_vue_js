<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-12">
          <form @submit.prevent="CreateForm">
            <h1>เพิ่มข้อมูล</h1>
            <hr />
            <div class="row">
              <div class="form-group">
                <code> * </code><label for="brandId">เลือกยี่ห้อรถ</label>

                <multiselect
                  v-model="applicant.brandId"
                  :options="viewbrand.map((viewbrand) => viewbrand.brandId)"
                  :custom-label="
                    (opt) => viewbrand.find((x) => x.brandId == opt).brandName
                  "
                  placeholder="เลือกยี่ห้อรถ"
                >
                </multiselect>
                <small
                  class="text-danger"
                  v-if="!$v.applicant.brandId.required"
                >
                  กรุณาเลือกยี่ห้อรถ
                </small>
              </div>

              <div
                class="form-group"
                :class="{ 'form-group--error': $v.applicant.modelCode.$error }"
              >
                <label class="form__label">รหัสรุ่นรถ</label>
                <input
                  maxlength="20"
                  placeholder="รหัสรุ่นรถ"
                  class="form-control"
                  v-model.trim="$v.applicant.modelCode.$model"
                />
              </div>
              <small
                class="text-danger"
                v-if="!$v.applicant.modelCode.required"
              >
                กรุณากรอกรหัสรุ่นรถ
              </small>
              <small
                class="text-danger"
                v-if="!$v.applicant.modelCode.minLength"
              >
                รหัสรุ่นรถต้องมีอย่างน้อย
                {{ $v.applicant.modelCode.$params.minLength.min }} ตัวอักษร
              </small>
              <small
                class="text-danger"
                v-if="!$v.applicant.modelCode.maxLength"
              >
                รหัสรุ่นรถต้องไม่เกิน
                {{ $v.applicant.modelCode.$params.maxLength.max }} ตัวอักษร
              </small>

              <div
                class="form-group"
                :class="{ 'form-group--error': $v.applicant.name.$error }"
              >
                <label class="form__label">ชื่อรุ่นรถ</label>
                <input
                  maxlength="45"
                  placeholder="รหัสรุ่นรถ"
                  class="form-control"
                  v-model.trim="$v.applicant.name.$model"
                />
              </div>
              <small class="text-danger" v-if="!$v.applicant.name.required">
                กรุณากรอกชื่อรุ่นรถ
              </small>
              <small class="text-danger" v-if="!$v.applicant.name.minLength">
                ชื่อรุ่นรถต้องมีอย่างน้อย
                {{ $v.applicant.name.$params.minLength.min }} ตัวอักษร
              </small>
              <small class="text-danger" v-if="!$v.applicant.name.maxLength">
                ชื่อรุ่นรถต้องไม่เกิน
                {{ $v.applicant.name.$params.maxLength.max }} ตัวอักษร
              </small>

              <div class="form-group">
                <label for="exampleInputPassword1">ปีรถ</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="ModelYear"
                  v-model="applicant.modelYear"
                />
                <small class="text-danger" v-if="!$v.applicant.modelYear.required">
                กรุณาเลือกปีรถ
              </small>
              </div>

              <div class="form-group">
                <label for="exampleInputPassword1">การใช้น้ำมัน</label>
                <div>
                  <b-form-radio-group
                    v-model="applicant.fuel"
                    :options="optionsfuel"
                    class="mb-3"
                    value-field="item"
                    text-field="name"
                    disabled-field="notEnabled"
                  ></b-form-radio-group>
                </div>

                <br />
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
                type="submit"
                class="btn btn-primary"
                :disabled="submitStatus === 'PENDING'"
              >
                Submit
              </button>
              &nbsp;&nbsp;
              <button type="button" class="btn btn-danger" @click="Clear">
                Clear
              </button>
            </div>
          </form>
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
export default {
  name: "User",
  components: { Multiselect },
  data() {
    return {
      page: 1,
      perPage: 5,
      viewfuel: "",
      viewbrand: [],
      optionsfuel: [
        { item: "D", name: " เบนซิน" },
        { item: "S", name: " ดีเซล" },
      ],
      loading: true,
      errored: false,
      url: "https://dms-backend-dev-dxvb7izyka-as.a.run.app",
      submitStatus: null,
      applicant: {
        brandId: "",
        modelCode: "",
        name: "",
        modelYear: "",
        fuel: "",
      },
    };
  },

  validations: {
    applicant: {
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
      modelYear: {
        required,
      },
    },
  },

  mounted() {
    this.Listbrand();
    this.Listfuel();
  },

  methods: {
    Clear() {
      this.applicant.brandId = "";
      this.applicant.modelCode = "";
      this.applicant.name = "";
      this.applicant.modelYear = "";
      this.applicant.fuel = "";
    },

    CreateForm() {
      console.log("submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.submitStatus = "PENDING";
        setTimeout(() => {
          this.submitStatus = "OK";
          axios
            .post(this.url + "/api/vehicle-model/store?", {
              brandId: this.applicant.brandId,
              modelCode: this.applicant.modelCode,
              name: this.applicant.name,
              modelYear: this.applicant.modelYear,
              fuel: this.applicant.fuel,
            })
            .then((response) => {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: `${response.message}`,
              });
              this.$router.push({ name: "home" });
            })
            .catch((error) => {
              this.$swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: `${error.message}`,
              });
              console.log(error.message);
            });
        }, 500);
      }
    },

    Listbrand() {
      axios
        .get(this.url + "/api/vehicle-model/brand")
        .then((response) => {
          this.viewbrand = response.data;
          //console.log(this.viewbrand);
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
          });
          console.log(error.message);
          this.erroredview = true;
        });
    },

    Listfuel() {
      axios
        .get(this.url + "/api/vehicle-model?", {
          params: {
            page: this.page,
            perPage: this.perPage,
          },
        })
        .then((response) => {
          this.viewfuel = response.data.statusLabel.fuel;
          //console.log(this.viewfuel);
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
          });
          console.log(error.message);
          this.erroredview = true;
        })
        .finally(() => (this.loadingview = false));
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped></style>
