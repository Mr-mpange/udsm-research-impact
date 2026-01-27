import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrcidWork {
  title?: { title?: { value?: string } };
  "journal-title"?: { value?: string };
  "publication-date"?: { year?: { value?: string } };
  "external-ids"?: { "external-id"?: Array<{ "external-id-type"?: string; "external-id-value"?: string }> };
}

interface OrcidResponse {
  group?: Array<{
    "work-summary"?: Array<{
      title?: { title?: { value?: string } };
      "journal-title"?: { value?: string };
      "publication-date"?: { year?: { value?: string } };
      "external-ids"?: { "external-id"?: Array<{ "external-id-type"?: string; "external-id-value"?: string }> };
    }>;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orcid_id } = await req.json();
    
    if (!orcid_id) {
      return new Response(JSON.stringify({ error: "ORCID ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Clean ORCID ID (remove URL prefix if present)
    const cleanOrcidId = orcid_id.replace(/^https?:\/\/orcid\.org\//, '').trim();

    // Validate ORCID format
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
    if (!orcidRegex.test(cleanOrcidId)) {
      return new Response(JSON.stringify({ error: "Invalid ORCID ID format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch works from ORCID public API
    const orcidResponse = await fetch(
      `https://pub.orcid.org/v3.0/${cleanOrcidId}/works`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!orcidResponse.ok) {
      if (orcidResponse.status === 404) {
        return new Response(JSON.stringify({ error: "ORCID ID not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`ORCID API error: ${orcidResponse.status}`);
    }

    const orcidData: OrcidResponse = await orcidResponse.json();
    
    // Parse works
    const publications = [];
    for (const group of orcidData.group || []) {
      const workSummary = group["work-summary"]?.[0];
      if (!workSummary) continue;

      const title = workSummary.title?.title?.value;
      if (!title) continue;

      const journal = workSummary["journal-title"]?.value || null;
      const year = workSummary["publication-date"]?.year?.value 
        ? parseInt(workSummary["publication-date"].year.value, 10) 
        : null;

      let doi: string | null = null;
      for (const extId of workSummary["external-ids"]?.["external-id"] || []) {
        if (extId["external-id-type"] === "doi") {
          doi = extId["external-id-value"] || null;
          break;
        }
      }

      publications.push({
        user_id: user.id,
        title,
        journal,
        year,
        doi,
        citations: 0, // ORCID doesn't provide citation counts
        quartile: null,
        co_authors: null
      });
    }

    // Upsert publications (using DOI as unique identifier where available)
    let imported = 0;
    let skipped = 0;

    for (const pub of publications) {
      if (pub.doi) {
        // Check if publication with this DOI already exists
        const { data: existing } = await supabase
          .from('researcher_publications')
          .select('id')
          .eq('user_id', user.id)
          .eq('doi', pub.doi)
          .maybeSingle();

        if (existing) {
          skipped++;
          continue;
        }
      }

      const { error: insertError } = await supabase
        .from('researcher_publications')
        .insert(pub);

      if (!insertError) {
        imported++;
      }
    }

    // Update profile with ORCID ID and publication count
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        orcid_id: cleanOrcidId,
        total_publications: publications.length
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
    }

    return new Response(JSON.stringify({
      success: true,
      total_found: publications.length,
      imported,
      skipped,
      message: `Successfully synced ${imported} publications from ORCID`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("ORCID sync error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
