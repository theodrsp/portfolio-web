import { useEffect, useState } from "react";

import { api } from "./lib/api";

export default function App() {
  const [status, setStatus] = useState("Memeriksa koneksi API...");

  useEffect(() => {
    api
      .get<{ nameDisplay: string }>("/api/profile")
      .then((p) => setStatus(`API terhubung: ${p.nameDisplay}`))
      .catch((e: Error) => setStatus(`Gagal: ${e.message}`));
  }, []);

  return <main className="p-8">{status}</main>;
}