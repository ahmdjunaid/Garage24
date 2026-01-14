import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store/store.ts";
import { PersistGate } from "redux-persist/es/integration/react";
import { Toaster } from "react-hot-toast";
import { toastStyles } from "./config/ToastConfig.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
              <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={toastStyles}
              />
            </BrowserRouter>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
