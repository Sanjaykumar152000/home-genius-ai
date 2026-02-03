import OpenAI from "openai";

export const generateDesign = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY missing");
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const {
      plotLength,
      plotWidth,
      facing,
      floors,
      bedrooms,
      style,
      vastu,
    } = req.body;

    if (!plotLength || !plotWidth) {
      return res.status(400).json({
        error: "Plot length and width are required",
      });
    }

    /* ───────────── SHARED LAYOUT ───────────── */
    const layout = `
Rectangular Indian residential plot.
Plot size ${plotLength}ft x ${plotWidth}ft.
Main entrance on ${facing} side.
Living room near entrance.
Kitchen beside dining.
${bedrooms} bedrooms.
Bathroom near living.
Staircase in one corner.
${vastu} vastu compliant.
DO NOT change layout or proportions.
`;

    const prompts = {
      floor2D: `
${layout}
2D architectural floor plan.
TOP-DOWN blueprint.
Black and white.
Thin clean lines.
Labeled rooms.
NO 3D.
`,
      floor3D: `
${layout}
3D isometric floor plan.
Dollhouse cutaway.
Same layout as 2D.
Modern Indian interior.
Architectural visualization.
`,
      exterior: `
${layout}
Photorealistic ${style} Indian house exterior.
${floors} floors.
Same window & door placement.
Modern elevation.
Daylight render.
`,
    };

    const generateImage = async (prompt, label) => {
      try {
        console.log(`🧠 Generating ${label}...`);
        const result = await client.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
        });

        return `data:image/png;base64,${result.data[0].b64_json}`;
      } catch (err) {
        console.error(`❌ ${label} FAILED`);
        return null; // 🔑 DO NOT CRASH
      }
    };

    // ⏳ SAFE SEQUENTIAL GENERATION
    const floor2D = await generateImage(prompts.floor2D, "2D PLAN");
    const floor3D = await generateImage(prompts.floor3D, "3D PLAN");
    const exterior = await generateImage(prompts.exterior, "EXTERIOR");

    res.json({
      floor2D,
      floor3D,
      exterior,
    });

  } catch (error) {
    console.error("❌ OPENAI ERROR:", error.message);
    res.status(500).json({
      error: "AI generation failed",
    });
  }
};
