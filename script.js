const scrollStage = document.querySelector('.scroll-stage');
        const taglineText = document.querySelector('.tagline-text');
        const worksFoldSection = document.querySelector('.works-fold-section');
        const collaborateSection = document.querySelector('.collaborate-section');
        const collaborateMarqueeSection = document.querySelector('.collaborate-marquee-section');
        const menuToggle = document.querySelector('.menu-toggle');
        const menuOverlay = document.querySelector('.menu-overlay');
        const menuLinks = document.querySelectorAll('.menu-link');
        const projectCardLinks = document.querySelectorAll('.project-card-link');
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
        const menuMusicToggle = document.querySelector('.menu-music-toggle');
        const musicModal = document.querySelector('.music-modal');
        const musicModalClose = document.querySelector('.music-modal__close');
        const menuSongButtons = document.querySelectorAll('.menu-song');
        const visitorCount = document.querySelector('#visitor-count');
        const introLoader = document.querySelector('.intro-loader');
        let activeSkillCard = null;
        let autoplayPrimed = true;
        let currentTrack = {
            title: 'Back to December',
            artist: 'Taylor Swift',
            src: 'assets/music/Backtodecember(Nene).mp3',
            cover: 'assets/music-profile/Taylor_Swift-Back_to_December.png',
            id: 'back-to-december'
        };
        const taglinePhrases = [
            'Build smart. Scale fast. Deliver value.',
            'Turning ideas into scalable digital solutions',
            'Code with purpose, build with impact',
            'Simple solutions for complex digital problems',
            'Creating systems that make life easier',
            'From idea to system, efficiently built',
            'Designing clean, scalable, and reliable systems'
        ];

        function hideIntroLoader() {
            if (!introLoader || introLoader.classList.contains('is-hidden')) return;

            window.setTimeout(() => {
                introLoader.classList.add('is-hidden');
                document.body.classList.remove('is-loading');
            }, 1150);
        }

        async function requestVisitorCount(endpoint) {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`Counter request failed with ${response.status}`);
            }

            return response.json();
        }

        async function updateVisitorCount() {
            if (!visitorCount) return;

            try {
                let data;

                try {
                    data = await requestVisitorCount('/api/visitor-count');
                } catch (vercelError) {
                    data = await requestVisitorCount('visitor-counter.php');
                }

                const countValue = Number.parseInt(data.count, 10);
                visitorCount.textContent = String(Number.isFinite(countValue) ? countValue : 1).padStart(3, '0');
            } catch (error) {
                console.error('Visitor count endpoint failed.', error);
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

        function updateCollaborateMarqueeSection() {
            if (!collaborateMarqueeSection) return;

            const rect = collaborateMarqueeSection.getBoundingClientRect();
            const total = Math.max(collaborateMarqueeSection.offsetHeight - window.innerHeight, 1);
            const progress = Math.min(Math.max(-rect.top / total, 0), 1);

            collaborateMarqueeSection.style.setProperty('--collaborate-marquee-progress', progress.toFixed(3));
        }

        updateCollaborateMarqueeSection();
        window.addEventListener('scroll', updateCollaborateMarqueeSection, { passive: true });
        window.addEventListener('resize', updateCollaborateMarqueeSection);
        updateVisitorCount();

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
            if (!menuMusicToggle || !musicModal) return;

            menuMusicToggle.setAttribute('aria-expanded', String(isOpen));
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

        menuMusicToggle?.addEventListener('click', () => {
            setMenuMusicState(true);
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

            link.addEventListener('click', (event) => {
                const projectUrl = link.dataset.projectLink;

                if (!projectUrl) {
                    event.preventDefault();
                }
            });
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

        async function tryAutoplayCurrentTrack() {
            if (!bgMusic || !bgMusicSource || !currentTrack.src) return;

            bgMusicSource.src = currentTrack.src;
            bgMusic.load();
            updateMusicDisplay();
            bgMusic.muted = true;

            try {
                await bgMusic.play();
                setMusicButtonState(true);
            } catch (error) {
                setMusicButtonState(false);
            }
        }

        function queueAutoplayAttempts() {
            if (!bgMusic) return;

            window.addEventListener('DOMContentLoaded', () => {
                tryAutoplayCurrentTrack();
            });

            window.addEventListener('load', () => {
                tryAutoplayCurrentTrack();
            });

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && bgMusic.paused) {
                    tryAutoplayCurrentTrack();
                }
            });
        }

        async function activateAudioWithSound() {
            if (!bgMusic) return;

            bgMusic.muted = false;
            autoplayPrimed = false;

            try {
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
                    autoplayPrimed = false;
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
                    if (bgMusic.muted || autoplayPrimed) {
                        await activateAudioWithSound();
                    } else if (bgMusic.paused) {
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

            tryAutoplayCurrentTrack();
            queueAutoplayAttempts();
            window.addEventListener('pointerdown', activateAudioWithSound, { once: true });
            window.addEventListener('keydown', activateAudioWithSound, { once: true });
            window.addEventListener('touchstart', activateAudioWithSound, { once: true });
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

