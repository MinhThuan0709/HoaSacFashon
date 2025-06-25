document.addEventListener('DOMContentLoaded', () => {
    // --- Logic cho Responsive Navigation (Hamburger menu) ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // --- Logic đổi màu thanh điều hướng khi cuộn trang ---
    const mainNav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            mainNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            mainNav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            mainNav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // --- HIỆU ỨNG NÂNG CẤP: Hiệu ứng cuộn cho các section thông thường bằng Anime.js ---
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elementsToAnimate = entry.target.querySelectorAll('.fade-in-element');
                anime({
                    targets: elementsToAnimate,
                    translateY: [40, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(150, { start: 200 }),
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // --- HIỆU ỨNG MỚI: Hiệu ứng gợn sóng cho nút bấm ---
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            button.appendChild(ripple);
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            anime({
                targets: ripple,
                scale: [0, 2],
                opacity: [0.5, 0],
                duration: 600,
                easing: 'easeInOutQuad',
                complete: () => ripple.remove()
            });
        });
    });

    // --- Logic hiệu ứng 4 mùa (Giữ nguyên) ---
    const collectionItems = document.querySelectorAll('.collection-item');
    const globalEffectContainer = document.getElementById('global-seasonal-effect-container');
    if (globalEffectContainer) {
        const seasonEffects = {
            spring: { spawnRate: 150, duration: 5000, sizeRange: [15, 30], animationName: 'flowerFall', additionalAnimations: 'flowerSway 3s infinite alternate' },
            summer: { spawnRate: 150, duration: 7000, sizeRange: [8, 18], animationName: 'sunSparkleFall', additionalAnimations: 'lightPulse 1.5s infinite alternate', cssVariables: () => ({ '--sparkle-drift': `${(Math.random() * 80) - 40}px` }) },
            autumn: { spawnRate: 100, duration: 8000, sizeRange: [20, 40], animationName: 'leafFall', additionalAnimations: 'leafSway 5s infinite linear', cssVariables: () => ({ '--wind-direction': Math.random() > 0.5 ? '1' : '-1' }) },
            winter: { spawnRate: 50, duration: 10000, sizeRange: [5, 15], animationName: 'snowFall', cssVariables: () => ({ '--snow-drift': `${(Math.random() * 60) - 30}px` }) }
        };
        // ... (phần còn lại của logic hiệu ứng 4 mùa)
    }

    // --- TOÀN BỘ LOGIC GSAP: SCROLLYTELLING, CHUYỂN CẢNH VÀ SIDE NAV (PHIÊN BẢN SỬA LỖI HOÀN TOÀN) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- 1. HIỆU ỨNG ẨN HEADER VÀ HIỆN SIDE NAV (LOGIC MỚI) ---
        const sideNav = document.querySelector('.side-nav');

        // Tạo một Timeline duy nhất để kiểm soát cả hai thanh nav
        const navTransitionTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".main-header",     // Kích hoạt dựa trên header
                start: "bottom top",         // Bắt đầu khi đáy header chạm đỉnh màn hình
                end: "bottom top-=200",      // Hoàn thành sau khi cuộn 200px
                scrub: 1,                    // Làm mượt hiệu ứng theo scroll
            }
        });

        // Thêm cả hai hiệu ứng vào cùng một timeline
        navTransitionTimeline
            .to(".main-nav", { y: "-100%", opacity: 0, ease: "power1.in" }, 0) // Di chuyển header lên
            .to(sideNav, { opacity: 1, visibility: 'visible', ease: "power1.in" }, 0); // Hiện side-nav ra (tại cùng thời điểm 0)


        // --- 2. LOGIC SCROLLYTELLING ---
        const storyImages = gsap.utils.toArray('.scrolly-image');
        const storyChapters = gsap.utils.toArray('.story-chapter');
        gsap.set(storyImages[0], { opacity: 1 });

        storyChapters.forEach((chapter, index) => {
            const chapterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: chapter,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                },
            });
            if (index > 0) chapterTimeline.to(storyImages[index - 1], { opacity: 0 }, 0);
            chapterTimeline.to(storyImages[index], { opacity: 1 }, 0);
            chapterTimeline.fromTo(chapter, { opacity: 0, y: 100 }, { opacity: 1, y: 0 }, 0);
        });

        ScrollTrigger.create({
            trigger: ".scrolly-story-container",
            start: "top top",
            end: "bottom bottom",
            pin: ".scrolly-images",
            anticipatePin: 1
        });

        // --- 3. HIỆU ỨNG CHUYỂN CẢNH TỪ STORY SANG MAIN ---
        const lastStoryImage = storyImages[storyImages.length - 1];
        const lastStoryChapter = storyChapters[storyChapters.length - 1];
        const firstMainSection = document.getElementById('first-main-section');
        const firstMainContent = firstMainSection.querySelector('.section-inner-content');

        gsap.timeline({
            scrollTrigger: {
                trigger: firstMainSection,
                start: "top bottom",
                end: "top top",
                scrub: 1,
            }
        })
        .fromTo(lastStoryChapter, { opacity: 1 }, { opacity: 0, ease: 'power1.in' }, 0)
        .to(lastStoryImage, { filter: 'brightness(0.6)' }, 0)
        .from(firstMainContent, { y: 150, opacity: 0 }, 0);

        // --- 4. LOGIC CẬP NHẬT TRẠNG THÁI ACTIVE CHO SIDE NAV ---
        const sideNavItems = gsap.utils.toArray('.side-nav .nav-item');
        const sectionsForSideNav = gsap.utils.toArray('.scrolly-story-container, #first-main-section, #collections-grid-section, #unique-features-section');
        
        const setActiveItem = (index) => {
            sideNavItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        };

        sectionsForSideNav.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveItem(i),
                onEnterBack: () => setActiveItem(i),
            });
        });
    }

    // --- KÍCH HOẠT HIỆU ỨNG 3D CINEMATIC KHI CUỘN ---
    const cinematicSection = document.querySelector('.cinematic-section');
    const observerCinematic = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cinematicSection.classList.add('in-view');
                observerCinematic.unobserve(cinematicSection); // Chỉ kích hoạt một lần
            } else {
                cinematicSection.classList.remove('in-view'); // Reset class nếu ra khỏi view
            }
        });
    }, { threshold: 0.3 }); // Kích hoạt khi 30% section xuất hiện

    if (cinematicSection) {
        observerCinematic.observe(cinematicSection);
    }
     // --- HIỆU ỨNG 3D CHUYỂN ĐỔI HÌNH ẢNH FULL MÀN HÌNH KHI CUỘN ---
        // --- 5. LOGIC HIỆU ỨNG 3D CAROUSEL CINEMATIC (PHIÊN BẢN NÂNG CẤP "ĐỈNH") ---
        const fullScreenImageSection = document.querySelector('.full-screen-image-section');
        if (fullScreenImageSection) {
            const images3D = gsap.utils.toArray('.full-screen-image');
            
            if (images3D.length > 0) {
                // Sắp xếp các ảnh thành một vòng xoay 3D
                images3D.forEach((img, i) => {
                    // Đặt vị trí ban đầu cho mỗi ảnh
                    gsap.set(img, {
                        // Đặt ở vị trí xa, xoay và mờ đi
                        xPercent: (i - 1) * 100,
                        z: -500,
                        rotationY: (i - 1) * -60,
                        opacity: 0,
                        scale: 0.8
                    });
                });

                // Timeline chính điều khiển toàn bộ hiệu ứng
                const timeline3D = gsap.timeline({
                    scrollTrigger: {
                        trigger: fullScreenImageSection,
                        pin: true,
                        start: "top top",
                        end: () => `+=${fullScreenImageSection.offsetHeight * (images3D.length)}`,
                        scrub: 1, // Mượt mà tuyệt đối
                        snap: {
                            snapTo: 1 / images3D.length, // Snap vào từng section ảnh
                            duration: 0.4,
                            ease: "power2.inOut"
                        }
                    }
                });

                // Tạo hiệu ứng xoay cho từng tấm ảnh
                images3D.forEach((img, i) => {
                    // Hiệu ứng đưa ảnh vào trung tâm
                    timeline3D.to(img, {
                        xPercent: 0,
                        z: 0,
                        rotationY: 0,
                        opacity: 1,
                        scale: 1.1, // Phóng to nhẹ khi ở trung tâm
                        ease: "power2.inOut",
                        onStart: () => {
                            // Cập nhật class active khi hiệu ứng bắt đầu
                            images3D.forEach(el => el.classList.remove('active'));
                            img.classList.add('active');
                        }
                    }, `step${i}`);

                    // Hiệu ứng đưa ảnh ra khỏi trung tâm
                    if (i < images3D.length -1) {
                        timeline3D.to(img, {
                            xPercent: -100,
                            z: -500,
                            rotationY: 60,
                            opacity: 0,
                            scale: 0.8,
                            ease: "power2.inOut"
                        }, `step${i+1}`);
                    }
                });
            }
        }
});
