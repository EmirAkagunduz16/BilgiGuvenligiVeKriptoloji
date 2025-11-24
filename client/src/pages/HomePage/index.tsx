import { useState } from "react";
import { encryptApi, decryptApi } from "../../lib/api";
import type { EncryptionMethod } from "../../types/encryption";

type Mode = "sender" | "receiver";

const Home = () => {
  const [mode, setMode] = useState<Mode>("sender");
  const [selectedMethod, setSelectedMethod] =
    useState<EncryptionMethod>("caeser");
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  // Tüm metodlar dropdown'da
  const allMethods = [
    { id: "substitution" as EncryptionMethod, name: "Substitution Cipher" },
    { id: "railfence" as EncryptionMethod, name: "Raylı Çit Şifresi" },
    { id: "playfair" as EncryptionMethod, name: "Playfair Cipher" },
    { id: "route" as EncryptionMethod, name: "Route Cipher" },
    { id: "columnar" as EncryptionMethod, name: "Columnar Transposition" },
    { id: "polybius" as EncryptionMethod, name: "Polybius Cipher" },
    { id: "pigpen" as EncryptionMethod, name: "Pigpen Cipher" },
    { id: "hill" as EncryptionMethod, name: "Hill Cipher" },
    { id: "caeser" as EncryptionMethod, name: "Caesar Cipher" },
    { id: "vigenere" as EncryptionMethod, name: "Vigenère Cipher" },
    { id: "aes" as EncryptionMethod, name: "AES" },
    { id: "des" as EncryptionMethod, name: "DES" },
  ];

  // Seçili metodun adını getir
  const getMethodName = (id: EncryptionMethod): string => {
    const method = allMethods.find((m) => m.id === id);
    return method?.name || id;
  };

  // Algoritmalara göre key placeholder'ı
  const getKeyPlaceholder = (method: EncryptionMethod): string => {
    const numericMethods = ["caeser", "railfence", "route", "columnar"];
    if (numericMethods.includes(method)) {
      return "Sayı girin (örn: 3)";
    }
    if (method === "substitution") {
      return "26 karakterlik alfabe girin";
    }
    if (method === "hill") {
      return "2x2 matris girin (örn: 3,3,2,5)";
    }
    if (method === "vigenere") {
      return "Kelime girin (örn: KEY)";
    }
    return "Anahtarınızı girin...";
  };

  // Algoritmalara göre input type
  const getKeyInputType = (method: EncryptionMethod): string => {
    const numericMethods = ["caeser", "railfence", "route", "columnar"];
    if (numericMethods.includes(method)) {
      return "number";
    }
    return "text";
  };

  const handleEncrypt = async () => {
    try {
      const result = await encryptApi(
        selectedMethod as EncryptionMethod,
        message,
        key as string
      );
      setEncryptedMessage(result.encryptedMessage);
      setDecryptedMessage(""); // Önceki decrypt sonucunu temizle
      setMode("receiver");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Şifreleme hatası");
      }
    }
  };

  const handleDecrypt = async () => {
    try {
      const result = await decryptApi(
        selectedMethod as EncryptionMethod,
        encryptedMessage,
        key as string
      );
      setDecryptedMessage(result.decryptedMessage);
      // Alıcı tarafında kalmaya devam et
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Deşifreleme hatası");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-slate-100 text-2xl font-light mb-6">
            İstemci-Sunucu Şifreleme Uygulaması
          </h1>

          {/* Mode Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setMode("sender")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === "sender"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-600/60 text-slate-200 hover:bg-slate-600/80"
              }`}
            >
              <span>📤</span>
              Gönderici (İstemci)
            </button>
            <button
              onClick={() => setMode("receiver")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === "receiver"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-600/60 text-slate-200 hover:bg-slate-600/80"
              }`}
            >
              <span>🔓</span>
              Alıcı (Sunucu)
            </button>
          </div>
        </header>

        {mode === "sender" && (
          <>
            {/* Encryption Methods */}
            <section className="mb-8">
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/70">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🔐</span>
                  <h2 className="text-slate-100 text-xl font-semibold">
                    Şifreleme Algoritması Seçin
                  </h2>
                </div>

                {/* Dropdown - Tüm metodlar */}
                <div>
                  <select
                    value={selectedMethod}
                    onChange={(e) =>
                      setSelectedMethod(e.target.value as EncryptionMethod)
                    }
                    className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600/70 rounded-lg text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {allMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Sender/Receiver Form */}
        <section>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">
                {mode === "sender" ? "📨" : "📬"}
              </span>
              <h2 className="text-slate-100 text-xl font-semibold">
                {mode === "sender" ? "Gönderici Arayüzü" : "Alıcı Arayüzü"}
              </h2>
            </div>

            {/* Alıcı tarafında seçili algoritma ve şifreli mesaj gösterimi */}
            {mode === "receiver" && (
              <div className="mb-4 space-y-3">
                <div className="p-4 bg-slate-600/30 rounded-lg border border-slate-500/50">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium">
                      Seçili Algoritma:
                    </span>
                    <span className="text-amber-400 font-bold">
                      {getMethodName(selectedMethod)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-700/50">
                  <p className="text-emerald-300 text-sm">
                    ℹ️ Gönderici tarafından şifrelenmiş mesaj otomatik olarak
                    aşağıya yüklenmiştir.
                  </p>
                </div>
              </div>
            )}

            {mode === "sender" ? (
              /* Sender - Encryption Form */
              <div className="space-y-4">
                {/* Message Input */}
                <div>
                  <label className="block text-slate-200 font-medium mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Şifrelenecek mesajı yazın..."
                    className="w-full h-32 px-4 py-3 bg-slate-600/40 border border-slate-500/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Key Input */}
                <div>
                  <label className="block text-slate-200 font-medium mb-2">
                    Anahtar
                  </label>
                  <input
                    type={getKeyInputType(selectedMethod)}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={getKeyPlaceholder(selectedMethod)}
                    className="w-full px-4 py-3 bg-slate-600/40 border border-slate-500/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Encrypt Button */}
                <button
                  onClick={handleEncrypt}
                  className="w-full py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
                >
                  <span>🔒</span>
                  Şifrele
                  <span>→</span>
                </button>
              </div>
            ) : (
              /* Receiver - Decryption Form */
              <div className="space-y-4">
                {/* Encrypted Message Input - Read Only */}
                <div>
                  <label className="block text-slate-200 font-medium mb-2">
                    Şifreli Mesaj (Otomatik Yüklendi)
                  </label>
                  <textarea
                    value={encryptedMessage}
                    readOnly
                    placeholder="Şifreli mesaj buraya gelecek..."
                    className="w-full h-32 px-4 py-3 bg-slate-700/60 border border-slate-500/50 rounded-lg text-slate-100 placeholder-slate-400 cursor-not-allowed resize-none"
                  />
                </div>

                {/* Key Input */}
                <div>
                  <label className="block text-slate-200 font-medium mb-2">
                    Anahtar
                  </label>
                  <input
                    type={getKeyInputType(selectedMethod)}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={getKeyPlaceholder(selectedMethod)}
                    className="w-full px-4 py-3 bg-slate-600/40 border border-slate-500/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Decrypt Button */}
                <button
                  onClick={handleDecrypt}
                  className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-2"
                >
                  <span>🔓</span>
                  Deşifrele
                  <span>→</span>
                </button>

                {/* Decrypted Message Result */}
                {decryptedMessage && (
                  <div className="mt-6 p-6 bg-emerald-900/30 border-2 border-emerald-500/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">✅</span>
                      <h3 className="text-emerald-300 text-lg font-semibold">
                        Deşifre Edilmiş Mesaj (Açık Metin)
                      </h3>
                    </div>
                    <div className="bg-slate-700/60 p-4 rounded-lg">
                      <p className="text-slate-100 text-lg font-medium wrap-break-word">
                        {decryptedMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
