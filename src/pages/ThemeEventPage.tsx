import { useThemeEvent } from '@/context/ThemeEventContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function ThemeEventPage() {
    const { currentThemeId, setTheme, availableThemes } = useThemeEvent();

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="text-yellow-500" />
                    Kho Giao Diện Sự Kiện
                </h1>
                <p className="text-muted-foreground">
                    Chọn chủ đề để trang trí ứng dụng theo các ngày lễ. Hiệu ứng sẽ được áp dụng ngay lập tức.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableThemes.map((theme) => {
                    const isActive = currentThemeId === theme.id;
                    return (
                        <motion.div
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all border-2 relative overflow-hidden h-full",
                                    isActive ? "border-primary bg-primary/5 shadow-lg" : "border-transparent hover:border-gray-200 bg-card"
                                )}
                                onClick={() => setTheme(theme.id)}
                            >
                                {/* Background preview shim */}
                                <div
                                    className="h-24 w-full bg-gradient-to-r from-gray-100 to-gray-200 relative"
                                    style={{
                                        background: theme.colors.primary ? `linear-gradient(135deg, ${theme.colors.primary}22, ${theme.colors.primary}66)` : undefined
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30 text-4xl">
                                        {theme.effects.type === 'snow' && '❄️'}
                                        {theme.effects.type === 'flower' && '🌸'}
                                        {theme.effects.type === 'leaf' && '🍂'}
                                        {theme.effects.type === 'ghost' && '👻'}
                                        {theme.effects.type === 'heart' && '❤️'}
                                        {theme.effects.type === 'star' && '⭐'}
                                    </div>
                                </div>

                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{theme.name}</CardTitle>
                                        {isActive && <Badge variant="default"><Check className="w-3 h-3 mr-1" /> Đang dùng</Badge>}
                                    </div>
                                    <CardDescription>{theme.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 flex-wrap text-sm text-muted-foreground">
                                        {theme.effects.type !== 'none' && (
                                            <Badge variant="outline">Hiệu ứng: {theme.effects.type}</Badge>
                                        )}
                                        {theme.marquee && (
                                            <Badge variant="outline">Text chạy</Badge>
                                        )}

                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
