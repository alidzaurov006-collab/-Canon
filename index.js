jQuery(function () {

// =========================================================
// CANON KEEPER
// =========================================================

const BUTTON_ID = 'canon-keeper-button';
const OVERLAY_ID = 'canon-keeper-overlay';
const STORAGE_KEY = 'canonKeeperRules';


// =========================================================
// КНОПКА В МЕНЮ EXTENSIONS
// =========================================================

const buttonHtml = `
    <div id="${BUTTON_ID}"
         class="list-group-item flex-container flexGap5">
        <div class="fa-solid fa-book extensionsMenuExtensionButton"></div>
        Canon Keeper
    </div>
`;

if ($('#' + BUTTON_ID).length 
