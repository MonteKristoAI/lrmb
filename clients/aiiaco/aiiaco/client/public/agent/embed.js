/**
 * AiiACo Voice Agent - Embeddable Widget
 *
 * Usage:
 *   <script src="https://aiiaco.com/agent/embed.js" data-token="aia_..." async></script>
 *
 * This is a self-contained vanilla JS widget. No React, no build step.
 * It loads the ElevenLabs Conversational AI SDK and renders a floating
 * voice chat button on the client's website.
 */
(function () {
  "use strict";

  // ─── Find our script tag and extract config ──────────────────────────
  var scriptTag = document.currentScript || (function () {
    var scripts = document.querySelectorAll('script[data-token]');
    return scripts[scripts.length - 1];
  })();

  if (!scriptTag) {
    console.error("[AiiACo Widget] Could not find script tag");
    return;
  }

  var EMBED_TOKEN = scriptTag.getAttribute("data-token");
  if (!EMBED_TOKEN) {
    console.error("[AiiACo Widget] Missing data-token attribute");
    return;
  }

  // Derive API base from the script src
  var scriptSrc = scriptTag.getAttribute("src") || "";
  var API_BASE = scriptSrc.replace(/\/agent\/embed\.js.*$/, "") || window.location.origin;

  // ─── State ───────────────────────────────────────────────────────────
  var config = null;
  var conversation = null;
  var status = "idle"; // idle | loading | connecting | connected | error
  var isMuted = false;
  var transcript = [];
  var sessionStartTime = null;
  var trialTimer = null;
  var trialSecondsLeft = null;

  // ─── DOM refs ────────────────────────────────────────────────────────
  var container, fab, panel, statusDot, statusText, transcriptBox;
  var trialBadge, muteBtn, endBtn;

  // ─── Styles ──────────────────────────────────────────────────────────
  var FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

  function injectStyles(primaryColor) {
    var style = document.createElement("style");
    style.textContent = [
      "@keyframes aiiaco-pulse{0%,100%{box-shadow:0 0 0 0 " + primaryColor + "40}50%{box-shadow:0 0 0 12px " + primaryColor + "00}}",
      "@keyframes aiiaco-spin{to{transform:rotate(360deg)}}",
      "@keyframes aiiaco-fadein{from{opacity:0;transform:translateY(12px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}",
      "@keyframes aiiaco-ripple{0%{transform:scale(1);opacity:0.4}100%{transform:scale(2.2);opacity:0}}",
      ".aiiaco-widget *{box-sizing:border-box;margin:0;padding:0}",
      ".aiiaco-widget{position:fixed;z-index:2147483647;font-family:" + FONT + "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  // ─── Fetch config ────────────────────────────────────────────────────
  function fetchConfig(cb) {
    status = "loading";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_BASE + "/api/widget/" + EMBED_TOKEN);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          config = JSON.parse(xhr.responseText);
          cb(null, config);
        } catch (e) {
          cb("Invalid config response");
        }
      } else {
        try {
          var err = JSON.parse(xhr.responseText);
          cb(err.error || "Failed to load widget");
        } catch (e2) {
          cb("Failed to load widget (HTTP " + xhr.status + ")");
        }
      }
    };
    xhr.onerror = function () { cb("Network error loading widget config"); };
    xhr.send();
  }

  // ─── Build UI ────────────────────────────────────────────────────────
  function buildWidget(cfg) {
    var color = cfg.primaryColor || "#B89C4A";
    var pos = cfg.position || "bottom-right";
    var btnSize = cfg.buttonSize || 60;

    injectStyles(color);

    // Container
    container = document.createElement("div");
    container.className = "aiiaco-widget";
    container.style.cssText = pos === "bottom-left"
      ? "bottom:24px;left:24px"
      : "bottom:24px;right:24px";

    // ─── Floating Action Button ────────────────────────────────────
    fab = document.createElement("button");
    fab.setAttribute("aria-label", "Talk to " + (cfg.agentName || "AI Agent"));
    fab.style.cssText = [
      "width:" + btnSize + "px", "height:" + btnSize + "px",
      "border-radius:50%", "border:none", "cursor:pointer",
      "background:" + color,
      "box-shadow:0 4px 24px rgba(0,0,0,0.25),0 0 0 0 " + color + "40",
      "display:flex", "align-items:center", "justify-content:center",
      "transition:transform 0.2s ease,box-shadow 0.2s ease",
      "animation:aiiaco-pulse 2.5s ease-in-out infinite",
      "position:relative", "overflow:visible",
    ].join(";");

    // Mic SVG icon
    fab.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';

    fab.onmouseenter = function () { fab.style.transform = "scale(1.08)"; };
    fab.onmouseleave = function () { fab.style.transform = "scale(1)"; };
    fab.onclick = function () { togglePanel(); };

    container.appendChild(fab);

    // ─── Panel ─────────────────────────────────────────────────────
    panel = document.createElement("div");
    panel.style.cssText = [
      "display:none", "position:absolute",
      pos === "bottom-left" ? "left:0" : "right:0",
      "bottom:" + (btnSize + 16) + "px",
      "width:340px", "max-height:480px",
      "background:rgba(8,14,24,0.96)",
      "border:1px solid rgba(255,255,255,0.08)",
      "border-radius:16px",
      "box-shadow:0 12px 48px rgba(0,0,0,0.5)",
      "backdrop-filter:blur(20px)",
      "overflow:hidden",
      "animation:aiiaco-fadein 0.25s ease-out",
    ].join(";");

    // Panel header
    var header = document.createElement("div");
    header.style.cssText = "padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px";

    // Agent avatar
    var avatar = document.createElement("div");
    avatar.style.cssText = "width:36px;height:36px;border-radius:10px;background:" + color + "20;border:1px solid " + color + "40;display:flex;align-items:center;justify-content:center;flex-shrink:0";
    avatar.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>';

    var headerText = document.createElement("div");
    headerText.style.cssText = "flex:1;min-width:0";
    var agentTitle = document.createElement("div");
    agentTitle.style.cssText = "font-size:14px;font-weight:600;color:rgba(255,255,255,0.90);white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    agentTitle.textContent = cfg.agentName || "AI Agent";
    var companyLine = document.createElement("div");
    companyLine.style.cssText = "font-size:11px;color:rgba(200,215,230,0.45);margin-top:2px";
    companyLine.textContent = cfg.companyName || "";
    headerText.appendChild(agentTitle);
    headerText.appendChild(companyLine);

    // Close button
    var closeBtn = document.createElement("button");
    closeBtn.style.cssText = "width:28px;height:28px;border-radius:6px;border:none;background:rgba(255,255,255,0.06);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0";
    closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(200,215,230,0.50)" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.onclick = function () { togglePanel(); };

    header.appendChild(avatar);
    header.appendChild(headerText);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Trial badge
    if (cfg.isTrial) {
      trialBadge = document.createElement("div");
      trialBadge.style.cssText = "padding:8px 20px;background:rgba(255,180,60,0.06);border-bottom:1px solid rgba(255,180,60,0.12);font-size:11px;color:rgba(255,180,60,0.80);display:flex;align-items:center;gap:6px";
      trialBadge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
      var trialText = document.createElement("span");
      trialText.id = "aiiaco-trial-text";
      trialText.textContent = "Trial: " + formatTime(cfg.trialSecondsRemaining) + " remaining";
      trialBadge.appendChild(trialText);
      panel.appendChild(trialBadge);
      trialSecondsLeft = cfg.trialSecondsRemaining;
    }

    // Status area
    var statusArea = document.createElement("div");
    statusArea.style.cssText = "padding:20px;display:flex;flex-direction:column;align-items:center;gap:12px;min-height:160px;justify-content:center";

    statusDot = document.createElement("div");
    statusDot.style.cssText = "width:64px;height:64px;border-radius:50%;background:" + color + "15;border:2px solid " + color + "30;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease";
    statusDot.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';

    statusText = document.createElement("div");
    statusText.style.cssText = "font-size:13px;color:rgba(200,215,230,0.55);text-align:center";
    statusText.textContent = cfg.greeting || "Click to start a conversation";

    statusArea.appendChild(statusDot);
    statusArea.appendChild(statusText);
    panel.appendChild(statusArea);

    // Transcript area (hidden initially)
    transcriptBox = document.createElement("div");
    transcriptBox.style.cssText = "display:none;max-height:200px;overflow-y:auto;padding:0 20px 12px;scroll-behavior:smooth";
    panel.appendChild(transcriptBox);

    // Controls
    var controls = document.createElement("div");
    controls.style.cssText = "padding:12px 20px 16px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px";

    // Start / End button
    endBtn = document.createElement("button");
    endBtn.style.cssText = "flex:1;height:42px;border-radius:10px;border:none;cursor:pointer;font-family:" + FONT + ";font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s ease;background:" + color + ";color:white";
    endBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg> Start Conversation';
    endBtn.onclick = function () { handleMainAction(); };

    // Mute button
    muteBtn = document.createElement("button");
    muteBtn.style.cssText = "width:42px;height:42px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);cursor:pointer;display:none;align-items:center;justify-content:center";
    muteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(200,215,230,0.60)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    muteBtn.onclick = function () { toggleMute(); };

    controls.appendChild(endBtn);
    controls.appendChild(muteBtn);
    panel.appendChild(controls);

    // Powered by
    var powered = document.createElement("div");
    powered.style.cssText = "padding:0 20px 12px;text-align:center";
    var poweredLink = document.createElement("a");
    poweredLink.href = "https://aiiaco.com?ref=widget";
    poweredLink.target = "_blank";
    poweredLink.rel = "noopener";
    poweredLink.style.cssText = "font-size:10px;color:rgba(200,215,230,0.25);text-decoration:none;letter-spacing:0.04em";
    poweredLink.textContent = "Powered by AiiACo";
    powered.appendChild(poweredLink);
    panel.appendChild(powered);

    container.appendChild(panel);
    document.body.appendChild(container);
  }

  // ─── Panel toggle ────────────────────────────────────────────────────
  function togglePanel() {
    if (!panel) return;
    var isVisible = panel.style.display !== "none";
    panel.style.display = isVisible ? "none" : "block";
    fab.style.animation = isVisible ? "aiiaco-pulse 2.5s ease-in-out infinite" : "none";
  }

  // ─── Main action (start/end conversation) ────────────────────────────
  function handleMainAction() {
    if (status === "connected" || status === "connecting") {
      endConversation();
    } else {
      startConversation();
    }
  }

  // ─── Start conversation ──────────────────────────────────────────────
  function startConversation() {
    if (!config || !config.agentId) {
      updateStatus("error", "Agent not configured yet. Please try again later.");
      return;
    }

    status = "connecting";
    updateStatus("connecting", "Requesting microphone access...");
    transcript = [];
    sessionStartTime = Date.now();

    // Load ElevenLabs SDK if not already loaded
    loadElevenLabsSDK(function (err) {
      if (err) {
        updateStatus("error", "Failed to load voice SDK. Please try again.");
        status = "idle";
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        // Stop the stream immediately - SDK handles its own
        stream.getTracks().forEach(function (t) { t.stop(); });

        updateStatus("connecting", "Connecting to " + (config.agentName || "agent") + "...");

        // Use the ElevenLabs client SDK
        window.__elevenLabsClient.Conversation.startSession({
          agentId: config.agentId,
          onConnect: function () {
            status = "connected";
            updateStatus("connected", "Connected - speak now");
            endBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> End Conversation';
            endBtn.style.background = "rgba(220,60,60,0.80)";
            muteBtn.style.display = "flex";
            transcriptBox.style.display = "block";

            // Start trial timer if applicable
            if (config.isTrial && trialSecondsLeft > 0) {
              startTrialTimer();
            }
          },
          onDisconnect: function () {
            handleDisconnect();
          },
          onError: function (err) {
            console.error("[AiiACo Widget] Conversation error:", err);
            updateStatus("error", "Connection lost. Click to try again.");
            status = "idle";
            resetControls();
          },
          onMessage: function (msg) {
            if (msg && msg.message && msg.message.trim()) {
              var entry = {
                role: msg.source === "ai" ? "agent" : "visitor",
                text: msg.message.trim(),
                timestamp: new Date().toISOString(),
              };
              transcript.push(entry);
              appendTranscriptBubble(entry);

              // Pulse the status dot when agent speaks
              if (msg.source === "ai") {
                statusDot.style.borderColor = (config.primaryColor || "#B89C4A");
                statusDot.style.background = (config.primaryColor || "#B89C4A") + "25";
                setTimeout(function () {
                  if (status === "connected") {
                    statusDot.style.borderColor = (config.primaryColor || "#B89C4A") + "30";
                    statusDot.style.background = (config.primaryColor || "#B89C4A") + "15";
                  }
                }, 600);
              }
            }
          },
        }).then(function (conv) {
          conversation = conv;
        }).catch(function (err) {
          console.error("[AiiACo Widget] Failed to start:", err);
          updateStatus("error", "Could not connect. Please check your microphone.");
          status = "idle";
          resetControls();
        });

      }).catch(function (err) {
        console.error("[AiiACo Widget] Mic permission denied:", err);
        updateStatus("error", "Microphone access required. Please allow and try again.");
        status = "idle";
      });
    });
  }

  // ─── End conversation ────────────────────────────────────────────────
  function endConversation() {
    if (trialTimer) {
      clearInterval(trialTimer);
      trialTimer = null;
    }

    if (conversation) {
      try { conversation.endSession(); } catch (e) { /* ignore */ }
      conversation = null;
    }

    handleDisconnect();
  }

  function handleDisconnect() {
    status = "idle";
    updateStatus("idle", config ? (config.greeting || "Click to start a conversation") : "Ready");
    resetControls();

    // Save conversation to server
    if (transcript.length > 0) {
      saveConversation();
    }
  }

  function resetControls() {
    if (endBtn) {
      endBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg> Start Conversation';
      endBtn.style.background = config ? (config.primaryColor || "#B89C4A") : "#B89C4A";
    }
    if (muteBtn) muteBtn.style.display = "none";
    isMuted = false;
  }

  // ─── Toggle mute ─────────────────────────────────────────────────────
  function toggleMute() {
    isMuted = !isMuted;
    if (conversation) {
      try { conversation.setVolume({ volume: isMuted ? 0 : 1 }); } catch (e) { /* ignore */ }
    }
    muteBtn.innerHTML = isMuted
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(220,60,60,0.80)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(200,215,230,0.60)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
  }

  // ─── Trial timer ─────────────────────────────────────────────────────
  function startTrialTimer() {
    if (trialTimer) clearInterval(trialTimer);
    trialTimer = setInterval(function () {
      trialSecondsLeft = Math.max(0, trialSecondsLeft - 1);
      var el = document.getElementById("aiiaco-trial-text");
      if (el) el.textContent = "Trial: " + formatTime(trialSecondsLeft) + " remaining";
      if (trialSecondsLeft <= 0) {
        clearInterval(trialTimer);
        trialTimer = null;
        endConversation();
        updateStatus("error", "Trial time has ended. Activate your subscription to continue.");
      }
    }, 1000);
  }

  // ─── Update status display ───────────────────────────────────────────
  function updateStatus(state, text) {
    if (!statusText) return;
    statusText.textContent = text || "";

    var color = config ? (config.primaryColor || "#B89C4A") : "#B89C4A";
    if (state === "connected") {
      statusDot.style.borderColor = "rgba(80,220,150,0.60)";
      statusDot.style.background = "rgba(80,220,150,0.10)";
      statusDot.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(80,220,150,0.80)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>';
    } else if (state === "connecting") {
      statusDot.style.borderColor = color + "50";
      statusDot.style.background = color + "10";
      statusDot.innerHTML = '<div style="width:20px;height:20px;border:2px solid ' + color + '30;border-top-color:' + color + ';border-radius:50%;animation:aiiaco-spin 0.8s linear infinite"></div>';
    } else if (state === "error") {
      statusDot.style.borderColor = "rgba(220,60,60,0.40)";
      statusDot.style.background = "rgba(220,60,60,0.08)";
      statusDot.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(220,60,60,0.70)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      statusDot.style.borderColor = color + "30";
      statusDot.style.background = color + "15";
      statusDot.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    }
  }

  // ─── Transcript bubbles ──────────────────────────────────────────────
  function appendTranscriptBubble(entry) {
    if (!transcriptBox) return;
    var bubble = document.createElement("div");
    var isAgent = entry.role === "agent";
    bubble.style.cssText = [
      "margin-bottom:8px",
      "padding:8px 12px",
      "border-radius:" + (isAgent ? "12px 12px 12px 4px" : "12px 12px 4px 12px"),
      "font-size:12px",
      "line-height:1.5",
      "max-width:85%",
      isAgent
        ? "background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.80);margin-right:auto"
        : "background:" + (config.primaryColor || "#B89C4A") + "18;color:rgba(255,255,255,0.85);margin-left:auto",
    ].join(";");

    var label = document.createElement("div");
    label.style.cssText = "font-size:10px;font-weight:600;color:rgba(200,215,230,0.40);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.04em";
    label.textContent = isAgent ? (config.agentName || "Agent") : "You";

    var text = document.createElement("div");
    text.textContent = entry.text;

    bubble.appendChild(label);
    bubble.appendChild(text);
    transcriptBox.appendChild(bubble);
    transcriptBox.scrollTop = transcriptBox.scrollHeight;
  }

  // ─── Save conversation to server ─────────────────────────────────────
  function saveConversation() {
    var duration = sessionStartTime
      ? Math.round((Date.now() - sessionStartTime) / 1000)
      : 0;

    var payload = {
      transcript: transcript.map(function (e) {
        return (e.role === "agent" ? "Agent" : "Visitor") + ": " + e.text;
      }).join("\n\n"),
      structuredTranscript: transcript,
      durationSeconds: duration,
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", API_BASE + "/api/widget/" + EMBED_TOKEN + "/conversation");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
  }

  // ─── Load ElevenLabs SDK ─────────────────────────────────────────────
  function loadElevenLabsSDK(cb) {
    if (window.__elevenLabsClient) {
      cb(null);
      return;
    }

    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@11labs/client@latest/dist/browser.min.js";
    script.onload = function () {
      // The SDK exposes itself as a global
      if (window.ElevenLabsClient || window.Conversation) {
        window.__elevenLabsClient = {
          Conversation: window.Conversation || (window.ElevenLabsClient && window.ElevenLabsClient.Conversation),
        };
        cb(null);
      } else {
        // Try the UMD global
        var keys = Object.keys(window);
        for (var i = keys.length - 1; i >= 0; i--) {
          var k = keys[i];
          if (window[k] && window[k].Conversation && typeof window[k].Conversation.startSession === "function") {
            window.__elevenLabsClient = window[k];
            cb(null);
            return;
          }
        }
        cb("ElevenLabs SDK loaded but Conversation not found");
      }
    };
    script.onerror = function () { cb("Failed to load ElevenLabs SDK"); };
    document.head.appendChild(script);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────
  function formatTime(seconds) {
    if (seconds == null) return "--:--";
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // ─── Init ────────────────────────────────────────────────────────────
  function init() {
    fetchConfig(function (err, cfg) {
      if (err) {
        console.warn("[AiiACo Widget] " + err);
        return; // Silently fail - don't break the client's website
      }
      buildWidget(cfg);
      status = "idle";
    });
  }

  // Wait for DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
