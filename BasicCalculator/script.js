document.addEventListener('DOMContentLoaded', function() {
    // Number formatting function
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    let currentInput = '';
    let operator = '';
    let previousInput = '';

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            const value = button.getAttribute('data-value');

            // Ignore clicks on the theme toggle button
            if (button.id === 'theme-toggle') return;

            if (value === 'C') {
                currentInput = '';
                operator = '';
                previousInput = '';
                display.textContent = '';
            } else if (value === '=') {
                if (operator && previousInput) {
                    try {
                        currentInput = eval(previousInput + operator + currentInput);
                        display.textContent = formatNumber(currentInput);
                        operator = '';
                        previousInput = '';
                    } catch (error) {
                        display.textContent = 'Error';
                        currentInput = '';
                        operator = '';
                        previousInput = '';
                    }
                }
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput) {
                    operator = value;
                    previousInput = currentInput;
                    currentInput = '';
                }
            } else {
                currentInput += value;
                display.textContent = currentInput;
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!isNaN(key) || key === '.') {
            currentInput += key;
            display.textContent = currentInput;
        } else if (['+', '-', '*', '/'].includes(key)) {
            operator = key;
            previousInput = currentInput;
            currentInput = '';
        } else if (key === 'Enter' || key === '=') {
            if (operator && previousInput) {
                try {
                    currentInput = eval(previousInput + operator + currentInput);
                    display.textContent = formatNumber(currentInput);
                    operator = '';
                    previousInput = '';
                } catch (error) {
                    display.textContent = 'Error';
                    currentInput = '';
                    operator = '';
                    previousInput = '';
                }
            }
        } else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            display.textContent = currentInput;
        } else if (key === 'Escape') {
            currentInput = '';
            operator = '';
            previousInput = '';
            display.textContent = '';
        }
    });

    // Dark/Light mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    let darkMode = true;

    themeToggle.addEventListener('click', function() {
        if (darkMode) {
            document.body.style.backgroundColor = "#f4f4f4";
            document.querySelector('.calculator').style.backgroundColor = "#fff";
            display.style.backgroundColor = "#e0e0e0";
            display.style.color = "#333";
            themeToggle.textContent = "Dark Mode";
        } else {
            document.body.style.backgroundColor = "#1e1e1e";
            document.querySelector('.calculator').style.backgroundColor = "#333";
            display.style.backgroundColor = "#000";
            display.style.color = "#00ffcc";
            themeToggle.textContent = "Light Mode";
        }
        darkMode = !darkMode;
    });
});
