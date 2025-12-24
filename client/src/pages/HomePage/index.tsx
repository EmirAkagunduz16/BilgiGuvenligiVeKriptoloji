import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { EncryptionMethod } from "../../types/encryption";

type Mode = "sender" | "receiver";
type EncryptionCategory = "classic" | "modern" | "hybrid";
type ModernAlgorithm = "aes" | "des";
type ImplementationMode = "library" | "manual";

interface HybridData {
  encryptedKey: string;
  encryptedMessage: string;
  algorithm: "aes" | "des";
}

interface KeyValidation {
  isValid: boolean;
  error: string;
}

const Home = () => {
  const [mode, setMode] = useState<Mode>("sender");
  const [category, setCategory] = useState<EncryptionCategory>("classic");
  
  // Klasik şifreler için
  const [selectedMethod, setSelectedMethod] = useState<EncryptionMethod>("caeser");
  
  // Modern şifreler için (AES/DES)
  const [modernAlgorithm, setModernAlgorithm] = useState<ModernAlgorithm>("aes");
  const [implementationMode, setImplementationMode] = useState<ImplementationMode>("library");
  
  // Hibrit şifreleme için
  const [hybridAlgorithm, setHybridAlgorithm] = useState<ModernAlgorithm>("aes");
  const [hybridData, setHybridData] = useState<HybridData | null>(null);
  const [useManualKeyInHybrid, setUseManualKeyInHybrid] = useState(false);
  
  // Genel state'ler
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [keyError, setKeyError] = useState("");
  
  // WebSocket bağlantısı
  const { isConnected, sendMessage, lastMessage } = useWebSocket(
    "ws://localhost:3000"
  );

  // WebSocket mesajlarını dinle
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === "encrypted") {
        setEncryptedMessage(lastMessage.data.encryptedMessage || "");
        setDecryptedMessage("");
        setMode("receiver");
      } else if (lastMessage.type === "decrypted") {
        setDecryptedMessage(lastMessage.data.decryptedMessage || "");
      } else if (lastMessage.type === "hybrid_encrypted") {
        setHybridData(lastMessage.data);
        setEncryptedMessage(lastMessage.data.encryptedMessage || "");
        setDecryptedMessage("");
        setMode("receiver");
      } else if (lastMessage.type === "hybrid_decrypted") {
        setDecryptedMessage(lastMessage.data.decryptedMessage || "");
      } else if (lastMessage.type === "error") {
        alert(lastMessage.message || "Bir hata oluştu");
      }
    }
  }, [lastMessage]);

  // Klasik metodlar
  const classicMethods = [
    { id: "caeser" as EncryptionMethod, name: "Caesar Cipher" },
    { id: "substitution" as EncryptionMethod, name: "Substitution Cipher" },
    { id: "railfence" as EncryptionMethod, name: "Rail Fence Cipher" },
    { id: "playfair" as EncryptionMethod, name: "Playfair Cipher" },
    { id: "route" as EncryptionMethod, name: "Route Cipher" },
    { id: "columnar" as EncryptionMethod, name: "Columnar Transposition" },
    { id: "polybius" as EncryptionMethod, name: "Polybius Cipher" },
    { id: "pigpen" as EncryptionMethod, name: "Pigpen Cipher" },
    { id: "hill" as EncryptionMethod, name: "Hill Cipher" },
    { id: "vigenere" as EncryptionMethod, name: "Vigenère Cipher" },
  ];

  // Anahtar doğrulama fonksiyonu
  const validateKey = (keyValue: string): KeyValidation => {
    // Hibrit mod ve otomatik anahtar
    if (category === "hybrid" && !useManualKeyInHybrid) {
      return { isValid: true, error: "" };
    }

    // Modern şifreler (AES/DES)
    if (category === "modern" || (category === "hybrid" && useManualKeyInHybrid)) {
      const algorithm = category === "hybrid" ? hybridAlgorithm : modernAlgorithm;
      if (algorithm === "aes") {
        if (keyValue.length !== 16) {
          return { 
            isValid: false, 
            error: `AES için anahtar 16 karakter olmalıdır. Şu an: ${keyValue.length} karakter` 
          };
        }
      } else if (algorithm === "des") {
        if (keyValue.length !== 8) {
          return { 
            isValid: false, 
            error: `DES için anahtar 8 karakter olmalıdır. Şu an: ${keyValue.length} karakter` 
          };
        }
      }
      return { isValid: true, error: "" };
    }

    // Klasik şifreler
    if (category === "classic") {
      const numericMethods = ["caeser", "railfence", "route", "columnar"];
      
      if (numericMethods.includes(selectedMethod)) {
        const numKey = parseInt(keyValue);
        if (isNaN(numKey)) {
          return { isValid: false, error: "Bu algoritma için sayısal bir anahtar gereklidir" };
        }
        if (selectedMethod === "caeser" && (numKey < 1 || numKey > 25)) {
          return { isValid: false, error: "Caesar için anahtar 1-25 arasında olmalıdır" };
        }
        if (selectedMethod === "railfence" && numKey < 2) {
          return { isValid: false, error: "Rail Fence için ray sayısı en az 2 olmalıdır" };
        }
        if ((selectedMethod === "route" || selectedMethod === "columnar") && numKey < 2) {
          return { isValid: false, error: "Sütun sayısı en az 2 olmalıdır" };
        }
        return { isValid: true, error: "" };
      }

      if (selectedMethod === "substitution") {
        if (keyValue.length !== 26) {
          return { 
            isValid: false, 
            error: `Substitution için 26 karakterlik alfabe gereklidir. Şu an: ${keyValue.length} karakter` 
          };
        }
        return { isValid: true, error: "" };
      }

      if (selectedMethod === "hill") {
        const parts = keyValue.split(",");
        if (parts.length !== 4) {
          return { isValid: false, error: "Hill için 4 sayı girin (örn: 3,3,2,5)" };
        }
        return { isValid: true, error: "" };
      }

      if (selectedMethod === "vigenere" || selectedMethod === "playfair" || 
          selectedMethod === "polybius" || selectedMethod === "pigpen") {
        if (keyValue.length < 1) {
          return { isValid: false, error: "Lütfen bir anahtar kelime girin" };
        }
        return { isValid: true, error: "" };
      }
    }

    return { isValid: true, error: "" };
  };

  // Anahtar değiştiğinde doğrula
  useEffect(() => {
    if (key) {
      const validation = validateKey(key);
      setKeyError(validation.error);
    } else {
      setKeyError("");
    }
  }, [key, category, selectedMethod, modernAlgorithm, hybridAlgorithm, useManualKeyInHybrid]);

  // Seçili metodun adını getir
  const getMethodName = (): string => {
    if (category === "classic") {
      const method = classicMethods.find((m) => m.id === selectedMethod);
      return method?.name || selectedMethod;
    } else if (category === "modern") {
      return `${modernAlgorithm.toUpperCase()} (${implementationMode === "library" ? "Kütüphane" : "Manuel"})`;
    } else {
      return `RSA + ${hybridAlgorithm.toUpperCase()} Hibrit`;
    }
  };

  // Algoritmalara göre key placeholder'ı ve örneği
  const getKeyPlaceholder = (): string => {
    if (category === "hybrid") {
      if (!useManualKeyInHybrid) {
        return "Anahtar RSA ile otomatik oluşturulur";
      }
      return hybridAlgorithm === "aes" 
        ? "16 karakter girin (örn: mySecretKey12345)" 
        : "8 karakter girin (örn: myKey123)";
    }
    if (category === "modern") {
      return modernAlgorithm === "aes" 
        ? "16 karakter girin (örn: mySecretKey12345)" 
        : "8 karakter girin (örn: myKey123)";
    }
    
    // Klasik şifreler için örnekli placeholder
    switch (selectedMethod) {
      case "caeser":
        return "1-25 arası sayı (örn: 3)";
      case "railfence":
        return "Ray sayısı (örn: 3)";
      case "route":
      case "columnar":
        return "Sütun sayısı (örn: 4)";
      case "substitution":
        return "26 harf (örn: QWERTYUIOPASDFGHJKLZXCVBNM)";
      case "hill":
        return "2x2 matris (örn: 3,3,2,5)";
      case "vigenere":
        return "Anahtar kelime (örn: ANAHTAR)";
      case "playfair":
        return "Anahtar kelime (örn: SIFRE)";
      case "polybius":
        return "Anahtar kelime (örn: ZEBRA)";
      case "pigpen":
        return "Herhangi bir kelime (örn: GIZLI)";
      default:
        return "Anahtarınızı girin...";
    }
  };

  // Algoritmalara göre input type
  const getKeyInputType = (): string => {
    const numericMethods = ["caeser", "railfence", "route", "columnar"];
    if (category === "classic" && numericMethods.includes(selectedMethod)) {
      return "number";
    }
    return "text";
  };

  const handleEncrypt = () => {
    if (!isConnected) {
      alert("WebSocket bağlantısı kurulamadı. Lütfen sunucunun çalıştığından emin olun.");
      return;
    }

    if (!message) {
      alert("Lütfen mesaj giriniz");
      return;
    }

    // Hibrit mod ve otomatik anahtar
    if (category === "hybrid" && !useManualKeyInHybrid) {
      sendMessage({
        type: "hybrid_encrypt",
        message,
        algorithm: hybridAlgorithm,
      });
      return;
    }

    // Anahtar doğrulama
    if (!key) {
      alert("Lütfen anahtar giriniz");
      return;
    }

    const validation = validateKey(key);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (category === "hybrid" && useManualKeyInHybrid) {
      // Hibrit mod manuel anahtar ile - standart şifreleme kullan
      sendMessage({
        type: "encrypt",
        method: hybridAlgorithm,
        message,
        key,
        useLibrary: implementationMode === "library",
      });
    } else if (category === "modern") {
      // Modern şifreleme - useLibrary parametresi ile kütüphane/manuel seçimi
      sendMessage({
        type: "encrypt",
        method: modernAlgorithm,
        message,
        key,
        useLibrary: implementationMode === "library",
      });
    } else {
      // Klasik şifreler - her zaman kütüphane
      sendMessage({
        type: "encrypt",
        method: selectedMethod.toLowerCase(),
        message,
        key,
      });
    }
  };

  const handleDecrypt = () => {
    if (!isConnected) {
      alert("WebSocket bağlantısı kurulamadı. Lütfen sunucunun çalıştığından emin olun.");
      return;
    }

    if (category === "hybrid" && !useManualKeyInHybrid) {
      if (!hybridData) {
        alert("Hibrit şifrelenmiş veri bulunamadı");
        return;
      }
      sendMessage({
        type: "hybrid_decrypt",
        encryptedKey: hybridData.encryptedKey,
        encryptedMessage: hybridData.encryptedMessage,
        algorithm: hybridData.algorithm,
      });
      return;
    }

    if (!encryptedMessage || !key) {
      alert("Lütfen şifreli mesaj ve anahtar giriniz");
      return;
    }

    const validation = validateKey(key);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (category === "hybrid" && useManualKeyInHybrid) {
      sendMessage({
        type: "decrypt",
        method: hybridAlgorithm,
        message: encryptedMessage,
        key,
        useLibrary: implementationMode === "library",
      });
    } else if (category === "modern") {
      // Modern deşifreleme - useLibrary parametresi ile kütüphane/manuel seçimi
      sendMessage({
        type: "decrypt",
        method: modernAlgorithm,
        message: encryptedMessage,
        key,
        useLibrary: implementationMode === "library",
      });
    } else {
      // Klasik şifreler
      sendMessage({
        type: "decrypt",
        method: selectedMethod.toLowerCase(),
        message: encryptedMessage,
        key,
      });
    }
  };

  // Kategori buton stili
  const getCategoryButtonClass = (cat: EncryptionCategory) => {
    const baseClass = "flex-1 py-3 px-4 rounded-lg font-medium transition-all text-center";
    if (category === cat) {
      switch (cat) {
        case "classic":
          return `${baseClass} bg-blue-500 text-white shadow-lg shadow-blue-500/30`;
        case "modern":
          return `${baseClass} bg-purple-500 text-white shadow-lg shadow-purple-500/30`;
        case "hybrid":
          return `${baseClass} bg-rose-500 text-white shadow-lg shadow-rose-500/30`;
      }
    }
    return `${baseClass} bg-slate-600/60 text-slate-200 hover:bg-slate-600/80`;
  };

  // Anahtar giriş alanı gerekli mi?
  const isKeyInputRequired = (): boolean => {
    if (category === "hybrid" && !useManualKeyInHybrid) {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-slate-100 text-2xl font-light mb-6">
            İstemci-Sunucu Şifreleme Uygulaması
          </h1>

          {/* WebSocket Bağlantı Durumu */}
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/60 border border-slate-600/50">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected
                  ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"
                  : "bg-red-500 shadow-lg shadow-red-500/50"
              }`}
            />
            <span className="text-slate-200 text-sm font-medium">
              {isConnected
                ? "🔌 WebSocket Bağlı"
                : "⚠️ WebSocket Bağlantısı Yok"}
            </span>
          </div>

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
            {/* Şifreleme Kategorisi Seçimi */}
            <section className="mb-8">
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/70">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🔐</span>
                  <h2 className="text-slate-100 text-xl font-semibold">
                    Şifreleme Türü Seçin
                  </h2>
                </div>

                {/* Kategori Butonları */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => { setCategory("classic"); setKey(""); setKeyError(""); }}
                    className={getCategoryButtonClass("classic")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>📜</span>
                      <span>Klasik Şifreler</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { setCategory("modern"); setKey(""); setKeyError(""); }}
                    className={getCategoryButtonClass("modern")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🔒</span>
                      <span>AES / DES</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { setCategory("hybrid"); setKey(""); setKeyError(""); }}
                    className={getCategoryButtonClass("hybrid")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🔑</span>
                      <span>RSA Hibrit</span>
                    </div>
                  </button>
                </div>

                {/* Klasik Şifreler */}
                {category === "classic" && (
                  <div>
                    <label className="block text-slate-300 text-sm mb-2">
                      Algoritma Seçin
                    </label>
                    <select
                      value={selectedMethod}
                      onChange={(e) => {
                        setSelectedMethod(e.target.value as EncryptionMethod);
                        setKey("");
                        setKeyError("");
                      }}
                      className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600/70 rounded-lg text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {classicMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Modern Şifreler (AES/DES) */}
                {category === "modern" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm mb-2">
                        Algoritma Seçin
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setModernAlgorithm("aes"); setKey(""); setKeyError(""); }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            modernAlgorithm === "aes"
                              ? "bg-purple-600 text-white"
                              : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          AES-128
                        </button>
                        <button
                          onClick={() => { setModernAlgorithm("des"); setKey(""); setKeyError(""); }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            modernAlgorithm === "des"
                              ? "bg-purple-600 text-white"
                              : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          DES
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm mb-2">
                        Implementasyon Modu
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setImplementationMode("library")}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            implementationMode === "library"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          📚 Kütüphane
                        </button>
                        <button
                          onClick={() => setImplementationMode("manual")}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            implementationMode === "manual"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          ⚙️ Manuel
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-700/50">
                      <p className="text-purple-300 text-sm">
                        {modernAlgorithm === "aes" 
                          ? "🔐 AES-128: Tam olarak 16 karakter (128 bit) anahtar gerektirir."
                          : "🔐 DES: Tam olarak 8 karakter (64 bit) anahtar gerektirir."
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Hibrit Şifreleme (RSA + AES/DES) */}
                {category === "hybrid" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm mb-2">
                        Simetrik Algoritma Seçin
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setHybridAlgorithm("aes"); setKey(""); setKeyError(""); }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            hybridAlgorithm === "aes"
                              ? "bg-rose-600 text-white"
                              : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          RSA + AES
                        </button>
                        <button
                          onClick={() => { setHybridAlgorithm("des"); setKey(""); setKeyError(""); }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            hybridAlgorithm === "des"
                              ? "bg-rose-600 text-white"
                              : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          RSA + DES
                        </button>
                      </div>
                    </div>

                    {/* Manuel Anahtar Seçeneği */}
                    <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useManualKeyInHybrid}
                          onChange={(e) => {
                            setUseManualKeyInHybrid(e.target.checked);
                            setKey("");
                            setKeyError("");
                          }}
                          className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-rose-500 focus:ring-rose-500"
                        />
                        <span className="text-slate-200 font-medium">
                          Manuel anahtar girmek istiyorum
                        </span>
                      </label>
                    </div>

                    <div className={`p-3 rounded-lg border ${useManualKeyInHybrid ? 'bg-amber-900/20 border-amber-700/50' : 'bg-rose-900/20 border-rose-700/50'}`}>
                      <p className={`text-sm ${useManualKeyInHybrid ? 'text-amber-300' : 'text-rose-300'}`}>
                        {useManualKeyInHybrid 
                          ? `⚠️ Manuel mod: ${hybridAlgorithm === "aes" ? "16" : "8"} karakterlik anahtar girmeniz gerekiyor. RSA anahtar dağıtımı kullanılmayacak.`
                          : `🔑 Otomatik mod: Simetrik anahtar rastgele oluşturulur ve RSA ile şifrelenerek gönderilir.`
                        }
                      </p>
                    </div>
                  </div>
                )}
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
                      {getMethodName()}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-700/50">
                  <p className="text-emerald-300 text-sm">
                    {category === "hybrid" && !useManualKeyInHybrid
                      ? "🔑 Hibrit şifrelenmiş mesaj ve RSA ile şifrelenmiş anahtar alındı. Deşifreleme otomatik yapılacak."
                      : "ℹ️ Gönderici tarafından şifrelenmiş mesaj otomatik olarak aşağıya yüklenmiştir."
                    }
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

                {/* Key Input - Hibrit otomatik modda gösterme */}
                {isKeyInputRequired() && (
                  <div>
                    <label className="block text-slate-200 font-medium mb-2">
                      Anahtar
                      {category === "modern" && (
                        <span className="ml-2 text-sm text-slate-400">
                          ({key.length}/{modernAlgorithm === "aes" ? "16" : "8"} karakter)
                        </span>
                      )}
                      {category === "hybrid" && useManualKeyInHybrid && (
                        <span className="ml-2 text-sm text-slate-400">
                          ({key.length}/{hybridAlgorithm === "aes" ? "16" : "8"} karakter)
                        </span>
                      )}
                    </label>
                    <input
                      type={getKeyInputType()}
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder={getKeyPlaceholder()}
                      className={`w-full px-4 py-3 bg-slate-600/40 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                        keyError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-slate-500/50 focus:ring-emerald-500"
                      }`}
                    />
                    {/* Hata Mesajı */}
                    {keyError && (
                      <div className="mt-2 p-2 bg-red-900/30 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>⚠️</span>
                          {keyError}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Encrypt Button */}
                <button
                  onClick={handleEncrypt}
                  disabled={keyError !== "" && isKeyInputRequired()}
                  className={`w-full py-4 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    keyError && isKeyInputRequired()
                      ? "bg-slate-500 cursor-not-allowed opacity-50"
                      : category === "classic"
                      ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                      : category === "modern"
                      ? "bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                      : "bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50"
                  }`}
                >
                  <span>🔒</span>
                  {category === "hybrid" && !useManualKeyInHybrid ? "Hibrit Şifrele" : "Şifrele"}
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

                {/* Hibrit modda RSA ile şifrelenmiş anahtar göster */}
                {category === "hybrid" && !useManualKeyInHybrid && hybridData && (
                  <div>
                    <label className="block text-slate-200 font-medium mb-2">
                      RSA ile Şifrelenmiş Anahtar
                    </label>
                    <textarea
                      value={hybridData.encryptedKey}
                      readOnly
                      className="w-full h-20 px-4 py-3 bg-rose-900/20 border border-rose-500/50 rounded-lg text-rose-200 text-xs font-mono cursor-not-allowed resize-none"
                    />
                  </div>
                )}

                {/* Key Input - Hibrit otomatik modda gösterme */}
                {isKeyInputRequired() && (
                  <div>
                    <label className="block text-slate-200 font-medium mb-2">
                      Anahtar
                    </label>
                    <input
                      type={getKeyInputType()}
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder={getKeyPlaceholder()}
                      className={`w-full px-4 py-3 bg-slate-600/40 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                        keyError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-slate-500/50 focus:ring-amber-500"
                      }`}
                    />
                    {/* Hata Mesajı */}
                    {keyError && (
                      <div className="mt-2 p-2 bg-red-900/30 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>⚠️</span>
                          {keyError}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Decrypt Button */}
                <button
                  onClick={handleDecrypt}
                  disabled={keyError !== "" && isKeyInputRequired()}
                  className={`w-full py-4 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    keyError && isKeyInputRequired()
                      ? "bg-slate-500 cursor-not-allowed opacity-50"
                      : "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
                  }`}
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
