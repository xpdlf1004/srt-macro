<template>
  <div class="login-page">
    <div class="contents">
      <div class="title-cont">
        <h1>SRT 매크로</h1>
        <span>로그인</span>
      </div>
      <div>
        <b-form @submit="onSubmit">
          <b-form-group class="user-type-cont">
            <b-form-radio-group
              v-model="form.selected"
              :options="form.options"
              name="user-type-options"
            ></b-form-radio-group>
          </b-form-group>
          <div class="d-flex user-key-input-cont align-items-center">
            <div class="label-cont">
              <span>{{selectedTypeLabel}}</span>
            </div>
            <div class="input-cont">
              <b-form-input
                id="user-key-input"
                :type="form.selected === 'email' ? 'email': 'text'"
                v-model="form.userKey"
                name="user-key"
                required
                :placeholder="selectedTypeLabel"
              ></b-form-input>
            </div>
          </div>
          <div :class="`d-flex user-pw-input-cont align-items-center ${hasError && 'has-error'}`">
            <div class="label-cont">
              <span>비밀번호</span>
            </div>
            <div class="input-cont">
              <b-form-input
                id="password-input"
                type="password"
                name="user-password"
                v-model="form.password"
                required
                placeholder="비밀번호"
              ></b-form-input>
            </div>
          </div>
          <div class="error-cont" v-if="hasError">
            <span>{{`${selectedTypeLabel} 또는 비밀번호를 확인하세요.`}}</span>
          </div>
          <div class="login-btn-cont">
            <b-button type="submit" variant="primary">
              <span v-if="!loading">로그인</span>
              <div v-if="loading" class="loader reverse"/>
            </b-button>
          </div>
          <div class="link-cont">
            <a
              href="https://etk.srail.co.kr/cmc/02/selectJoinInfo.do?pageId=TK0702000000"
              target="_blank"
            >회원가입</a> 또는
            <a
              href="https://etk.srail.co.kr/cmc/01/selectCfrmInfo.do?pageId=TK0703000000"
              target="_blank"
            >회원찾기</a>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cookies from "js-cookie";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  form = {
    userKey: "",
    password: "",
    selected: "userNumber",
    options: [
      { text: "회원 번호", value: "userNumber" },
      { text: "이메일", value: "email", disabled: true },
      { text: "휴대전화번호", value: "phone", disabled: true }
    ]
  };
  loading = null;
  hasError = null;

  mounted() {
    this.$store.commit("CLEAR");
    Cookies.remove("connect.sid");
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.loading = true;
    this.$store
      .dispatch("LOGIN", {
        userNumber: this.form.userKey,
        userPassword: this.form.password
      })
      .then(() => {
        this.$router.push("/");
      })
      .catch(e => {
        this.hasError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  get selectedTypeLabel() {
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
</script>
<style lang="scss" scoped>
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;

  .contents {
    width: 320px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .title-cont {
      text-align: center;
      margin-bottom: 30px;
      span {
        font-size: 1.5rem;
      }
    }
    .user-type-cont {
      text-align: center;
      margin-bottom: 15px;
    }
    .label-cont {
      width: 90px;
    }
    .input-cont {
      flex: 1;
    }
    .user-key-input-cont {
      margin-bottom: 10px;
    }
    .user-pw-input-cont {
      margin-bottom: 20px;

      &.has-error {
        margin-bottom: 10px;
      }
    }
    .login-btn-cont {
      margin-bottom: 10px;
      button {
        width: 100%;
      }
    }
    .link-cont {
      text-align: center;
      font-size: 0.8rem;
    }
    .error-cont {
      text-align: center;
      margin-bottom: 10px;
      span {
        font-size: 0.8rem;
        color: $text-error;
      }
    }
  }
}
</style>
