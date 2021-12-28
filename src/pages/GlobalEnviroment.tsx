export const MENU_BUTTON_FONT_FAMILY = "Noto Sans";
export const MENU_BUTTON_FONT_STYLE = "normal";
export const MENU_BUTTON_FONT_WEIGHT = "500";
export const MENU_BUTTON_FONT_SIZE = "16px";

export const MENU_TEXT_FONT_FAMILY = "Noto Sans";
export const MENU_TEXT_FONT_STYLE = "normal";
export const MENU_TEXT_FONT_WEIGHT = "500";
export const MENU_TEXT_FONT_SIZE = "16px";

export const FORM_FONT_FAMILY = "Noto Sans";
export const FORM_FONT_STYLE = "normal";
export const FORM_FONT_WEIGHT = "normal";
export const FORMTITLE_FONT_WEIGHT = "bold";
export const FORM_FONT_SIZE = "16px";

export function loadGlobalEnviroments(): void {
    const newStyle = document.createElement("style");
    newStyle.appendChild(document.createTextNode(`
    @font-face {
        font-family: ${MENU_BUTTON_FONT_FAMILY};
        src: url("${process.env.PUBLIC_URL}/static/font/NotoSans/NotoSans-Bold.ttf") font-weight: bold;
    }
    @font-face {
        font-family: ${MENU_BUTTON_FONT_FAMILY};
        src: url("${process.env.PUBLIC_URL}/static/font/NotoSans/NotoSans-BoldItalic.ttf") font-weight: bold; font-style: italic;
    }
    @font-face {
        font-family: ${MENU_BUTTON_FONT_FAMILY};
        src: url("${process.env.PUBLIC_URL}/static/font/NotoSans/NotoSans-Italic.ttf") font-style: italic;
    }
    @font-face {
        font-family: ${MENU_BUTTON_FONT_FAMILY};
        src: url("${process.env.PUBLIC_URL}/static/font/NotoSans/NotoSans-Regular.ttf")
    }
    `));
    document.head.appendChild(newStyle);
}
