import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useSupabase() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check connection status
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("count", { count: "exact", head: true });
        if (!error) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Connection check failed:", error);
        setIsConnected(false);
      }
    };

    checkConnection();

    // Set up connection status listener
    const channel = supabase
      .channel("system")
      .on("system", { event: "connected" }, () => {
        console.log("Connected to Supabase");
        setIsConnected(true);
      })
      .on("system", { event: "disconnected" }, () => {
        console.log("Disconnected from Supabase");
        setIsConnected(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Real-time subscription helper
  const subscribeToTable = (
    tableName: string,
    callback: (payload: any) => void,
    filter?: string
  ): RealtimeChannel => {
    const channel = supabase
      .channel(`table_${tableName}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: filter,
        },
        callback
      )
      .subscribe();

    return channel;
  };

  // Real-time chat subscription
  const subscribeToChat = (
    chatId: string,
    callback: (payload: any) => void
  ): RealtimeChannel => {
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        callback
      )
      .subscribe();

    return channel;
  };

  return {
    supabase,
    isConnected,
    subscribeToTable,
    subscribeToChat,
  };
}
