// 1. Загружаем слова из words.js
const dictionary = words; // Убедитесь, что words.js загружен раньше script.js!

// 2. Создаем поля для букв при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    createLetterInputs(5); // По умолчанию 5 полей

    // 3. Обновляем поля при изменении длины слова
    document.getElementById("word-length").addEventListener("change", function() {
        createLetterInputs(parseInt(this.value));
    });
});

// 4. Функция создания полей для букв
function createLetterInputs(length) {
    const container = document.getElementById("letter-inputs");
    container.innerHTML = "";

    for (let i = 0; i < length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.className = "letter-input";
        input.placeholder = "_";
        input.id = letter-${i};
        container.appendChild(input);
    }
}

// 5. Функция поиска
function searchWords() {
    const length = parseInt(document.getElementById("word-length").value);
    const requiredLetters = document.getElementById("required-letters").value.toLowerCase();
    const excludedLetters = document.getElementById("excluded-letters").value.toLowerCase();

    // Собираем известные буквы (например, ["б", "", "а"] для "б _ а")
    const knownLetters = [];
    for (let i = 0; i < length; i++) {
        const letter = document.getElementById(`letter-${i}`).value.toLowerCase();
        knownLetters.push(letter || ""); // Пустая строка = любая буква
    }

    // Фильтруем слова
    const results = dictionary.filter(word => {
        if (word.length !== length) return false;

        // Проверка известных букв
        for (let i = 0; i < knownLetters.length; i++) {
            if (knownLetters[i] && word[i] !== knownLetters[i]) {
                return false;
            }
        }

        // Проверка обязательных букв
        for (const letter of requiredLetters) {
            if (!word.includes(letter)) return false;
        }

        // Проверка исключенных букв
        for (const letter of excludedLetters) {
            if (word.includes(letter)) return false;
        }

        return true;
    });

    // Выводим результаты
    const resultsDiv = document.getElementById("results");
    if (results.length === 0) {
        resultsDiv.innerHTML = "Совпадений не найдено.";
    } else {
        resultsDiv.innerHTML = `
            <strong>Найдено ${results.length} слов:</strong><br>
            ${results.join(", ")}
        `;
    }
}