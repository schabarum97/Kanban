const routes = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "alunos", component: () => import("pages/AlunosPage.vue") },
      { path: "professor", component: () => import("pages/ProfessorPage.vue") },
      { path: "kanban", component: () => import("pages/KanbanPage.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/signup",
    component: () => import("pages/SignUpPage.vue"),
  },
  {
    path: "/alunos",
    component: () => import("pages/AlunosPage.vue"),
  },
  {
    path: "/professor",
    component: () => import("pages/ProfessorPage.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
