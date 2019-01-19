<template>
  <b-container>
    <div>
      <h1>Login</h1>
    </div>
    <div>
      <b-form @submit="onSubmit">
        <b-form-group>
          <b-form-radio-group
            v-model="form.selected"
            :options="form.options"
            name="user-type-options"
          ></b-form-radio-group>
        </b-form-group>
        <b-form-group :label="`${selectedTypeLabel}:`" label-for="user-key-input">
          <b-form-input
            id="user-key-input"
            :type="form.selected === 'email' ? 'email': 'text'"
            v-model="form.userKey"
            name="user-key"
            required
            :placeholder="selectedTypeLabel"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="비밀번호:" label-for="password-input">
          <b-form-input
            id="password-input"
            type="password"
            name="user-password"
            v-model="form.password"
            required
            placeholder="비밀번호"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">로그인</b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script>
import * as Cookies from "js-cookie";

export default {
  data() {
    return {
      form: {
        userKey: "",
        password: "",
        selected: "userNumber",
        options: [
          { text: "회원 번호", value: "userNumber" },
          { text: "인증된 이메일", value: "email", disabled: true },
          { text: "인증된 휴대전화번호", value: "phone", disabled: true }
        ]
      }
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store
        .dispatch("LOGIN", {
          userNumber: this.form.userKey,
          userPassword: this.form.password
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch(e => alert(e));
    }
  },
  mounted() {
    this.$store.commit("CLEAR");
    Cookies.remove("connect.sid");
  },
  computed: {
    selectedTypeLabel() {
      const selected = this.form.selected;
      if (selected === "userNumber") {
        return "회원 번호";
      } else if (selected === "email") {
        return "이메일";
      } else if (selected === "phone") {
        return "휴대전화번호";
      }
      throw new Error("Invalid user type");
    }
  }
};
</script>
