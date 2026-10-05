let timer: NodeJS.Timeout | null = null;

async function callRevalidate() {
  const url = process.env.WEB_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) {
    console.warn("[revalidate] WEB_REVALIDATE_URL atau REVALIDATE_SECRET belum diisi, dilewati");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[revalidate] gagal: HTTP ${res.status}`);
  } catch (e) {
    console.error("[revalidate] gagal:", e);
  }
}

// Beberapa perubahan beruntun (misalnya menyimpan tiga kali dalam sedetik) digabung jadi satu panggilan
export function scheduleRevalidate() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void callRevalidate();
  }, 1000);
}