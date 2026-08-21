jQuery(function () {

    // =========================================================
    // CANON KEEPER
    // =========================================================

    const BUTTON_ID = 'canon-keeper-button';
    const OVERLAY_ID = 'canon-keeper-overlay';
    const STORAGE_KEY = 'canonKeeperRules';


    // =========================================================
    // КНОПКА CANON KEEPER В EXTENSIONS
    // =========================================================

    const buttonHtml = `
        <div id="${BUTTON_ID}"
             class="list-group-item flex-container flexGap5">
            <div class="fa-solid fa-book extensionsMenuExtensionButton"></div>
            Canon Keeper
        </div>
    `;

    if ($('#' + BUTTON_ID).length === 0) {
        $('#extensionsMenu').prepend(buttonHtml);
    }


    $('#' + BUTTON_ID)
        .off('click.canonKeeper')
        .on('click.canonKeeper', function () {
            openCanonKeeper();
        });


    // =========================================================
    // CANON KEEPER — ОКНО
    // =========================================================

    if ($('#canon-keeper-style').length === 0) {

        $('head').append(`
            <style id="canon-keeper-style">

                #${OVERLAY_ID} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;

                    z-index: 99990;

                    background: rgba(0, 0, 0, 0.55);

                    display: flex;
                    justify-content: center;
                    align-items: flex-start;

                    box-sizing: border-box;

                    padding-top: 175px;
                    padding-left: 8px;
                    padding-right: 8px;
                    padding-bottom: 12px;
                }


                #canon-keeper-modal {
                    position: relative;

                    width: 100%;
                    max-width: 760px;

                    height: calc(100vh - 187px);
                    max-height: calc(100vh - 187px);

                    box-sizing: border-box;

                    background: #171717;
                    color: #eeeeee;

                    border: 1px solid #303030;
                    border-radius: 22px;

                    box-shadow:
                        0 15px 55px rgba(0, 0, 0, 0.80);

                    overflow: hidden;

                    display: flex;
                    flex-direction: column;
                }


                #canon-keeper-header {
                    flex: 0 0 auto;

                    position: relative;

                    padding:
                        22px
                        65px
                        16px
                        22px;

                    text-align: center;

                    background: #171717;
                }


                #canon-keeper-header h2 {
                    margin: 0;

                    font-size: 34px;
                    line-height: 1.2;

                    color: #eeeeee;
                }


                #canon-keeper-header .canon-subtitle {
                    margin-top: 10px;

                    font-size: 21px;
                    line-height: 1.3;

                    color: #dddddd;
                }


                #canon-keeper-header hr {
                    margin: 18px 0 0 0;

                    border: 0;
                    border-top: 1px solid #333333;
                }


                #canon-keeper-close {
                    position: absolute;

                    top: 12px;
                    right: 12px;

                    width: 46px;
                    height: 46px;

                    padding: 0;

                    border: 0;
                    border-radius: 50%;

                    background: #eeeeee;
                    color: #222222;

                    font-size: 28px;
                    font-weight: bold;

                    line-height: 46px;
                    text-align: center;

                    z-index: 20;

                    cursor: pointer;
                }


                #canon-keeper-content {
                    flex: 1 1 auto;

                    min-height: 0;

                    overflow-y: auto;
                    overflow-x: hidden;

                    -webkit-overflow-scrolling: touch;

                    box-sizing: border-box;

                    padding:
                        0
                        20px
                        30px
                        20px;
                }


                #canon-keeper-content .canon-section-title {
                    text-align: center;

                    font-size: 30px;
                    font-weight: bold;

                    line-height: 1.25;

                    margin:
                        8px
                        0
                        18px
                        0;
                }


                #canon-keeper-input {
                    display: block;

                    width: 100%;
                    min-height: 145px;

                    box-sizing: border-box;

                    resize: vertical;

                    padding: 18px;

                    border: 2px solid #444444;
                    border-radius: 14px;

                    background: #0d0d0d;
                    color: #eeeeee;

                    font-size: 19px;
                    line-height: 1.45;

                    outline: none;
                }


                #canon-keeper-input:focus {
                    border-color: #707070;
                }


                #canon-keeper-input::placeholder {
                    color: #777777;
                }


                #canon-keeper-add {
                    display: block;

                    width: 100%;
                    min-height: 60px;

                    margin-top: 15px;

                    padding: 8px 12px;

                    box-sizing: border-box;

                    border: 2px solid #444444;
                    border-radius: 14px;

                    background: #242424;
                    color: #eeeeee;

                    font-size: 21px;
                    font-weight: bold;

                    cursor: pointer;
                }


                .canon-keeper-rule {
                    width: 100%;

                    margin-top: 18px;

                    padding: 20px;

                    box-sizing: border-box;

                    border: 2px solid #3d3d3d;
                    border-radius: 16px;

                    background: #202020;
                }


                .canon-keeper-rule-text {
                    font-size: 20px;

                    line-height: 1.45;

                    color: #eeeeee;

                    white-space: pre-wrap;
                    word-break: break-word;
                }


                .canon-keeper-rule-buttons {
                    display: flex;

                    gap: 12px;

                    margin-top: 16px;
                }


                .canon-keeper-rule-buttons button {
                    flex: 1;

                    min-width: 0;
                    min-height: 54px;

                    padding: 8px 6px;

                    box-sizing: border-box;

                    border: 1px solid #555555;
                    border-radius: 12px;

                    background: #303030;
                    color: #eeeeee;

                    font-size: 18px;

                    cursor: pointer;
                }


                #canon-keeper-copy {
                    display: block;

                    width: 100%;
                    min-height: 58px;

                    margin-top: 22px;

                    padding: 8px 12px;

                    box-sizing: border-box;

                    border: 2px solid #444444;
                    border-radius: 14px;

                    background: #242424;
                    color: #eeeeee;

                    font-size: 20px;
                    font-weight: bold;

                    cursor: pointer;
                }


                /* =================================================
                   ПЛАВАЮЩИЙ ВИДЖЕТ
                   ================================================= */

                #canon-keeper-floating-widget {

                    position: fixed;

                    width: 58px;
                    height: 58px;

                    right: 18px;
                    bottom: 90px;

                    z-index: 999999;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    box-sizing: border-box;

                    border-radius: 50%;

                    background: #242424;

                    border: 2px solid #555555;

                    box-shadow:
                        0 5px 18px rgba(0,0,0,0.55);

                    color: #eeeeee;

                    font-size: 28px;

                    cursor: grab;

                    user-select: none;
                    -webkit-user-select: none;

                    touch-action: none;
                }


                #canon-keeper-floating-widget.canon-dragging {

                    cursor: grabbing;

                    transform: scale(1.08);

                    box-shadow:
                        0 8px 25px rgba(0,0,0,0.7);
                }


                @media (max-width: 600px) {

                    #canon-keeper-modal {
                        height: calc(100vh - 183px);
                        max-height: calc(100vh - 183px);
                    }

                    #canon-keeper-header {
                        padding:
                            18px
                            60px
                            14px
                            18px;
                    }

                    #canon-keeper-header h2 {
                        font-size: 30px;
                    }

                    #canon-keeper-content {
                        padding:
                            0
                            14px
                            25px
                            14px;
                    }

                    #canon-keeper-input {
                        min-height: 135px;
                    }
                }

            </style>
        `);
    }


    // =========================================================
    // ОТКРЫТЬ CANON KEEPER
    // =========================================================

    function openCanonKeeper() {

        if ($('#' + OVERLAY_ID).length) {
            return;
        }


        let rules = [];

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    rules = parsed;
                }
            }

        } catch (error) {

            console.error(
                '[Canon Keeper] Ошибка загрузки:',
                error
            );

        }


        const overlay = $(`
            <div id="${OVERLAY_ID}">

                <div id="canon-keeper-modal">

                    <button
                        id="canon-keeper-close"
                        type="button">
                        ×
                    </button>


                    <div id="canon-keeper-header">

                        <h2>🛡️ Canon Keeper</h2>

                        <div class="canon-subtitle">
                            Хранитель канона
                        </div>

                        <hr>

                    </div>


                    <div id="canon-keeper-content">

                        <div class="canon-section-title">
                            📜 Канон
                        </div>


                        <textarea
                            id="canon-keeper-input"
                            placeholder="Напиши правило канона..."
                        ></textarea>


                        <button
                            id="canon-keeper-add"
                            type="button">
                            ➕ Добавить правило
                        </button>


                        <div id="canon-keeper-rules"></div>


                        <button
                            id="canon-keeper-copy"
                            type="button">
                            📋 Скопировать весь канон
                        </button>

                    </div>

                </div>

            </div>
        `);


        $('body').append(overlay);


        // =====================================================
        // СОХРАНЕНИЕ
        // =====================================================

        function saveRules() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(rules)
                );

            } catch (error) {

                console.error(
                    '[Canon Keeper] Ошибка сохранения:',
                    error
                );

            }
        }


        // =====================================================
        // ОТОБРАЖЕНИЕ ПРАВИЛ
        // =====================================================

        function renderRules() {

            const container =
                $('#canon-keeper-rules');

            container.empty();


            rules.forEach(function (rule, index) {

                const card = $(`
                    <div class="canon-keeper-rule">

                        <div class="canon-keeper-rule-text"></div>

                        <div class="canon-keeper-rule-buttons">

                            <button
                                type="button"
                                class="canon-keeper-edit">
                                ✏️ Изменить
                            </button>

                            <button
                                type="button"
                                class="canon-keeper-delete">
                                🗑️ Удалить
                            </button>

                        </div>

                    </div>
                `);


                card.find('.canon-keeper-rule-text')
                    .text(rule);


                card.find('.canon-keeper-edit')
                    .on('click', function () {

                        const newRule =
                            prompt(
                                'Измени правило канона:',
                                rule
                            );


                        if (
                            newRule !== null &&
                            newRule.trim() !== ''
                        ) {

                            rules[index] =
                                newRule.trim();

                            saveRules();

                            renderRules();

                        }

                    });


                card.find('.canon-keeper-delete')
                    .on('click', function () {

                        if (
                            confirm(
                                'Удалить это правило из канона?'
                            )
                        ) {

                            rules.splice(
                                index,
                                1
                            );

                            saveRules();

                            renderRules();

                        }

                    });


                container.append(card);

            });

        }


        // =====================================================
        // ДОБАВИТЬ ПРАВИЛО
        // =====================================================

        $('#canon-keeper-add')
            .on('click', function () {

                const input =
                    $('#canon-keeper-input');

                const text =
                    input.val().trim();


                if (!text) {

                    alert(
                        'Сначала напиши правило канона.'
                    );

                    input.focus();

                    return;
                }


                rules.push(text);

                saveRules();

                input.val('');

                renderRules();

            });


        // =====================================================
        // КОПИРОВАТЬ КАНОН
        // =====================================================

        $('#canon-keeper-copy')
            .on('click', async function () {

                if (rules.length === 0) {

                    alert(
                        'Канон пока пуст.'
                    );

                    return;
                }


                const canonText =
                    rules
                        .map(function (rule, index) {

                            return (
                                (index + 1) +
                                '. ' +
                                rule
                            );

                        })
                        .join('\n');


                try {

                    await navigator.clipboard
                        .writeText(canonText);

                    alert(
                        'Канон скопирован!'
                    );

                } catch (error) {

                    const textarea =
                        $('<textarea>')
                            .val(canonText)
                            .appendTo('body');

                    textarea[0].select();

                    document.execCommand('copy');

                    textarea.remove();

                    alert(
                        'Канон скопирован!'
                    );
                }

            });


        // =====================================================
        // ЗАКРЫТЬ
        // =====================================================

        $('#canon-keeper-close')
            .on('click', function () {

                $('#' + OVERLAY_ID).remove();

            });


        $('#' + OVERLAY_ID)
            .on('click', function (event) {

                if (event.target === this) {
                    $(this).remove();
                }

            });


        // =====================================================
        // РЕНДЕР
        // =====================================================

        renderRules();

    }


    // =========================================================
    // ПЛАВАЮЩИЙ ВИДЖЕТ
    // =========================================================

    if ($('#canon-keeper-floating-widget').length === 0) {

        const floatingWidget = $(`
            <div
                id="canon-keeper-floating-widget"
                title="Canon Keeper">
                📖
            </div>
        `);


        $('body').append(floatingWidget);


        // -----------------------------------------------------
        // Восстановление положения
        // -----------------------------------------------------

        try {

            const savedPosition =
                JSON.parse(
                    localStorage.getItem(
                        'canonKeeperWidgetPosition'
                    ) || 'null'
                );


            if (
                savedPosition &&
                typeof savedPosition.left === 'number' &&
                typeof savedPosition.top === 'number'
            ) {

                floatingWidget.css({

                    left:
                        savedPosition.left + 'px',

                    top:
                        savedPosition.top + 'px',

            
