// ================================================
//  🤖 BOT WHATSAPP — DigiCréa
//  Boutique de produits digitaux
//  Paiement : Orange Money + Wave
// ================================================

const { default: makeWASocket,
        DisconnectReason,
        useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const pino = require('pino')

// ============================================
// 🔧 CONFIGURATION
// ============================================
const CONFIG = {
  NOM_BUSINESS:   "Digicrea1",
  TELEPHONE:      "761503130",             // ← WhatsApp Business
  ORANGE:         "774423079",             // ← Orange Money
  WAVE:           "774423079",             // ← Wave
  NOM_COMPTE:     "Digicrea1",             // ← Nom sur Mobile Money
}

// ============================================
// 🛍️ CATALOGUE COMPLET DIGICRÉA
// ============================================
const CATALOGUE = {

  // ─── EBOOKS ───────────────────────────────
  ebooks: [
    {
      id: 'E1',
      nom: '📗 Votre Pharmacie Naturelle au Quotidien',
      desc: 'Les 10 remèdes indispensables pour retrouver bien-être et vitalité sans quitter votre maison.',
      prix: 1200,
      ancien_prix: 1500,
      remise: '-20%'
    },
    {
      id: 'E2',
      nom: '💡 Produits Digitaux : Guide Complet pour Réussir',
      desc: 'Crée et vends ton produit digital — méthode complète pour débuter et réussir.',
      prix: 1000,
      ancien_prix: 1200,
      remise: '-17%'
    },
    {
      id: 'E3',
      nom: '🍎 Fruits Frais Plus Longtemps',
      desc: 'Guide pratique anti-gaspi — 50 pages d\'astuces simples pour conserver tes fruits naturellement.',
      prix: 1200,
      ancien_prix: 1500,
      remise: '-20%'
    },
  ],

  // ─── FORMATIONS ───────────────────────────
  formations: [
    {
      id: 'F1',
      nom: '🤖 Comment Dialoguer avec l\'IA',
      desc: 'Maîtrise l\'art de poser les bonnes questions pour obtenir des réponses précises. Bonus : 120 prompts prêts à utiliser.',
      prix: 2000,
      ancien_prix: 10000,
      remise: '-80%'
    },
    {
      id: 'F2',
      nom: '📱 Maîtriser WhatsApp Business de A à Z',
      desc: 'La méthode simple pour vendre chaque jour avec ton téléphone. Formation complète + stratégies prouvées.',
      prix: 2000,
      ancien_prix: 10000,
      remise: '-80%'
    },
    {
      id: 'F3',
      nom: '🎵 Monétiser ton Compte TikTok de A à Z',
      desc: 'Formation complète pour générer tes premiers revenus avec TikTok. Accessible aux débutants. Bonus : 1000 idées de vidéos virales !',
      prix: 2000,
      ancien_prix: 10000,
      remise: '-80%'
    },
  ],

  // ─── PACKS ────────────────────────────────
  packs: [
    {
      id: 'P1',
      nom: '💰 Pack 50 Formations — Gagne de l\'Argent avec ton Téléphone',
      desc: 'E-commerce, Marketing digital, Dropshipping, Création de contenu + droit de revente. BONUS : 100 livres audio + 6000 ebooks. Accès immédiat après paiement.',
      prix: 10000,
      ancien_prix: 30000,
      remise: '-67%'
    },
  ]
}

// ============================================
// 📋 MESSAGES DU BOT
// ============================================

const MENU_PRINCIPAL = `
✨ Bonjour *{prenom}* !

Bienvenue chez *Digicrea1* 🚀
Ta boutique de produits digitaux !

Je suis disponible *24h/24 - 7j/7* 💬

Que veux-tu faire ?

1️⃣ 📚 Voir les Ebooks
2️⃣ 🎓 Voir les Formations
3️⃣ 📦 Voir les Packs (Meilleur rapport qualité/prix)
4️⃣ 💰 Comment payer ?
5️⃣ ✅ Passer une commande
6️⃣ 👨‍💼 Parler à un conseiller

_Tape le chiffre correspondant_ 👇
`

// Génère automatiquement la liste des ebooks
const MSG_EBOOKS = () => {
  let txt = `📚 *Nos Ebooks DigiCréa :*\n\n`
  CATALOGUE.ebooks.forEach((p, i) => {
    txt += `━━━━━━━━━━━━━━━━━━━━━\n`
    txt += `${p.nom} ${p.remise}\n`
    txt += `📝 ${p.desc}\n`
    txt += `💰 *${p.prix} FCFA* ~~${p.ancien_prix} FCFA~~\n`
    txt += `👉 Tape *C${p.id}* pour commander\n\n`
  })
  txt += `━━━━━━━━━━━━━━━━━━━━━\n`
  txt += `Tape *0* pour revenir au menu 🔙`
  return txt
}

// Génère automatiquement la liste des formations
const MSG_FORMATIONS = () => {
  let txt = `🎓 *Nos Formations DigiCréa :*\n\n`
  CATALOGUE.formations.forEach((p, i) => {
    txt += `━━━━━━━━━━━━━━━━━━━━━\n`
    txt += `${p.nom} ${p.remise}\n`
    txt += `📝 ${p.desc}\n`
    txt += `💰 *${p.prix} FCFA* ~~${p.ancien_prix} FCFA~~\n`
    txt += `👉 Tape *C${p.id}* pour commander\n\n`
  })
  txt += `━━━━━━━━━━━━━━━━━━━━━\n`
  txt += `Tape *0* pour revenir au menu 🔙`
  return txt
}

// Génère automatiquement la liste des packs
const MSG_PACKS = () => {
  let txt = `📦 *Nos Packs DigiCréa :*\n\n`
  CATALOGUE.packs.forEach((p, i) => {
    txt += `━━━━━━━━━━━━━━━━━━━━━\n`
    txt += `${p.nom} ${p.remise}\n`
    txt += `📝 ${p.desc}\n`
    txt += `💰 *${p.prix} FCFA* ~~${p.ancien_prix} FCFA~~\n`
    txt += `👉 Tape *C${p.id}* pour commander\n\n`
  })
  txt += `━━━━━━━━━━━━━━━━━━━━━\n`
  txt += `Tape *0* pour revenir au menu 🔙`
  return txt
}

const MSG_PAIEMENT = `
💳 *Comment Payer chez DigiCréa :*

━━━━━━━━━━━━━━━━━━━━━
🟠 *Orange Money :*
   📞 ${CONFIG.ORANGE}
   Nom : ${CONFIG.NOM_COMPTE}

🔵 *Wave :*
   📞 ${CONFIG.WAVE}
   Nom : ${CONFIG.NOM_COMPTE}
━━━━━━━━━━━━━━━━━━━━━

✅ *Étapes après paiement :*
1️⃣ Fais le transfert du montant exact
2️⃣ Prends une capture du reçu 📸
3️⃣ Envoie ici :
   • 📸 Capture du reçu
   • 👤 Ton prénom + nom
   • 📧 Ton email
   • 🛍️ Le produit commandé

⚡ Accès envoyé en *moins de 30 min* !

Tape *5* pour commander maintenant ✅
Tape *0* pour le menu 🔙
`

const MSG_COMMANDE = (prenom) => `
🛒 *Passer une Commande :*

Bonjour *${prenom}* ! Super choix 🎉

*Étape 1* — Choisis ton produit :
Tape *1* pour les Ebooks
Tape *2* pour les Formations
Tape *3* pour les Packs

*Étape 2* — Effectue ton paiement :
🟠 Orange Money : ${CONFIG.ORANGE}
🔵 Wave : ${CONFIG.WAVE}
_(Au nom de : ${CONFIG.NOM_COMPTE})_

*Étape 3* — Envoie-nous :
📸 Capture du reçu de paiement
👤 Ton prénom + nom
📧 Ton adresse email
🛍️ Nom du produit choisi

⚡ *Accès immédiat sous 30 min garantis !*

Tape *0* pour le menu 🔙
`

const MSG_CONSEILLER = `
👨‍💼 *Parler à un Conseiller DigiCréa :*

Notre équipe est là pour toi ! 🙌

📞 WhatsApp : ${CONFIG.TELEPHONE}
🕗 Disponible : *Lun - Sam, 8h à 22h*

En dehors des heures d'ouverture,
laisse ton message ici et on te répond
dès que possible ✅

Tape *0* pour revenir au menu 🔙
`

// Trouve un produit par son ID de commande (CE1, CF1, CP1...)
const trouverProduit = (id) => {
  const tous = [
    ...CATALOGUE.ebooks,
    ...CATALOGUE.formations,
    ...CATALOGUE.packs
  ]
  return tous.find(p => p.id === id.toUpperCase())
}

// Message de confirmation de commande
const MSG_CONFIRMATION = (produit) => `
🎉 *Parfait ! Tu as choisi :*

${produit.nom}
💰 *${produit.prix} FCFA*

━━━━━━━━━━━━━━━━━━━━━
📲 *Effectue ton paiement maintenant :*

🟠 Orange Money :
   ${CONFIG.ORANGE} — ${CONFIG.NOM_COMPTE}

🔵 Wave :
   ${CONFIG.WAVE} — ${CONFIG.NOM_COMPTE}

━━━━━━━━━━━━━━━━━━━━━
✅ *Après paiement, envoie ici :*
📸 Capture du reçu
👤 Ton prénom + nom
📧 Ton email

⚡ Tu reçois ton accès en *moins de 30 min* !

Tape *0* pour le menu 🔙
`

// ============================================
// 🔑 MOTS DÉCLENCHEURS
// ============================================
const DECLENCHEURS = [
  'bonjour', 'bonsoir', 'salut', 'hello', 'hi',
  'allô', 'allo', 'menu', 'start', 'commencer',
  'aide', 'help', '00', 'début'
]

// ============================================
// 🚀 DÉMARRAGE DU BOT
// ============================================
async function demarrerBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_digicrea')

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\n╔══════════════════════════════════╗')
      console.log('║  📱 SCANNE CE QR CODE avec WhatsApp ║')
      console.log('║  WhatsApp → Appareils connectés     ║')
      console.log('╚══════════════════════════════════╝\n')
      qrcode.generate(qr, { small: true })
    }
    if (connection === 'close') {
      const reconnect = lastDisconnect?.error?.output?.statusCode
        !== DisconnectReason.loggedOut
      console.log('⚠️  Connexion perdue. Reconnexion :', reconnect)
      if (reconnect) demarrerBot()
    }
    if (connection === 'open') {
      console.log('\n╔══════════════════════════════════╗')
      console.log('║  ✅ BOT DIGICRÉA ACTIF 24h/24 🚀  ║')
      console.log('╚══════════════════════════════════╝\n')
    }
  })

  // 📨 Traitement des messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const expediteur = msg.key.remoteJid
    const texte = (
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text || ''
    ).trim().toLowerCase()

    const prenom = msg.pushName || 'ami(e)'
    console.log(`📩 [${new Date().toLocaleTimeString()}] ${prenom}: ${texte}`)

    try {
      let reponse = ''

      // ── Déclencheur → Menu principal
      if (DECLENCHEURS.some(d => texte.includes(d)) || texte === '0') {
        reponse = MENU_PRINCIPAL.replace('{prenom}', prenom)
      }

      // ── Option 1 → Ebooks
      else if (texte === '1') {
        reponse = MSG_EBOOKS()
      }

      // ── Option 2 → Formations
      else if (texte === '2') {
        reponse = MSG_FORMATIONS()
      }

      // ── Option 3 → Packs
      else if (texte === '3') {
        reponse = MSG_PACKS()
      }

      // ── Option 4 → Paiement
      else if (texte === '4') {
        reponse = MSG_PAIEMENT
      }

      // ── Option 5 → Commander
      else if (texte === '5') {
        reponse = MSG_COMMANDE(prenom)
      }

      // ── Option 6 → Conseiller
      else if (texte === '6') {
        reponse = MSG_CONSEILLER
      }

      // ── Commande directe : CE1, CF1, CP1, CE2...
      else if (texte.startsWith('c') && texte.length >= 2) {
        const idProduit = texte.slice(1).toUpperCase() // ex: "E1", "F2", "P1"
        const produit = trouverProduit(idProduit)
        if (produit) {
          reponse = MSG_CONFIRMATION(produit)
        } else {
          reponse = `Produit non trouvé 😅\nTape *1*, *2* ou *3* pour voir le catalogue.\nTape *0* pour le menu 🔙`
        }
      }

      // ── Message non reconnu
      else {
        reponse = `Je n'ai pas compris 😅\n\nTape *0* pour revoir le menu principal 👇`
      }

      await sock.sendMessage(expediteur, { text: reponse })

    } catch (err) {
      console.error('❌ Erreur :', err.message)
    }
  })
}

demarrerBot()
