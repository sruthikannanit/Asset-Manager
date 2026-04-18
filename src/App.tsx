import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useGetMe } from "@workspace/api-client-react";

import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Members from "@/pages/members";
import MemberDetail from "@/pages/member-detail";
import AssignTask from "@/pages/assign-task";
import MyUpdates from "@/pages/my-updates";
import MyTasks from "@/pages/my-tasks";

import { Shell } from "@/components/layout/Shell";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false;
        return failureCount < 2;
      },
    },
  },
});

function Router() {
  const { data: user, isError, isLoading } = useGetMe();

  // ✅ ALWAYS handle loading FIRST
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const isAuth = !!user && !isError;

  return (
    <Switch>
      {/* LOGIN */}
      <Route path="/login" component={Login} />

      {/* ROOT REDIRECT */}
      <Route path="/">
        {() => {
          if (!isAuth) return <Redirect to="/login" />;
          return (
            <Redirect
              to={user.role === "leader" ? "/dashboard" : "/my-updates"}
            />
          );
        }}
      </Route>

      {/* LEADER ROUTES */}
      <Route path="/dashboard">
        {() =>
          isAuth && user?.role === "leader" ? (
            <Shell>
              <Dashboard />
            </Shell>
          ) : (
            <Redirect to="/login" />
          )
        }
      </Route>

      <Route path="/members">
        {() =>
          isAuth && user?.role === "leader" ? (
            <Shell>
              <Members />
            </Shell>
          ) : (
            <Redirect to="/login" />
          )
        }
      </Route>

      <Route path="/members/:userId">
        {() =>
          isAuth && user?.role === "leader" ? (
            <Shell>
              <MemberDetail />
            </Shell>
          ) : (
            <Redirect to="/login" />
          )
        }
      </Route>

      <Route path="/assign-task">
        {() =>
          isAuth && user?.role === "leader" ? (
            <Shell>
              <AssignTask />
            </Shell>
          ) : (
            <Redirect to="/login" />
          )
        }
      </Route>

      {/* MEMBER ROUTES */}
      <Route path="/my-updates">
        {() =>
          isAuth && user?.role === "member" ? (
            <Shell>
              <MyUpdates />
            </Shell>
          ) : (
            <Redirect to="/login" />
          )
        }
      </Route>

      <Route path="/my-tasks">
        {() =>
          isAuth && user?.role === "member" ? (
            <Shell>
              <MyTasks />
            </Shell>
          ) : (
            <Redirect to="/login" />
          )
        }
      </Route>

      {/* NOT FOUND */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;