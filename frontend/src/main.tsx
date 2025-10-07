import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store/store.ts";
import { PersistGate } from "redux-persist/es/integration/react";
import { Toaster } from "react-hot-toast";
import { toastStyles } from "./config/ToastConfig.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
        <Toaster position="bottom-center" reverseOrder={false} toastOptions={toastStyles} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
