
  import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  </HelmetProvider>
);
  