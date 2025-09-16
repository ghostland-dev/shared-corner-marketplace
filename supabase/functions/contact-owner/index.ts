import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerEmail) || !emailRegex.test(senderEmail)) {
      return new Response(
        JSON.stringify({ error: "Format d'email invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending email via Resend:", {
      to: ownerEmail,
      from: senderEmail,
      senderName,
      listingTitle,
      listingId
    });

    // Envoi de l'email via Resend
    const emailResponse = await resend.emails.send({
      from: "Location App <onboarding@resend.dev>", // Vous devrez configurer votre domaine
      to: [ownerEmail],
      replyTo: senderEmail,
      subject: `Nouvelle demande de contact pour "${listingTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nouvelle demande de contact</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Annonce concernée :</h3>
            <p style="font-weight: bold; font-size: 16px;">${listingTitle}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Message de ${senderName} :</h3>
            <div style="background-color: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0;">
              <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Coordonnées du contact :</h4>
            <p><strong>Nom :</strong> ${senderName}</p>
            <p><strong>Email :</strong> ${senderEmail}</p>
          </div>

          <div style="margin: 30px 0; text-align: center;">
            <p style="color: #666; font-size: 14px;">
              Vous pouvez répondre directement à cet email pour contacter ${senderName}.
            </p>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px;">
              Cet email a été envoyé via votre plateforme de location.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: "Votre message a été envoyé au propriétaire par email",
      data: {
        id: emailResponse.data?.id,
        to: ownerEmail,
        subject: `Nouvelle demande de contact pour "${listingTitle}"`
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in contact-owner function:", error);
    
    // Gestion des erreurs spécifiques de Resend
    let errorMessage = "Erreur lors de l'envoi du message";
    if (error.message?.includes("API key")) {
      errorMessage = "Erreur de configuration du service d'email";
    } else if (error.message?.includes("domain")) {
      errorMessage = "Domaine email non configuré";
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
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