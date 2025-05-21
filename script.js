document.addEventListener('DOMContentLoaded', () => {
    if (typeof words === 'undefined' || !Array.isArray(words)) {
        console.error("Ошибка: словарь отсутствует или имеет неправильный формат.");
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

    function generatePositionalInputs(length) {
    positionalInputsContainer.innerHTML = '';
    const inputs = [];

    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('positional-input');
        input.dataset.index = i;

        positionalInputsContainer.appendChild(input);
        inputs.push(input);

        input.addEventListener('input', function() {
            if (this.value.length === this.maxLength) { 
                const currentIndex = parseInt(this.dataset.index, 10);
                if (currentIndex < inputs.length - 1) { 
                    inputs[currentIndex + 1].focus(); 
                }
            }
        });

        input.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace' && this.value.length === 0) {
                const currentIndex = parseInt(this.dataset.index, 10);
                if (currentIndex > 0) {
                    inputs[currentIndex - 1].focus();
                }
            }
        });
    }
}

    generatePositionalInputs(parseInt(wordLengthInput.value, 10));

    wordLengthInput.addEventListener('change', () => {
        let length = parseInt(wordLengthInput.value, 10);
        if (length < 2) length = 2;
        if (length > 20) length = 20;
        wordLengthInput.value = length; 
        generatePositionalInputs(length);
    });

    findButton.addEventListener('click', () => {
        const length = parseInt(wordLengthInput.value, 10);
        
    const positionalLetters = [];
    document.querySelectorAll('.positional-input').forEach(input => {
        let letterValue = input.value.toLowerCase();
        if (letterValue === ' ') { 
            letterValue = '';
        }
        positionalLetters[parseInt(input.dataset.index, 10)] = letterValue;
    });

        const requiredLetters = requiredLettersInput.value.toLowerCase().split('').filter(l => l.trim() !== '');
        const excludedLetters = excludedLettersInput.value.toLowerCase().split('').filter(l => l.trim() !== '');

        const foundWords = words.filter(word => {
            const lowerWord = word.toLowerCase(); // Работаем с нижним регистром

            if (lowerWord.length !== length) {
                return false;
            }

            for (let i = 0; i < length; i++) {
                if (positionalLetters[i] && positionalLetters[i] !== '_' && positionalLetters[i] !== '') {
                    if (lowerWord[i] !== positionalLetters[i]) {
                        return false;
                    }
                }
            }

            for (const reqLetter of requiredLetters) {
                if (!lowerWord.includes(reqLetter)) {
                    return false;
                }
            }

            for (const exLetter of excludedLetters) {
                if (lowerWord.includes(exLetter)) {
                    return false;
                }
            }

            return true;
        });

        resultsCountDiv.textContent = `Найдено слов: ${foundWords.length}`;
        resultsListDiv.innerHTML = '';

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