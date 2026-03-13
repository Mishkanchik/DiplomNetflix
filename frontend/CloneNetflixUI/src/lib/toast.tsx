// src/lib/toast.ts
import toast, { Toaster } from "react-hot-toast";

export const $t = toast; // твій зручний шорткат

export function GlobalToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{ top: 130, right: 20 }}
      toastOptions={{
        duration: 4500,

        style: {
          background: "rgb(15 23 42)",
          color: "#fff",
          fontWeight: "500",
          fontSize: "15px",
          borderRadius: "16px",
          padding: "14px 20px",
          boxShadow:
            "0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.07)",
        },

        success: {
          style: {
            background: "linear-gradient(135deg, #10b981, #059669)",
          },
        },

        error: {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
          },
        },

        loading: {
          style: {
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          },
        },
      }}
    />
  );
}
