import { createRouter, createWebHashHistory } from "vue-router";
import Nav from "../components/Nav.vue";
import Home from "../components/Home.vue";
import DetalleTipoServicio from "../components/DetalleTipoServicio.vue";
import DetalleServicio from "../components/DetalleServicio.vue";

const routes = [
  {
    path: "/",
    component: Nav,
    children: [
      { path: "", redirect: "/home" },
      {
        path: "/home",
        component: Home,
      },
      {
        path: "/tipo-servicio",
        component: DetalleTipoServicio,
      },
      {
        path: "/detalle-servicio",
        component: DetalleServicio,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
