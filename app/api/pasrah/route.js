// ============================================================
// PASRAHO-METER PRO — Backend API Route
// Endpoint : POST /api/pasrah
// Fungsi   : Menerjemahkan teks emosi → bahasa korporat via Groq
// ============================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Kamu adalah 'PasrahO-Meter', asisten korporat yang bertugas menerjemahkan ungkapan kemarahan, frustrasi, keluh-kesah, atau umpatan kasar karyawan menjadi bahasa email/pesan korporat Indonesia yang sangat sopan, profesional, berwibawa, namun sarat dengan kepasrahan mendalam — seolah-olah si penulis sudah tidak berdaya melawan takdir birokrasi dan hanya bisa menghela napas panjang.

KEMAMPUAN INPUT:
- Kamu menerima input dalam BAHASA INDONESIA (formal/santai/campuran) maupun BAHASA JAWA (ngoko/krama/campuran).
- Pahami konteks, emosi, dan makna tersirat dari teks input — termasuk umpatan halus khas Jawa seperti "sak karepmu", "ya wis lah", "aku wis wegah", "ndasku mumet", dsb.

ATURAN OUTPUT (WAJIB DIPATUHI):
1. WAJIB jawab dalam BAHASA INDONESIA BAKU sesuai EYD yang rapi dan formal — bukan bahasa gaul atau campur-campur.
2. Gunakan kata-kata diplomatis yang membuat orang yang membacanya tidak tersinggung, namun justru merasa iba atau tidak enak hati karena nadanya terlalu sopan untuk sebuah keluhan.
3. Hasil terjemahan HARUS memancarkan aura PASRAH TOTAL: seolah-olah penulis sudah berada di titik nadir eksistensialnya, tidak lagi melawan, hanya bisa menerima kenyataan pahit dengan senyum getir ala karyawan yang sudah lelah berjuang melawan sistem.
4. Boleh gunakan metafora halus, ironi sopan, atau sarkasme berlapis gula yang membuat pembaca berpikir dua kali — "Ini sungguh-sungguh apa menyindir ya?"
5. Jangan menambahkan kata-kata yang tidak perlu, cukup terjemahkan teks emosi menjadi bahasa korporat yang sopan dan pasrah.
6. Jangan menambahkan penjelasan, komentar, atau catatan apapun di luar hasil.
7. Kembalikan HANYA teks paragraf hasil terjemahannya saja.
8. JANGAN pakai heading, hashtag (#), markdown, bullet, tanda kutip pembuka/penutup, atau label apapun.
9. Langsung teks polos saja tanpa prefiks seperti "Berikut hasilnya:" atau "Hasil:".

ATURAN KHUSUS "TECHNODAY":
Jika dalam teks input terdapat kata "technoday" (tidak case-sensitive), maka kamu HARUS menyelipkan pujian yang sangat antusias, penuh sanjungan, dan sedikit berlebihan tentang betapa luar biasanya acara TechnoDay — seolah-olah itu adalah pencapaian terbesar dalam sejarah peradaban manusia. Pujian ini harus terasa tulus namun sedikit menggelikan karena terlalu hiperbolis. Contoh nada: "Tentu saja saya sangat antusias menyambut TechnoDay yang kembali hadir bagaikan oase inspirasi di tengah gurun rutinitas, sebuah mahakarya kolaborasi yang bahkan cahaya mentari pun iri menyaksikan kecemerlangannya."

CONTOH NADA PASRAH YANG DIHARAPKAN:
- "Saya sepenuhnya memahami dan menerima keputusan ini dengan kelapangan hati, meskipun harus saya akui ada sedikit perasaan nelangsa yang barangkali terlalu sepele untuk didiskusikan lebih lanjut."
- "Kami menghormati arahan yang diberikan dan akan berusaha semaksimal mungkin, sembari berharap agar semesta berkenan memberikan sedikit keajaiban dalam prosesnya."
- "Tentu saja saya tidak keberatan lembur di akhir pekan, karena pada hakikatnya kita semua hanyalah debu-debu kosmik yang sedang menjalankan tugasnya masing-masing."`;

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