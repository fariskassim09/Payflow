import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SalaryProvider } from "./contexts/SalaryContext";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";
import Settings from "./pages/Settings";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/summary"} component={Summary} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Design Philosophy: Salary Allocation Planner
// - Black minimal aesthetic with blue accents
// - Grouped budget categories (NEEDS, WANTS, SAVINGS, DEBTS)
// - Editable salary and allocation percentages
// - Month/year navigation
// - Summary breakdown by group

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <SalaryProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SalaryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
