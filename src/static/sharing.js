const ActivitySharing = {
  createControls(name) {
    // Share only the activity name and a clean link, never participant or login data.
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set("activity", name);
    const text = `Check out ${name} at Mergington High School!`;
    const controls = document.createElement("div");
    controls.className = "activity-sharing";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", `Share ${name}`);

    const label = document.createElement("span");
    label.textContent = "Share activity:";
    controls.appendChild(label);

    const status = document.createElement("span");
    status.className = "share-status";
    status.setAttribute("role", "status");

    function addButton(label, handler) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "share-button";
      button.textContent = label;
      button.setAttribute("aria-label", `${label}: ${name}`);
      button.addEventListener("click", handler);
      controls.appendChild(button);
    }

    if (typeof navigator.share === "function") {
      addButton("Share…", async () => {
        try {
          await navigator.share({ title: name, text, url: url.href });
          status.textContent = "Activity shared.";
        } catch (error) {
          if (error.name !== "AbortError") {
            status.textContent = "Unable to share. Try a sharing link or Copy link.";
          }
        }
      });
    }

    const facebookUrl = new URL("https://www.facebook.com/sharer/sharer.php");
    facebookUrl.searchParams.set("u", url.href);
    const whatsappUrl = new URL("https://wa.me/");
    whatsappUrl.searchParams.set("text", `${text} ${url.href}`);

    [["Facebook", facebookUrl], ["WhatsApp", whatsappUrl]].forEach(
      ([label, shareUrl]) => {
        const link = document.createElement("a");
        link.className = "share-button";
        link.textContent = label;
        link.href = shareUrl.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `Share ${name} on ${label} (opens a new tab)`);
        controls.appendChild(link);
      }
    );

    addButton("Copy link", async () => {
      try {
        await navigator.clipboard.writeText(url.href);
        status.textContent = "Link copied!";
      } catch (error) {
        window.prompt("Copy this activity link to share with friends:", url.href);
        status.textContent = "You can copy the link from the dialog.";
      }
    });

    controls.appendChild(status);
    return controls;
  },
};
