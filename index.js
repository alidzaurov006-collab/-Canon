jQuery(function () {

    /* =====================================================
       CANON KEEPER
       ===================================================== */

    const STORAGE_KEY = 'canon_keeper_rules';

    /* ---------- Данные ---------- */

    function loadRules() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            console.error('[Canon Keeper] Ошибка загрузки:', e);
            return [];
        }
    }

    function saveRules(rules) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    }

    /* ---------- Кнопка в меню Tavern ---------- */

    if ($('#canon-keeper-button').length === 0) {

        const buttonHtml = `
            <div id="canon-keeper-button"
                 class="list-group-item flex-container flexGap5">
                <div class="fa-solid fa-book extensionsMenuExtensionButton"></div>
                Canon Keeper
            </div>
        `;

        $('#extensionsMenu').prepend(buttonHtml);
    }

    /* ---------- Стили окна ---------- */

    function applyKeeperStyles() {

        $('#canon-keeper-modal').css({
            'position': 'fixed',
            'top': '180px',
            'left': '50%',
            'transform': 'translateX(-50%)',
            'width': 'calc(100vw - 32px)',
            'max-width': '760px',
            'max-height': 'calc(100vh - 205px)',
            'overflow-y': 'auto',
            'overflow-x': 'hidden',
            'z-index': '2147483647',
            'box-sizing': 'border-box'
        });

        $('#canon-keeper-modal, #canon-keeper-modal *').css(
            'box-sizing',
            'border-box'
        );
    }

    /* ---------- Закрываем меню Tavern ---------- */

    function closeTavernMenu() {

        /*
         * Важно:
         * не удаляем меню и не ломаем его.
         * Просто убираем его визуально перед открытием
         * Canon Keeper.
         */

        const menu = $('#extensionsMenu');

        if (menu.length) {
            menu.removeClass('open');
            menu.removeClass('show');
            menu.attr('aria-hidden', 'true');
        }

        /*
         * Убираем возможные открытые dropdown/popover.
         */
        $('.dropdown-menu.show').not('#canon-keeper-modal').removeClass('show');
    }

    /* ---------- Создание окна ---------- */

    function createModal() {

        if ($('#canon-keeper-modal').length) {
            return;
        }

        const modalHtml = `
            <div id="canon-keeper-modal">

                <div style="
                    background:#171717;
                    color:#eeeeee;
                    border:1px solid #333;
                    border-radius:22px;
                    padding:30px 28px;
                    box-shadow:0 12px 50px rgba(0,0,0,.75);
                    position:relative;
                ">

                    <button id="canon-keeper-close"
                        style="
                            position:absolute;
                            right:12px;
                            top:12px;
                            width:42px;
                            height:42px;
                            border:0;
                            border-radius:50%;
                            background:#eeeeee;
                            color:#111;
                            font-size:26px;
                            font-weight:bold;
                            cursor:pointer;
                            z-index:10;
                        ">
                        ×
                    </button>

                    <div style="
                        text-align:center;
                        font-size:38px;
                        font-weight:bold;
                        margin:5px 40px 12px;
                    ">
                        🛡️ Canon Keeper
                    </div>

                    <div style="
                        text-align:center;
                        font-size:25px;
                        margin-bottom:25px;
                        color:#dddddd;
                    ">
                        Хранитель канона
                    </div>

                    <hr style="
                        border:0;
                        border-top:1px solid #333;
                        margin:0 0 25px;
                    ">

                    <div style="
                        text-align:center;
                        font-size:30px;
                        font-weight:bold;
                        margin-bottom:20px;
                    ">
                        📜 Канон
                    </div>

                    <textarea
                        id="canon-keeper-input"
                        placeholder="Напиши правило канона..."
                        style="
                            display:block;
                            width:100%;
                            min-height:170px;
                            resize:vertical;
                            padding:18px;
                            border-radius:12px;
                            border:2px solid #444;
                            background:#0d0d0d;
                            color:#eeeeee;
                            font-size:22px;
                            line-height:1.4;
                            outline:none;
                        "
                    ></textarea>

                    <button id="canon-keeper-add"
                        style="
                            display:block;
                            width:100%;
                            margin-top:18px;
                            padding:16px;
                            border-radius:12px;
                            border:2px solid #444;
                            background:#222;
                            color:#eeeeee;
                            font-size:24px;
                            cursor:pointer;
                        ">
                        ➕ Добавить правило
                    </button>

                    <div id="canon-keeper-rules"
                         style="margin-top:25px;">
                    </div>

                    <button id="canon-keeper-copy"
                        style="
                            display:block;
                            width:100%;
                            margin-top:25px;
                            padding:17px;
                            border-radius:12px;
                            border:2px solid #444;
                            background:#222;
                            color:#eeeeee;
                            font-size:24px;
                            cursor:pointer;
                        ">
                        📋 Скопировать весь канон
                    </button>

                </div>

            </div>
        `;

        /*
         * Ключевой момент:
         * окно добавляем непосредственно в BODY,
         * а не внутрь extensionsMenu.
         */
        $('body').append(modalHtml);

        applyKeeperStyles();

        renderRules();
    }

    /* ---------- Отображение правил ---------- */

    function renderRules() {

        const container = $('#canon-keeper-rules');

        if (!container.length) {
            return;
        }

        const rules = loadRules();

        container.empty();

        rules.forEach(function (rule, index) {

            const ruleHtml = `
                <div class="canon-rule"
                     data-index="${index}"
                     style="
                        background:#242424;
                        border:2px solid #444;
                        border-radius:14px;
                        padding:20px;
                        margin-bottom:15px;
                     ">

                    <div style="
                        font-size:23px;
                        line-height:1.45;
                        white-space:pre-wrap;
                        word-break:break-word;
                    ">
                        ${escapeHtml(rule)}
                    </div>

                    <div style="
                        display:flex;
                        gap:12px;
                        margin-top:18px;
                    ">

                        <button class="canon-edit"
                            data-index="${index}"
                            style="
                                flex:1;
                                padding:14px 8px;
                                border-radius:10px;
                                border:2px solid #555;
                                background:#333;
                                color:#eee;
                                font-size:20px;
                            ">
                            ✏️ Изменить
                        </button>

                        <button class="canon-delete"
                            data-index="${index}"
                            style="
                                flex:1;
                                padding:14px 8px;
                                border-radius:10px;
                                border:2px solid #555;
                                background:#333;
                                color:#eee;
                                font-size:20px;
                            ">
                            🗑️ Удалить
                        </button>

                    </div>

                </div>
            `;

            container.append(ruleHtml);
        });
    }

    /* ---------- Защита от HTML ---------- */

    function escapeHtml(text) {

        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* ---------- Открытие ---------- */

    $(document).off('click.canonKeeper', '#canon-keeper-button');

    $(document).on(
        'click.canonKeeper',
        '#canon-keeper-button',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            closeTavernMenu();

            createModal();

            /*
             * Переносим окно в самый конец BODY.
             * Это дополнительно защищает его от меню Tavern.
             */
            const modal = document.getElementById('canon-keeper-modal');

            if (modal && modal.parentElement !== document.body) {
                document.body.appendChild(modal);
            }

            applyKeeperStyles();

            $('#canon-keeper-modal').show();
        }
    );

    /* ---------- Закрытие ---------- */

    $(document).off('click.canonKeeperClose', '#canon-keeper-close');

    $(document).on(
        'click.canonKeeperClose',
        '#canon-keeper-close',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            $('#canon-keeper-modal').hide();
        }
    );

    /* ---------- Добавить правило ---------- */

    $(document).off('click.canonKeeperAdd', '#canon-keeper-add');

    $(document).on(
        'click.canonKeeperAdd',
        '#canon-keeper-add',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            const input = $('#canon-keeper-input');
            const text = input.val().trim();

            if (!text) {
                return;
            }

            const rules = loadRules();

            rules.push(text);

            saveRules(rules);

            input.val('');

            renderRules();
        }
    );

    /* ---------- Удалить ---------- */

    $(document).off('click.canonKeeperDelete', '.canon-delete');

    $(document).on(
        'click.canonKeeperDelete',
        '.canon-delete',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            const index = Number($(this).data('index'));

            const rules = loadRules();

            rules.splice(index, 1);

            saveRules(rules);

            renderRules();
        }
    );

    /* ---------- Изменить ---------- */

    $(document).off('click.canonKeeperEdit', '.canon-edit');

    $(document).on(
        'click.canonKeeperEdit',
        '.canon-edit',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            const index = Number($(this).data('index'));

            const rules = loadRules();

            if (rules[index] === undefined) {
                return;
            }

            $('#canon-keeper-input').val(rules[index]);

            rules.splice(index, 1);

            saveRules(rules);

            renderRules();

            $('#canon-keeper-input').focus();
        }
    );

    /* ---------- Копировать весь канон ---------- */

    $(document).off('click.canonKeeperCopy', '#canon-keeper-copy');

    $(document).on(
        'click.canonKeeperCopy',
        '#canon-keeper-copy',
        async function (event) {

            event.preventDefault();
            event.stopPropagation();

            const rules = loadRules();

            if (!rules.length) {
                return;
            }

            const canonText = rules
                .map(function (rule, index) {
                    return (index + 1) + '. ' + rule;
                })
                .join('\n\n');

            try {

                await navigator.clipboard.writeText(canonText);

                alert('Канон скопирован!');

            } catch (error) {

                /*
                 * Запасной вариант для браузеров,
                 * где navigator.clipboard недоступен.
                 */
                const temp = $('<textarea>');

                temp.val(canonText);

                $('body').append(temp);

                temp[0].select();

                document.execCommand('copy');

                temp.remove();

                alert('Канон скопирован!');
            }
        }
    );

    console.log('[Canon Keeper] loaded successfully');

});
// =========================================================
// ПЛАВАЮЩИЙ ВИДЖЕТ CANON KEEPER
// Одно нажатие = открыть Canon Keeper
// Долгое нажатие / движение = переместить виджет
// =========================================================

if ($('#canon-keeper-floating-widget').length === 0) {

    // -----------------------------------------------------
    // CSS
    // -----------------------------------------------------

    if ($('#canon-keeper-floating-style').length === 0) {

        $('head').append(`
            <style id="canon-keeper-floating-style">

                #canon-keeper-floating-widget {

                    position: fixed;

                    width: 58px;
                    height: 58px;

                    right: 18px;
                    bottom: 100px;

                    z-index: 999998;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    background: #242424;

                    border: 2px solid #666;

                    box-shadow:
                        0 5px 18px rgba(0,0,0,0.6);

                    color: #eeeeee;

                    font-size: 28px;

                    cursor: grab;

                    user-select: none;
                    -webkit-user-select: none;

                    touch-action: none;

                    -webkit-tap-highlight-color: transparent;

                    transition:
                        transform 0.12s ease,
                        box-shadow 0.12s ease;
                }


                #canon-keeper-floating-widget.canon-dragging {

                    cursor: grabbing;

                    transform: scale(1.08);

                    box-shadow:
                        0 8px 25px rgba(0,0,0,0.75);
                }

            </style>
        `);
    }


    // -----------------------------------------------------
    // Создаём виджет
    // -----------------------------------------------------

    const canonFloatingWidget = $(`
        <div
            id="canon-keeper-floating-widget"
            title="Canon Keeper">

            📖

        </div>
    `);


    $('body').append(canonFloatingWidget);


    // -----------------------------------------------------
    // Восстанавливаем сохранённую позицию
    // -----------------------------------------------------

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    'canonKeeperWidgetPosition'
                ) || 'null'
            );


        if (
            saved &&
            typeof saved.left === 'number' &&
            typeof saved.top === 'number'
        ) {

            canonFloatingWidget.css({

                left: saved.left + 'px',
                top: saved.top + 'px',

                right: 'auto',
                bottom: 'auto'

            });

        }

    } catch (error) {

        console.log(
            '[Canon Keeper] Не удалось восстановить позицию виджета'
        );

    }


    // -----------------------------------------------------
    // Переменные управления
    // -----------------------------------------------------

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;

    let dragging = false;

    let moved = false;

    let pressTimer = null;

    let pointerId = null;


    // -----------------------------------------------------
    // НАЖАТИЕ
    // -----------------------------------------------------

    canonFloatingWidget.on(
        'pointerdown',
        function (event) {

            event.preventDefault();

            pointerId = event.pointerId;


            const rect =
                this.getBoundingClientRect();


            startX =
                event.clientX;

            startY =
                event.clientY;


            startLeft =
                rect.left;

            startTop =
                rect.top;


            dragging = false;
            moved = false;


            try {

                this.setPointerCapture(
                    event.pointerId
                );

            } catch (e) {}


            // Через 400 мс считаем нажатие долгим

            pressTimer =
                setTimeout(function () {

                    dragging = true;

                    canonFloatingWidget.addClass(
                        'canon-dragging'
                    );

                }, 400);

        }
    );


    // -----------------------------------------------------
    // ДВИЖЕНИЕ
    // -----------------------------------------------------

    canonFloatingWidget.on(
        'pointermove',
        function (event) {

            if (
                pointerId !== event.pointerId
            ) {
                return;
            }


            const deltaX =
                event.clientX - startX;

            const deltaY =
                event.clientY - startY;


            // Небольшое движение игнорируем

            if (
                Math.abs(deltaX) > 8 ||
                Math.abs(deltaY) > 8
            ) {

                moved = true;

                dragging = true;

                clearTimeout(
                    pressTimer
                );

                canonFloatingWidget.addClass(
                    'canon-dragging'
                );

            }


            if (!dragging) {
                return;
            }


            const width =
                canonFloatingWidget.outerWidth();


            const height =
                canonFloatingWidget.outerHeight();


            let newLeft =
                startLeft + deltaX;


            let newTop =
                startTop + deltaY;


            // -------------------------------------------------
            // Ограничения экрана
            // -------------------------------------------------

            const minLeft = 0;

            const maxLeft =
                window.innerWidth - width;


            /*
             * Не позволяем виджету залезать
             * на самый верхний системный / интерфейсный участок.
             */

            const minTop = 70;


            /*
             * Оставляем немного места
             * над нижней панелью приложения.
             */

            const maxTop =
                window.innerHeight - height - 70;


            newLeft =
                Math.max(
                    minLeft,
                    Math.min(
                        newLeft,
                        maxLeft
                    )
                );


            newTop =
                Math.max(
                    minTop,
                    Math.min(
                        newTop,
                        maxTop
                    )
                );


            canonFloatingWidget.css({

                left: newLeft + 'px',
                top: newTop + 'px',

                right: 'auto',
                bottom: 'auto'

            });

        }
    );


    // -----------------------------------------------------
    // ОТПУСКАНИЕ
    // -----------------------------------------------------

    canonFloatingWidget.on(
        'pointerup pointercancel',
        function (event) {

            clearTimeout(
                pressTimer
            );


            const wasDragging =
                dragging;


            // ---------------------------------------------
            // Если двигали — сохраняем положение
            // ---------------------------------------------

            if (wasDragging) {

                const rect =
                    this.getBoundingClientRect();


                try {

                    localStorage.setItem(
                        'canonKeeperWidgetPosition',

                        JSON.stringify({

                            left: rect.left,
                            top: rect.top

                        })
                    );

                } catch (error) {

                    console.log(
                        '[Canon Keeper] Не удалось сохранить позицию'
                    );

                }


                canonFloatingWidget.removeClass(
                    'canon-dragging'
                );

            }


            // ---------------------------------------------
            // Если не двигали — это обычный тап
            // ---------------------------------------------

            if (!wasDragging && !moved) {

                openCanonKeeper();

            }


            dragging = false;
            moved = false;
            pointerId = null;

        }
    );


    // -----------------------------------------------------
    // Поиск существующей кнопки Canon Keeper
    // -----------------------------------------------------

    function openCanonKeeper() {

        let found = false;


        /*
         * Ищем уже существующий элемент Canon Keeper.
         * Саму рабочую систему не заменяем.
         */

        $('button, a, div, span').each(
            function () {

                if (found) {
                    return;
                }


                const text =
                    $(this)
                        .clone()
                        .children()
                        .remove()
                        .end()
                        .text()
                        .trim();


                if (
                    text === 'Canon Keeper'
                ) {

                    found = true;

                    $(this).trigger('click');

                }

            }
        );


        /*
         * Если текстовый элемент не найден,
         * пробуем найти элемент по ID / классу.
         */

        if (!found) {

            const selectors = [

                '#canon-keeper',
                '#canonKeeper',
                '.canon-keeper',
                '[data-canon-keeper]'

            ];


            for (
                let i = 0;
                i < selectors.length;
                i++
            ) {

                const target =
                    $(selectors[i]);


                if (target.length) {

                    found = true;

                    target.first().trigger('click');

                    break;

                }

            }

        }


        if (!found) {

            console.log(
                '[Canon Keeper] Кнопка Canon Keeper не найдена'
            );

        }

    }


    // -----------------------------------------------------
    // Если экран изменил размер —
    // возвращаем виджет в пределы экрана
    // -----------------------------------------------------

    $(window).on(
        'resize.canonKeeperWidget',
        function () {

            const rect =
                canonFloatingWidget[0]
                    .getBoundingClientRect();


            const width =
                canonFloatingWidget.outerWidth();


            const height =
                canonFloatingWidget.outerHeight();


            let left =
                Math.max(
                    0,
                    Math.min(
                        rect.left,
                        window.innerWidth - width
                    )
                );


            let top =
                Math.max(
                    70,
                    Math.min(
                        rect.top,
                        window.innerHeight - height - 70
                    )
                );


            canonFloatingWidget.css({

                left: left + 'px',
                top: top + 'px',

                right: 'auto',
                bottom: 'auto'

            });

        }
    );


    console.log(
        '[Canon Keeper] Плавающий виджет создан'
    );

                }
// =========================================================
// CANON STORE
// Центральное хранилище Canon Keeper
// =========================================================

(function () {

    const CANON_STORE_KEY = 'canonKeeperStore';


    // -----------------------------------------------------
    // Создание новой структуры канона
    // -----------------------------------------------------

    function createEmptyCanon() {

        return {

            version: 1,

            world: {

                name: '',
                source: '',
                era: '',
                description: ''

            },


            characters: [],


            relationships: [],


            locations: [],


            events: [],


            timeline: [],


            rules: []

        };

    }


    // -----------------------------------------------------
    // Загрузка канона
    // -----------------------------------------------------

    function loadCanon() {

        try {

            const saved =
                localStorage.getItem(
                    CANON_STORE_KEY
                );


            if (!saved) {

                const newCanon =
                    createEmptyCanon();


                migrateOldRules(newCanon);


                saveCanon(newCanon);


                return newCanon;

            }


            const parsed =
                JSON.parse(saved);


            if (
                !parsed ||
                typeof parsed !== 'object'
            ) {

                throw new Error(
                    'Некорректная структура Canon Store'
                );

            }


            const canon =
                createEmptyCanon();


            /*
             * Объединяем сохранённые данные
             * с новой структурой.
             */

            canon.version =
                parsed.version || 1;


            canon.world =
                Object.assign(
                    canon.world,
                    parsed.world || {}
                );


            canon.characters =
                Array.isArray(
                    parsed.characters
                )
                    ? parsed.characters
                    : [];


            canon.relationships =
                Array.isArray(
                    parsed.relationships
                )
                    ? parsed.relationships
                    : [];


            canon.locations =
                Array.isArray(
                    parsed.locations
                )
                    ? parsed.locations
                    : [];


            canon.events =
                Array.isArray(
                    parsed.events
                )
                    ? parsed.events
                    : [];


            canon.timeline =
                Array.isArray(
                    parsed.timeline
                )
                    ? parsed.timeline
                    : [];


            canon.rules =
                Array.isArray(
                    parsed.rules
                )
                    ? parsed.rules
                    : [];


            return canon;

        } catch (error) {

            console.error(
                '[Canon Store] Ошибка загрузки:',
                error
            );


            return createEmptyCanon();

        }

    }


    // -----------------------------------------------------
    // Сохранение канона
    // -----------------------------------------------------

    function saveCanon(canon) {

        try {

            localStorage.setItem(
                CANON_STORE_KEY,
                JSON.stringify(canon)
            );


            return true;

        } catch (error) {

            console.error(
                '[Canon Store] Ошибка сохранения:',
                error
            );


            return false;

        }

    }


    // -----------------------------------------------------
    // Перенос старых правил
    // -----------------------------------------------------

    function migrateOldRules(canon) {

        try {

            const oldRules =
                localStorage.getItem(
                    'canonKeeperRules'
                );


            if (!oldRules) {
                return;
            }


            const parsed =
                JSON.parse(oldRules);


            if (
                !Array.isArray(parsed) ||
                parsed.length === 0
            ) {
                return;
            }


            canon.rules =
                parsed.map(function (rule) {

                    return {

                        id:
                            createId('rule'),

                        text:
                            String(rule),

                        source:
                            'manual',

                        createdAt:
                            Date.now(),

                        updatedAt:
                            Date.now()

                    };

                });


            console.log(
                '[Canon Store] Старые правила перенесены:',
                canon.rules.length
            );


        } catch (error) {

            console.error(
                '[Canon Store] Ошибка переноса старых правил:',
                error
            );

        }

    }


    // -----------------------------------------------------
    // Генератор ID
    // -----------------------------------------------------

    function createId(prefix) {

        return (
            prefix +
            '_' +
            Date.now() +
            '_' +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );

    }


    // -----------------------------------------------------
    // Получить весь канон
    // -----------------------------------------------------

    function getCanon() {

        return loadCanon();

    }


    // -----------------------------------------------------
    // Обновить весь канон
    // -----------------------------------------------------

    function setCanon(canon) {

        return saveCanon(canon);

    }


    // -----------------------------------------------------
    // Добавить правило
    // -----------------------------------------------------

    function addRule(text, options = {}) {

        if (
            !text ||
            !String(text).trim()
        ) {

            return null;

        }


        const canon =
            loadCanon();


        const now =
            Date.now();


        const rule = {

            id:
                createId('rule'),

            text:
                String(text).trim(),

            source:
                options.source || 'manual',

            createdAt:
                now,

            updatedAt:
                now

        };


        canon.rules.push(rule);


        saveCanon(canon);


        return rule;

    }


    // -----------------------------------------------------
    // Удалить правило
    // -----------------------------------------------------

    function removeRule(id) {

        const canon =
            loadCanon();


        const oldLength =
            canon.rules.length;


        canon.rules =
            canon.rules.filter(
                function (rule) {

                    return rule.id !== id;

                }
            );


        if (
            canon.rules.length === oldLength
        ) {

            return false;

        }


        saveCanon(canon);


        return true;

    }


    // -----------------------------------------------------
    // Изменить правило
    // -----------------------------------------------------

    function updateRule(id, text) {

        if (
            !text ||
            !String(text).trim()
        ) {

            return false;

        }


        const canon =
            loadCanon();


        const rule =
            canon.rules.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!rule) {

            return false;

        }


        rule.text =
            String(text).trim();


        rule.updatedAt =
            Date.now();


        saveCanon(canon);


        return true;

    }


    // -----------------------------------------------------
    // Добавить персонажа
    // -----------------------------------------------------

    function addCharacter(data = {}) {

        const canon =
            loadCanon();


        const character = {

            id:
                data.id ||
                createId('character'),

            name:
                data.name || '',

            personality:
                Array.isArray(
                    data.personality
                )
                    ? data.personality
                    : [],

            biography:
                data.biography || '',

            knowledge:
                Array.isArray(
                    data.knowledge
                )
                    ? data.knowledge
                    : [],

            currentState:
                data.currentState || '',

            notes:
                data.notes || '',

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        canon.characters.push(
            character
        );


        saveCanon(canon);


        return character;

    }


    // -----------------------------------------------------
    // Добавить отношение
    // -----------------------------------------------------

    function addRelationship(data = {}) {

        const canon =
            loadCanon();


        const relationship = {

            id:
                data.id ||
                createId('relationship'),

            from:
                data.from || '',

            to:
                data.to || '',

            type:
                data.type || '',

            attitude:
                data.attitude || '',

            notes:
                data.notes || '',

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        canon.relationships.push(
            relationship
        );


        saveCanon(canon);


        return relationship;

    }


    // -----------------------------------------------------
    // Добавить локацию
    // -----------------------------------------------------

    function addLocation(data = {}) {

        const canon =
            loadCanon();


        const location = {

            id:
                data.id ||
                createId('location'),

            name:
                data.name || '',

            description:
                data.description || '',

            notes:
                data.notes || '',

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        canon.locations.push(
            location
        );


        saveCanon(canon);


        return location;

    }


    // -----------------------------------------------------
    // Добавить событие
    // -----------------------------------------------------

    function addEvent(data = {}) {

        const canon =
            loadCanon();


        const event = {

            id:
                data.id ||
                createId('event'),

            title:
                data.title || '',

            description:
                data.description || '',

            status:
                data.status || 'future',

            order:
                typeof data.order === 'number'
                    ? data.order
                    : canon.events.length,

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        canon.events.push(
            event
        );


        saveCanon(canon);


        return event;

    }


    // -----------------------------------------------------
    // Добавить событие в хронологию
    // -----------------------------------------------------

    function addTimelineEntry(data = {}) {

        const canon =
            loadCanon();


        const entry = {

            id:
                data.id ||
                createId('timeline'),

            title:
                data.title || '',

            description:
                data.description || '',

            order:
                typeof data.order === 'number'
                    ? data.order
                    : canon.timeline.length,

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        canon.timeline.push(
            entry
        );


        saveCanon(canon);


        return entry;

    }


    // -----------------------------------------------------
    // Очистить всё хранилище
    // -----------------------------------------------------

    function resetCanon() {

        const emptyCanon =
            createEmptyCanon();


        saveCanon(emptyCanon);


        return emptyCanon;

    }


    // -----------------------------------------------------
    // Экспортируем Canon Store
    // -----------------------------------------------------

    window.CanonStore = {

        getCanon:
            getCanon,

        setCanon:
            setCanon,

        saveCanon:
            saveCanon,

        createId:
            createId,

        addRule:
            addRule,

        removeRule:
            removeRule,

        updateRule:
            updateRule,

        addCharacter:
            addCharacter,

        addRelationship:
            addRelationship,

        addLocation:
            addLocation,

        addEvent:
            addEvent,

        addTimelineEntry:
            addTimelineEntry,

        resetCanon:
            resetCanon

    };


    // -----------------------------------------------------
    // Инициализация
    // -----------------------------------------------------

    const initialCanon =
        loadCanon();


    console.log(
        '[Canon Store] готов',
        initialCanon
    );


})();
// =========================================================
// CANON KEEPER — CHARACTER STORE
// Первый модуль памяти персонажей
// =========================================================

(function () {

    'use strict';

    const CHARACTER_STORE_KEY =
        'canonKeeperCharacters';


    // -----------------------------------------------------
    // Загрузка персонажей
    // -----------------------------------------------------

    function loadCharacters() {

        try {

            const saved =
                localStorage.getItem(
                    CHARACTER_STORE_KEY
                );

            if (!saved) {
                return [];
            }

            const characters =
                JSON.parse(saved);

            if (!Array.isArray(characters)) {
                return [];
            }

            return characters;

        } catch (error) {

            console.error(
                '[Canon Store] Ошибка загрузки персонажей:',
                error
            );

            return [];

        }

    }


    // -----------------------------------------------------
    // Сохранение персонажей
    // -----------------------------------------------------

    function saveCharacters(characters) {

        try {

            localStorage.setItem(
                CHARACTER_STORE_KEY,
                JSON.stringify(characters)
            );

            return true;

        } catch (error) {

            console.error(
                '[Canon Store] Ошибка сохранения персонажей:',
                error
            );

            return false;

        }

    }


    // -----------------------------------------------------
    // Создание ID
    // -----------------------------------------------------

    function createCharacterId() {

        return (
            'character_' +
            Date.now() +
            '_' +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );

    }


    // -----------------------------------------------------
    // Добавление персонажа
    // -----------------------------------------------------

    function addCharacter(data) {

        if (!data || !data.name) {

            console.warn(
                '[Canon Store] Нельзя добавить персонажа без имени'
            );

            return null;

        }


        const characters =
            loadCharacters();


        const character = {

            id:
                data.id ||
                createCharacterId(),

            name:
                String(data.name).trim(),

            aliases:
                Array.isArray(data.aliases)
                    ? data.aliases
                    : [],

            personality:
                Array.isArray(data.personality)
                    ? data.personality
                    : [],

            biography:
                data.biography || '',

            knowledge:
                Array.isArray(data.knowledge)
                    ? data.knowledge
                    : [],

            currentState:
                data.currentState || '',

            notes:
                data.notes || '',

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        characters.push(character);


        saveCharacters(characters);


        console.log(
            '[Canon Store] Персонаж добавлен:',
            character.name
        );


        return character;

    }


    // -----------------------------------------------------
    // Получить всех персонажей
    // -----------------------------------------------------

    function getCharacters() {

        return loadCharacters();

    }


    // -----------------------------------------------------
    // Найти персонажа по имени
    // -----------------------------------------------------

    function findCharacter(name) {

        if (!name) {
            return null;
        }


        const searchName =
            String(name)
                .trim()
                .toLowerCase();


        const characters =
            loadCharacters();


        return characters.find(
            function (character) {

                if (
                    String(character.name)
                        .trim()
                        .toLowerCase() === searchName
                ) {

                    return true;

                }


                if (
                    Array.isArray(
                        character.aliases
                    )
                ) {

                    return character.aliases.some(
                        function (alias) {

                            return String(alias)
                                .trim()
                                .toLowerCase() === searchName;

                        }
                    );

                }


                return false;

            }
        ) || null;

    }


    // -----------------------------------------------------
    // Удаление персонажа
    // -----------------------------------------------------

    function removeCharacter(id) {

        const characters =
            loadCharacters();


        const filtered =
            characters.filter(
                function (character) {

                    return character.id !== id;

                }
            );


        if (
            filtered.length ===
            characters.length
        ) {

            return false;

        }


        saveCharacters(filtered);


        return true;

    }


    // -----------------------------------------------------
    // Публичный API
    // -----------------------------------------------------

    window.CanonCharacterStore = {

        addCharacter:
            addCharacter,

        getCharacters:
            getCharacters,

        findCharacter:
            findCharacter,

        removeCharacter:
            removeCharacter,

        saveCharacters:
            saveCharacters

    };


    // -----------------------------------------------------
    // Проверка загрузки
    // -----------------------------------------------------

    const characters =
        loadCharacters();


    console.log(
        '[Canon Store] персонажи: готово',
        'Количество:',
        characters.length
    );


})();
// =========================================================
// CANON KEEPER — ПЕРВЫЙ ТЕСТ ЯДРА
// Читаем текущий чат SillyTavern, ничего не изменяя
// =========================================================

(function () {

    console.log('[Canon Keeper] Test core started');

    function getChatMessages() {

        const messages = document.querySelectorAll(
            '#chat .mes'
        );

        return Array.from(messages).map(function (message) {

            const textElement =
                message.querySelector('.mes_text');

            const nameElement =
                message.querySelector('.ch_name');

            return {

                name:
                    nameElement
                        ? nameElement.innerText.trim()
                        : 'Unknown',

                text:
                    textElement
                        ? textElement.innerText.trim()
                        : ''

            };

        }).filter(function (message) {

            return message.text.length > 0;

        });

    }


    // Делаем функцию доступной для дальнейшего ядра
    window.CanonKeeper = window.CanonKeeper || {};

    window.CanonKeeper.getCurrentChat =
        getChatMessages;


    // Тест через 2 секунды после загрузки
    setTimeout(function () {

        const messages =
            getChatMessages();

        console.log(
            '[Canon Keeper] Найдено сообщений:',
            messages.length
        );

        if (messages.length > 0) {

            console.log(
                '[Canon Keeper] Последнее сообщение:',
                messages[messages.length - 1]
            );

        }

    }, 2000);


})();
