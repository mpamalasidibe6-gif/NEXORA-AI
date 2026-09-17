/* =========================================================
   NEXORA AI — WORKSPACE V3
   Local frontend assistant
   ========================================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "nexora_workspace_v3";
  const DEFAULT_MODE = "chat";

  const state = {
    mode: DEFAULT_MODE,
    conversations: loadConversations(),
    currentChat: null,
    isTyping: false
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  function loadConversations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveConversations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createChat() {
    const chat = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      messages: []
    };

    state.conversations.unshift(chat);
    state.currentChat = chat;
    saveConversations();
    render();
  }

  function getCurrentChat() {
    if (state.currentChat) return state.currentChat;

    if (state.conversations.length) {
      state.currentChat = state.conversations[0];
      return state.currentChat;
    }

    createChat();
    return state.currentChat;
  }

  function addMessage(role, content) {
    const chat = getCurrentChat();

    chat.messages.push({
      role,
      content,
      time: new Date().toISOString()
    });

    if (
      role === "user" &&
      chat.title === "Nouvelle conversation"
    ) {
      chat.title =
        content.length > 32
          ? content.substring(0, 32) + "…"
          : content;
    }

    saveConversations();
  }

  function setMode(mode) {
    const allowed = ["chat", "vision", "code", "data", "create"];

    if (!allowed.includes(mode)) return;

    state.mode = mode;

    $$("[data-mode]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.mode === mode
      );
    });

    updateModeText();
  }

  function updateModeText() {
    const names = {
      chat: "Chat",
      vision: "Vision",
      code: "Code",
      data: "Data",
      create: "Create"
    };

    const modeName = names[state.mode] || "Chat";

    const elements = [
      $("#modeName"),
      $("#currentMode"),
      $(".current-mode"),
      $(".mode-name")
    ].filter(Boolean);

    elements.forEach(element => {
      element.textContent = modeName;
    });
  }

  function generateLocalResponse(message) {
    const text = message.toLowerCase();

    if (state.mode === "code") {
      if (text.includes("html")) {
        return `Voici la structure HTML de base :

<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="fr"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;NEXORA Project&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Bonjour NEXORA 👋&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

💡 Pour un vrai assistant de programmation, il faudra connecter NEXORA à un modèle IA distant.`;
      }

      return `💻 Mode Code activé.

Je peux t'aider à :
• écrire du HTML/CSS/JavaScript
• corriger du code
• expliquer une erreur
• structurer un projet
• améliorer une interface

⚠️ Cette version de NEXORA fonctionne côté navigateur et ne constitue pas encore une connexion à un véritable modèle IA.`;
    }

    if (state.mode === "vision") {
      return `👁️ Mode Vision activé.

Pour analyser réellement une image, NEXORA devra disposer d'un système d'analyse d'images connecté à un modèle compatible.

Tu peux néanmoins préparer ici ta demande d'analyse.`;
    }

    if (state.mode === "data") {
      return `📊 Mode Data activé.

Je peux t'aider à préparer :
• tableaux
• statistiques
• calculs
• graphiques
• analyse de données

Pour une analyse réellement automatique de fichiers, il faudra connecter un moteur de traitement des données.`;
    }

    if (state.mode === "create") {
      return `✨ Mode Create activé.

Tu peux préparer une idée de :
• site web
• application
• logo
• affiche
• interface
• projet créatif

Décris simplement ce que tu veux construire.`;
    }

    if (
      text.includes("bonjour") ||
      text.includes("salut") ||
      text.includes("hello")
    ) {
      return "Bonjour 👋 Je suis NEXORA. Comment puis-je t'aider ?";
    }

    if (text.includes("qui es-tu")) {
      return "Je suis NEXORA, une interface d'assistant IA conçue pour discuter, coder, analyser et créer.";
    }

    if (
      text.includes("merci") ||
      text.includes("thanks")
    ) {
      return "Avec plaisir 😎🚀";
    }

    return `J'ai bien reçu ton message :

<strong>${escapeHTML(message)}</strong>

Pour l'instant, cette interface utilise un moteur local de démonstration. Elle n'est pas encore connectée à un véritable modèle IA distant.

🚀 La prochaine étape consiste à connecter NEXORA à une API IA sécurisée.`;
  }

  function renderMessages() {
    const container =
      $("#messages") ||
      $(".messages") ||
      $("#chatMessages");

    if (!container) return;

    const chat = getCurrentChat();

    if (!chat.messages.length) {
      container.innerHTML = `
        <div class="nexora-empty">
          <div class="nexora-empty-icon">✦</div>
          <h2>Bienvenue dans NEXORA AI</h2>
          <p>Commence une conversation avec ton assistant.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = chat.messages
      .map(message => {
        const isUser = message.role === "user";

        return `
          <div class="message ${isUser ? "user" : "assistant"}">
            <div class="message-content">
              ${escapeHTML(message.content)
                .replace(/\n/g, "<br>")
                .replace(
                  /&lt;pre&gt;/g,
                  "<pre>"
                )
                .replace(
                  /&lt;\/pre&gt;/g,
                  "</pre>"
                )
                .replace(
                  /&lt;code&gt;/g,
                  "<code>"
                )
                .replace(
                  /&lt;\/code&gt;/g,
                  "</code>"
                )}
            </div>

            ${
              !isUser
                ? `<button class="copy-response" type="button">Copier</button>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    container.scrollTop = container.scrollHeight;
  }

  function renderHistory() {
    const container =
      $("#conversationList") ||
      $("#history") ||
      $(".conversation-list");

    if (!container) return;

    container.innerHTML = state.conversations
      .map(chat => `
        <button
          class="conversation-item ${
            state.currentChat?.id === chat.id ? "active" : ""
          }"
          data-chat-id="${chat.id}"
          type="button"
        >
          <span>💬</span>
          <span>${escapeHTML(chat.title)}</span>
        </button>
      `)
      .join("");
  }

  function render() {
    renderMessages();
    renderHistory();
    updateModeText();
  }

  function showTyping() {
    const container =
      $("#messages") ||
      $(".messages") ||
      $("#chatMessages");

    if (!container) return;

    const typing = document.createElement("div");
    typing.className = "message assistant typing";
    typing.id = "typingIndicator";

    typing.innerHTML = `
      <div class="message-content">
        <span>●</span>
        <span>●</span>
        <span>●</span>
      </div>
    `;

    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    $("#typingIndicator")?.remove();
  }

  function sendMessage() {
    const input =
      $("#messageInput") ||
      $("#promptInput") ||
      $("textarea");

    if (!input) return;

    const message = input.value.trim();

    if (!message || state.isTyping) return;

    addMessage("user", message);

    input.value = "";
    input.style.height = "auto";

    renderMessages();

    state.isTyping = true;
    showTyping();

    setTimeout(() => {
      hideTyping();

      const response = generateLocalResponse(message);

      addMessage("assistant", response);

      state.isTyping = false;
      renderMessages();
    }, 500);
  }

  function selectConversation(id) {
    const chat = state.conversations.find(
      item => item.id === id
    );

    if (!chat) return;

    state.currentChat = chat;
    render();
  }

  function clearCurrentChat() {
    const chat = getCurrentChat();

    chat.messages = [];
    chat.title = "Nouvelle conversation";

    saveConversations();
    render();
  }

  function deleteAllConversations() {
    state.conversations = [];
    state.currentChat = null;

    localStorage.removeItem(STORAGE_KEY);

    createChat();
  }

  function copyResponse(button) {
    const message =
      button.closest(".message")?.querySelector(".message-content");

    if (!message) return;

    const text = message.innerText;

    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        const original = button.textContent;
        button.textContent = "Copié ✓";

        setTimeout(() => {
          button.textContent = original;
        }, 1200);
      })
      .catch(() => {});
  }

  function setupEvents() {
    document.addEventListener("click", event => {
      const modeButton =
        event.target.closest("[data-mode]");

      if (modeButton) {
        setMode(modeButton.dataset.mode);
        return;
      }

      const sendButton =
        event.target.closest(
          "#sendButton, #sendBtn, .send-button, [data-send]"
        );

      if (sendButton) {
        sendMessage();
        return;
      }

      const newChatButton =
        event.target.closest(
          "#newChat, #newChatButton, [data-new-chat]"
        );

      if (newChatButton) {
        createChat();
        return;
      }

      const clearButton =
        event.target.closest(
          "#clearChat, [data-clear-chat]"
        );

      if (clearButton) {
        clearCurrentChat();
        return;
      }

      const conversation =
        event.target.closest("[data-chat-id]");

      if (conversation) {
        selectConversation(
          conversation.dataset.chatId
        );
        return;
      }

      const copyButton =
        event.target.closest(".copy-response");

      if (copyButton) {
        copyResponse(copyButton);
        return;
      }

      const homeButton =
        event.target.closest(
          "#homeButton, #backHome, [data-home]"
        );

      if (homeButton) {
        window.location.href = "index.html";
      }
    });

    document.addEventListener("keydown", event => {
      const input =
        event.target.closest(
          "#messageInput, #promptInput, textarea"
        );

      if (!input) return;

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        sendMessage();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        input.focus();
      }
    });

    document.addEventListener("input", event => {
      const input =
        event.target.closest(
          "#messageInput, #promptInput, textarea"
        );

      if (!input) return;

      input.style.height = "auto";
      input.style.height =
        Math.min(input.scrollHeight, 180) + "px";
    });
  }

  function initialize() {
    if (!state.conversations.length) {
      createChat();
    } else {
      state.currentChat = state.conversations[0];
      render();
    }

    setupEvents();
    setMode(DEFAULT_MODE);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
