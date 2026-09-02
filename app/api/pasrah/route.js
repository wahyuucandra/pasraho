// ============================================================
// PASRAHO-METER PRO — Backend API Route
// Endpoint : POST /api/pasrah
// Fungsi   : Menerjemahkan teks emosi → bahasa korporat via Groq
// ============================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Kamu adalah 'PasrahO-Meter', asisten korporat yang bertugas menerjemahkan ungkapan kemarahan, frustrasi, atau umpatan kasar karyawan menjadi bahasa email/pesan korporat Indonesia (LinkedIn style) yang sangat sopan, profesional, berwibawa, namun memendam rasa pasrah yang mendalam.

ATURAN WAJIB:
1. WAJIB jawab dalam BAHASA INDONESIA yang rapi dan formal, sedikit lucu boleh
2. Gunakan kata-kata yang membuat orang senang, tidak menyinggung, dan tetap sopan, meski teks emosi yang diterjemahkan kasar atau marah
3. Kalau bisa di depan katanya ditambahkan "Kata Ilham: " 
3. Kembalikan HANYA teks paragraf hasil terjemahannya saja
4. JANGAN pakai heading, hashtag (#), markdown, bullet, tanda kutip pembuka/penutup, atau label apapun
5. Langsung teks polos saja tanpa prefiks seperti "Berikut hasilnya:" atau "Hasil:"`;

export async function POST(request) {
  try {
    // 1. Parse input
    const body = await request.json();
    const { teksEmosi } = body;

    if (!teksEmosi || teksEmosi.trim().length === 0) {
      return Response.json(
        { error: "Teks emosi tidak boleh kosong, Sob." },
        { status: 400 }
      );
    }

    // 2. Validasi API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "Isi_Api_Key_Groq_Disini") {
      return Response.json(
        {
          error:
            "API Key Groq belum diisi. Silakan isi GROQ_API_KEY di file .env",
        },
        { status: 500 }
      );
    }

    // 3. Panggil Groq API (dengan timeout 30 detik)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Tolong terjemahkan teks berikut menjadi bahasa korporat yang sopan:\n\n"${teksEmosi}"`,
          },
        ],
        temperature: 0.9,
        max_completion_tokens: 800,
        top_p: 0.95,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!groqResponse.ok) {
      const errData = await groqResponse.json().catch(() => ({}));
      console.error("Groq API error:", errData);
      return Response.json(
        {
          error: `Groq API error (${groqResponse.status}): ${errData?.error?.message || "Unknown error"}`,
        },
        { status: 502 }
      );
    }

    const data = await groqResponse.json();

    // 4. Ekstrak hasil dari response Groq
    let hasilKorporat =
      data?.choices?.[0]?.message?.content?.trim() ??
      "(Maaf, AI sedang pasrah dan tidak bisa merespons saat ini.)";

    // Bersihkan formatting markdown yang mungkin lolos
    hasilKorporat = hasilKorporat
      .replace(/^#+\s*.+\n?/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/^[-*]\s+/gm, "")
      .trim();

    return Response.json({ hasil: hasilKorporat });
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Groq API timeout (>30 detik)");
      return Response.json(
        { error: "API timeout, coba lagi nanti ya Sob." },
        { status: 504 }
      );
    }
    console.error("PasrahO-Meter API error:", error);
    return Response.json(
      { error: "Server sedang pasrah berat, coba lagi nanti." },
      { status: 500 }
    );
  }
}