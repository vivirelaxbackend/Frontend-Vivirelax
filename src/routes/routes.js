import { createRouter, createWebHashHistory } from "vue-router";
import Nav from "../components/Nav.vue";
import Home from "../components/Home.vue";
import DetalleTipoServicio from "../components/DetalleTipoServicio.vue";
import DetalleServicio from "../components/DetalleServicio.vue";
import Login from "../components/Login.vue";
import PanelAdmin from "../components/administrador/PanelAdministrativo.vue";
import MenuAdmin from "../components/administrador/MenuAdministrativo.vue";
import TipoServicio from "../components/administrarTablas/TipoServicio.vue";
import Servicio from "../components/administrarTablas/Servicio.vue";
import Cliente from "../components/administrarTablas/Cliente.vue";
import Reserva from "../components/administrarTablas/Reserva.vue";

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
      {
        path: "/login",
        component: Login,
      },
      {
        path: "/panel-admin",
        component: PanelAdmin,
        children: [
          { path: "", redirect: "/panel-admin/menu-admin" },
          { path: "menu-admin", component: MenuAdmin },
          { path: "tipo-servicio", component: TipoServicio },
          { path: "servicio", component: Servicio },
          { path: "cliente", component: Cliente },
          { path: "reserva", component: Reserva },
        ],
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
