window.sendFormSubmitGoal = function () {
  // Яндекс.Метрика
  // Заменить 00000000 на реальный номер счетчика
  if (typeof ym === "function") {
    ym(00000000, "reachGoal", "form_submit");
  }

  // Здесь можно добавить цели Roistat / VK Pixel / другие события
  console.log("Form submit goal sent");
};