document.addEventListener('DOMContentLoaded', () => {
    // Sử dụng Timeline của anime.js để tạo chuỗi hiệu ứng nối tiếp nhau một cách hoàn hảo
    const headerTimeline = anime.timeline({
        easing: 'easeOutExpo', // Chọn một hiệu ứng chuyển động mượt mà cho toàn bộ timeline
    });

    // 1. Hiệu ứng cho logo lớn xuất hiện
    headerTimeline.add({
        targets: '.large-brand-logo',
        opacity: [0, 1],      // Từ trong suốt thành hiện rõ
        translateY: [20, 0],  // Di chuyển từ dưới lên 20px
        duration: 1200,       // Thời gian thực hiện: 1.2 giây
        delay: 500            // Chờ 0.5 giây trước khi bắt đầu
    });

    // 2. Hiệu ứng cho từng từ của tiêu đề chính
    headerTimeline.add({
        targets: '.header-title .word',
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.9, 1],      // Phóng to nhẹ để tạo cảm giác "nảy"
        duration: 800,
        delay: anime.stagger(100) // Mỗi từ xuất hiện cách nhau 100ms
    }, '-=800'); // Dấu '-=' cho phép hiệu ứng này bắt đầu sớm hơn, tạo sự gối đầu mượt mà

    // 3. Hiệu ứng cho từng từ của phụ đề
    headerTimeline.add({
        targets: '.header-subtitle .subtitle-word',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        delay: anime.stagger(50) // Các từ của phụ đề xuất hiện nhanh hơn
    }, '-=600'); // Bắt đầu gối đầu
});