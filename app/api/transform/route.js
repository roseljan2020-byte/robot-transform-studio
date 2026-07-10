const STYLE_WORDS = {
  cinematic: "hyper-realistic, cinematic lighting, 8K detail, dramatic low angle, lens flare, gritty brushed-metal textures",
  anime: "anime mecha style, bold cel shading, dynamic action lines, glowing eyes, Gundam-inspired armor plating",
  pixar: "3D cartoon style, soft studio lighting, friendly expressive robot face, vibrant colors, toy-like polish",
  cyberpunk: "cyberpunk style, neon pink and cyan glow, rain-soaked night city, holographic panels, chrome reflections",
};

export async function POST(req) {
  try {
    const { subject, style } = await req.json();

    if (!subject || typeof subject !== "string" || subject.length > 80) {
      return Response.json({ error: "Invalid subject" }, { status: 400 });
    }

    const styleWords = STYLE_WORDS[style] || STYLE_WORDS.cinematic;

    const prompt = "A " + subject + " in mid-transformation into a giant robot, panels shifting and unfolding, mechanical joints and hydraulic pistons visible, sparks and energy glow at the seams, " + styleWords + ", epic scale, highly detailed";

    const falRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Key " + process.env.FAL_KEY,
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: "portrait_16_9",
        num_images: 1,
      }),
    });

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("fal error:", errText);
      return Response.json({ error: "Image generation failed. Check your FAL_KEY in Vercel." }, { status: 502 });
    }

    const data = await falRes.json();
    const imageUrl = data && data.images && data.images[0] ? data.images[0].url : null;

    if (!imageUrl) {
      return Response.json({ error: "No image returned" }, { status: 502 });
    }

    const caption = "Grabe! Ang " + subject + " naging ROBOT?! Transformation level 1000! Ano gusto niyong i-transform next? Comment below!";
    const hashtags = "#RobotTransform #AIart #Transformers #AIcreator #ViralPH #FYP #RobotChallenge #AIimage";

    return Response.json({ imageUrl: imageUrl, prompt: prompt, caption: caption, hashtags: hashtags });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
Compose
Write to Janrose Parungao
