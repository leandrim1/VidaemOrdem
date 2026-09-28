import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import { FullPageLoader } from '@/components/layout/FullPageLoader'
import { RouteError } from '@/pages/NotFound/RouteError'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './guards'

/* Layouts e páginas são carregados sob demanda (code splitting por rota). */
const AppLayout = lazy(() => import('@/components/layout/AppLayout').then((m) => ({ default: m.AppLayout })))
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const LandingPage = lazy(() => import('@/pages/Landing/LandingPage'))
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage'))
const OnboardingPage = lazy(() => import('@/pages/Onboarding/OnboardingPage'))
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'))
const FinancePage = lazy(() => import('@/pages/Finance/FinancePage'))
const AccountsPage = lazy(() => import('@/pages/Accounts/AccountsPage'))
const CardsPage = lazy(() => import('@/pages/Cards/CardsPage'))
const SubscriptionsPage = lazy(() => import('@/pages/Subscriptions/SubscriptionsPage'))
const GoalsPage = lazy(() => import('@/pages/Goals/GoalsPage'))
const TasksPage = lazy(() => import('@/pages/Tasks/TasksPage'))
const RoutinePage = lazy(() => import('@/pages/Routine/RoutinePage'))
const HabitsPage = lazy(() => import('@/pages/Habits/HabitsPage'))
const DocumentsPage = lazy(() => import('@/pages/Documents/DocumentsPage'))
const DigitalOrganizationPage = lazy(() => import('@/pages/DigitalOrganization/DigitalOrganizationPage'))
const ChecklistsPage = lazy(() => import('@/pages/Checklists/ChecklistsPage'))
const ChallengePage = lazy(() => import('@/pages/Challenge/ChallengePage'))
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'))
const HelpPage = lazy(() => import('@/pages/Help/HelpPage'))
const AdminDashboardPage = lazy(() => import('@/pages/Admin/AdminDashboardPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'))

function page(Component: LazyExoticComponent<ComponentType>) {
  return <Component />
}

/** Páginas públicas em tela cheia (sem o layout da aplicação). */
function PublicShell() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Outlet />
    </Suspense>
  )
}

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      {
        element: <PublicShell />,
        children: [
          { path: '/', element: page(LandingPage) },
          {
            element: <PublicOnlyRoute />,
            children: [
              { path: '/login', element: page(LoginPage) },
              { path: '/cadastro', element: page(RegisterPage) },
            ],
          },
          { path: '/recuperar-senha', element: page(ForgotPasswordPage) },
          {
            path: '/onboarding',
            element: <ProtectedRoute requireOnboarding={false}>{page(OnboardingPage)}</ProtectedRoute>,
          },
          { path: '*', element: page(NotFoundPage) },
        ],
      },
      {
        path: '/app',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<FullPageLoader />}>
              <AppLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: page(DashboardPage) },
          { path: 'financas', element: page(FinancePage) },
          { path: 'contas', element: page(AccountsPage) },
          { path: 'cartoes', element: page(CardsPage) },
          { path: 'assinaturas', element: page(SubscriptionsPage) },
          { path: 'metas', element: page(GoalsPage) },
          { path: 'tarefas', element: page(TasksPage) },
          { path: 'rotina', element: page(RoutinePage) },
          { path: 'habitos', element: page(HabitsPage) },
          { path: 'documentos', element: page(DocumentsPage) },
          { path: 'organizacao-digital', element: page(DigitalOrganizationPage) },
          { path: 'checklists', element: page(ChecklistsPage) },
          { path: 'desafio', element: page(ChallengePage) },
          { path: 'perfil', element: page(ProfilePage) },
          { path: 'configuracoes', element: page(SettingsPage) },
          { path: 'ajuda', element: page(HelpPage) },
          { path: '*', element: page(NotFoundPage) },
        ],
      },
      {
        path: '/admin',
        element: (
          <AdminRoute>
            <Suspense fallback={<FullPageLoader />}>
              <AdminLayout />
            </Suspense>
          </AdminRoute>
        ),
        children: [{ index: true, element: page(AdminDashboardPage) }],
      },
    ],
  },
])
