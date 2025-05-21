document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что массив words существует
    if (typeof words === 'undefined') {
        console.error('Массив words не найден! Проверьте подключение words.js');
        alert('Ошибка: словарь не загружен. Проверьте файл words.js');
        return;
    }

    // Элементы интерфейса
    const wordLengthInput = document.getElementById('wordLength');
    const knownLettersContainer = document.getElementById('knownLettersContainer');
    const requiredLettersInput = document.getElementById('requiredLetters');
    const excludedLettersInput = document.getElementById('excludedLetters');
    const findButton = document.getElementById('findButton');
    const wordsList = document.getElementById('wordsList');
    
    // Проверяем, что все элементы существуют
    if (!wordLengthInput || !knownLettersContainer || !requiredLettersInput || 
        !excludedLettersInput || !findButton || !wordsList) {
        console.error('Не найдены необходимые элементы DOM');
        return;
    }
    
    // Создаём ячейки для букв
    function createLetterInputs() {
        knownLettersContainer.innerHTML = '';
        const length = parseInt(wordLengthInput.value) || 6;
        
        for (let i = 0; i < length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.className = 'letter-input';
            input.dataset.position = i;
            input.placeholder = '?';
            knownLettersContainer.appendChild(input);
        }
    }
    
    // Инициализация
    createLetterInputs();
    wordLengthInput.addEventListener('change', createLetterInputs);
    
    // Функция поиска слов
    function findWords() {
        const length = parseInt(wordLengthInput.value) || 6;
        const requiredLetters = (requiredLettersInput.value || '').toLowerCase().replace(/[^а-яё]/g, '');
        const excludedLetters = (excludedLettersInput.value || '').toLowerCase().replace(/[^а-яё]/g, '');
        
        // Получаем известные буквы
        const knownLetters = {};
        document.querySelectorAll('.letter-input').forEach(input => {
            const letter = input.value.trim().toLowerCase();
            if (letter) {
                knownLetters[parseInt(input.dataset.position)] = letter;
            }
        });
        
        // Фильтрация слов
        const matchedWords = words.filter(word => {
            if (word.length !== length) return false;
            
            for (const [position, letter] of Object.entries(knownLetters)) {
                if (word[position] !== letter) return false;
            }
            
            for (const letter of requiredLetters) {
                if (!word.includes(letter)) return false;
            }
            
            for (const letter of excludedLetters) {
                if (word.includes(letter)) return false;
            }
            
            return true;
        });
        
        displayResults(matchedWords);
    }
    
    // Вывод результатов
    function displayResults(matchedWords) {
        wordsList.innerHTML = '';
        
        if (matchedWords.length === 0) {
            wordsList.innerHTML = '<p>Слова не найдены</p>';
            return;
        }
        
        const countElement = document.createElement('h3');
        countElement.textContent = `Найдено слов: ${matchedWords.length}`;
        wordsList.appendChild(countElement);
        
        matchedWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.textContent = word;
            wordsList.appendChild(wordElement);
        });
    }
    
    findButton.addEventListener('click', findWords);
    
    // Автопереход между полями
    knownLettersContainer.addEventListener('input', function(e) {
        if (e.target.matches('.letter-input') && e.target.value) {
            const next = e.target.nextElementSibling;
            if (next && next.matches('.letter-input')) {
                next.focus();
            }
        }
    });
});