const WEBHOOK_URL = "PASTE_WEBHOOK_URL_HERE";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || ""
  };
}

function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );

  return matches ? decodeURIComponent(matches[1]) : "";
}

function getRoistatVisit() {
  return getCookie("roistat_visit") || window.roistat_visit || "";
}

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, "");
}

document.querySelectorAll("[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") || "",
      phone: normalizePhone(formData.get("phone") || ""),
      form_name: form.dataset.formName || "main_form",
      page_url: window.location.href,
      page_title: document.title,
      roistat_visit: getRoistatVisit(),
      ...getUtmParams()
    };

    if (!payload.phone) {
      alert("Пожалуйста, укажите телефон");
      return;
    }

    if (!WEBHOOK_URL || WEBHOOK_URL === "PASTE_WEBHOOK_URL_HERE") {
      console.log("Webhook payload:", payload);
      alert("Форма пока в тестовом режиме. Данные выведены в консоль.");
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Отправляем...";

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки формы");
      }

      if (typeof window.sendFormSubmitGoal === "function") {
        window.sendFormSubmitGoal();
      }

      window.location.href = "thanks.html";
    } catch (error) {
      console.error(error);
      alert("Не удалось отправить заявку. Попробуйте еще раз.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Скачать презентацию комплекса";
    }
  });
});