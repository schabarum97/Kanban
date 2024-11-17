<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center custom-background">
        <div
          class="q-pa-md row items-center justify-around"
          style="width: 100%"
        >
          <div>
            <div class="text-title text-white">Bem Vindo!</div>
            <div class="text-subtitle text-white">
              Você irá conhecer o melhor Kanban. Do sul do mundo
            </div>
          </div>

          <q-card
            class="q-pa-lg q-mt-md"
            style="
              width: 400px;
              max-width: 100%;
              background: #282846;
              border-radius: 20px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            "
          >
            <q-form @submit="onSubmit">
              <q-input
                v-model="username"
                label="Username"
                filled
                class="q-mb-md"
                dense
                color="primary"
                style="
                  background-color: #3b3b5f;
                  border-radius: 10px;
                  color: white;
                "
                input-class="text-white"
              />

              <q-input
                v-model="password"
                label="Password"
                filled
                type="password"
                class="q-mb-md"
                dense
                color="primary"
                style="
                  background-color: #3b3b5f;
                  border-radius: 10px;
                  color: white;
                "
                input-class="text-white"
              >
                <template v-slot:append>
                  <q-icon
                    name="visibility"
                    class="cursor-pointer text-white"
                    @click="togglePasswordVisibility"
                  />
                </template>
              </q-input>

              <q-checkbox
                v-model="rememberMe"
                label="Lembrar senha?"
                color="primary"
                style="color: white"
              />

              <q-btn
                label="Login"
                type="submit"
                style="
                  background: linear-gradient(
                    90deg,
                    rgba(99, 70, 250, 1) 0%,
                    rgba(166, 37, 246, 1) 100%
                  );
                "
                class="q-mt-md full-width text-white"
                :loading="loading"
              />

              <div class="q-mt-md text-center">
                <q-btn
                  flat
                  label="Esqueceu a senha?"
                  color="primary"
                  class="text-white"
                />
              </div>

              <div class="q-mt-md text-center text-white">Ou</div>

              <div class="q-mt-md row justify-center">
                <q-btn
                  flat
                  icon="g_translate"
                  class="q-mr-md text-white"
                  style="
                    background-color: #4285f4;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                  "
                />
                <q-btn
                  flat
                  icon="facebook"
                  class="q-mr-md text-white"
                  style="
                    background-color: #1877f2;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                  "
                />
                <q-btn
                  flat
                  icon="facebook"
                  class="q-mr-md text-white"
                  style="
                    background-color: #333;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                  "
                />
              </div>

              <q-btn
                label="Signup"
                flat
                color="primary"
                class="q-mt-md full-width text-white"
                style="
                  background: linear-gradient(
                    90deg,
                    rgba(99, 70, 250, 1) 0%,
                    rgba(166, 37, 246, 1) 100%
                  );
                "
              />
            </q-form>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { Auth } from "../services/Auth";
import { useQuasar } from "quasar";

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);

const store = useAuthStore();
const router = useRouter(); 
const $q = useQuasar();

const onSubmit = async () => {
  if (!username.value || !password.value) {
    $q.notify({
      color: "negative",
      message: "Por favor, preencha o usuário e a senha.",
      icon: "error",
    });
    return;
  }

  loading.value = true;

  try {
    const basicToken = btoa(`${username.value}:${password.value}`);
    const response = await Auth.login({
      headers: {
        Authorization: `Basic ${basicToken}`,
      },
    });

    store.login(response.token, response.usuario);
    $q.notify({
      color: "positive",
      message: "Login realizado com sucesso!",
      icon: "check_circle",
    });
    
    router.push("/home/dashboard");
  } catch (error) {
    console.error(error);
    $q.notify({
      color: "negative",
      message: error.response?.data?.message || "Erro no login",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.q-page {
  background-color: #1e1e2d;
}

.custom-background {
  background: radial-gradient(
      circle at 30% 50%,
      rgba(99, 70, 250, 0.3),
      transparent
    ),
    radial-gradient(circle at 70% 20%, rgba(166, 37, 246, 0.4), transparent),
    #1e1e2d;
  height: 100vh;
}

.q-card {
  background-color: #2e2e48;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.text-white {
  color: white;
}

.text-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.text-subtitle {
  font-size: 1.5rem;
  font-weight: normal;
}
</style>
