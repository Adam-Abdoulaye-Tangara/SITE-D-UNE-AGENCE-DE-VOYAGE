/* ============================================================
   EAGLE TRAVEL — Script global
   Gère : lien actif nav, fil d'ariane, recherche, réservation
   ============================================================ */

/* ============================================================
   1. LIEN ACTIF DANS LA NAV
   ============================================================ */
(function () {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (
            linkPage === currentPage ||
            (currentPage !== 'index_accueil.html' && linkPage === 'destination.html' &&
                ['fes.html','marrakech.html','ifrane.html','chefchaouen.html',
                 'mekhnes.html','merzouga.html','tanger.html','casablanca.html',
                 'destination.html'].includes(currentPage))
        ) {
            link.classList.add('nav-active');
        }
    });
})();


/* ============================================================
   2. FIL D'ARIANE (BREADCRUMB)
   ============================================================ */
(function () {
    const pageNames = {
        'index_accueil.html': 'Accueil',
        'destination.html':   'Destinations',
        'fes.html':           'Fès',
        'marrakech.html':     'Marrakech',
        'ifrane.html':        'Ifrane',
        'chefchaouen.html':   'Chefchaouen',
        'mekhnes.html':       'Meknès',
        'merzouga.html':      'Merzouga',
        'tanger.html':        'Tanger',
        'casablanca.html':    'Casablanca',
        'connexion.html':     'Connexion',
    };

    const destinationPages = ['fes.html','marrakech.html','ifrane.html',
        'chefchaouen.html','mekhnes.html','merzouga.html','tanger.html','casablanca.html'];

    const currentPage = window.location.pathname.split('/').pop();
    const currentName = pageNames[currentPage];

    // On n'affiche pas le fil sur l'accueil
    if (!currentName || currentPage === 'index_accueil.html') return;

    const nav = document.querySelector('nav');
    if (!nav) return;

    const bc = document.createElement('nav');
    bc.classList.add('breadcrumb');
    bc.setAttribute('aria-label', 'Fil d\'ariane');

    let html = `<a href="../accueil/index_accueil.html">Accueil</a>
                <span class="sep">›</span>`;

    if (destinationPages.includes(currentPage)) {
        html += `<a href="destination.html">Destinations</a>
                 <span class="sep">›</span>
                 <span class="current">${currentName}</span>`;
    } else {
        html += `<span class="current">${currentName}</span>`;
    }

    bc.innerHTML = html;
    nav.insertAdjacentElement('afterend', bc);
})();


/* ============================================================
   3. RECHERCHE EN TEMPS RÉEL (page accueil uniquement)
   ============================================================ */
(function () {
    const input = document.getElementById('recherche');
    const cards = document.querySelectorAll('.destination');

    if (!input || !cards.length) return;

    // Correspondances ville → page
    const destinations = {
        'marrakech':    '../pages/marrakech.html',
        'ifrane':       '../pages/ifrane.html',
        'chefchaouen':  '../pages/chefchaouen.html',
        'fes':          '../pages/fes.html',
        'fès':          '../pages/fes.html',
        'meknes':       '../pages/mekhnes.html',
        'meknès':       '../pages/mekhnes.html',
        'tanger':       '../pages/tanger.html',
        'merzouga':     '../pages/merzouga.html',
        'casablanca':   '../pages/casablanca.html',
    };

    // Filtrage en temps réel
    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();

        cards.forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

            if (name.includes(query) || desc.includes(query) || query === '') {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Redirection sur Enter ou clic bouton
    function handleSearch() {
        const query = input.value.toLowerCase().trim();

        if (destinations[query]) {
            window.location.href = destinations[query];
        }
        // Sinon on laisse le filtrage déjà fait
    }

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });

    // Bouton loupe
    const form = document.getElementById('formulaire');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            handleSearch();
        });
    }

})();


/* ============================================================
   4. POPUP RÉSERVATION
   ============================================================ */
(function () {

    // Données des forfaits
    const forfaits = {
        eco: {
            nom: 'Forfait Éco',
            solo:   { prix: 1500, duree: '3 jours' },
            groupe: { prix: 3500, duree: '1 semaine' },
            details: ['Hébergement 3 étoiles', 'Guide inclus', 'Petit-déjeuner inclus']
        },
        vip: {
            nom: 'Forfait VIP',
            solo:   { prix: 4500, duree: '1 semaine' },
            groupe: { prix: 8500, duree: '2 semaines' },
            details: ['Hébergement 5 étoiles', 'Guide privatif', 'Transport inclus', 'Tous repas inclus']
        }
    };

    // Simuler un utilisateur connecté (à connecter à ton vrai système)
    // true = connecté, false = non connecté
    const isLoggedIn = false;

    // Créer la popup dans le DOM
    const popupHTML = `
    <div class="popup-overlay" id="reservationPopup">
        <div class="popup-box">

            <div class="popup-header">
                <div>
                    <h2>Réserver votre voyage</h2>
                    <p id="popup-type-label">Visite individuelle</p>
                </div>
                <button class="popup-close" id="popupClose">✕</button>
            </div>

            <div class="popup-body">

                <div class="popup-destination">
                    Destination sélectionnée
                    <strong id="popup-destination-name">—</strong>
                </div>

                <!-- Étape 1 : Choisir le forfait -->
                <div class="popup-step active" id="step1">
                    <div class="popup-step-title">Étape 1 — Choisissez votre forfait</div>
                    <div class="forfait-cards">

                        <div class="forfait-card" data-forfait="eco">
                            <h3>Éco</h3>
                            <div class="forfait-price" id="eco-price">1 500 MAD <span>/ pers.</span></div>
                            <ul>
                                <li>Hébergement 3 étoiles</li>
                                <li>Guide inclus</li>
                                <li>Petit-déjeuner inclus</li>
                            </ul>
                        </div>

                        <div class="forfait-card" data-forfait="vip">
                            <span class="forfait-badge">⭐ Premium</span>
                            <h3>VIP</h3>
                            <div class="forfait-price" id="vip-price">4 500 MAD <span>/ pers.</span></div>
                            <ul>
                                <li>Hébergement 5 étoiles</li>
                                <li>Guide privatif</li>
                                <li>Transport inclus</li>
                                <li>Tous repas inclus</li>
                            </ul>
                        </div>

                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn-next" id="step1Next" disabled>
                            Continuer →
                        </button>
                    </div>
                </div>

                <!-- Étape 2 : Résumé et confirmation -->
                <div class="popup-step" id="step2">
                    <div class="popup-step-title">Étape 2 — Récapitulatif</div>
                    <div class="popup-summary" id="popupSummary"></div>
                    <div class="popup-actions">
                        <button class="popup-btn-back" id="step2Back">← Retour</button>
                        <button class="popup-btn-next" id="step2Confirm">
                            Confirmer la réservation
                        </button>
                    </div>
                </div>

                <!-- Étape 3 : Succès -->
                <div class="popup-step" id="step3">
                    <div class="popup-success">
                        <div class="success-icon">✅</div>
                        <h3>Réservation confirmée !</h3>
                        <p>Votre demande a bien été envoyée.<br>
                        Notre équipe vous contactera sous 24h pour finaliser votre voyage.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Variables d'état
    let typeVisite = 'solo'; // solo ou groupe
    let forfaitChoisi = null;

    // Références DOM
    const overlay    = document.getElementById('reservationPopup');
    const closeBtn   = document.getElementById('popupClose');
    const step1      = document.getElementById('step1');
    const step2      = document.getElementById('step2');
    const step3      = document.getElementById('step3');
    const step1Next  = document.getElementById('step1Next');
    const step2Back  = document.getElementById('step2Back');
    const step2Conf  = document.getElementById('step2Confirm');
    const summary    = document.getElementById('popupSummary');
    const typeLabel  = document.getElementById('popup-type-label');
    const destName   = document.getElementById('popup-destination-name');
    const forfaitCards = document.querySelectorAll('.forfait-card');

    // Lire la destination depuis le <h1> de la page
    function getDestination() {
        return document.querySelector('.destination-detail h1')?.textContent || 'Non spécifiée';
    }

    // Ouvrir la popup
    function openPopup(type) {
        typeVisite = type;
        forfaitChoisi = null;

        // Reset
        forfaitCards.forEach(c => c.classList.remove('selected'));
        step1Next.disabled = true;
        [step1, step2, step3].forEach(s => s.classList.remove('active'));
        step1.classList.add('active');

        // Mettre à jour les prix selon le type
        document.getElementById('eco-price').innerHTML =
            `${forfaits.eco[type].prix.toLocaleString()} MAD <span>/ pers. · ${forfaits.eco[type].duree}</span>`;
        document.getElementById('vip-price').innerHTML =
            `${forfaits.vip[type].prix.toLocaleString()} MAD <span>/ pers. · ${forfaits.vip[type].duree}</span>`;

        typeLabel.textContent = type === 'solo' ? 'Visite individuelle' : 'Visite en groupe';
        destName.textContent = getDestination();

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Fermer la popup
    function closePopup() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Sélectionner un forfait
    forfaitCards.forEach(card => {
        card.addEventListener('click', () => {
            forfaitCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            forfaitChoisi = card.dataset.forfait;
            step1Next.disabled = false;
        });
    });

    // Étape 1 → Étape 2
    step1Next.addEventListener('click', () => {
        const f = forfaits[forfaitChoisi][typeVisite];
        const fname = forfaits[forfaitChoisi].nom;
        const details = forfaits[forfaitChoisi].details.map(d => `• ${d}`).join('<br>');

        summary.innerHTML = `
            <strong>Destination :</strong> ${getDestination()}<br>
            <strong>Type :</strong> ${typeVisite === 'solo' ? 'Individuelle' : 'En groupe'}<br>
            <strong>Forfait :</strong> ${fname}<br>
            <strong>Durée :</strong> ${f.duree}<br>
            <strong>Inclus :</strong><br>${details}
            <span class="summary-price">${f.prix.toLocaleString()} MAD / personne</span>`;

        step1.classList.remove('active');
        step2.classList.add('active');
    });

    // Étape 2 → retour Étape 1
    step2Back.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
    });

    // Étape 2 → Confirmer
    step2Conf.addEventListener('click', () => {
        if (!isLoggedIn) {
            // Sauvegarder l'intention dans sessionStorage
            sessionStorage.setItem('reservationPending', JSON.stringify({
                destination: getDestination(),
                type: typeVisite,
                forfait: forfaitChoisi
            }));
            closePopup();
            window.location.href = '../pages/connexion.html';
            return;
        }
        step2.classList.remove('active');
        step3.classList.add('active');
    });

    // Fermer au clic sur l'overlay ou le bouton ✕
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closePopup();
    });

    // Brancher les boutons de réservation existants
    const btnSolo   = document.querySelector('.reservation .btn-primary');
    const btnGroupe = document.querySelector('.reservation .btn-secondary');

    if (btnSolo)   btnSolo.addEventListener('click',   () => openPopup('solo'));
    if (btnGroupe) btnGroupe.addEventListener('click', () => openPopup('groupe'));

})();
