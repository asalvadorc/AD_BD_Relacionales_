(function () {
  function blocks(scope = document) {
    return Array.from(
      scope.querySelectorAll("div.highlight pre, div.codehilite pre, pre > code")
    );
  }

  async function copyText(pre, btn) {
    const text = pre.innerText.replace(/\n+$/, "");
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add("copied");
      btn.querySelector("span").textContent = "¡Copiado!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.querySelector("span").textContent = "Copiar código";
      }, 1500);
    } catch (e) {
      console.error("Error al copiar:", e);
    }
  }

  function addButtons(scope = document) {
    blocks(scope).forEach(pre => {
      if (pre.dataset.copyButtonAttached === "1") return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-button";
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="18" height="18"
             viewBox="0 0 24 24"
             fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3
                   4H8c-1.1 0-2 .9-2 2v14c0
                   1.1.9 2 2 2h11c1.1 0 2-.9
                   2-2V7c0-1.1-.9-2-2-2zm0
                   16H8V7h11v14z"/>
        </svg>
        <span>Copiar código</span>
      `;

      btn.addEventListener("click", () => copyText(pre, btn));

      const host = pre.parentElement;
      if (getComputedStyle(host).position === "static") {
        host.style.position = "relative";
      }
      host.appendChild(btn);

      pre.dataset.copyButtonAttached = "1";
    });
  }

  document.addEventListener("DOMContentLoaded", () => addButtons(document));

  const obs = new MutationObserver(ms => ms.forEach(r => addButtons(r.target)));
  obs.observe(document.body, { childList: true, subtree: true });
})();
