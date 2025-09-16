import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    console.log("Starting cleanup job...");

    // Supprimer les notifications anciennes (plus de 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: deletedNotifications, error: notificationError } = await supabase
      .from("notifications")
      .delete()
      .lt("created_at", thirtyDaysAgo.toISOString());

    if (notificationError) {
      console.error("Error cleaning notifications:", notificationError);
    } else {
      console.log("Cleaned old notifications");
    }

    // Supprimer les conversations sans messages récents (plus de 90 jours)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: oldConversations, error: conversationFetchError } = await supabase
      .from("conversations")
      .select("id")
      .lt("last_message_at", ninetyDaysAgo.toISOString());

    if (conversationFetchError) {
      console.error("Error fetching old conversations:", conversationFetchError);
    } else if (oldConversations && oldConversations.length > 0) {
      const conversationIds = oldConversations.map(c => c.id);
      
      // Supprimer les messages d'abord
      const { error: messageDeleteError } = await supabase
        .from("messages")
        .delete()
        .in("conversation_id", conversationIds);

      if (messageDeleteError) {
        console.error("Error deleting old messages:", messageDeleteError);
      }

      // Puis supprimer les conversations
      const { error: conversationDeleteError } = await supabase
        .from("conversations")
        .delete()
        .in("id", conversationIds);

      if (conversationDeleteError) {
        console.error("Error deleting old conversations:", conversationDeleteError);
      } else {
        console.log(`Cleaned ${conversationIds.length} old conversations`);
      }
    }

    // Nettoyer les réservations expirées en attente (plus de 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: expiredReservations, error: reservationError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("status", "pending")
      .lt("created_at", sevenDaysAgo.toISOString());

    if (reservationError) {
      console.error("Error updating expired reservations:", reservationError);
    } else {
      console.log("Updated expired reservations to cancelled");
    }

    // Statistiques de nettoyage
    const stats = {
      cleanedNotifications: deletedNotifications?.length || 0,
      cleanedConversations: oldConversations?.length || 0,
      expiredReservations: expiredReservations?.length || 0,
      timestamp: new Date().toISOString()
    };

    console.log("Cleanup completed:", stats);

    return new Response(JSON.stringify({
      success: true,
      message: "Cleanup completed successfully",
      stats
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in cleanup function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Cleanup failed",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);