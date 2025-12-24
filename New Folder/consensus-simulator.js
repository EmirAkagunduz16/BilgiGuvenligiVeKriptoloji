/**
 * ========================================
 * KONSENSÜS SİMÜLATÖRÜ
 * PoW (Proof of Work) ve PoS (Proof of Stake) Test Aracı
 * ========================================
 */

const SHA256 = require("crypto-js/sha256");
const readline = require("readline");

// ==========================================
// PoW (Proof of Work) Simülasyonu
// ==========================================

class PoWSimulator {
  constructor() {
    this.results = [];
  }

  /**
   * Tek bir bloğu belirli zorlukta mine eder ve istatistikleri döndürür
   */
  mineBlockWithStats(difficulty, data = "Test Block Data") {
    const startTime = Date.now();
    let nonce = 0;
    let hash = "";
    const target = Array(difficulty + 1).join("0");

    const blockData = {
      timestamp: Date.now(),
      data: data,
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      nonce: 0
    };

    // Mining döngüsü
    while (hash.substring(0, difficulty) !== target) {
      nonce++;
      blockData.nonce = nonce;
      hash = SHA256(JSON.stringify(blockData)).toString();
    }

    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // saniye cinsinden

    return {
      difficulty,
      nonce,
      hash,
      timeTaken,
      hashRate: nonce / timeTaken // hash/saniye
    };
  }

  /**
   * Farklı zorluk seviyelerinde test yapar
   */
  runDifficultyTest(minDifficulty = 1, maxDifficulty = 5) {
    console.log("\n" + "=".repeat(60));
    console.log("⛏️  POW (PROOF OF WORK) TESTİ BAŞLIYOR");
    console.log("=".repeat(60));
    console.log("\n📋 Bu test, farklı zorluk seviyelerinde blok madenciliği");
    console.log("   süresini ölçerek PoW'un nasıl çalıştığını gösterir.\n");

    this.results = [];

    for (let diff = minDifficulty; diff <= maxDifficulty; diff++) {
      console.log(`\n🔨 Zorluk ${diff} test ediliyor (Hedef: ${"0".repeat(diff)}...)...`);
      
      const result = this.mineBlockWithStats(diff);
      this.results.push(result);

      console.log(`   ✅ Tamamlandı!`);
      console.log(`   📊 Deneme sayısı (Nonce): ${result.nonce.toLocaleString()}`);
      console.log(`   ⏱️  Süre: ${result.timeTaken.toFixed(3)} saniye`);
      console.log(`   🔗 Hash: ${result.hash.substring(0, 20)}...`);
      console.log(`   ⚡ Hash Rate: ${Math.round(result.hashRate).toLocaleString()} hash/sn`);
    }

    this.printPoWReport();
  }

  /**
   * PoW test raporunu yazdırır
   */
  printPoWReport() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 POW TEST SONUÇ RAPORU");
    console.log("=".repeat(60));
    
    console.log("\n┌──────────┬────────────────┬──────────────┬─────────────────┐");
    console.log("│ Zorluk   │ Deneme Sayısı  │ Süre (sn)    │ Hash Rate       │");
    console.log("├──────────┼────────────────┼──────────────┼─────────────────┤");
    
    for (const r of this.results) {
      const diff = r.difficulty.toString().padStart(6);
      const nonce = r.nonce.toLocaleString().padStart(12);
      const time = r.timeTaken.toFixed(3).padStart(10);
      const rate = Math.round(r.hashRate).toLocaleString().padStart(13);
      console.log(`│ ${diff}   │ ${nonce} │ ${time}   │ ${rate} │`);
    }
    
    console.log("└──────────┴────────────────┴──────────────┴─────────────────┘");

    // Analiz
    console.log("\n📈 ANALİZ:");
    console.log("─".repeat(60));
    
    if (this.results.length >= 2) {
      const first = this.results[0];
      const last = this.results[this.results.length - 1];
      const timeIncrease = (last.timeTaken / first.timeTaken).toFixed(1);
      const nonceIncrease = (last.nonce / first.nonce).toFixed(1);
      
      console.log(`• Zorluk ${first.difficulty}'den ${last.difficulty}'e çıkınca:`);
      console.log(`  - Süre ${timeIncrease}x arttı`);
      console.log(`  - Deneme sayısı ${nonceIncrease}x arttı`);
      console.log(`\n• Her zorluk seviyesi artışı, ortalama ~16x daha fazla`);
      console.log(`  hesaplama gerektiriyor (16 = 2^4, bir hex karakteri)`);
    }

    console.log("\n💡 SONUÇ:");
    console.log("─".repeat(60));
    console.log("PoW'da zorluk arttıkça:");
    console.log("  ✓ Daha fazla hesaplama gücü gerekir");
    console.log("  ✓ Daha fazla enerji harcanır");
    console.log("  ✓ Blok üretim süresi uzar");
    console.log("  ✓ Ağın güvenliği artar (saldırı maliyeti yükselir)");
  }
}

// ==========================================
// PoS (Proof of Stake) Simülasyonu
// ==========================================

class PoSSimulator {
  constructor() {
    this.validators = [];
    this.results = [];
  }

  /**
   * Varsayılan validatörleri oluşturur
   */
  createDefaultValidators() {
    this.validators = [
      { name: "Ali", stake: 500, selectedCount: 0 },
      { name: "Veli", stake: 300, selectedCount: 0 },
      { name: "Ayşe", stake: 150, selectedCount: 0 },
      { name: "Fatma", stake: 50, selectedCount: 0 }
    ];
  }

  /**
   * Özel validatörler ekler
   */
  setValidators(validators) {
    this.validators = validators.map(v => ({
      ...v,
      selectedCount: 0
    }));
  }

  /**
   * Toplam stake miktarını hesaplar
   */
  getTotalStake() {
    return this.validators.reduce((sum, v) => sum + v.stake, 0);
  }

  /**
   * Stake oranına göre rastgele bir validatör seçer
   * (Weighted Random Selection)
   */
  selectValidator() {
    const totalStake = this.getTotalStake();
    let random = Math.random() * totalStake;

    for (const validator of this.validators) {
      random -= validator.stake;
      if (random <= 0) {
        return validator;
      }
    }

    // Fallback (normalde buraya gelmemeli)
    return this.validators[this.validators.length - 1];
  }

  /**
   * Belirli sayıda blok için simülasyon yapar
   */
  runSimulation(blockCount = 1000) {
    console.log("\n" + "=".repeat(60));
    console.log("🎰 POS (PROOF OF STAKE) SİMÜLASYONU BAŞLIYOR");
    console.log("=".repeat(60));
    console.log("\n📋 Bu simülasyon, stake miktarına göre validatör seçiminin");
    console.log("   nasıl çalıştığını gösterir.\n");

    // Reset counts
    this.validators.forEach(v => v.selectedCount = 0);

    const totalStake = this.getTotalStake();

    // Validatör bilgilerini göster
    console.log("👥 VALİDATÖRLER:");
    console.log("─".repeat(40));
    for (const v of this.validators) {
      const percentage = ((v.stake / totalStake) * 100).toFixed(1);
      const bar = "█".repeat(Math.round(percentage / 5));
      console.log(`   ${v.name.padEnd(8)} │ ${v.stake.toString().padStart(5)} coin │ %${percentage.padStart(5)} │ ${bar}`);
    }
    console.log(`   ${"─".repeat(8)}─┼─${"─".repeat(10)}─┼─${"─".repeat(6)}─┤`);
    console.log(`   ${"TOPLAM".padEnd(8)} │ ${totalStake.toString().padStart(5)} coin │`);

    console.log(`\n🎲 ${blockCount.toLocaleString()} blok simüle ediliyor...`);

    const startTime = Date.now();

    // Simülasyon
    for (let i = 0; i < blockCount; i++) {
      const winner = this.selectValidator();
      winner.selectedCount++;
    }

    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;

    console.log(`   ✅ Tamamlandı! (${timeTaken.toFixed(3)} saniye)\n`);

    this.printPoSReport(blockCount, timeTaken);
  }

  /**
   * PoS simülasyon raporunu yazdırır
   */
  printPoSReport(blockCount, timeTaken) {
    const totalStake = this.getTotalStake();

    console.log("=".repeat(60));
    console.log("📊 POS SİMÜLASYON SONUÇ RAPORU");
    console.log("=".repeat(60));

    console.log("\n┌──────────┬────────────┬────────────┬────────────┬──────────┐");
    console.log("│ Validatör│ Stake      │ Beklenen % │ Gerçek %   │ Fark     │");
    console.log("├──────────┼────────────┼────────────┼────────────┼──────────┤");

    for (const v of this.validators) {
      const expectedPercent = (v.stake / totalStake) * 100;
      const actualPercent = (v.selectedCount / blockCount) * 100;
      const diff = actualPercent - expectedPercent;
      const diffStr = diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);

      console.log(
        `│ ${v.name.padEnd(8)} │ ${v.stake.toString().padStart(6)} coin│ ${expectedPercent.toFixed(2).padStart(9)}% │ ${actualPercent.toFixed(2).padStart(9)}% │ ${diffStr.padStart(7)}% │`
      );
    }

    console.log("└──────────┴────────────┴────────────┴────────────┴──────────┘");

    // Blok dağılımı
    console.log("\n📦 BLOK DAĞILIMI:");
    console.log("─".repeat(60));
    
    for (const v of this.validators) {
      const barLength = Math.round((v.selectedCount / blockCount) * 40);
      const bar = "█".repeat(barLength);
      console.log(`   ${v.name.padEnd(8)} │ ${v.selectedCount.toString().padStart(5)} blok │ ${bar}`);
    }

    // İstatistikler
    console.log("\n📈 İSTATİSTİKLER:");
    console.log("─".repeat(60));
    console.log(`   • Toplam blok sayısı: ${blockCount.toLocaleString()}`);
    console.log(`   • Simülasyon süresi: ${timeTaken.toFixed(3)} saniye`);
    console.log(`   • Blok/saniye: ${Math.round(blockCount / timeTaken).toLocaleString()}`);
    console.log(`   • Enerji tüketimi: Minimal (sadece rastgele seçim)`);

    console.log("\n💡 SONUÇ:");
    console.log("─".repeat(60));
    console.log("PoS'ta:");
    console.log("  ✓ Daha fazla stake = Daha yüksek seçilme şansı");
    console.log("  ✓ Madencilik yok, enerji tasarrufu sağlanır");
    console.log("  ✓ Blok üretimi çok hızlı (milisaniyeler içinde)");
    console.log("  ✓ 'Zengin daha zengin olur' eleştirisi yapılır");
  }
}

// ==========================================
// PoW vs PoS Karşılaştırması
// ==========================================

class ConsensusComparator {
  constructor() {
    this.powSimulator = new PoWSimulator();
    this.posSimulator = new PoSSimulator();
  }

  runComparison() {
    console.log("\n" + "=".repeat(60));
    console.log("⚔️  POW vs POS KARŞILAŞTIRMASI");
    console.log("=".repeat(60));

    // PoW testi - zorluk 4
    console.log("\n🔨 PoW Testi (Zorluk: 4)...");
    const powStart = Date.now();
    const powResult = this.powSimulator.mineBlockWithStats(4);
    const powTime = (Date.now() - powStart);

    // PoS testi - 1 blok seçimi
    console.log("🎰 PoS Testi (1 blok seçimi)...");
    this.posSimulator.createDefaultValidators();
    const posStart = Date.now();
    const posWinner = this.posSimulator.selectValidator();
    const posTime = (Date.now() - posStart);

    // Karşılaştırma tablosu
    console.log("\n" + "=".repeat(60));
    console.log("📊 KARŞILAŞTIRMA TABLOSU");
    console.log("=".repeat(60));

    console.log("\n┌─────────────────────┬─────────────────────┬─────────────────────┐");
    console.log("│ Özellik             │ PoW                 │ PoS                 │");
    console.log("├─────────────────────┼─────────────────────┼─────────────────────┤");
    console.log(`│ Blok üretim süresi  │ ${powTime.toString().padStart(10)} ms      │ ${posTime.toString().padStart(10)} ms      │`);
    console.log(`│ Hesaplama sayısı    │ ${powResult.nonce.toLocaleString().padStart(15)}    │ ${"1".padStart(15)}    │`);
    console.log("│ Enerji tüketimi     │ Yüksek              │ Çok düşük           │");
    console.log("│ Güvenlik kaynağı    │ Hesaplama gücü      │ Stake miktarı       │");
    console.log("│ Saldırı maliyeti    │ Donanım + Elektrik  │ Coin satın alma     │");
    console.log("│ Örnek blockchain    │ Bitcoin, Litecoin   │ Ethereum 2.0, Cardano│");
    console.log("└─────────────────────┴─────────────────────┴─────────────────────┘");

    const speedDiff = powTime / Math.max(posTime, 0.001);
    console.log(`\n⚡ PoS, PoW'dan yaklaşık ${speedDiff.toFixed(0)}x daha hızlı!`);

    console.log("\n💡 ÖNEMLİ NOTLAR:");
    console.log("─".repeat(60));
    console.log("• PoW: 'Bir işi yapmak' ile güven sağlar (İş Kanıtı)");
    console.log("• PoS: 'Bir şeye sahip olmak' ile güven sağlar (Hisse Kanıtı)");
    console.log("• Bitcoin PoW kullanır, Ethereum PoS'a geçti (The Merge, 2022)");
    console.log("• Her iki sistemin de avantaj ve dezavantajları vardır");
  }
}

// ==========================================
// CLI (Komut Satırı Arayüzü)
// ==========================================

class CLI {
  constructor() {
    this.powSimulator = new PoWSimulator();
    this.posSimulator = new PoSSimulator();
    this.comparator = new ConsensusComparator();
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  clearScreen() {
    console.clear();
  }

  printBanner() {
    console.log("\n");
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║                                                              ║");
    console.log("║   ██████╗ ██╗      ██████╗  ██████╗██╗  ██╗ ██████╗██╗  ██╗  ║");
    console.log("║   ██╔══██╗██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██║  ██║  ║");
    console.log("║   ██████╔╝██║     ██║   ██║██║     █████╔╝ ██║     ███████║  ║");
    console.log("║   ██╔══██╗██║     ██║   ██║██║     ██╔═██╗ ██║     ██╔══██║  ║");
    console.log("║   ██████╔╝███████╗╚██████╔╝╚██████╗██║  ██╗╚██████╗██║  ██║  ║");
    console.log("║   ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝  ║");
    console.log("║                                                              ║");
    console.log("║           KONSENSÜS ALGORİTMALARI SİMÜLATÖRÜ                 ║");
    console.log("║              PoW & PoS Test ve Karşılaştırma                 ║");
    console.log("║                                                              ║");
    console.log("╚══════════════════════════════════════════════════════════════╝");
    console.log("\n");
  }

  printMenu() {
    console.log("┌────────────────────────────────────────────────────────────┐");
    console.log("│                        ANA MENÜ                            │");
    console.log("├────────────────────────────────────────────────────────────┤");
    console.log("│  [1] PoW (Proof of Work) Testi                             │");
    console.log("│  [2] PoS (Proof of Stake) Simülasyonu                      │");
    console.log("│  [3] PoW vs PoS Karşılaştırması                            │");
    console.log("│  [4] Özel PoW Testi (Zorluk Seçimi)                        │");
    console.log("│  [5] Özel PoS Simülasyonu (Validatör Ayarı)                │");
    console.log("│  [6] Tüm Testleri Çalıştır (Tam Rapor)                     │");
    console.log("│  [0] Çıkış                                                 │");
    console.log("└────────────────────────────────────────────────────────────┘");
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async waitForEnter() {
    await this.question("\n📌 Devam etmek için ENTER'a basın...");
  }

  async runPoWTest() {
    this.powSimulator.runDifficultyTest(1, 5);
    await this.waitForEnter();
  }

  async runPoSSimulation() {
    this.posSimulator.createDefaultValidators();
    this.posSimulator.runSimulation(1000);
    await this.waitForEnter();
  }

  async runComparison() {
    this.comparator.runComparison();
    await this.waitForEnter();
  }

  async runCustomPoW() {
    console.log("\n🔨 ÖZEL POW TESTİ");
    console.log("─".repeat(40));
    
    const minDiff = await this.question("Minimum zorluk seviyesi (1-3): ");
    const maxDiff = await this.question("Maximum zorluk seviyesi (3-6): ");
    
    const min = Math.max(1, parseInt(minDiff) || 1);
    const max = Math.min(6, parseInt(maxDiff) || 4);
    
    if (max > 5) {
      console.log("\n⚠️  Uyarı: Zorluk 6 ve üzeri çok uzun sürebilir!");
    }
    
    this.powSimulator.runDifficultyTest(min, max);
    await this.waitForEnter();
  }

  async runCustomPoS() {
    console.log("\n🎰 ÖZEL POS SİMÜLASYONU");
    console.log("─".repeat(40));
    
    const validatorCount = await this.question("Kaç validatör olsun? (2-5): ");
    const count = Math.min(5, Math.max(2, parseInt(validatorCount) || 3));
    
    const validators = [];
    const names = ["Ali", "Veli", "Ayşe", "Fatma", "Mehmet"];
    
    for (let i = 0; i < count; i++) {
      const stake = await this.question(`${names[i]}'nin stake miktarı (coin): `);
      validators.push({
        name: names[i],
        stake: parseInt(stake) || 100
      });
    }
    
    const blockCount = await this.question("Kaç blok simüle edilsin? (100-10000): ");
    const blocks = Math.min(10000, Math.max(100, parseInt(blockCount) || 1000));
    
    this.posSimulator.setValidators(validators);
    this.posSimulator.runSimulation(blocks);
    await this.waitForEnter();
  }

  async runFullReport() {
    console.log("\n" + "═".repeat(60));
    console.log("📋 TAM RAPOR - TÜM TESTLER ÇALIŞTIRILIYOR");
    console.log("═".repeat(60));
    
    // PoW Testi
    this.powSimulator.runDifficultyTest(1, 4);
    
    // PoS Simülasyonu
    this.posSimulator.createDefaultValidators();
    this.posSimulator.runSimulation(1000);
    
    // Karşılaştırma
    this.comparator.runComparison();
    
    // Genel özet
    console.log("\n" + "═".repeat(60));
    console.log("📝 GENEL ÖZET");
    console.log("═".repeat(60));
    console.log("\nBu simülatör, blockchain konsensüs algoritmalarının");
    console.log("temel çalışma prensiplerini göstermektedir:\n");
    console.log("• PoW (Proof of Work): Hesaplama gücüne dayalı güvenlik");
    console.log("• PoS (Proof of Stake): Ekonomik güvenceye dayalı güvenlik\n");
    console.log("Her iki sistemin de kendine özgü avantajları ve");
    console.log("dezavantajları bulunmaktadır.");
    console.log("═".repeat(60));
    
    await this.waitForEnter();
  }

  async start() {
    this.clearScreen();
    this.printBanner();
    
    let running = true;
    
    while (running) {
      this.printMenu();
      
      const choice = await this.question("\n👉 Seçiminiz (0-6): ");
      
      switch (choice.trim()) {
        case "1":
          await this.runPoWTest();
          this.clearScreen();
          this.printBanner();
          break;
        case "2":
          await this.runPoSSimulation();
          this.clearScreen();
          this.printBanner();
          break;
        case "3":
          await this.runComparison();
          this.clearScreen();
          this.printBanner();
          break;
        case "4":
          await this.runCustomPoW();
          this.clearScreen();
          this.printBanner();
          break;
        case "5":
          await this.runCustomPoS();
          this.clearScreen();
          this.printBanner();
          break;
        case "6":
          await this.runFullReport();
          this.clearScreen();
          this.printBanner();
          break;
        case "0":
          running = false;
          console.log("\n👋 Görüşmek üzere!\n");
          break;
        default:
          console.log("\n❌ Geçersiz seçim! Lütfen 0-6 arası bir sayı girin.\n");
      }
    }
    
    this.rl.close();
  }
}

// ==========================================
// Modül Exports ve CLI Başlatma
// ==========================================

module.exports = {
  PoWSimulator,
  PoSSimulator,
  ConsensusComparator,
  CLI
};

// Eğer doğrudan çalıştırılıyorsa CLI'ı başlat
if (require.main === module) {
  const cli = new CLI();
  cli.start();
}
