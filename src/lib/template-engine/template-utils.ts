import type { ResumeCustomization } from '@/types/resume';

export function getAccentColorClasses(color?: string) {
    if (!color) return 'text-blue-600 border-blue-600';

    // Convert hex to Tailwind-compatible inline styles
    return {
        color: color,
        borderColor: color,
    };
}

export function getFontFamily(font?: string) {
    const fontMap: Record<string, string> = {
        inter: 'Inter, system-ui, sans-serif',
        roboto: 'Roboto, sans-serif',
        lato: 'Lato, sans-serif',
        opensans: 'Open Sans, sans-serif',
        georgia: 'Georgia, serif',
        merriweather: 'Merriweather, serif',
    };

    return fontMap[font || 'inter'] || fontMap.inter;
}

export function getTemplateStyles(customization?: ResumeCustomization) {
    const primaryColor = customization?.primaryColor || '#3B82F6';
    const font = getFontFamily(customization?.font);

    return {
        fontFamily: font,
        '--accent-color': primaryColor,
    } as React.CSSProperties;
}
