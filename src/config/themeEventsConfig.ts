export interface ThemeConfig {
    id: string;
    name: string;
    description: string;
    colors: {
        primary?: string; // Hex color for primary accents
        backgroundOverlay?: string; // CSS color for background overlay (e.g. "rgba(0,0,0,0.5)")
    };
    effects: {
        type: 'none' | 'snow' | 'flower' | 'leaf' | 'ghost' | 'heart' | 'star';
        speed?: number; // 1 (slow) to 5 (fast)
        density?: number; // 1 (sparse) to 10 (dense)
        colors?: string[]; // Custom colors for particles
    };
    marquee?: string; // Text scrolling at the top

}

export const themes: ThemeConfig[] = [
    {
        id: 'default',
        name: 'Mặc định',
        description: 'Giao diện gốc của ứng dụng',
        colors: {},
        effects: { type: 'none' },
    },
    {
        id: 'tet',
        name: 'Tết Nguyên Đán',
        description: 'Chúc mừng năm mới! Hoa đào, hoa mai rơi.',
        colors: {
            primary: '#d32f2f', // Red
        },
        effects: {
            type: 'flower',
            density: 5,
            colors: ['#FFD700', '#FF69B4', '#FF4500'], // Gold, HotPink, OrangeRed
        },
        marquee: '🎉 Chúc Mừng Năm Mới - An Khang Thịnh Vượng - Vạn Sự Như Ý! 🎉',

    },
    {
        id: 'valentines',
        name: 'Valentine (14/2)',
        description: 'Ngày lễ tình nhân lãng mạn.',
        colors: {
            primary: '#e91e63',
        },
        effects: {
            type: 'heart',
            density: 3,
            colors: ['#FF69B4', '#FF1493', '#FFFFFF'],
        },
        marquee: '❤️ Happy Valentine\'s Day! Chúc bạn một ngày lễ tràn ngập yêu thương ❤️',
    },
    {
        id: 'womens_day',
        name: 'Quốc Tế Phụ Nữ (8/3)',
        description: 'Tôn vinh phái đẹp.',
        colors: {
            primary: '#ec407a',
        },
        effects: {
            type: 'flower',
            density: 4,
            colors: ['#F8BBD0', '#F48FB1', '#F06292'],
        },
        marquee: '💐 Chúc mừng ngày Quốc tế Phụ nữ 8/3! Xinh đẹp, hạnh phúc và thành công! 💐',
    },
    {
        id: 'liberation_day',
        name: 'Giải Phóng & Quốc Tế LĐ (30/4 - 1/5)',
        description: 'Kỷ niệm ngày Giải phóng miền Nam và Quốc tế Lao động.',
        colors: {
            primary: '#b71c1c',
        },
        effects: {
            type: 'star',
            density: 2,
            colors: ['#FFFF00', '#FF0000'], // Yellow stars representing the flag colors
        },
        marquee: '🇻🇳 Chào mừng kỷ niệm Ngày Giải phóng miền Nam 30/4 và Quốc tế Lao động 1/5 🇻🇳',
    },
    {
        id: 'hung_kings',
        name: 'Giỗ Tổ Hùng Vương',
        description: 'Uống nước nhớ nguồn.',
        colors: {
            primary: '#ef6c00',
        },
        effects: {
            type: 'none', // Maybe subtle incense smoke later if possible? defaulting to none or simple stars
        },
        marquee: '🙏 Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng mười tháng ba 🙏',
    },
    {
        id: 'national_day',
        name: 'Quốc Khánh (2/9)',
        description: 'Mừng Tết Độc Lập.',
        colors: {
            primary: '#d50000',
        },
        effects: {
            type: 'star',
            density: 3,
            colors: ['#FFD700', '#FF0000'], // Gold stars
        },
        marquee: '🇻🇳 Chào mừng Quốc Khánh Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam 2/9 🇻🇳',
    },
    {
        id: 'halloween',
        name: 'Halloween',
        description: 'Lễ hội hóa lộ quỷ.',
        colors: {
            primary: '#ff6d00',
            backgroundOverlay: 'rgba(20, 0, 10, 0.2)',
        },
        effects: {
            type: 'ghost',
            density: 3,
            speed: 2,
            colors: ['#ffffff', '#aaaaaa'],
        },
        marquee: '🎃 Happy Halloween! Trick or Treat! 🎃',

    },
    {
        id: 'teachers_day',
        name: 'Nhà Giáo Việt Nam (20/11)',
        description: 'Tri ân thầy cô.',
        colors: {
            primary: '#2e7d32',
        },
        effects: {
            type: 'flower',
            density: 3,
            colors: ['#FFA000', '#FFFFFF', '#4CAF50'],
        },
        marquee: '📚 Chào mừng ngày Nhà giáo Việt Nam 20/11 - Tôn sư trọng đạo 📚',
    },
    {
        id: 'christmas',
        name: 'Giáng Sinh',
        description: 'Mùa lễ hội an lành.',
        colors: {
            primary: '#1b5e20',
            backgroundOverlay: 'rgba(0, 10, 30, 0.1)',
        },
        effects: {
            type: 'snow',
            density: 8,
            speed: 3,
            colors: ['#FFFFFF', '#E3F2FD'],
        },
        marquee: '🎄 Merry Christmas & Happy New Year! Chúc Giáng sinh an lành và năm mới hạnh phúc 🎄',

    },
];

export const getThemeById = (id: string): ThemeConfig | undefined => {
    return themes.find(t => t.id === id);
};
