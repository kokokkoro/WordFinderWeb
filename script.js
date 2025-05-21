document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, загружен ли массив words
    if (typeof words === 'undefined' || !Array.isArray(words)) {
        console.error("Массив 'words' не найден или не является массивом. Убедитесь, что файл words.js подключен и содержит 'const words = [...]';");
        alert("Ошибка: Список слов не загружен. Проверьте консоль разработчика (F12) для деталей.");
        return;
    }

    const wordLengthInput = document.getElementById('wordLength');
    const positionalInputsContainer = document.getElementById('positionalInputsContainer');
    const requiredLettersInput = document.getElementById('requiredLetters');
    const excludedLettersInput = document.getElementById('excludedLetters');
    const findButton = document.getElementById('findButton');
    const resultsCountDiv = document.getElementById('resultsCount');
    const resultsListDiv = document.getElementById('resultsList');

    // Функция для генерации полей ввода для позиционных букв
    // Обновленная функция для генерации полей ввода для позиционных букв
    function generatePositionalInputs(length) {
    positionalInputsContainer.innerHTML = ''; // Очищаем предыдущие поля
    const inputs = []; // Массив для хранения ссылок на созданные поля ввода

    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('positional-input');
        input.dataset.index = i; // Сохраняем индекс

        positionalInputsContainer.appendChild(input);
        inputs.push(input); // Добавляем созданное поле в наш массив

        // Слушатель события 'input': когда пользователь вводит символ
        input.addEventListener('input', function() {
            // this - текущее поле ввода, в котором произошло событие
            if (this.value.length === this.maxLength) { // Если поле заполнено (введена 1 буква)
                const currentIndex = parseInt(this.dataset.index, 10);
                if (currentIndex < inputs.length - 1) { // Если это не последнее поле
                    inputs[currentIndex + 1].focus(); // Перемещаем фокус на следующее поле
                }
            }
        });

        // Слушатель события 'keydown': для обработки Backspace
        input.addEventListener('keydown', function(event) {
            // event.key === 'Backspace' - была нажата клавиша Backspace
            // this.value.length === 0 - и поле ввода при этом уже пустое
            if (event.key === 'Backspace' && this.value.length === 0) {
                const currentIndex = parseInt(this.dataset.index, 10);
                if (currentIndex > 0) { // Если это не первое поле
                    inputs[currentIndex - 1].focus(); // Перемещаем фокус на предыдущее поле
                }
            }
        });
    }
}

    // Инициализация полей при загрузке страницы
    generatePositionalInputs(parseInt(wordLengthInput.value, 10));

    // Обновление полей при изменении длины слова
    wordLengthInput.addEventListener('change', () => {
        let length = parseInt(wordLengthInput.value, 10);
        if (length < 2) length = 2;
        if (length > 20) length = 20;
        wordLengthInput.value = length; // Корректируем значение в поле, если оно вышло за пределы
        generatePositionalInputs(length);
    });

    // Обработчик нажатия на кнопку "Найти"
    findButton.addEventListener('click', () => {
        const length = parseInt(wordLengthInput.value, 10);
        
        // ... внутри findButton.addEventListener('click', () => { ...
    const positionalLetters = [];
    document.querySelectorAll('.positional-input').forEach(input => {
        let letterValue = input.value.toLowerCase();
        if (letterValue === ' ') { // Если введен пробел
            letterValue = '';      // Считаем его как пустую строку (любая буква)
        }
        positionalLetters[parseInt(input.dataset.index, 10)] = letterValue;
    });
// ... остальная часть функции

        const requiredLetters = requiredLettersInput.value.toLowerCase().split('').filter(l => l.trim() !== '');
        const excludedLetters = excludedLettersInput.value.toLowerCase().split('').filter(l => l.trim() !== '');

        // Фильтрация слов
        const foundWords = words.filter(word => {
            const lowerWord = word.toLowerCase(); // Работаем с нижним регистром

            // 1. Проверка длины
            if (lowerWord.length !== length) {
                return false;
            }

            // 2. Проверка по позиционным буквам
            for (let i = 0; i < length; i++) {
                if (positionalLetters[i] && positionalLetters[i] !== '_' && positionalLetters[i] !== '') {
                    if (lowerWord[i] !== positionalLetters[i]) {
                        return false;
                    }
                }
            }

            // 3. Проверка обязательных букв
            for (const reqLetter of requiredLetters) {
                if (!lowerWord.includes(reqLetter)) {
                    return false;
                }
            }

            // 4. Проверка букв-исключений
            for (const exLetter of excludedLetters) {
                if (lowerWord.includes(exLetter)) {
                    return false;
                }
            }

            return true; // Слово подходит по всем критериям
        });

        // Отображение результатов
        resultsCountDiv.textContent = `Найдено слов: ${foundWords.length}`;
        resultsListDiv.innerHTML = ''; // Очищаем предыдущие результаты

        if (foundWords.length > 0) {
            foundWords.forEach(word => {
                const wordDiv = document.createElement('div');
                wordDiv.textContent = word;
                resultsListDiv.appendChild(wordDiv);
            });
        } else {
            resultsListDiv.textContent = 'Подходящих слов не найдено.';
        }
    });
});
