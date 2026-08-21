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

    if ($('#' + BUTTON_ID).length === 0) {
        $('#extensionsMenu').prepend(buttonHtml);
    }


    // =========================================================
    // CSS
    // =========================================================

    if ($('#canon-keeper-style').length === 0) {

        $('head').append(`
            <style id="canon-keeper-style">

                /* =================================================
                   Затемнение
                   ================================================= */

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

                    /*
                     * Верхняя панель Tavern остаётся свободной.
                     */
                    padding-top: 175px;

                    padding-left: 8px;
                    padding-right: 8px;
                    padding-bottom: 12px;
                }


                /* =================================================
                   ОКНО
                   ================================================= */

                #canon-keeper-modal {

                    position: relative;

                    width: 100%;
                    max-width: 760px;

                    /*
                     * Высота окна ограничена экраном.
                     */
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


                /* =================================================
                   ШАПКА
                   ================================================= */

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

                    margin:
                        18px
                        0
                        0
                        0;

                    border: 0;

                    border-top:
                        1px solid #333333;
                }


                /* =================================================
                   КРЕСТИК
                   ================================================= */

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

                    box-shadow:
                        0 2px 8px rgba(0,0,0,0.35);
                }


                /* =================================================
                   ВНУТРЕННЯЯ ПРОКРУТКА
                   ================================================= */

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


                /* =================================================
                   ЗАГОЛОВОК КАНОНА
                   ================================================= */

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


                /* =================================================
                   ПОЛЕ
                   ================================================= */

                #canon-keeper-input {

                    display: block;

                    width: 100%;

                    min-height: 145px;

                    box-sizing: border-box;

                    resize: vertical;

                    padding: 18px;

                    border:
                        2px solid #444444;

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


                /* =================================================
                   ДОБАВИТЬ ПРАВИЛО
                   ================================================= */

                #canon-keeper-add {

                    display: block;

                    width: 100%;

                    min-height: 60px;

                    margin-top: 15px;

                    padding:
                        8px
                        12px;

                    box-sizing: border-box;

                    border:
                        2px solid #444444;

                    border-radius: 14px;

                    background: #242424;

                    color: #eeeeee;

                    font-size: 21px;

                    font-weight: bold;

                    cursor: pointer;
                }


                #canon-keeper-add:active {

                    transform: scale(0.985);
                }


                /* =================================================
                   ПРАВИЛО
                   ================================================= */

                .canon-keeper-rule {

                    width: 100%;

                    margin-top: 18px;

                    padding: 20px;

                    box-sizing: border-box;

                    border:
                        2px solid #3d3d3d;

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


                /* =================================================
                   КНОПКИ ПРАВИЛА
                   ================================================= */

                .canon-keeper-rule-buttons {

                    display: flex;

                    gap: 12px;

                    margin-top: 16px;
                }


                .canon-keeper-rule-buttons button {

                    flex: 1;

                    min-width: 0;

                    min-height: 54px;

                    padding:
                        8px
                        6px;

                    box-sizing: border-box;

                    border:
                        1px solid #555555;

                    border-radius: 12px;

                    background: #303030;

                    color: #eeeeee;

                    font-size: 18px;

                    cursor: pointer;
                }


                .canon-keeper-rule-buttons button:active {

                    transform: scale(0.98);
                }


                /* =================================================
                   КОПИРОВАТЬ ВЕСЬ КАНОН
                   ================================================= */

                #canon-keeper-copy {

                    display: block;

                    width: 100%;

                    min-height: 58px;

                    margin-top: 22px;

                    padding:
                        8px
                        12px;

                    box-sizing: border-box;

                    border:
                        2px solid #444444;

                    border-radius: 14px;

                    background: #242424;

                    color: #eeeeee;

                    font-size: 20px;

                    font-weight: bold;

                    cursor: pointer;
                }


                /* =================================================
                   ТЕЛЕФОН
                   ================================================= */

                @media (max-width: 600px) {

                    #${OVERLAY_ID} {

                        padding-top: 175px;

                        padding-left: 6px;
                        padding-right: 6px;
                        padding-bottom: 8px;
                    }


                    #canon-keeper-modal {

                        height:
                            calc(100vh - 183px);

                        max-height:
                            calc(100vh - 183px);

                        border-radius: 20px;
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


                    #canon-keeper-header .canon-subtitle {

                        font-size: 20px;
                    }


                    #canon-keeper-content {

                        padding:
                            0
                            14px
                            25px
                            14px;
                    }


                    #canon-keeper-content .canon-section-title {

                        font-size: 27px;

                        margin-top: 7px;
                    }


                    #canon-keeper-input {

                        min-height: 135px;

                        font-size: 19px;

                        padding: 16px;
                    }


                    #canon-keeper-add {

                        min-height: 58px;

                        font-size: 20px;
                    }


                    .canon-keeper-rule {

                        padding: 18px;
                    }


                    .canon-keeper-rule-text {

                        font-size: 19px;
                    }


                    .canon-keeper-rule-buttons {

                        gap: 10px;
                    }


                    .canon-keeper-rule-buttons button {

                        font-size: 17px;

                        min-height: 52px;
                    }


                    #canon-keeper-copy {

                        font-size: 19px;
                    }
                }

            </style>
        `);
    }


    // =========================================================
    // ОТКРЫТИЕ
    // =========================================================

    $('#' + BUTTON_ID)
        .off('click.canonKeeper')
        .on('click.canonKeeper', function () {

            openCanonKeeper();

        });


    // =========================================================
    // ОТКРЫТИЕ ОКНА
    // =========================================================

    function openCanonKeeper() {

        /*
         * Не создаём второе окно поверх первого.
         */
        if ($('#' + OVERLAY_ID).length) {
            return;
        }


        // -----------------------------------------------------
        // Загружаем правила
        // -----------------------------------------------------

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

            rules = [];
        }


        // -----------------------------------------------------
        // Создаём окно
        // -----------------------------------------------------

        const overlay = $(`
            <div id="${OVERLAY_ID}">

                <div id="canon-keeper-modal">

                    <button
                        id="canon-keeper-close"
                        type="button"
                        aria-label="Закрыть">
                        ×
                    </button>


                    <div id="canon-keeper-header">

                        <h2>
                            🛡️ Canon Keeper
                        </h2>

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

                alert(
                    'Не удалось сохранить канон.'
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


                // -------------------------------------------------
                // ИЗМЕНИТЬ
                // -------------------------------------------------

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


                // -------------------------------------------------
                // УДАЛИТЬ
                // -------------------------------------------------

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

                            renderRu
