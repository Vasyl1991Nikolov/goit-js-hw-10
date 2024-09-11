import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
let timerInterval;
let userSelectedDate; // Змінна для збереження обраної дати

// Об'єкт налаштувань для flatpickr
const options = {
  enableTime: true,           // Дозволяє вибір часу
  time_24hr: true,            // Формат часу 24 години
  defaultDate: new Date(),    // Поточна дата як значення за замовчуванням
  minuteIncrement: 1,         // Крок зміни хвилин
  onClose(selectedDates) {    // Викликається після закриття вибору дати
    userSelectedDate = selectedDates[0];
    if (userSelectedDate && userSelectedDate > new Date()) {
      startButton.disabled = false; // Увімкнення кнопки, якщо вибрана дата коректна
    } else {
      startButton.disabled = true; // Вимкнення кнопки, якщо дата у минулому
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
    }
  },
};

// Ініціалізація flatpickr з обраними опціями
flatpickr(dateTimePicker, options);

// Функція для конвертації часу у дні, години, хвилини, секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля, якщо число менше двох символів
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для оновлення таймера
function updateTimer() {
  const now = new Date().getTime();
  const timeRemaining = userSelectedDate.getTime() - now;

  if (timeRemaining <= 0) {
    clearInterval(timerInterval);
    displayTime(0, 0, 0, 0);
    iziToast.info({
      title: "Time's up!",
      message: "The countdown has finished.",
      position: "topRight",
    });
    dateTimePicker.disabled = false; // Дозволяємо обирати нову дату
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeRemaining);
  displayTime(days, hours, minutes, seconds);
}

// Функція для відображення часу на екрані
function displayTime(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').innerText = addLeadingZero(days);
  document.querySelector('[data-hours]').innerText = addLeadingZero(hours);
  document.querySelector('[data-minutes]').innerText = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').innerText = addLeadingZero(seconds);
}

// Запуск таймера при натисканні кнопки "Start"
startButton.addEventListener('click', () => {
  if (timerInterval) clearInterval(timerInterval); // Зупиняємо попередній таймер, якщо він був запущений
  updateTimer(); // Початкове оновлення
  timerInterval = setInterval(updateTimer, 1000); // Оновлення кожну секунду
  startButton.disabled = true; // Вимкнення кнопки після старту
  dateTimePicker.disabled = true; // Деактивація вибору дати під час відліку
});
