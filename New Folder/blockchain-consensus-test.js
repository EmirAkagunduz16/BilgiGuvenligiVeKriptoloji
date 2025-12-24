/**
 * ========================================
 * BLOCKCHAIN KONSENSÜS ENTEGRASYONU
 * Mevcut blockchain.js ile PoW/PoS entegrasyonu
 * ========================================
 */

const { Blockchain, Transaction, Block } = require("./blockchain");
const { PoWSimulator, PoSSimulator } = require("./consensus-simulator");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// ==========================================
// Mevcut Blockchain ile PoW Testi
// ==========================================

function testBlockchainPoW() {
  console.log("\n" + "=".repeat(60));
  console.log("🔗 MEVCUT BLOCKCHAIN İLE POW TESTİ");
  console.log("=".repeat(60));
  console.log("\nMevcut blockchain.js dosyasındaki PoW mekanizmasını");
  console.log("farklı zorluk seviyeleriyle test ediyoruz.\n");

  const results = [];

  for (let difficulty = 1; difficulty <= 4; difficulty++) {
    console.log(`\n⛏️  Zorluk ${difficulty} test ediliyor...`);
    
    // Yeni blockchain oluştur
    const testChain = new Blockchain();
    testChain.difficulty = difficulty;

    // Test için key oluştur
    const testKey = ec.genKeyPair();
    const testAddress = testKey.getPublic("hex");

    // Birkaç işlem ekle
    for (let i = 0; i < 3; i++) {
      const receiverKey = ec.genKeyPair();
      const tx = new Transaction(testAddress, receiverKey.getPublic("hex"), 10);
      tx.signTransaction(testKey);
      testChain.addTransaction(tx);
    }

    // Madencilik zamanını ölç
    const startTime = Date.now();
    
    // Console.log'u geçici olarak devre dışı bırak
    const originalLog = console.log;
    console.log = () => {};
    
    testChain.minePendingTransactions(testAddress);
    
    // Console.log'u geri getir
    console.log = originalLog;
    
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;

    // Son bloğun bilgilerini al
    const minedBlock = testChain.getLatestBlock();
    
    results.push({
      difficulty,
      nonce: minedBlock.nonce,
      timeTaken,
      hash: minedBlock.hash
    });

    console.log(`   ✅ Blok başarıyla mine edildi!`);
    console.log(`   📊 Nonce: ${minedBlock.nonce.toLocaleString()}`);
    console.log(`   ⏱️  Süre: ${timeTaken.toFixed(3)} saniye`);
    console.log(`   🔗 Hash: ${minedBlock.hash.substring(0, 25)}...`);
  }

  // Sonuç tablosu
  console.log("\n" + "=".repeat(60));
  console.log("📊 BLOCKCHAIN POW TEST SONUÇLARI");
  console.log("=".repeat(60));
  
  console.log("\n┌──────────┬──────────────┬──────────────┬────────────────────────────┐");
  console.log("│ Zorluk   │ Nonce        │ Süre (sn)    │ Hash Öneki                 │");
  console.log("├──────────┼──────────────┼──────────────┼────────────────────────────┤");
  
  for (const r of results) {
    console.log(
      `│ ${r.difficulty.toString().padStart(6)}   │ ${r.nonce.toLocaleString().padStart(10)} │ ${r.timeTaken.toFixed(3).padStart(10)}   │ ${r.hash.substring(0, 26)} │`
    );
  }
  
  console.log("└──────────┴──────────────┴──────────────┴────────────────────────────┘");

  return results;
}

// ==========================================
// Blockchain için PoS Simülasyonu
// ==========================================

class BlockchainWithPoS extends Blockchain {
  constructor() {
    super();
    this.validators = [];
    this.consensusType = "PoW"; // Varsayılan
  }

  /**
   * Validatör ekler (PoS için)
   */
  addValidator(address, stake) {
    this.validators.push({
      address,
      stake,
      selectedCount: 0
    });
  }

  /**
   * Toplam stake miktarını döndürür
   */
  getTotalStake() {
    return this.validators.reduce((sum, v) => sum + v.stake, 0);
  }

  /**
   * PoS ile validatör seçer
   */
  selectValidator() {
    const totalStake = this.getTotalStake();
    let random = Math.random() * totalStake;

    for (const validator of this.validators) {
      random -= validator.stake;
      if (random <= 0) {
        validator.selectedCount++;
        return validator;
      }
    }
    return this.validators[this.validators.length - 1];
  }

  /**
   * PoS ile blok oluşturur (madencilik yok)
   */
  createBlockWithPoS(validatorAddress) {
    const startTime = Date.now();
    
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    
    // PoS'ta mining yok, direkt hash hesapla
    block.hash = block.calculateHash();
    block.validator = validatorAddress; // Kim doğruladı
    
    const endTime = Date.now();
    
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, validatorAddress, this.miningReward),
    ];
    
    return {
      block,
      timeTaken: endTime - startTime
    };
  }

  /**
   * PoS simülasyonu yapar
   */
  simulatePoS(blockCount = 100) {
    console.log("\n" + "=".repeat(60));
    console.log("🔗 BLOCKCHAIN İLE POS SİMÜLASYONU");
    console.log("=".repeat(60));

    if (this.validators.length === 0) {
      console.log("\n❌ Validatör bulunamadı! Önce addValidator() ile ekleyin.");
      return;
    }

    const totalStake = this.getTotalStake();

    console.log("\n👥 KAYITLI VALİDATÖRLER:");
    console.log("─".repeat(50));
    for (const v of this.validators) {
      const percent = ((v.stake / totalStake) * 100).toFixed(1);
      console.log(`   ${v.address.substring(0, 15)}... │ ${v.stake} coin │ %${percent}`);
    }

    console.log(`\n🎲 ${blockCount} blok simüle ediliyor...\n`);

    // Reset counts
    this.validators.forEach(v => v.selectedCount = 0);

    const startTime = Date.now();
    let totalBlockTime = 0;

    for (let i = 0; i < blockCount; i++) {
      const winner = this.selectValidator();
      
      // Blok oluştur (simülasyon - gerçek işlem yok)
      const blockStart = Date.now();
      // Basit blok oluşturma simülasyonu
      const blockEnd = Date.now();
      totalBlockTime += (blockEnd - blockStart);
    }

    const totalTime = (Date.now() - startTime) / 1000;

    // Sonuçlar
    console.log("📊 SİMÜLASYON SONUÇLARI:");
    console.log("─".repeat(50));
    
    for (const v of this.validators) {
      const expectedPercent = (v.stake / totalStake) * 100;
      const actualPercent = (v.selectedCount / blockCount) * 100;
      const diff = actualPercent - expectedPercent;
      
      console.log(`   ${v.address.substring(0, 15)}...`);
      console.log(`      Kazanılan: ${v.selectedCount} blok (${actualPercent.toFixed(1)}%)`);
      console.log(`      Beklenen: ${expectedPercent.toFixed(1)}%, Fark: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`);
    }

    console.log(`\n⏱️  Toplam süre: ${totalTime.toFixed(3)} saniye`);
    console.log(`📦 Blok/saniye: ${Math.round(blockCount / totalTime).toLocaleString()}`);
  }
}

// ==========================================
// Tam Karşılaştırma Demo
// ==========================================

function runFullDemo() {
  console.clear();
  
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        BLOCKCHAIN KONSENSÜS MEKANİZMALARI DEMOsu             ║");
  console.log("║                   PoW vs PoS Karşılaştırması                 ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  // 1. Mevcut blockchain ile PoW testi
  const powResults = testBlockchainPoW();

  // 2. PoS özellikli blockchain ile test
  console.log("\n\n" + "═".repeat(60));
  console.log("                    POS BLOCKCHAIN TESTİ");
  console.log("═".repeat(60));

  const posChain = new BlockchainWithPoS();
  
  // Validatörler ekle
  const validators = [
    { name: "Validator_A", stake: 500 },
    { name: "Validator_B", stake: 300 },
    { name: "Validator_C", stake: 150 },
    { name: "Validator_D", stake: 50 }
  ];

  for (const v of validators) {
    posChain.addValidator(v.name, v.stake);
  }

  posChain.simulatePoS(1000);

  // 3. Final Karşılaştırma
  console.log("\n\n" + "═".repeat(60));
  console.log("                 FİNAL KARŞILAŞTIRMA");
  console.log("═".repeat(60));

  const avgPoWTime = powResults.reduce((sum, r) => sum + r.timeTaken, 0) / powResults.length;

  console.log("\n┌─────────────────────┬─────────────────┬─────────────────┐");
  console.log("│ Metrik              │ PoW             │ PoS             │");
  console.log("├─────────────────────┼─────────────────┼─────────────────┤");
  console.log(`│ Ort. Blok Süresi    │ ${(avgPoWTime * 1000).toFixed(1).padStart(10)} ms │ ${" < 1".padStart(10)} ms │`);
  console.log(`│ Enerji Tüketimi     │ Yüksek          │ Minimal         │`);
  console.log(`│ Güvenlik Kaynağı    │ Hesaplama       │ Ekonomik        │`);
  console.log(`│ Donanım Gereksinimi │ GPU/ASIC        │ Yok             │`);
  console.log(`│ Merkezileşme Riski  │ Mining Pool     │ Zengin Stake    │`);
  console.log("└─────────────────────┴─────────────────┴─────────────────┘");

  console.log("\n✅ Demo tamamlandı!");
  console.log("\n💡 İPUCU: Daha detaylı testler için şunu çalıştırın:");
  console.log("   node consensus-simulator.js\n");
}

// ==========================================
// Export ve CLI
// ==========================================

module.exports = {
  testBlockchainPoW,
  BlockchainWithPoS,
  runFullDemo
};

// Direkt çalıştırıldığında
if (require.main === module) {
  runFullDemo();
}
