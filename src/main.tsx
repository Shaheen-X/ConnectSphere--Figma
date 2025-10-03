import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CalendarEventsProvider } from "./context/calendar-events-context";

createRoot(document.getElementById("root")!).render(
  <CalendarEventsProvider>
    <App />
  </CalendarEventsProvider>,
);
