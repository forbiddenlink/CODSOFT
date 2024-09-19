// Waits for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function() {

    // Function to format numbers with commas (for better readability)
    function formatNumber(num) {
        // Uses a regular expression to insert commas at every thousand place
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Get the display element where input and result will be shown
    const display = document.getElementById('display');
    
    // Get all buttons in the calculator (number and operator buttons)
    const buttons = document.querySelectorAll('.btn');
    
    // Variables to store the current input, operator, and the previous input
    let currentInput = '';  // Stores the current number being entered
    let operator = '';      // Stores the operator (e.g., +, -, *, /)
    let previousInput = ''; // Stores the previous number (before an operator is pressed)

    // Loop through each button and add a click event listener
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Get the value of the button that was clicked
            const value = button.getAttribute('data-value');

            // Ignore clicks on the theme toggle button
            if (button.id === 'theme-toggle') return;

            // Clear the display and reset variables when 'C' (clear) is pressed
            if (value === 'C') {
                currentInput = '';
                operator = '';
                previousInput = '';
                display.textContent = ''; // Clear the display
            } 
            // When '=' is pressed, evaluate the expression
            else if (value === '=') {
                if (operator && previousInput) { // Ensure there's an operator and previous input
                    try {
                        // Use eval to calculate the result
                        currentInput = eval(previousInput + operator + currentInput);
                        display.textContent = formatNumber(currentInput); // Display the formatted result
                        operator = '';
                        previousInput = '';
                    } catch (error) {
                        // If there's an error (e.g., invalid expression), show 'Error'
                        display.textContent = 'Error';
                        currentInput = '';
                        operator = '';
                        previousInput = '';
                    }
                }
            } 
            // If an operator (+, -, *, /) is clicked
            else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput) { // If there's a current input
                    operator = value;  // Set the operator
                    previousInput = currentInput; // Store the current input as previous
                    currentInput = ''; // Clear current input for the next number
                }
            } 
            // If a number or decimal is clicked
            else {
                currentInput += value; // Append the value to the current input
                display.textContent = currentInput; // Update the display with the current input
            }
        });
    });

    // Adding support for keyboard inputs (number keys, operators, etc.)
    document.addEventListener('keydown', function(event) {
        const key = event.key; // Get the key that was pressed

        // If the key is a number or a decimal point
        if (!isNaN(key) || key === '.') {
            currentInput += key; // Append it to the current input
            display.textContent = currentInput; // Update the display
        } 
        // If the key is an operator
        else if (['+', '-', '*', '/'].includes(key)) {
            operator = key; // Set the operator
            previousInput = currentInput; // Store current input as previous
            currentInput = ''; // Clear current input for the next number
        } 
        // If 'Enter' or '=' is pressed, calculate the result
        else if (key === 'Enter' || key === '=') {
            if (operator && previousInput) { // Ensure there's an operator and previous input
                try {
                    // Evaluate the expression
                    currentInput = eval(previousInput + operator + currentInput);
                    display.textContent = formatNumber(currentInput); // Display the formatted result
                    operator = '';
                    previousInput = '';
                } catch (error) {
                    // If there's an error, show 'Error'
                    display.textContent = 'Error';
                    currentInput = '';
                    operator = '';
                    previousInput = '';
                }
            }
        } 
        // If 'Backspace' is pressed, remove the last character from current input
        else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1); // Remove the last character
            display.textContent = currentInput; // Update the display
        } 
        // If 'Escape' is pressed, clear everything (similar to pressing 'C')
        else if (key === 'Escape') {
            currentInput = '';
            operator = '';
            previousInput = '';
            display.textContent = ''; // Clear the display
        }
    });

    // Toggle between dark mode and light mode when the button is clicked
    const themeToggle = document.getElementById('theme-toggle');
    let darkMode = true; // Variable to keep track of the current theme

    themeToggle.addEventListener('click', function() {
        // If dark mode is currently on, switch to light mode
        if (darkMode) {
            document.body.style.backgroundColor = "#f4f4f4"; // Set light background
            document.querySelector('.calculator').style.backgroundColor = "#fff"; // Light calculator background
            display.style.backgroundColor = "#e0e0e0"; // Light display background
            display.style.color = "#333"; // Dark text color for better readability
            themeToggle.textContent = "Dark Mode"; // Change button text to reflect the mode
        } 
        // Otherwise, switch back to dark mode
        else {
            document.body.style.backgroundColor = "#1e1e1e"; // Set dark background
            document.querySelector('.calculator').style.backgroundColor = "#333"; // Dark calculator background
            display.style.backgroundColor = "#000"; // Dark display background
            display.style.color = "#00ffcc"; // Light text color for better readability
            themeToggle.textContent = "Light Mode"; // Change button text to reflect the mode
        }
        darkMode = !darkMode; // Toggle the mode (dark -> light, light -> dark)
    });
});
