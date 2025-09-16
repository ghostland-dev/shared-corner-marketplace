import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  listingId: string;
  ownerEmail: string;
  senderName: string;
  senderEmail: string;
  message: string;
  listingTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
    const { 
      listingId, 
      ownerEmail, 
      senderName, 
      senderEmail, 
      message, 
      listingTitle 
    }: ContactRequest = await req.json();

    // Validation des données
    if (!ownerEmail || !senderName || !senderEmail || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Pour l'instant, on retourne une réponse simulée
    // En production, vous pouvez intégrer Resend ou un autre service d'email
    console.log("Email contact request:", {
      to: ownerEmail,
      from: senderEmail,
      senderName,
      message,
      listingTitle,
      listingId
    });

    // Simulation d'envoi d'email réussi
    const emailResponse = {
      id: `contact_${Date.now()}`,
      to: ownerEmail,
      subject: `Nouvelle demande de contact pour "${listingTitle}"`,
      status: "sent"
    };

    return new Response(JSON.stringify({
      success: true,
      message: "Votre message a été envoyé au propriétaire",
      data: emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in contact-owner function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de l'envoi du message",
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