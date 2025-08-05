// components/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      // Configure NextAuth session provider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch session when window gains focus
    >
      <Provider store={store}>
        {children}
        <Toaster
          // Configure toast notifications
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
      </Provider>
    </SessionProvider>
  );
}
