// Імпортуємо iziToast та його стилі
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо форму та додаємо обробник події на сабміт
const form = document.querySelector(".form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки

  // Отримуємо значення затримки та стан (fulfilled або rejected) з форми
  const delay = parseInt(form.elements.delay.value, 10);
  const state = form.elements.state.value;

  // Створюємо проміс з затримкою
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay); // Виконується проміс
      } else {
        reject(delay); // Відхиляється проміс
      }
    }, delay);
  });

  // Обробляємо виконання та відхилення промісу
  promise
    .then((delay) => {
      iziToast.success({
        title: "✅ Fulfilled",
        message: `Fulfilled promise in ${delay}ms`,
        position: "topRight",
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: "❌ Rejected",
        message: `Rejected promise in ${delay}ms`,
        position: "topRight",
      });
    });
});
