export const MENU_BUTTON_FONT_FAMILY = 'Noto Sans';
export const MENU_BUTTON_FONT_STYLE = 'normal';
export const MENU_BUTTON_FONT_WEIGHT = '500';
export const MENU_BUTTON_FONT_SIZE = '16px';

export function loadGlobalEnviroments() {
    [
        // new FontFace(MENU_BUTTON_FONT_FAMILY, `url(%PUBLIC_URL%/static/font/NotoSans/NotoSans-Bold.ttf)`),
        // new FontFace(MENU_BUTTON_FONT_FAMILY, `url(%PUBLIC_URL%/static/font/NotoSans/NotoSans-BoldItalic.ttf)`),
        // new FontFace(MENU_BUTTON_FONT_FAMILY, `url(%PUBLIC_URL%/static/font/NotoSans/NotoSans-Italic.ttf)`),
        new FontFace(MENU_BUTTON_FONT_FAMILY, `url(${process.env.PUBLIC_URL}/static/font/NotoSans/NotoSans-Regular.ttf)`)
    ].forEach(font => font.load().then(loadedFont => document.fonts.add(loadedFont)));
}
