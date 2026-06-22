import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, increment, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function scrollToPageTop() {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
}

scrollToPageTop();
window.addEventListener('pageshow', scrollToPageTop);

const firebaseConfig = {
    apiKey: "AIzaSyDeGBjAiqj4V9rJh5S81PUbhyZkuJsvdAA",
    authDomain: "my-portfolio-ezekiel.firebaseapp.com",
    projectId: "my-portfolio-ezekiel",
    storageBucket: "my-portfolio-ezekiel.firebasestorage.app",
    messagingSenderId: "74900076736",
    appId: "1:74900076736:web:3be43fc620101b62015525",
    measurementId: "G-5W8K7E68NK"
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value && !String(value).startsWith('PASTE_YOUR_'));
const firebaseApp = hasFirebaseConfig ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
const firestoreDb = firebaseApp ? getFirestore(firebaseApp) : null;

const scrollStage = document.querySelector('.scroll-stage');
        const hero = document.querySelector('.hero');
        const heroCarouselDots = document.querySelector('.hero-carousel-dots');
        const heroPhotoStack = document.querySelector('.hero-photo-stack');
        const taglineText = document.querySelector('.tagline-text');
        const skillsIntroText = document.querySelector('.skills-intro p');
        const worksFoldSection = document.querySelector('.works-fold-section');
        const collaborateSection = document.querySelector('.collaborate-section');
        const collaborateMarqueeSection = document.querySelector('.collaborate-marquee-section');
        const collaborateMarqueeTitle = document.querySelector('.collaborate-marquee-title');
        const menuToggle = document.querySelector('.menu-toggle');
        const menuOverlay = document.querySelector('.menu-overlay');
        const menuLinks = document.querySelectorAll('.menu-link');
        const desktopNav = document.querySelector('.desktop-nav');
        const desktopNavLinks = desktopNav ? Array.from(desktopNav.querySelectorAll('.desktop-nav__link[href^="#"]')) : [];
        const projectsGrid = document.querySelector('.projects-grid');
        const projectsPrevButton = document.querySelector('.projects-carousel__arrow--left');
        const projectsNextButton = document.querySelector('.projects-carousel__arrow--right');
        const projectCardLinks = document.querySelectorAll('.project-card-link');
        const projectsShowcase = document.querySelector('.projects-showcase');
        const projectsIntro = document.querySelector('.projects-showcase__intro');
        const projectsToggle = document.querySelector('.projects-toggle');
        const skillCards = document.querySelectorAll('.skill-card');
        const skillsGroups = document.querySelector('.skills-groups');
        const skillTooltip = document.querySelector('#skill-tooltip');
        const skillTooltipTitle = skillTooltip?.querySelector('.skill-tooltip__title');
        const skillTooltipDescription = skillTooltip?.querySelector('.skill-tooltip__description');
        const skillTooltipClose = skillTooltip?.querySelector('.skill-tooltip__close');
        const bgMusic = document.querySelector('#bg-music');
        const bgMusicSource = bgMusic?.querySelector('source');
        const musicToggle = document.querySelector('.music-toggle');
        const musicToggleCover = musicToggle?.querySelector('.music-toggle__cover img');
        const musicToggleLabel = musicToggle?.querySelector('.music-toggle__label');
        const musicToggleEyebrow = musicToggle?.querySelector('.music-toggle__eyebrow');
        const musicToggleMeta = musicToggle?.querySelector('.music-toggle__meta');
        const menuMusicToggles = document.querySelectorAll('.menu-music-toggle');
        const musicModal = document.querySelector('.music-modal');
        const musicModalClose = document.querySelector('.music-modal__close');
        const menuSongButtons = document.querySelectorAll('.menu-song');
        const visitorCount = document.querySelector('#visitor-count');
        const introLoader = document.querySelector('.intro-loader');
        const backToTopButton = document.querySelector('.back-to-top');
        const navClickSound = new Audio('assets/other/click-sound-for-gd.mp3');
        let activeSkillCard = null;
        let currentTrack = {
            title: 'Back to December',
            artist: 'Taylor Swift',
            src: 'assets/music/Backtodecember(Nene).mp3',
            cover: 'assets/music-profile/Taylor_Swift-Back_to_December.png',
            id: 'back-to-december'
        };
        const taglinePhrases = [
            'Build smart. Scale fast. Deliver value.',
            'Turning ideas into scalable digital solutions.',
            'Code with purpose, build with impact.',
            'Simple solutions for complex digital problems.',
            'Creating systems that make life easier.',
            'From idea to system, efficiently built.',
            'Designing clean, scalable, and reliable systems.'
        ];
        const heroBackgroundPhotos = [
            'assets/bg-pic/579549187_1105946728124786_6311742506946919213_n.jpg',
            'assets/bg-pic/724281844_970639135795156_5735761625985478262_n.jpg',
            'assets/bg-pic/727542319_4329437703982246_6227268017165817076_n.jpg',
            'assets/bg-pic/727542319_4517738071886619_838941891574633351_n.jpg',
            'assets/bg-pic/727613262_1020435270943514_7802878478507018108_n.jpg',
            'assets/bg-pic/727050495_957458370674489_489731668981895557_n.jpg',
            'assets/bg-pic/725172618_847331821487807_3216166992163305311_n.jpg',
            'assets/bg-pic/590228946_693775343522908_4938229024197139984_n.jpg',
            'assets/bg-pic/728543661_1006366451995678_1933816842049622408_n.jpg'
        ];
        let heroBackgroundIndex = 0;
        let heroBackgroundTimer = null;
        let skillsScrambleFrame = null;

        navClickSound.preload = 'auto';
        navClickSound.volume = 0.45;

        function showHeroBackground(index) {
            if (!hero || !heroBackgroundPhotos.length) return;

            const selectedIndex = ((index % heroBackgroundPhotos.length) + heroBackgroundPhotos.length) % heroBackgroundPhotos.length;
            const photo = heroBackgroundPhotos[selectedIndex];
            hero.style.setProperty('--hero-background-image', `url("${photo}")`);
            hero.style.setProperty('--hero-background-position', 'center');
            heroBackgroundIndex = (selectedIndex + 1) % heroBackgroundPhotos.length;

            heroCarouselDots?.querySelectorAll('.hero-carousel-dot').forEach((dot, dotIndex) => {
                const isActive = dotIndex === selectedIndex;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });

            heroPhotoStack?.querySelectorAll('.hero-photo-card').forEach((card, cardIndex) => {
                const offset = (cardIndex - selectedIndex + heroBackgroundPhotos.length) % heroBackgroundPhotos.length;
                card.classList.toggle('is-active', offset === 0);
                card.classList.toggle('is-next', offset === 1);
                card.classList.toggle('is-previous', offset === heroBackgroundPhotos.length - 1);
                card.setAttribute('aria-hidden', offset > 1 && offset < heroBackgroundPhotos.length - 1 ? 'true' : 'false');
            });
        }

        function startHeroBackgroundTimer() {
            window.clearInterval(heroBackgroundTimer);
            heroBackgroundTimer = window.setInterval(() => showHeroBackground(heroBackgroundIndex), 5000);
        }

        if (heroCarouselDots) {
            heroBackgroundPhotos.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'hero-carousel-dot';
                dot.setAttribute('aria-label', `Show background image ${index + 1}`);
                dot.addEventListener('click', () => {
                    showHeroBackground(index);
                    startHeroBackgroundTimer();
                });
                heroCarouselDots.appendChild(dot);
            });
        }

        if (heroPhotoStack) {
            heroBackgroundPhotos.forEach((photo, index) => {
                const card = document.createElement('button');
                const image = document.createElement('img');
                card.type = 'button';
                card.className = 'hero-photo-card';
                card.setAttribute('aria-label', `Show background image ${index + 1}`);
                image.alt = '';
                image.addEventListener('load', () => {
                    card.classList.toggle('is-portrait', image.naturalHeight > image.naturalWidth);
                });
                card.style.setProperty('--hero-photo-image', `url("${photo}")`);
                image.src = photo;
                card.appendChild(image);
                card.addEventListener('click', () => {
                    showHeroBackground(index);
                    startHeroBackgroundTimer();
                });
                heroPhotoStack.appendChild(card);
            });
        }

        showHeroBackground(0);
        startHeroBackgroundTimer();

        function prepareSkillsTextScramble() {
            if (!skillsIntroText) return [];

            const originalText = skillsIntroText.textContent.replace(/\s+/g, ' ').trim();
            skillsIntroText.setAttribute('aria-label', originalText);

            const textNodes = [];
            const walker = document.createTreeWalker(skillsIntroText, NodeFilter.SHOW_TEXT);
            let node;

            while ((node = walker.nextNode())) {
                if (node.nodeValue.trim()) textNodes.push(node);
            }

            const characters = [];
            textNodes.forEach((textNode) => {
                const fragment = document.createDocumentFragment();
                let word = null;

                function appendWord() {
                    if (!word) return;
                    fragment.appendChild(word);
                    word = null;
                }

                [...textNode.nodeValue].forEach((character) => {
                    if (/\s/.test(character)) {
                        appendWord();
                        fragment.appendChild(document.createTextNode(character));
                        return;
                    }

                    if (!word) {
                        word = document.createElement('span');
                        word.className = 'skills-scramble-word';
                    }

                    const characterSpan = document.createElement('span');
                    characterSpan.className = 'skills-scramble-char';
                    characterSpan.dataset.character = character;
                    characterSpan.setAttribute('aria-hidden', 'true');
                    characterSpan.textContent = character;
                    word.appendChild(characterSpan);
                    characters.push(characterSpan);
                });

                appendWord();
                textNode.replaceWith(fragment);
            });

            return characters;
        }

        function animateSkillsTextScramble(characters) {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const initialJumbleDuration = 420;
            const characterDelay = 28;
            const duration = initialJumbleDuration + characters.length * characterDelay;
            const startTime = performance.now();

            if (skillsScrambleFrame) window.cancelAnimationFrame(skillsScrambleFrame);
            skillsIntroText?.classList.add('is-scrambling');

            function frame(now) {
                const elapsed = now - startTime;
                const settledCharacters = Math.max(0, Math.floor((elapsed - initialJumbleDuration) / characterDelay));

                characters.forEach((character, index) => {
                    const finalCharacter = character.dataset.character;
                    const isSettled = index < settledCharacters;
                    character.classList.toggle('is-settled', isSettled);
                    character.textContent = isSettled
                        ? finalCharacter
                        : letters[Math.floor(Math.random() * letters.length)];
                });

                if (elapsed < duration) {
                    skillsScrambleFrame = window.requestAnimationFrame(frame);
                } else {
                    characters.forEach((character) => {
                        character.textContent = character.dataset.character;
                        character.classList.add('is-settled');
                    });
                    skillsIntroText?.classList.remove('is-scrambling');
                    skillsScrambleFrame = null;
                }
            }

            skillsScrambleFrame = window.requestAnimationFrame(frame);
        }

        // A standalone fallback in index.html owns this animation when the main
        // module cannot load (for example, if its remote Firebase imports fail).
        const skillsScrambleCharacters = skillsIntroText?.dataset.scrambleInitialized
            ? []
            : prepareSkillsTextScramble();
        if (skillsIntroText && skillsScrambleCharacters.length) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                skillsScrambleCharacters.forEach((character) => character.classList.add('is-settled'));
            } else {
                const skillsScrambleObserver = new IntersectionObserver((entries, observer) => {
                    if (!entries.some((entry) => entry.isIntersecting)) return;

                    animateSkillsTextScramble(skillsScrambleCharacters);
                    observer.disconnect();
                }, {
                    // The animation begins as soon as the paragraph reaches the lower
                    // portion of the viewport, exactly where it first becomes readable.
                    threshold: 0.15,
                    rootMargin: '0px 0px -10% 0px'
                });

                skillsScrambleObserver.observe(skillsIntroText);
            }
        }

        function playNavClickSound() {
            navClickSound.currentTime = 0;
            navClickSound.play().catch(() => {});
        }

        document.addEventListener('click', (event) => {
            const clickableElement = event.target.closest('a, button, [role="button"], input[type="button"], input[type="submit"]');

            if (!clickableElement || clickableElement.disabled || clickableElement.getAttribute('aria-disabled') === 'true') {
                return;
            }

            playNavClickSound();
        });

        function hideIntroLoader() {
            if (!introLoader || introLoader.classList.contains('is-hidden')) {
                updateDesktopNavIndicator();
                desktopNav?.classList.add('is-ready');
                return;
            }

            window.setTimeout(() => {
                introLoader.classList.add('is-hidden');
                document.body.classList.remove('is-loading');

                window.setTimeout(() => {
                    updateDesktopNavIndicator();
                    desktopNav?.classList.add('is-ready');
                }, 250);
            }, 1150);
        }

        function updateDesktopNavIndicator(activeLink = desktopNav?.querySelector('.desktop-nav__link.is-active')) {
            if (!desktopNav || !activeLink) return;

            const navRect = desktopNav.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            const x = linkRect.left - navRect.left;

            desktopNav.style.setProperty('--nav-indicator-x', `${x.toFixed(2)}px`);
            desktopNav.style.setProperty('--nav-indicator-width', `${linkRect.width.toFixed(2)}px`);
        }

        function setDesktopNavActive(targetId) {
            if (!desktopNavLinks.length || !targetId) return;

            const activeLink = desktopNavLinks.find((link) => link.getAttribute('href') === targetId);
            if (!activeLink) return;

            desktopNavLinks.forEach((link) => {
                link.classList.toggle('is-active', link === activeLink);
            });
            updateDesktopNavIndicator(activeLink);
        }

        function updateDesktopNavFromScroll() {
            if (!desktopNavLinks.length) return;

            const scrollTarget = window.scrollY + window.innerHeight * 0.38;
            let currentId = desktopNavLinks[0].getAttribute('href');

            desktopNavLinks.forEach((link) => {
                const section = document.querySelector(link.getAttribute('href'));
                if (section && section.offsetTop <= scrollTarget) {
                    currentId = link.getAttribute('href');
                }
            });

            setDesktopNavActive(currentId);
        }

        async function updateVisitorCount() {
            if (!visitorCount) return;

            try {
                if (!firestoreDb) {
                    throw new Error('Firebase is not configured');
                }

                const counterRef = doc(firestoreDb, 'siteStats', 'visitorCounter');
                await setDoc(
                    counterRef,
                    {
                        count: increment(1),
                        updatedAt: serverTimestamp()
                    },
                    { merge: true }
                );

                const counterSnapshot = await getDoc(counterRef);
                const countValue = counterSnapshot.exists() ? counterSnapshot.data().count : 1;
                visitorCount.textContent = String(countValue || 1).padStart(3, '0');
            } catch (error) {
                console.error('Firebase visitor count failed.', error);
                visitorCount.textContent = '001';
            }
        }

        function updateScrollStage() {
            if (!scrollStage) return;

            const rect = scrollStage.getBoundingClientRect();
            const total = Math.max(scrollStage.offsetHeight - window.innerHeight, 1);
            const progress = Math.min(Math.max(-rect.top / total, 0), 1);

            scrollStage.style.setProperty('--scroll-progress', progress.toFixed(3));
        }

        updateScrollStage();
        window.addEventListener('scroll', updateScrollStage, { passive: true });
        window.addEventListener('resize', updateScrollStage);

        function updateWorksFold() {
            if (!worksFoldSection) return;

            const rect = worksFoldSection.getBoundingClientRect();
            const total = Math.max(worksFoldSection.offsetHeight - window.innerHeight, 1);
            const progress = Math.min(Math.max(-rect.top / total, 0), 1);

            worksFoldSection.style.setProperty('--works-progress', progress.toFixed(3));
        }

        updateWorksFold();
        window.addEventListener('scroll', updateWorksFold, { passive: true });
        window.addEventListener('resize', updateWorksFold);

        function updateCollaborateSection() {
            if (!collaborateSection) return;

            const rect = collaborateSection.getBoundingClientRect();
            const total = Math.max(collaborateSection.offsetHeight - window.innerHeight, 1);
            const progress = Math.min(Math.max(-rect.top / total, 0), 1);

            collaborateSection.style.setProperty('--collaborate-progress', progress.toFixed(3));
        }

        updateCollaborateSection();
        window.addEventListener('scroll', updateCollaborateSection, { passive: true });
        window.addEventListener('resize', updateCollaborateSection);

        let collaborateMarqueeTarget = 0;
        let collaborateMarqueeCurrent = 0;
        let collaborateMarqueeFrame = null;

        function animateCollaborateMarqueeSection() {
            if (!collaborateMarqueeSection) {
                collaborateMarqueeFrame = null;
                return;
            }

            collaborateMarqueeCurrent += (collaborateMarqueeTarget - collaborateMarqueeCurrent) * 0.08;

            if (Math.abs(collaborateMarqueeTarget - collaborateMarqueeCurrent) < 0.001) {
                collaborateMarqueeCurrent = collaborateMarqueeTarget;
            }

            collaborateMarqueeSection.style.setProperty('--collaborate-marquee-progress', collaborateMarqueeCurrent.toFixed(3));

            if (collaborateMarqueeCurrent !== collaborateMarqueeTarget) {
                collaborateMarqueeFrame = window.requestAnimationFrame(animateCollaborateMarqueeSection);
            } else {
                collaborateMarqueeFrame = null;
            }
        }

        function updateCollaborateMarqueeSection() {
            if (!collaborateMarqueeSection) return;

            const rect = collaborateMarqueeSection.getBoundingClientRect();
            const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);

            collaborateMarqueeTarget = progress;

            if (collaborateMarqueeTitle) {
                const titleRect = collaborateMarqueeTitle.getBoundingClientRect();
                const titleProgress = Math.min(Math.max((window.innerHeight - titleRect.top) / (window.innerHeight + titleRect.height), 0), 1);
                collaborateMarqueeSection.style.setProperty('--collaborate-title-progress', titleProgress.toFixed(3));
            }

            if (!collaborateMarqueeFrame) {
                collaborateMarqueeFrame = window.requestAnimationFrame(animateCollaborateMarqueeSection);
            }
        }

        updateCollaborateMarqueeSection();
        window.addEventListener('scroll', updateCollaborateMarqueeSection, { passive: true });
        window.addEventListener('resize', updateCollaborateMarqueeSection);
        updateVisitorCount();

        function updateBackToTopButton() {
            if (!backToTopButton) return;

            backToTopButton.classList.toggle('is-visible', window.scrollY > 420);
        }

        updateBackToTopButton();
        window.addEventListener('scroll', updateBackToTopButton, { passive: true });

        backToTopButton?.addEventListener('click', () => {
            const startY = window.scrollY;
            const duration = 1200;
            const startTime = performance.now();

            function scrollStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);

                window.scrollTo(0, startY * (1 - easedProgress));

                if (progress < 1) {
                    window.requestAnimationFrame(scrollStep);
                }
            }

            window.requestAnimationFrame(scrollStep);
        });

        desktopNavLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                const targetElement = targetId ? document.querySelector(targetId) : null;

                if (!targetElement) return;

                event.preventDefault();
                setDesktopNavActive(targetId);
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        updateDesktopNavFromScroll();
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateDesktopNavFromScroll);
        }, { passive: true });
        window.addEventListener('resize', () => {
            updateDesktopNavIndicator();
        });

        function setMenuState(isOpen) {
            if (!menuToggle || !menuOverlay) return;

            menuToggle.classList.toggle('is-open', isOpen);
            menuOverlay.classList.toggle('is-open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuOverlay.setAttribute('aria-hidden', String(!isOpen));
            document.body.classList.toggle('menu-open', isOpen);

            if (!isOpen) {
                setMenuMusicState(false);
            }
        }

        function setMenuMusicState(isOpen) {
            if (!musicModal) return;

            menuMusicToggles.forEach((toggle) => {
                toggle.setAttribute('aria-expanded', String(isOpen));
            });
            musicModal.classList.toggle('is-open', isOpen);
            musicModal.setAttribute('aria-hidden', String(!isOpen));
        }

        if (menuToggle && menuOverlay) {
            menuToggle.addEventListener('click', () => {
                const isOpen = !menuToggle.classList.contains('is-open');
                setMenuState(isOpen);
            });

            menuLinks.forEach((link) => {
                link.addEventListener('click', (event) => {
                    const targetId = link.getAttribute('href');

                    if (!targetId || !targetId.startsWith('#')) {
                        setMenuState(false);
                        return;
                    }

                    event.preventDefault();
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }

                    window.requestAnimationFrame(() => {
                        setMenuState(false);
                    });
                });
            });

            menuOverlay.addEventListener('click', (event) => {
                if (event.target === menuOverlay || event.target.classList.contains('menu-overlay__backdrop')) {
                    setMenuState(false);
                }
            });

            window.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setMenuMusicState(false);
                    setMenuState(false);
                }
            });
        }

        menuMusicToggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                setMenuMusicState(true);
            });
        });

        musicModalClose?.addEventListener('click', () => {
            setMenuMusicState(false);
        });

        musicModal?.addEventListener('click', (event) => {
            if (event.target === musicModal || event.target.classList.contains('music-modal__backdrop')) {
                setMenuMusicState(false);
            }
        });

        projectCardLinks.forEach((link) => {
            const card = link.querySelector('.project-card');

            link.addEventListener('pointermove', (event) => {
                if (!card) return;

                const rect = link.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 8;
                const rotateX = ((centerY - y) / centerY) * 8;

                card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
                card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
                card.style.setProperty('--card-glow-x', `${((x / rect.width) * 100).toFixed(2)}%`);
                card.style.setProperty('--card-glow-y', `${((y / rect.height) * 100).toFixed(2)}%`);
            });

            link.addEventListener('pointerleave', () => {
                if (!card) return;

                card.style.setProperty('--card-rotate-x', '0deg');
                card.style.setProperty('--card-rotate-y', '0deg');
                card.style.setProperty('--card-glow-x', '50%');
                card.style.setProperty('--card-glow-y', '50%');
            });

        });

        function initProjectReveal() {
            const revealTargets = [
                ...(projectsIntro ? [projectsIntro] : []),
                ...projectCardLinks
            ];

            if (!revealTargets.length) return;

            revealTargets.forEach((element) => {
                element.classList.add('reveal-from-bottom');
            });

            function setRevealProgress(element) {
                const rect = element.getBoundingClientRect();
                const start = window.innerHeight * 0.92;
                const end = window.innerHeight * 0.42;
                const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
                const offset = (1 - progress) * 120;

                element.style.opacity = progress.toFixed(3);
                element.style.transform = `translateY(${offset.toFixed(1)}px)`;
                element.classList.toggle('is-visible', progress >= 1);
            }

            function updateProjectReveal() {
                revealTargets.forEach((element) => {
                    setRevealProgress(element);
                });
            }

            let revealFrame = null;

            function requestProjectRevealUpdate() {
                if (revealFrame) return;

                revealFrame = window.requestAnimationFrame(() => {
                    revealFrame = null;
                    updateProjectReveal();
                });
            }

            updateProjectReveal();
            window.addEventListener('scroll', requestProjectRevealUpdate, { passive: true });
            window.addEventListener('resize', requestProjectRevealUpdate);
        }

        initProjectReveal();

        function updateProjectCarouselArrows() {
            if (!projectsGrid || !projectsPrevButton || !projectsNextButton) return;

            const maxScrollLeft = Math.max(projectsGrid.scrollWidth - projectsGrid.clientWidth, 0);
            const scrollLeft = projectsGrid.scrollLeft;
            const atStart = scrollLeft <= 8;
            const atEnd = scrollLeft >= maxScrollLeft - 8;
            const hasOverflow = maxScrollLeft > 8;

            projectsPrevButton.classList.toggle('is-hidden', !hasOverflow || atStart);
            projectsNextButton.classList.toggle('is-hidden', !hasOverflow || atEnd);
        }

        function scrollProjects(direction) {
            if (!projectsGrid) return;

            const firstCard = projectsGrid.querySelector('.project-card-link');
            const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : projectsGrid.clientWidth * 0.85;
            const gapValue = window.getComputedStyle(projectsGrid).columnGap || window.getComputedStyle(projectsGrid).gap || '0';
            const gap = Number.parseFloat(gapValue) || 0;

            projectsGrid.scrollBy({
                left: direction * (cardWidth + gap),
                behavior: 'smooth'
            });
        }

        projectsPrevButton?.addEventListener('click', () => {
            scrollProjects(-1);
        });

        projectsNextButton?.addEventListener('click', () => {
            scrollProjects(1);
        });

        projectsGrid?.addEventListener('scroll', updateProjectCarouselArrows, { passive: true });
        window.addEventListener('resize', updateProjectCarouselArrows);
        updateProjectCarouselArrows();

        projectsToggle?.addEventListener('click', () => {
            const isExpanded = projectsShowcase?.classList.toggle('is-expanded');
            projectsToggle.setAttribute('aria-expanded', String(Boolean(isExpanded)));
            projectsToggle.querySelector('span').textContent = isExpanded ? 'Show Less' : 'View All Projects';

            if (!isExpanded) {
                projectsShowcase?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        function syncMenuSongState() {
            menuSongButtons.forEach((button) => {
                const isActive = button.dataset.track === currentTrack.id;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });
        }

        function updateMusicDisplay() {
            if (musicToggleCover) {
                musicToggleCover.src = currentTrack.cover;
                musicToggleCover.alt = `${currentTrack.title} cover`;
            }

            if (musicToggleLabel) {
                musicToggleLabel.textContent = currentTrack.title;
            }

            if (musicToggleMeta) {
                musicToggleMeta.textContent = currentTrack.artist;
            }

            syncMenuSongState();
        }

        function loadCurrentTrack() {
            if (!bgMusic || !bgMusicSource || !currentTrack.src) return;

            bgMusicSource.src = currentTrack.src;
            bgMusic.load();
            updateMusicDisplay();
        }

        async function activateAudioWithSound() {
            if (!bgMusic) return;

            bgMusic.muted = false;

            try {
                if (!bgMusicSource?.getAttribute('src')) {
                    loadCurrentTrack();
                }

                if (bgMusic.paused) {
                    await bgMusic.play();
                }
                setMusicButtonState(true);
            } catch (error) {
                setMusicButtonState(false);
            }
        }

        async function changeTrack(button, shouldAutoplay = false) {
            if (!bgMusic || !bgMusicSource || !button) return;

            currentTrack = {
                id: button.dataset.track || '',
                title: button.dataset.title || 'Unknown Track',
                artist: button.dataset.artist || 'Unknown Artist',
                src: button.dataset.src || '',
                cover: button.dataset.cover || ''
            };

            bgMusic.pause();
            bgMusicSource.src = currentTrack.src;
            bgMusic.load();
            updateMusicDisplay();

            if (!currentTrack.src) {
                setMusicButtonState(false, true);
                return;
            }

            if (shouldAutoplay) {
                try {
                    bgMusic.muted = false;
                    await bgMusic.play();
                    setMusicButtonState(true);
                } catch (error) {
                    setMusicButtonState(false);
                }
            } else {
                setMusicButtonState(false);
            }
        }

        function setMusicButtonState(isPlaying, isUnavailable = false) {
            if (!musicToggle) return;

            if (isUnavailable) {
                musicToggle.classList.remove('is-playing');
                musicToggle.classList.add('is-unavailable');
                musicToggle.disabled = true;
                musicToggle.setAttribute('aria-pressed', 'false');
                musicToggle.setAttribute('aria-label', 'Background music unavailable');
                if (musicToggleEyebrow) musicToggleEyebrow.textContent = 'Audio';
                if (musicToggleLabel) musicToggleLabel.textContent = 'Music N/A';
                if (musicToggleMeta) musicToggleMeta.textContent = 'Add a valid track';
                return;
            }

            musicToggle.disabled = false;
            musicToggle.classList.remove('is-unavailable');
            musicToggle.classList.toggle('is-playing', isPlaying);
            musicToggle.setAttribute('aria-pressed', String(isPlaying));
            musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
            if (musicToggleEyebrow) musicToggleEyebrow.textContent = isPlaying ? 'Now Playing' : 'Background Audio';
        }

        if (bgMusic && musicToggle) {
            bgMusic.volume = 0.35;
            updateMusicDisplay();
            syncMenuSongState();

            musicToggle.addEventListener('click', async () => {
                if (!bgMusicSource?.getAttribute('src')) {
                    setMusicButtonState(false, true);
                    return;
                }

                try {
                    if (bgMusic.paused) {
                        if (!bgMusicSource?.getAttribute('src')) {
                            loadCurrentTrack();
                        }

                        bgMusic.muted = false;
                        await bgMusic.play();
                        setMusicButtonState(true);
                    } else {
                        bgMusic.pause();
                        setMusicButtonState(false);
                    }
                } catch (error) {
                    setMusicButtonState(false, true);
                }
            });

            bgMusic.addEventListener('ended', () => {
                setMusicButtonState(false);
            });

            bgMusic.addEventListener('error', () => {
                setMusicButtonState(false, true);
            });

            loadCurrentTrack();
            setMusicButtonState(false);
        }

        menuSongButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                await changeTrack(button, true);
                setMenuMusicState(false);
            });
        });

        function closeSkillTooltip() {
            if (!skillTooltip) return;

            skillTooltip.hidden = true;
            skillTooltip.classList.remove('is-visible');
            skillTooltip.style.removeProperty('top');
            skillTooltip.style.removeProperty('left');
            document.body.classList.remove('skill-tooltip-open');

            if (activeSkillCard) {
                activeSkillCard.classList.remove('is-active');
                activeSkillCard.setAttribute('aria-expanded', 'false');
            }

            activeSkillCard = null;
        }

        function positionSkillTooltip(card) {
            if (!skillTooltip || !skillsGroups || !card) return;

            if (window.innerWidth <= 640) {
                skillTooltip.style.removeProperty('top');
                skillTooltip.style.removeProperty('left');
                document.body.classList.add('skill-tooltip-open');
                return;
            }

            document.body.classList.remove('skill-tooltip-open');

            const containerRect = skillsGroups.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const tooltipWidth = skillTooltip.offsetWidth;
            const top = cardRect.bottom - containerRect.top + 14;
            const centeredLeft = (cardRect.left - containerRect.left) + (cardRect.width / 2) - (tooltipWidth / 2);
            const maxLeft = Math.max(containerRect.width - tooltipWidth, 0);
            const left = Math.min(Math.max(centeredLeft, 0), maxLeft);

            skillTooltip.style.top = `${top}px`;
            skillTooltip.style.left = `${left}px`;
        }

        function openSkillTooltip(card) {
            if (!skillTooltip || !skillTooltipTitle || !skillTooltipDescription) return;

            const { skillName, skillDescription } = card.dataset;

            if (activeSkillCard === card && skillTooltip.classList.contains('is-visible')) {
                closeSkillTooltip();
                return;
            }

            if (activeSkillCard) {
                activeSkillCard.classList.remove('is-active');
                activeSkillCard.setAttribute('aria-expanded', 'false');
            }

            activeSkillCard = card;
            activeSkillCard.classList.add('is-active');
            activeSkillCard.setAttribute('aria-expanded', 'true');

            skillTooltipTitle.textContent = skillName || 'Skill';
            skillTooltipDescription.textContent = skillDescription || '';
            skillTooltip.hidden = false;
            positionSkillTooltip(card);

            window.requestAnimationFrame(() => {
                skillTooltip.classList.add('is-visible');
                const tooltipRect = skillTooltip.getBoundingClientRect();
                const isOutOfView = tooltipRect.bottom > window.innerHeight || tooltipRect.top < 0;

                if (isOutOfView) {
                    skillTooltip.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        skillCards.forEach((card) => {
            card.setAttribute('aria-controls', 'skill-tooltip');
            card.setAttribute('aria-expanded', 'false');

            card.addEventListener('click', () => {
                openSkillTooltip(card);
            });
        });

        skillTooltipClose?.addEventListener('click', () => {
            closeSkillTooltip();
        });

        document.addEventListener('click', (event) => {
            if (!skillTooltip || skillTooltip.hidden) return;

            const clickedSkillCard = event.target.closest('.skill-card');

            if (clickedSkillCard || skillTooltip.contains(event.target)) {
                return;
            }

            closeSkillTooltip();
        });

        if (taglineText) {
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function typeTagline() {
                const currentPhrase = taglinePhrases[phraseIndex];

                if (isDeleting) {
                    charIndex -= 1;
                } else {
                    charIndex += 1;
                }

                taglineText.textContent = currentPhrase.slice(0, charIndex);

                let delay = isDeleting ? 35 : 65;

                if (!isDeleting && charIndex === currentPhrase.length) {
                    delay = 3600;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % taglinePhrases.length;
                    delay = 450;
                }

                window.setTimeout(typeTagline, delay);
            }

            typeTagline();
        }

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && skillTooltip && !skillTooltip.hidden) {
                closeSkillTooltip();
            }
        });

        window.addEventListener('resize', () => {
            if (activeSkillCard && skillTooltip && !skillTooltip.hidden) {
                positionSkillTooltip(activeSkillCard);
            }
        });

        if (document.readyState === 'complete') {
            hideIntroLoader();
        } else {
            window.addEventListener('load', hideIntroLoader, { once: true });
        }
