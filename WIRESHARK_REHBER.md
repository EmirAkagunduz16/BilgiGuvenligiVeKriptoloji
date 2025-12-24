# 🦈 Wireshark ile WebSocket Paket Analizi Rehberi

## 📋 İçindekiler
1. [Wireshark Nedir?](#wireshark-nedir)
2. [Kurulum](#kurulum)
3. [Paket Yakalama Adımları](#paket-yakalama-adımları)
4. [Şifreli Metinleri Doğrulama](#şifreli-metinleri-doğrulama)
5. [Önemli Notlar](#önemli-notlar)

---

## 🔍 Wireshark Nedir?

**Wireshark**, ağ üzerinden gidip gelen tüm paketleri yakalayan ve analiz eden ücretsiz, açık kaynak bir programdır. Ağ trafiğini gerçek zamanlı olarak izleyebilir, protokolleri analiz edebilir ve güvenlik testleri yapabilirsiniz.

### ✨ Özellikleri:
- 📡 Ağ trafiğini gerçek zamanlı yakalama
- 🔬 Protokol analizi (HTTP, WebSocket, TCP, UDP, vb.)
- 🎯 Güçlü filtreleme sistemi
- 📊 Detaylı paket inceleme
- **KOD YAZMAYA GEREK YOK!** Sadece bir program, kurdunuz mu kullanıyorsunuz.

---

## 💾 Kurulum

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install wireshark
```

Kurulum sırasında "non-root kullanıcılar paket yakalayabilsin mi?" sorusu gelirse **EVET** deyin.

Sonra kendinizi wireshark grubuna ekleyin:
```bash
sudo usermod -aG wireshark $USER
```

**ÖNEMLİ:** Bu işlemden sonra oturumunuzu kapatıp tekrar açın veya bilgisayarınızı yeniden başlatın.

### Windows:
1. [Wireshark İndirme Sayfası](https://www.wireshark.org/download.html)
2. Windows installer'ı indirin ve çalıştırın
3. Kurulum sırasında **Npcap**'i de kurun (otomatik seçili gelir)

### macOS:
1. [Wireshark İndirme Sayfası](https://www.wireshark.org/download.html)
2. macOS installer'ı (.dmg) indirin ve kurun

---

## 🎯 Paket Yakalama Adımları

### Adım 1: Uygulamanızı Başlatın

Önce server ve client'ı çalıştırın:

**Terminal 1 (Server):**
```bash
cd /home/emir/Desktop/School/Kriptoloji/server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd /home/emir/Desktop/School/Kriptoloji/client
npm run dev
```

### Adım 2: Wireshark'ı Açın

Linux'ta:
```bash
wireshark
```

veya uygulamalar menüsünden "Wireshark" yazıp açın.

### Adım 3: Doğru Arayüzü Seçin

Wireshark açıldığında bir arayüz listesi göreceksiniz:

![Wireshark Arayüz Seçimi](https://via.placeholder.com/600x200?text=Arayüz+Listesi)

**Localhost trafiği için:**
- **Linux/macOS:** `Loopback: lo` veya `lo0` seçin
- **Windows:** `Adapter for loopback traffic capture` seçin

Arayüze **çift tıklayın** veya seçip **Start** butonuna basın.

### Adım 4: Filtreyi Uygulayın

Üstteki filtre çubuğuna şunu yazın:

```
tcp.port == 3000
```

veya WebSocket trafiğini görmek için:

```
websocket
```

veya her ikisi için:

```
tcp.port == 3000 or websocket
```

**Enter'a basın** veya sağdaki mavi ok butonuna tıklayın.

### Adım 5: Mesaj Gönderin

Tarayıcınızda `http://localhost:5173` adresine gidin:

1. **Gönderici** modunda bir mesaj yazın (örn: "Merhaba Dünya")
2. Bir anahtar girin (örn: Caesar için "3")
3. **Şifrele** butonuna basın
4. **Alıcı** moduna geçecek, şifreli mesaj göreceksiniz
5. Anahtarı girin ve **Deşifrele** butonuna basın

### Adım 6: Paketleri İnceleyin

Wireshark'ta paketler görünmeye başlayacak:

```
No.     Time        Source          Destination     Protocol  Info
1       0.000000    127.0.0.1       127.0.0.1       TCP       [SYN]
2       0.000023    127.0.0.1       127.0.0.1       TCP       [SYN, ACK]
3       0.000045    127.0.0.1       127.0.0.1       TCP       [ACK]
4       0.123456    127.0.0.1       127.0.0.1       WebSocket Text [{"type":"encrypt",...}]
5       0.234567    127.0.0.1       127.0.0.1       WebSocket Text [{"type":"encrypted",...}]
```

---

## 🔐 Şifreli Metinleri Doğrulama

### 1. WebSocket Paketini Bulun

- **Protocol** sütununda `WebSocket` yazan satırlara bakın
- **Info** sütununda `Text` yazan paketler mesaj paketleridir

### 2. Paketi Açın

Pakete **çift tıklayın** veya **sağ tık > Follow > TCP Stream**

### 3. Mesaj İçeriğini İnceleyin

Alt panelde paket detaylarını göreceksiniz:

```
WebSocket
  ├─ Frame
  ├─ Ethernet II
  ├─ Internet Protocol Version 4
  ├─ Transmission Control Protocol
  └─ WebSocket
      ├─ Opcode: Text (1)
      ├─ Mask: True
      └─ Payload
          └─ Text: {"type":"encrypt","method":"caeser","message":"Merhaba Dünya","key":"3"}
```

**▶ Payload** kısmını genişletin ve **Text** alanına bakın.

### 4. Şifrelemeyi Doğrulayın

**ŞİFRELEME İSTEĞİ (Client → Server):**
```json
{
  "type": "encrypt",
  "method": "caeser",
  "message": "Merhaba Dünya",  ← AÇIK METİN (ŞİFRELENMEMİŞ)
  "key": "3"
}
```

**ŞİFRELEME CEVABI (Server → Client):**
```json
{
  "type": "encrypted",
  "data": {
    "encryptedMessage": "Phukded Gûqbd"  ← ŞİFRELİ METİN
  }
}
```

**DEŞİFRELEME İSTEĞİ (Client → Server):**
```json
{
  "type": "decrypt",
  "method": "caeser",
  "message": "Phukded Gûqbd",  ← ŞİFRELİ METİN
  "key": "3"
}
```

**DEŞİFRELEME CEVABI (Server → Client):**
```json
{
  "type": "decrypted",
  "data": {
    "decryptedMessage": "Merhaba Dünya"  ← AÇIK METİN
  }
}
```

### ✅ Ne Görmeli, Ne Görmemelisiniz?

| Paket | Beklenen Durum | Açıklama |
|-------|----------------|----------|
| Şifreleme İsteği | ❌ Açık metin görünür | Normal - henüz şifrelenmedi |
| Şifreleme Cevabı | ✅ Şifreli metin görünür | İyi - server şifreleyip gönderdi |
| Deşifreleme İsteği | ✅ Şifreli metin görünür | İyi - client şifreli metni gönderiyor |
| Deşifreleme Cevabı | ⚠️ Açık metin görünür | Normal - server deşifre etti |

### 🎯 Kritik Nokta

**ŞİFRELEME CEVABI** paketinde `encryptedMessage` değerinin **okunaksız/anlaşılmaz** olduğunu doğrulayın. Eğer orijinal mesajınız "Merhaba Dünya" ise, cevap paketinde "Merhaba Dünya" değil, "Phukded Gûqbd" gibi şifreli bir metin görmelisiniz.

---

## 📸 Wireshark Ekran Görüntüleri

### WebSocket Bağlantısı
```
GET / HTTP/1.1
Host: localhost:3000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: ...
Sec-WebSocket-Version: 13
```

### Şifreli Mesaj Görünümü
```
Text: {"type":"encrypted","data":{"encryptedMessage":"Qjfwpjiqfs"}}
      ^                                              ^
      |                                              |
      Tip bilgisi                         ŞİFRELİ METİN (okunaksız)
```

---

## 🛠️ Yararlı Wireshark Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `tcp.port == 3000` | 3000 portundaki tüm trafik |
| `websocket` | Sadece WebSocket paketleri |
| `websocket.payload` | WebSocket mesaj içerikleri |
| `websocket and tcp.port == 3000` | Port 3000'deki WebSocket trafiği |
| `ip.addr == 127.0.0.1` | Localhost trafiği |

---

## 💡 İpuçları

1. **🎨 Renklendirme:** Wireshark paketleri renklere göre kategorize eder:
   - **Yeşil:** TCP bağlantısı
   - **Mavi:** UDP paketleri
   - **Siyah:** TCP hataları

2. **🔍 Follow TCP Stream:** Bir WebSocket paketine sağ tıklayıp "Follow > TCP Stream" seçerseniz, tüm konuşmayı görebilirsiniz.

3. **💾 Kaydetme:** File > Save As ile yakalanan paketleri `.pcap` formatında kaydedebilir, sonra tekrar açıp inceleyebilirsiniz.

4. **🎯 Display Filter Kullanın:** Capture başladıktan SONRA filtreleme yapın. Böylece tüm trafiği kaydeder, sonra istediğinizi görebilirsiniz.

---

## 🚀 Hızlı Test Senaryosu

### Test 1: Caesar Cipher
1. Mesaj: `HELLO`
2. Key: `3`
3. Beklenen Şifreli: `KHOOR`
4. Wireshark'ta `KHOOR` görmelisiniz

### Test 2: AES Cipher
1. Mesaj: `Secret Message`
2. Key: `mySecretKey123456`
3. Beklenen: Base64 kodlu şifreli metin (örn: `U2FsdGVkX1+...`)
4. Wireshark'ta Base64 string görmelisiniz

### Test 3: Vigenère Cipher
1. Mesaj: `ATTACKATDAWN`
2. Key: `LEMON`
3. Beklenen Şifreli: `LXFOPVEFRNHR`
4. Wireshark'ta `LXFOPVEFRNHR` görmelisiniz

---

## ⚠️ Önemli Notlar

### 🔒 Güvenlik Notu
Bu projede **WebSocket bağlantısı şifresiz (ws://)** kullanılıyor. Üretim ortamında **WSS (WebSocket Secure)** kullanmalısınız. WSS kullanırsanız, Wireshark paketlerin içini göremez çünkü TLS/SSL ile şifrelidir.

### 🌐 Sadece Localhost
Bu test senaryosu localhost üzerinde çalışır. Farklı bilgisayarlar arasında test yapmak isterseniz:
1. Server'ın IP adresini bulun
2. Client'ta WebSocket URL'ini güncelleyin
3. Wireshark'ta doğru network arayüzünü seçin (örn: `eth0`, `wlan0`)

### 🎓 Öğrenme Amaçlı
Bu proje eğitim amaçlıdır. Gerçek dünya uygulamalarında:
- WSS (WebSocket Secure) kullanın
- HTTPS kullanın
- Ek güvenlik katmanları ekleyin
- API anahtarları ve token'lar kullanın

---

## 🎉 Başarılı Test İçin Kontrol Listesi

- [ ] Wireshark kuruldu ve çalışıyor
- [ ] Server başlatıldı (port 3000)
- [ ] Client başlatıldı (port 5173)
- [ ] Wireshark'ta `Loopback: lo` arayüzü seçildi
- [ ] Filtre uygulandı: `tcp.port == 3000`
- [ ] Web arayüzünde "WebSocket Bağlı" görünüyor
- [ ] Mesaj şifrelendi
- [ ] Wireshark'ta WebSocket paketleri görünüyor
- [ ] Şifreli metin okunaksız/anlaşılmaz
- [ ] Deşifreleme çalışıyor

---

## 📚 Ek Kaynaklar

- [Wireshark Resmi Dökümanları](https://www.wireshark.org/docs/)
- [WebSocket Protokolü (RFC 6455)](https://datatracker.ietf.org/doc/html/rfc6455)
- [Wireshark Kullanım Kılavuzu (Türkçe)](https://www.wireshark.org/)

---

## 🆘 Sorun Giderme

### Problem: Wireshark'ta hiç paket görünmüyor
**Çözüm:**
- Doğru arayüzü seçtiğinizden emin olun (`Loopback: lo`)
- Server ve client çalışıyor mu kontrol edin
- Filtreyi kaldırıp tekrar deneyin

### Problem: "Permission denied" hatası
**Çözüm:**
```bash
sudo usermod -aG wireshark $USER
```
Sonra oturumu kapatıp açın.

### Problem: WebSocket paketleri görünmüyor
**Çözüm:**
- TCP handshake'i tamamlandı mı kontrol edin
- WebSocket upgrade request'i arayın
- `tcp.port == 3000` filtresini kullanın

---

## ✅ Sonuç

Artık Wireshark ile WebSocket trafiğini yakalayıp, şifreli metinlerin gerçekten şifreli olduğunu doğrulayabilirsiniz! 

**Başarılar! 🎓🔐**

