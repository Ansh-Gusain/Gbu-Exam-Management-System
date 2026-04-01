import { jsx, jsxs } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { StoreProvider } from "./lib/store";
import { Toaster } from "sonner";
function App() {
  return /* @__PURE__ */ jsxs(StoreProvider, { children: [
    /* @__PURE__ */ jsx(RouterProvider, { router }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-right", richColors: true })
  ] });
}
export {
  App as default
};
