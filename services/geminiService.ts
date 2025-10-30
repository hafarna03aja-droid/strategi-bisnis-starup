import { GoogleGenAI, Type, Chat } from "@google/genai";
import { BusinessInput, AnalysisResult, Geolocation, GroundingChunk, ExecutiveSummary } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatInstance: Chat | null = null;

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    swotAnalysis: {
      type: Type.STRING,
      description: "Analisis SWOT (Kekuatan, Kelemahan, Peluang, Ancaman) yang sangat mendetail. Untuk setiap kategori, berikan setidaknya 4-5 poin bullet yang dapat ditindaklanjuti. Untuk setiap poin, berikan penjelasan singkat tentang dampaknya terhadap bisnis. Gunakan format markdown.",
    },
    swotSummary: {
        type: Type.STRING,
        description: "Ringkasan eksekutif yang ringkas namun komprehensif (sekitar 3-4 kalimat) dari analisis SWOT.",
    },
    targetAudienceProfile: {
      type: Type.STRING,
      description: "Buat persona audiens target yang terperinci. Sertakan bagian-bagian berikut: **Demografi** (usia, jenis kelamin, pendapatan, lokasi), **Psikografi** (gaya hidup, nilai, minat, tantangan), **Perilaku Online** (platform media sosial yang digunakan, blog yang dibaca, influencer yang diikuti), dan **Motivasi Pembelian** (apa yang mendorong mereka untuk membeli produk/layanan ini). Gunakan format markdown.",
    },
    targetAudienceSummary: {
        type: Type.STRING,
        description: "Ringkasan eksekutif yang ringkas namun komprehensif (sekitar 3-4 kalimat) dari profil audiens target.",
    },
    marketingStrategy: {
      type: Type.STRING,
      description: "Strategi pemasaran multifaset yang dapat ditindaklanjuti dan sangat detail. Gunakan format markdown. Harus mencakup bagian 'Strategi Media Sosial' yang sangat terperinci yang menyediakan: 1. **Pemilihan Platform:** Rekomendasikan 2-3 platform media sosial terbaik untuk bisnis ini dan berikan alasannya. 2. **Analisis Pesaing Media Sosial:** Analisis singkat tentang bagaimana pesaing yang disebutkan menggunakan media sosial. Identifikasi kekuatan, kelemahan, dan peluang untuk diferensiasi. 3. **Ide Konten & Contoh Spesifik:** Untuk setiap platform yang direkomendasikan, berikan setidaknya **5 ide konten yang beragam**, mencakup berbagai format (misalnya, Reel, Story, Carousel, Live, Artikel Blog). Untuk setiap ide, berikan **contoh teks postingan yang mendetail** dan **saran visual yang sangat spesifik** (misalnya, 'Visual: Video time-lapse yang menunjukkan proses pembuatan kopi dari biji hingga cangkir' atau 'Visual: Infografis carousel yang membandingkan keunggulan kopi arabika vs robusta kami'). 4. **Jadwal Posting yang Direkomendasikan:** Sarankan frekuensi dan waktu posting yang optimal untuk setiap platform (misalnya, 'Instagram: 3-5 kali seminggu, fokus pada jam makan siang dan malam hari'). 5. **Taktik Keterlibatan & KPI:** Sarankan 3-4 taktik spesifik untuk meningkatkan keterlibatan audiens. Untuk setiap taktik, **sebutkan Metrik Kinerja Utama (KPI) yang jelas** untuk mengukur keberhasilannya. 6. **Strategi Iklan Berbayar:** Berikan saran awal untuk iklan berbayar. Termasuk rekomendasi audiens penargetan, saran anggaran awal (misalnya, 'Mulai dengan anggaran kecil Rp 25.000-50.000/hari'), dan format iklan yang disarankan (misalnya, 'Iklan Cerita Instagram untuk jangkauan'). Selain strategi media sosial, sertakan bagian untuk **Optimisasi Mesin Pencari (SEO)** dengan saran 5-7 kata kunci utama dan 3-4 ide topik untuk postingan blog yang relevan. Juga, tambahkan bagian **Pemasaran Konten** yang menguraikan strategi funnel (TOFU, MOFU, BOFU) dengan contoh-contoh konten untuk setiap tahap. Sertakan juga pemasaran offline jika relevan.",
    },
    marketingStrategySummary: {
        type: Type.STRING,
        description: "Ringkasan eksekutif yang ringkas namun komprehensif (sekitar 3-4 kalimat) dari strategi pemasaran.",
    },
  },
  required: ["swotAnalysis", "swotSummary", "targetAudienceProfile", "targetAudienceSummary", "marketingStrategy", "marketingStrategySummary"],
};

const trendsSummarySchema = {
    type: Type.OBJECT,
    properties: {
        marketTrendsSummary: {
            type: Type.STRING,
            description: "Ringkasan eksekutif yang ringkas namun komprehensif (sekitar 3-4 kalimat) dari tren pasar.",
        },
        localOpportunitiesSummary: {
            type: Type.STRING,
            description: "Ringkasan eksekutif yang ringkas namun komprehensif (sekitar 3-4 kalimat) dari peluang lokal. Jika tidak ada, kembalikan string kosong.",
        },
    },
    required: ["marketTrendsSummary", "localOpportunitiesSummary"],
};

const suggestedQuestionsSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Daftar 3-4 pertanyaan lanjutan yang relevan yang mungkin ditanyakan pengguna berdasarkan analisis bisnis.",
        },
    },
    required: ["questions"],
};

const generateBusinessAnalysis = async (
  business: BusinessInput,
  location: Geolocation | null
): Promise<AnalysisResult> => {
  const proModel = 'gemini-2.5-pro';
  const flashModel = 'gemini-2.5-flash';

  const basePrompt = `
    Analisis bisnis startup berikut dan hasilkan laporan terperinci dalam Bahasa Indonesia.
    Nama Bisnis: ${business.name}
    Deskripsi: ${business.description}
    Target Audiens: ${business.targetAudience}
    Pesaing yang Diketahui: ${business.competitors}
  `;

  // --- Complex Analysis with Pro Model ---
  const analysisPromise = ai.models.generateContent({
    model: proModel,
    contents: basePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.5,
    },
  });

  // --- Market Trends with Search Grounding ---
  const marketTrendsPrompt = `Lakukan analisis mendalam tentang tren pasar utama yang memengaruhi industri '${business.description}'. Untuk setiap tren, berikan: 1. **Deskripsi Tren:** Penjelasan terperinci tentang apa tren itu. 2. **Dampak pada Bisnis:** Bagaimana tren ini secara spesifik dapat memengaruhi '${business.name}'. 3. **Rekomendasi Tindakan:** Saran konkret tentang bagaimana bisnis dapat memanfaatkan tren ini atau mengurangi risikonya. Sajikan dalam format markdown yang terstruktur dengan baik. Jawab dalam Bahasa Indonesia.`;
  const marketTrendsPromise = ai.models.generateContent({
    model: flashModel,
    contents: marketTrendsPrompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // --- Local Opportunities with Maps Grounding (if location is available) ---
  let localOpportunitiesPromise = Promise.resolve(null);
  if (location) {
    const localOpportunitiesPrompt = `Dengan menggunakan data lokasi, berikan analisis komprehensif tentang lanskap lokal untuk '${business.name}'. Sertakan bagian-bagian berikut: 1. **Analisis Pesaing Lokal:** Identifikasi 2-3 pesaing lokal utama, sebutkan lokasi mereka jika memungkinkan, dan analisis singkat kekuatan dan kelemahan mereka. 2. **Peluang Kemitraan:** Sarankan 3-5 bisnis lokal non-kompetitif yang potensial untuk kemitraan (misalnya, kedai kopi bermitra dengan toko buku lokal). 3. **Acara & Komunitas Lokal:** Sebutkan acara tahunan, pasar, atau kelompok komunitas yang relevan di mana bisnis dapat berpartisipasi untuk pemasaran. 4. **Wawasan Demografis Lokal:** Berikan wawasan singkat tentang demografi area tersebut yang dapat memengaruhi strategi pemasaran. Jawab dalam Bahasa Indonesia.`;
    localOpportunitiesPromise = ai.models.generateContent({
      model: flashModel,
      contents: localOpportunitiesPrompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });
  }

  const [analysisResponse, marketTrendsResponse, localOpportunitiesResponse] = await Promise.all([
    analysisPromise,
    marketTrendsPromise,
    localOpportunitiesPromise,
  ]);
  
  const analysisData = JSON.parse(analysisResponse.text.trim());
  const marketTrendsText = marketTrendsResponse.text;
  const localOpportunitiesText = localOpportunitiesResponse?.text ?? null;

  // --- Summarize Trends and Local Opps ---
  const summaryPrompt = `Buat ringkasan eksekutif yang ringkas namun komprehensif (sekitar 3-4 kalimat) untuk setiap topik berikut berdasarkan teks yang diberikan. Jawab dalam format JSON.
    Topik 1: Tren Pasar
    Teks Tren Pasar: ${marketTrendsText}

    Topik 2: Peluang Lokal
    Teks Peluang Lokal: ${localOpportunitiesText || 'Tidak tersedia.'}
  `;

  const trendsSummaryResponse = await ai.models.generateContent({
    model: flashModel,
    contents: summaryPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: trendsSummarySchema,
    },
  });
  const trendsSummaryData = JSON.parse(trendsSummaryResponse.text.trim());

  const executiveSummary: ExecutiveSummary = {
    swot: analysisData.swotSummary,
    targetAudience: analysisData.targetAudienceSummary,
    marketTrends: trendsSummaryData.marketTrendsSummary,
    marketingStrategy: analysisData.marketingStrategySummary,
    ...(localOpportunitiesText && { localOpportunities: trendsSummaryData.localOpportunitiesSummary }),
  };
  
    // --- Generate Follow-up Questions ---
  const fullAnalysisText = `
    Analisis SWOT: ${analysisData.swotAnalysis}
    Profil Audiens: ${analysisData.targetAudienceProfile}
    Tren Pasar: ${marketTrendsText}
    Peluang Lokal: ${localOpportunitiesText || 'Tidak ada'}
    Strategi Pemasaran: ${analysisData.marketingStrategy}
  `;

  const questionsPrompt = `Berdasarkan analisis bisnis berikut, buatlah 3-4 pertanyaan lanjutan yang singkat dan relevan yang mungkin diajukan oleh pengguna startup untuk mengklarifikasi atau mendalami lebih lanjut. Jawab dalam format JSON. Analisis: ${fullAnalysisText}`;
  
  const suggestedQuestionsResponse = await ai.models.generateContent({
      model: flashModel,
      contents: questionsPrompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: suggestedQuestionsSchema,
      },
  });

  const suggestedQuestionsData = JSON.parse(suggestedQuestionsResponse.text.trim());

  return {
    swotAnalysis: analysisData.swotAnalysis,
    targetAudienceProfile: analysisData.targetAudienceProfile,
    marketingStrategy: analysisData.marketingStrategy,
    marketTrends: marketTrendsText,
    marketTrendsSources: marketTrendsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined,
    localOpportunities: localOpportunitiesText ?? undefined,
    localOpportunitiesSources: localOpportunitiesResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined,
    executiveSummary,
    suggestedQuestions: suggestedQuestionsData.questions,
  };
};

const getChatInstance = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'Anda adalah asisten strategi bisnis yang membantu. Jawab pertanyaan dengan singkat dan jelas dalam Bahasa Indonesia, bantu pengguna menyempurnakan ide startup mereka.',
      },
    });
  }
  return chatInstance;
}

const sendChatMessage = (message: string) => {
    const chat = getChatInstance();
    return chat.sendMessageStream({ message });
};

export { generateBusinessAnalysis, sendChatMessage };