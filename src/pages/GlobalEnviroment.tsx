export const MENU_BUTTON_FONT_FAMILY = 'Noto Sans';
export const MENU_BUTTON_FONT_STYLE = 'normal';
export const MENU_BUTTON_FONT_WEIGHT = '500';
export const MENU_BUTTON_FONT_SIZE = '16px';

export function loadFonts() {
    const font = new FontFace(MENU_BUTTON_FONT_FAMILY, `url(%PUBLIC_URL%/index.css)`, {
        style: MENU_BUTTON_FONT_STYLE,
        weight: MENU_BUTTON_FONT_WEIGHT
    });
    font.load().then(function () {
        document.fonts.add(font);
    });
}