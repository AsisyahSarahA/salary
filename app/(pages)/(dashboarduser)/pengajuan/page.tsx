"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CutiType = "TAHUNAN" | "SAKIT" | "KHUSUS" | "BERSAMA";

export default function PengajuanCutiPage() {
  const router = useRouter();
  const [jenisCuti, setJenisCuti] = useState<CutiType>("TAHUNAN");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [alasan, setAlasan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cek role USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role?.toLowerCase() !== "user") {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validasi
    if (!tanggalMulai || !tanggalSelesai || !alasan) {
      alert("Semua field wajib diisi!");
      setIsLoading(false);
      return;
    }

    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("Pengajuan cuti berhasil dikirim!");
    setIsLoading(false);
    setTanggalMulai("");
    setTanggalSelesai("");
    setAlasan("");
  };

  const cutiTypes = [
    { type: "TAHUNAN" as CutiType, label: "Cuti Tahunan", icon: "🏖️", color: "bg-emerald-600" },
    { type: "SAKIT" as CutiType, label: "Cuti Sakit", icon: "🤒", color: "bg-rose-600" },
    { type: "KHUSUS" as CutiType, label: "Alasan Penting", icon: "⚠️", color: "bg-amber-600" },
    { type: "BERSAMA" as CutiType, label: "Cuti Bersama", icon: "🎉", color: "bg-blue-600" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">Form Pengajuan Cuti</h1>
        <p className="text-sm text-purple-500 mt-1">Silahkan lengkapi data di bawah ini untuk mengajukan cuti.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-purple-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Jenis Cuti */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-3">
                Pilih Jenis Cuti
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cutiTypes.map((cuti) => (
                  <button
                    key={cuti.type}
                    type="button"
                    onClick={() => setJenisCuti(cuti.type)}
                    className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                      jenisCuti === cuti.type
                        ? `border-purple-500 ${cuti.color} text-white`
                        : "border-purple-800 bg-slate-800 text-purple-300 hover:border-purple-600"
                    }`}
                  >
                    <span className="text-2xl">{cuti.icon}</span>
                    <span className="text-xs font-medium text-center">{cuti.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="w-full rounded-lg border border-purple-800 bg-slate-800 text-purple-100 px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Tanggal Berakhir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  className="w-full rounded-lg border border-purple-800 bg-slate-800 text-purple-100 px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Alasan */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Alasan Cuti <span className="text-red-500">*</span>
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Berikan alasan yang jelas untuk pengajuan cuti Anda..."
                rows={5}
                className="w-full rounded-lg border border-purple-800 bg-slate-800 text-purple-100 px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                required
              />
            </div>

            {/* Upload Dokumen */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Upload Dokumen Pendukung (Opsional)
              </label>
              <div className="border-2 border-dashed border-purple-800 rounded-lg p-6 text-center hover:border-purple-600 transition cursor-pointer">
                <div className="text-purple-400 text-3xl mb-2">☁️</div>
                <p className="text-sm text-purple-300 font-medium">Upload Dokumen Pendukung (Opsional)</p>
                <p className="text-xs text-purple-500 mt-1">PDF, JPG, atau PNG (Maks 2MB)</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Kirim Pengajuan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Ketentuan Cuti */}
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <span className="text-blue-400">ℹ️</span>
            Ketentuan Cuti
          </h3>
          <ol className="space-y-3 text-sm text-purple-300">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-purple-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span>Pengajuan cuti dilakukan minimal 3 hari sebelum tanggal mulai.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-purple-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span>Cuti sakit wajib melampirkan surat keterangan dokter.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-purple-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span>Persetujuan cuti bergantung pada kebijakan manajer divisi.</span>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-xs text-blue-400 font-semibold mb-2">BUTUH BANTUAN?</p>
            <p className="text-xs text-blue-300">
              Hubungi HRD melalui email<br />
              <a href="mailto:hrd@company.com" className="text-blue-400 hover:underline">hrd@company.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}