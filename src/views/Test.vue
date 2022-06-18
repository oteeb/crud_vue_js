<!-- Vue component -->
<template>
  <form @submit.prevent="submit">
    <div
      class="form-group"
      :class="{ 'form-group--error': $v.test.name.$error }"
    >
      <label class="form__label">Name</label>
      <input class="form-control" v-model.trim="$v.test.name.$model" />
    </div>
    <div class="text-danger" v-if="!$v.test.name.required">
      Name is required
    </div>
    <div class="text-danger" v-if="!$v.test.name.minLength">
      Name must have at least {{ $v.test.name.$params.minLength.min }} letters.
    </div>
    <button class="button" type="submit" :disabled="submitStatus === 'PENDING'">
      Submit!
    </button>

    <p class="alert alert-success" role="alert" v-if="submitStatus === 'OK'">
      Thanks for your submission!
    </p>
    <p class="alert alert-danger" role="alert" v-if="submitStatus === 'ERROR'">
      Please fill the form correctly.
    </p>
    <p
      class="alert alert-primary"
      role="alert"
      v-if="submitStatus === 'PENDING'"
    >
      Sending...
    </p>
    <div>{{ test.name }}</div>
  </form>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      test: {
        name: "",
      },

      age: 0,
      submitStatus: null,
    };
  },
  validations: {
    test: {
      name: {
        required,
        minLength: minLength(4),
      },
    },
  },
  methods: {
    submit() {
      console.log("submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.submitStatus = "PENDING";
        setTimeout(() => {
          this.submitStatus = "OK";
        }, 500);
      }
    },
  },
};
</script>
