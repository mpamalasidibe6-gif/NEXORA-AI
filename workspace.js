/* =========================================================
   NEXORA AI — WORKSPACE V2.1
   Persistent Conversations + Local Memory
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const promptInput = document.getElementById("promptInput");
    const sendBtn = document.getElementById("sendBtn");

    const chatArea = document.getElementById("chatArea");
    const messagesContainer =
        document.getElementById("messagesContainer");

    const welcomeScreen =
        document.getElementById("welcomeScreen");

    const newChatBtn =
        document.getElementById("newChatBtn");

    const clearBtn =
        document.getElementById("clearBtn");

    const conversationList =
        document.getElementById("conversationList");

    const backHomeBtn =
        document.getElementById("backHomeBtn");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const navItems =
        document.querySelectorAll(".nav-item");

    const suggestions =
        document.querySelectorAll(".suggestion");

    const composerTools =
        document.querySelectorAll(".composer-tool");


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY = "nexora_ai_conversations_v21";

    const ACTIVE_KEY = "nexora_ai_active_conversation_v21";


    /* =====================================================
       STATE
       ===================================================== */

    let conversations = loadConversations();

    let activeConversationId =
        localStorage.getItem(ACTIVE_KEY) || null;

    let currentMode = "chat";

    let isGenerating = false;


    /* =====================================================
       UTILITIES
       ===================================================== */

    function createId() {

        return (
            Date.now().toString(36) +
            Math.random().toString(36).substring(2, 8)
        );
    }


    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    function saveConversations() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(conversations)
        );
    }


    function loadConversations() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) return [];

            const parsed = JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.warn(
                "NEXORA: impossible de charger les conversations.",
                error
            );

            return [];
        }
    }


    function scrollToBottom() {

        setTimeout(() => {

            chatArea.scrollTo({
                top: chatArea.scrollHeight,
                behavior: "smooth"
            });

        }, 50);
    }


    /* =====================================================
       CONVERSATION CREATION
       ===================================================== */

    function createConversation(firstPrompt = "") {

        const conversation = {

            id: createId(),

            title:
                firstPrompt
                    ? generateTitle(firstPrompt)
                    : "Nouvelle conversation",

            mode: currentMode,

            createdAt: Date.now(),

            updatedAt: Date.now(),

            messages: []

        };

        conversations.unshift(conversation);

        activeConversationId =
            conversation.id;

        localStorage.setItem(
            ACTIVE_KEY,
            activeConversationId
        );

        saveConversations();

        renderConversationList();

        return conversation;
    }


    function generateTitle(text) {

        const clean =
            text
                .replace(/\s+/g, " ")
                .trim();

        if (!clean) {
            return "Nouvelle conversation";
        }

        return clean.length > 32
            ? clean.substring(0, 32) + "…"
            : clean;
    }


    function getActiveConversation() {

        return conversations.find(
            conversation =>
                conversation.id === activeConversationId
        );
    }


    /* =====================================================
       SAVE MESSAGE
       ===================================================== */

    function saveMessage(role, text, mode) {

        let conversation =
            getActiveConversation();

        if (!conversation) {

            conversation =
                createConversation(text);

        }

        conversation.messages.push({

            id: createId(),

            role,

            text,

            mode,

            timestamp: Date.now()

        });

        conversation.updatedAt =
            Date.now();

        if (
            role === "user" &&
            conversation.messages.filter(
                message => message.role === "user"
            ).length === 1
        ) {

            conversation.title =
                generateTitle(text);

        }

        saveConversations();

        renderConversationList();
    }


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    function openSidebar() {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add("active");
    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove("active");
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =====================================================
       NAVIGATION MODES
       ===================================================== */

    function setMode(mode) {

        currentMode = mode;

        navItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.mode === mode
            );

        });

        const placeholders = {

            chat:
                "Message NEXORA AI...",

            vision:
                "Décris ce que tu veux analyser avec Vision...",

            code:
                "Décris le code que tu veux créer...",

            data:
                "Décris les données que tu veux analyser...",

            create:
                "Décris ce que tu veux créer..."

        };

        promptInput.placeholder =
            placeholders[mode] ||
            placeholders.chat;

        closeSidebar();

        promptInput.focus();
    }


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                setMode(
                    item.dataset.mode
                );

            }
        );

    });


    composerTools.forEach(tool => {

        const mode = tool.dataset.mode;

        if (!mode) return;

        tool.addEventListener(
            "click",
            () => setMode(mode)
        );

    });


    /* =====================================================
       AI RESPONSE ENGINE
       ===================================================== */

    function generateResponse(prompt, mode) {

        const p =
            prompt
                .toLowerCase()
                .trim();


        if (mode === "vision") {

            return `Vision mode activé.

J'ai reçu ta demande :

"${prompt}"

Dans cette version, Vision fonctionne en simulation locale.

La prochaine évolution pourra connecter un véritable moteur d'analyse d'images.

◈ VISION ENGINE : READY`;
        }


        if (mode === "code") {

            return `Code mode activé.

Analyse de ta demande :

"${prompt}"

NEXORA peut actuellement simuler une analyse de code et proposer une architecture.

Les prochaines versions pourront intégrer un véritable moteur de génération de code.

</> CODE ENGINE : READY`;
        }


        if (mode === "data") {

            return `Data mode activé.

Demande reçue :

"${prompt}"

Je peux simuler l'analyse de données, identifier des tendances et préparer des visualisations.

📊 DATA ENGINE : READY`;
        }


        if (mode === "create") {

            return `Create mode activé.

Projet reçu :

"${prompt}"

NEXORA peut transformer cette idée en concept, interface, structure de projet ou expérience digitale.

✦ CREATIVE ENGINE : READY`;
        }


        /* CHAT */

        if (
            p.includes("bonjour") ||
            p.includes("salut") ||
            p.includes("hello") ||
            p.includes("bonsoir")
        ) {

            return `Bonjour 👋

Bienvenue dans NEXORA AI.

Je suis ton interface d'intelligence numérique.

Pose-moi une question, donne-moi une idée ou décris un projet que tu veux construire.

⚡ NEXORA CORE : ONLINE`;
        }


        if (
            p.includes("intelligence artificielle") ||
            p === "ia" ||
            p.includes(" intelligence artificielle ") ||
            p.includes("machine learning")
        ) {

            return `L'intelligence artificielle regroupe des techniques permettant à des systèmes informatiques d'effectuer certaines tâches qui nécessitent habituellement des capacités humaines.

On retrouve notamment :

• compréhension du langage
• reconnaissance d'images
• génération de contenu
• analyse de données
• apprentissage automatique

Dans NEXORA AI, nous allons progressivement transformer cette interface en véritable plateforme d'intelligence artificielle.`;
        }


        if (
            p.includes("site") ||
            p.includes("website") ||
            p.includes("web")
        ) {

            return `Très bonne idée 🚀

Pour créer un site moderne, on peut travailler avec :

• HTML — structure
• CSS — design
• JavaScript — interactions
• API — services et données
• Backend — logique serveur

NEXORA AI peut servir de laboratoire pour expérimenter chacune de ces technologies.`;
        }


        if (
            p.includes("javascript") ||
            p.includes("js")
        ) {

            return `JavaScript est le moteur d'interactivité de nombreuses applications Web.

Il peut gérer :

• boutons
• menus
• animations
• formulaires
• données dynamiques
• appels API

Et actuellement, JavaScript constitue également le moteur principal de cette interface NEXORA Workspace.`;
        }


        if (
            p.includes("html") ||
            p.includes("css")
        ) {

            return `HTML et CSS travaillent ensemble mais ont des rôles différents.

HTML définit la structure de la page.

CSS contrôle son apparence :

• couleurs
• dimensions
• positionnement
• responsive design
• animations

Dans NEXORA, les trois fichiers principaux HTML, CSS et JavaScript travaillent ensemble pour construire l'expérience.`;
        }


        return `NEXORA Core a reçu ta demande :

"${prompt}"

Analyse locale terminée.

Cette version utilise encore un moteur de démonstration local. Les conversations sont maintenant sauvegardées sur cet appareil.

⚡ STATUS : READY`;
    }


    /* =====================================================
       RENDER MESSAGE
       ===================================================== */

    function renderUserMessage(text) {

        const message =
            document.createElement("div");

        message.className =
            "message user";

        message.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    ${escapeHTML(text)}
                </div>
            </div>
        `;

        messagesContainer.appendChild(message);
    }


    function renderAIMessage(text) {

        const message =
            document.createElement("div");

        message.className =
            "message ai";

        message.innerHTML = `
            <div class="message-avatar">
                N
            </div>

            <div class="message-content">

                <div class="message-label">
                    NEXORA CORE
                </div>

                <div class="message-text">
                    ${escapeHTML(text)}
                </div>

            </div>
        `;

        messagesContainer.appendChild(message);
    }


    /* =====================================================
       LOAD CONVERSATION INTO UI
       ===================================================== */

    function loadConversation(id) {

        const conversation =
            conversations.find(
                item => item.id === id
            );

        if (!conversation) return;

        activeConversationId =
            conversation.id;

        localStorage.setItem(
            ACTIVE_KEY,
            activeConversationId
        );

        currentMode =
            conversation.mode || "chat";

        setModeWithoutFocus(currentMode);

        messagesContainer.innerHTML = "";

        if (
            !conversation.messages ||
            conversation.messages.length === 0
        ) {

            welcomeScreen.style.display =
                "flex";

        } else {

            welcomeScreen.style.display =
                "none";

            conversation.messages.forEach(
                message => {

                    if (message.role === "user") {

                        renderUserMessage(
                            message.text
                        );

                    } else {

                        renderAIMessage(
                            message.text
                        );

                    }

                }
            );

            scrollToBottom();
        }

        renderConversationList();
    }


    function setModeWithoutFocus(mode) {

        currentMode = mode;

        navItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.mode === mode
            );

        });

        const placeholders = {

            chat:
                "Message NEXORA AI...",

            vision:
                "Décris ce que tu veux analyser avec Vision...",

            code:
                "Décris le code que tu veux créer...",

            data:
                "Décris les données que tu veux analyser...",

            create:
                "Décris ce que tu veux créer..."

        };

        promptInput.placeholder =
            placeholders[mode] ||
            placeholders.chat;
    }


    /* =====================================================
       TYPING INDICATOR
       ===================================================== */

    function showTyping() {

        const typing =
            document.createElement("div");

        typing.className =
            "message ai typing-message";

        typing.innerHTML = `
            <div class="message-avatar">
                N
            </div>

            <div class="message-content">

                <div class="message-label">
                    NEXORA CORE
                </div>

                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>
        `;

        messagesContainer.appendChild(typing);

        scrollToBottom();

        return typing;
    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    async function sendMessage(customPrompt = null) {

        if (isGenerating) return;

        const prompt =
            customPrompt !== null
                ? customPrompt.trim()
                : promptInput.value.trim();

        if (!prompt) return;

        isGenerating = true;

        welcomeScreen.style.display =
            "none";

        promptInput.value = "";

        promptInput.style.height =
            "auto";

        /*
         * Create a conversation only when
         * the first message is sent.
         */

        if (!getActiveConversation()) {

            createConversation(prompt);

        }

        addUserMessageToUI(prompt);

        saveMessage(
            "user",
            prompt,
            currentMode
        );

        scrollToBottom();

        const typing =
            showTyping();

        await new Promise(resolve =>
            setTimeout(resolve, 850)
        );

        typing.remove();

        const response =
            generateResponse(
                prompt,
                currentMode
            );

        addAIMessageToUI(response);

        saveMessage(
            "assistant",
            response,
            currentMode
        );

        scrollToBottom();

        isGenerating = false;
    }


    function addUserMessageToUI(text) {

        renderUserMessage(text);
    }


    function addAIMessageToUI(text) {

        renderAIMessage(text);
    }


    /* =====================================================
       SEND BUTTON
       ===================================================== */

    sendBtn.addEventListener(
        "click",
        () => sendMessage()
    );


    /* =====================================================
       KEYBOARD
       ===================================================== */

    promptInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* =====================================================
       AUTO RESIZE
       ===================================================== */

    promptInput.addEventListener(
        "input",
        () => {

            promptInput.style.height =
                "auto";

            promptInput.style.height =
                Math.min(
                    promptInput.scrollHeight,
                    150
                ) + "px";

        }
    );


    /* =====================================================
       SUGGESTIONS
       ===================================================== */

    suggestions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const prompt =
                    button.dataset.prompt;

                sendMessage(prompt);

            }
        );

    });


    /* =====================================================
       NEW CHAT
       ===================================================== */

    function resetChat() {

        const conversation =
            createConversation();

        messagesContainer.innerHTML = "";

        welcomeScreen.style.display =
            "flex";

        promptInput.value = "";

        promptInput.style.height =
            "auto";

        setModeWithoutFocus("chat");

        renderConversationList();

        promptInput.focus();

    }


    newChatBtn.addEventListener(
        "click",
        resetChat
    );


    /* =====================================================
       CLEAR CURRENT CHAT
       ===================================================== */

    clearBtn.addEventListener(
        "click",
        () => {

            const conversation =
                getActiveConversation();

            if (!conversation) {

                resetChat();

                return;

            }

            conversation.messages = [];

            conversation.title =
                "Nouvelle conversation";

            conversation.updatedAt =
                Date.now();

            saveConversations();

            messagesContainer.innerHTML = "";

            welcomeScreen.style.display =
                "flex";

            renderConversationList();

        }
    );


    /* =====================================================
       DELETE CONVERSATION
       ===================================================== */

    function deleteConversation(id) {

        conversations =
            conversations.filter(
                conversation =>
                    conversation.id !== id
            );

        if (activeConversationId === id) {

            activeConversationId = null;

            localStorage.removeItem(
                ACTIVE_KEY
            );

            messagesContainer.innerHTML = "";

            welcomeScreen.style.display =
                "flex";

            setModeWithoutFocus("chat");
        }

        saveConversations();

        renderConversationList();
    }


    /* =====================================================
       RENAME CONVERSATION
       ===================================================== */

    function renameConversation(id) {

        const conversation =
            conversations.find(
                item => item.id === id
            );

        if (!conversation) return;

        const newTitle =
            window.prompt(
                "Nouveau nom de la conversation :",
                conversation.title
            );

        if (
            newTitle === null ||
            !newTitle.trim()
        ) {

            return;
        }

        conversation.title =
            newTitle
                .trim()
                .substring(0, 50);

        conversation.updatedAt =
            Date.now();

        saveConversations();

        renderConversationList();
    }


    /* =====================================================
       CONVERSATION LIST
       ===================================================== */

    function renderConversationList() {

        conversationList.innerHTML = "";

        if (conversations.length === 0) {

            const empty =
                document.createElement("div");

            empty.style.padding =
                "10px";

            empty.style.color =
                "var(--muted-2)";

            empty.style.fontSize =
                "10px";

            empty.textContent =
                "Aucune conversation";

            conversationList.appendChild(
                empty
            );

            return;
        }


        conversations.forEach(
            conversation => {

                const wrapper =
                    document.createElement("div");

                wrapper.style.display =
                    "flex";

                wrapper.style.alignItems =
                    "center";

                wrapper.style.gap =
                    "3px";


                const button =
                    document.createElement("button");

                button.className =
                    "conversation";

                if (
                    conversation.id ===
                    activeConversationId
                ) {

                    button.classList.add(
                        "active"
                    );

                }

                button.style.flex = "1";

                button.innerHTML = `
                    <span>◉</span>
                    <span>
                        ${escapeHTML(
                            conversation.title
                        )}
                    </span>
                `;

                button.addEventListener(
                    "click",
                    () => {

                        loadConversation(
                            conversation.id
                        );

                    }
                );


                const menu =
                    document.createElement("button");

                menu.type = "button";

                menu.textContent = "⋯";

                menu.title =
                    "Options";

                menu.style.width =
                    "27px";

                menu.style.height =
                    "27px";

                menu.style.flexShrink =
                    "0";

                menu.style.border =
                    "0";

                menu.style.borderRadius =
                    "7px";

                menu.style.color =
                    "var(--muted)";

                menu.style.background =
                    "transparent";

                menu.style.cursor =
                    "pointer";

                menu.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        showConversationMenu(
                            conversation.id
                        );

                    }
                );


                wrapper.appendChild(button);

                wrapper.appendChild(menu);

                conversationList.appendChild(
                    wrapper
                );

            }
        );
    }


    /* =====================================================
       CONVERSATION MENU
       ===================================================== */

    function showConversationMenu(id) {

        const action =
            window.prompt(
                "Tape R pour renommer ou S pour supprimer :",
                "R"
            );

        if (!action) return;

        const value =
            action.trim().toLowerCase();

        if (value === "r") {

            renameConversation(id);

        } else if (value === "s") {

            const confirmed =
                window.confirm(
                    "Supprimer cette conversation ?"
                );

            if (confirmed) {

                deleteConversation(id);

            }

        }

    }


    /* =====================================================
       BACK HOME
       ===================================================== */

    backHomeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "../index.html";

        }
    );


    /* =====================================================
       ATTACH BUTTON
       ===================================================== */

    const attachBtn =
        document.getElementById(
            "attachBtn"
        );

    if (attachBtn) {

        attachBtn.addEventListener(
            "click",
            () => {

                const message =
                    "📎 Le système de fichiers sera disponible dans une prochaine version de NEXORA Workspace.";

                if (!getActiveConversation()) {

                    createConversation(
                        "Fichiers"
                    );

                }

                addAIMessageToUI(message);

                saveMessage(
                    "assistant",
                    message,
                    currentMode
                );

                scrollToBottom();

            }
        );

    }


    /* =====================================================
       ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    renderConversationList();


    /*
     * Restore previous conversation
     * after refreshing the page.
     */

    if (activeConversationId) {

        const exists =
            conversations.some(
                conversation =>
                    conversation.id ===
                    activeConversationId
            );

        if (exists) {

            loadConversation(
                activeConversationId
            );

        } else {

            activeConversationId = null;

            localStorage.removeItem(
                ACTIVE_KEY
            );

        }

    }


    console.log(
        "%c NEXORA AI — WORKSPACE V2.1 ",
        "color:#00e5ff;font-weight:bold;"
    );

    console.log(
        "Persistent local memory initialized."
    );

});