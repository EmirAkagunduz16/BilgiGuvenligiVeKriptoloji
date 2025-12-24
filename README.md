# 🔐 Bilgi Güvenliği ve Kriptoloji Projesi

WebSocket tabanlı, gerçek zamanlı şifreleme/deşifreleme uygulaması.

## 📋 Özellikler

- ✨ **12 Farklı Şifreleme Algoritması:**
  - Caesar Cipher
  - Substitution Cipher
  - Rail Fence Cipher
  - Playfair Cipher
  - Route Cipher
  - Columnar Transposition
  - Polybius Cipher
  - Pigpen Cipher
  - Hill Cipher
  - Vigenère Cipher
  - AES (Advanced Encryption Standard)
  - DES (Data Encryption Standard)

- 🔌 **WebSocket İletişimi:** Gerçek zamanlı, çift yönlü iletişim
- 🎨 **Modern UI:** React + TailwindCSS ile tasarlanmış kullanıcı dostu arayüz
- 📊 **İstemci-Sunucu Mimarisi:** TypeScript ile güvenli ve tip-güvenli kod
- 🦈 **Wireshark Uyumlu:** Şifreli mesajları ağ trafiğinde doğrulayabilirsiniz

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn

### 1. Depoyu Klonlayın
```bash
git clone <repo-url>
cd Kriptoloji
```

### 2. Server Kurulumu
```bash
cd server
npm install
npm run dev
```

Server `http://localhost:3000` adresinde çalışacak.

### 3. Client Kurulumu
Yeni bir terminal açın:
```bash
cd client
npm install
npm run dev
```

Client `http://localhost:5173` adresinde çalışacak.

## 📖 Kullanım

1. **Tarayıcınızda** `http://localhost:5173` adresine gidin
2. **WebSocket Bağlantısını** kontrol edin (yeşil nokta görmelisiniz)
3. **Gönderici Modunda:**
   - Bir şifreleme algoritması seçin
   - Mesajınızı yazın
   - Anahtar girin
   - "Şifrele" butonuna tıklayın
4. **Alıcı Modunda:**
   - Şifreli mesaj otomatik olarak gösterilir
   - Anahtarı girin
   - "Deşifrele" butonuna tıklayın
   - Orijinal mesajı görün

## 🦈 Wireshark ile Paket Analizi

Şifreli mesajların gerçekten şifreli olduğunu doğrulamak için Wireshark kullanabilirsiniz.

**Detaylı rehber için:** [WIRESHARK_REHBER.md](./WIRESHARK_REHBER.md)

### Hızlı Başlangıç
1. Wireshark'ı yükleyin ve açın
2. `Loopback: lo` arayüzünü seçin
3. Filtre: `tcp.port == 3000` veya `websocket`
4. Uygulamadan mesaj gönderin
5. Wireshark'ta paketleri inceleyin
6. Şifreli mesajların okunaksız olduğunu doğrulayın

## 🛠️ Teknolojiler

### Backend
- **Node.js** + **Express.js**
- **WebSocket (ws)** - Gerçek zamanlı iletişim
- **TypeScript** - Tip güvenliği
- **dotenv** - Çevre değişkenleri

### Frontend
- **React 19** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **TailwindCSS** - Stil framework'ü
- **Vite** - Build tool
- **Axios** - HTTP client (REST API için)

## 📁 Proje Yapısı

```
Kriptoloji/
├── server/
│   ├── main.ts                 # Server giriş noktası + WebSocket
│   ├── src/
│   │   ├── controller/
│   │   │   └── cipherController.ts    # Şifreleme kontrolcüsü
│   │   ├── lib/
│   │   │   └── encryptions/           # Tüm şifreleme algoritmaları
│   │   │       ├── caeserCipher.ts
│   │   │       ├── aesCipher.ts
│   │   │       └── ...
│   │   └── routes/                    # REST API routes
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── HomePage/
│   │   │       └── index.tsx          # Ana sayfa
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts        # WebSocket hook
│   │   ├── lib/
│   │   │   └── api.ts                 # API fonksiyonları
│   │   └── types/
│   │       └── encryption.ts          # TypeScript tipleri
│   └── package.json
│
├── README.md
└── WIRESHARK_REHBER.md                # Wireshark kullanım rehberi
```

## 🔐 Şifreleme Algoritmaları Hakkında

### Klasik Şifreler
- **Caesar Cipher:** Alfabedeki her harfi sabit sayıda kaydırır
- **Substitution Cipher:** Her harfi başka bir harfle değiştirir
- **Rail Fence Cipher:** Metni zigzag paterninde yazar
- **Playfair Cipher:** 5x5 matris kullanarak şifreler
- **Vigenère Cipher:** Anahtar kelime kullanarak çoklu Caesar şifresi

### Modern Şifreler
- **AES (Advanced Encryption Standard):** Günümüzde en yaygın simetrik şifreleme
- **DES (Data Encryption Standard):** Eski ama hala öğretilen simetrik şifreleme

## 🎯 WebSocket İletişim Protokolü

### Client → Server (Şifreleme İsteği)
```json
{
  "type": "encrypt",
  "method": "caeser",
  "message": "Merhaba Dünya",
  "key": "3"
}
```

### Server → Client (Şifreli Sonuç)
```json
{
  "type": "encrypted",
  "data": {
    "encryptedMessage": "Phukded Gûqbd"
  }
}
```

### Client → Server (Deşifreleme İsteği)
```json
{
  "type": "decrypt",
  "method": "caeser",
  "message": "Phukded Gûqbd",
  "key": "3"
}
```

### Server → Client (Deşifreli Sonuç)
```json
{
  "type": "decrypted",
  "data": {
    "decryptedMessage": "Merhaba Dünya"
  }
}
```

## 🧪 Test Senaryoları

### Senaryo 1: Caesar Cipher
- **Mesaj:** `HELLO`
- **Key:** `3`
- **Beklenen:** `KHOOR`

### Senaryo 2: Vigenère Cipher
- **Mesaj:** `ATTACKATDAWN`
- **Key:** `LEMON`
- **Beklenen:** `LXFOPVEFRNHR`

### Senaryo 3: AES
- **Mesaj:** `Secret Message`
- **Key:** `mySecretKey123456`
- **Beklenen:** Base64 kodlanmış şifreli metin

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje eğitim amaçlıdır.

## ⚠️ Güvenlik Notu

Bu proje **eğitim amaçlı** hazırlanmıştır. Üretim ortamında kullanmadan önce:

- ✅ WSS (WebSocket Secure) kullanın
- ✅ HTTPS kullanın
- ✅ API authentication ekleyin
- ✅ Rate limiting uygulayın
- ✅ Input validation yapın
- ✅ CORS ayarlarını güçlendirin

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Yapımcı:** Kriptoloji Dersi Projesi  
**Tarih:** 2025  
**Teknoloji:** TypeScript, React, Node.js, WebSocket
