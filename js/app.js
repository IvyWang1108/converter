// World Clock Functionality
function updateWorldClocks() {
    const clockCards = document.querySelectorAll('.clock-card');
    
    clockCards.forEach(card => {
        const timezone = card.dataset.timezone;
        const timeElement = card.querySelector('.time');
        const dateElement = card.querySelector('.date');
        
        try {
            const now = new Date();
            const options = {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const dateOptions = {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            
            const timeString = now.toLocaleTimeString('en-US', options);
            const dateString = now.toLocaleDateString('en-US', dateOptions);
            
            timeElement.textContent = timeString;
            dateElement.textContent = dateString;
        } catch (e) {
            console.error(`Error updating clock for ${card.dataset.location}:`, e);
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize world clocks
    updateWorldClocks();
    setInterval(updateWorldClocks, 1000);
    
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#00ff88"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00ff88",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Temperature conversion functions
    function celsiusToFahrenheit(c) { return (c * 9/5) + 32; }
    function fahrenheitToCelsius(f) { return (f - 32) * 5/9; }

    // Length conversion functions
    const lengthConversions = {
        cm: {
            inches: cm => cm / 2.54,
            feet: cm => cm / 30.48
        },
        inches: {
            cm: inches => inches * 2.54,
            feet: inches => inches / 12
        },
        feet: {
            cm: feet => feet * 30.48,
            inches: feet => feet * 12
        }
    };

    // Weight conversion functions
    function kgToPounds(kg) { return kg * 2.20462; }
    function poundsToKg(pounds) { return pounds / 2.20462; }

    // Sync dropdowns to prevent same unit selection
    function syncDropdowns(fromSelect, toSelect) {
        if (fromSelect.value === toSelect.value) {
            // Find first different option
            const options = Array.from(toSelect.options);
            const otherOption = options.find(opt => opt.value !== fromSelect.value);
            if (otherOption) {
                toSelect.value = otherOption.value;
            }
        }
    }

    // Setup converter with event listeners
    function setupConverter(converterId, convertFunction) {
        const input = document.getElementById(`${converterId}-input`);
        const fromSelect = document.getElementById(`${converterId}-from`);
        const toSelect = document.getElementById(`${converterId}-to`);
        const result = document.getElementById(`${converterId}-result`);

        if (!input || !fromSelect || !toSelect || !result) return;

        // Initial sync
        syncDropdowns(fromSelect, toSelect);

        // Handle changes
        const handleChange = () => {
            convertFunction(input, fromSelect, toSelect, result);
        };

        // Add event listeners
        input.addEventListener('input', handleChange);
        fromSelect.addEventListener('change', () => {
            syncDropdowns(fromSelect, toSelect);
            handleChange();
        });
        toSelect.addEventListener('change', () => {
            syncDropdowns(toSelect, fromSelect);
            handleChange();
        });

        // Initial conversion
        handleChange();
    }


    // Temperature conversion handler
    function convertTemperature() {
        const input = document.getElementById('temp-input');
        const fromSelect = document.getElementById('temp-from');
        const toSelect = document.getElementById('temp-to');
        const result = document.getElementById('temp-result');
        
        if (!input || !fromSelect || !toSelect || !result) return;
        
        const value = parseFloat(input.value) || 0;
        let convertedValue;
        
        if (fromSelect.value === 'celsius' && toSelect.value === 'fahrenheit') {
            convertedValue = celsiusToFahrenheit(value);
        } else if (fromSelect.value === 'fahrenheit' && toSelect.value === 'celsius') {
            convertedValue = fahrenheitToCelsius(value);
        } else {
            convertedValue = value; // Same unit
        }
        
        result.textContent = convertedValue.toFixed(2);
    }
    
    // Length conversion handler
    function convertLength() {
        const input = document.getElementById('length-input');
        const fromSelect = document.getElementById('length-from');
        const toSelect = document.getElementById('length-to');
        const result = document.getElementById('length-result');
        
        if (!input || !fromSelect || !toSelect || !result) return;
        
        const value = parseFloat(input.value) || 0;
        let convertedValue;
        
        if (fromSelect.value === toSelect.value) {
            convertedValue = value;
        } else {
            // First convert to cm, then to target unit if needed
            let inCm;
            if (fromSelect.value === 'cm') {
                inCm = value;
            } else {
                inCm = lengthConversions[fromSelect.value].cm(value);
            }
            
            if (toSelect.value === 'cm') {
                convertedValue = inCm;
            } else {
                convertedValue = lengthConversions.cm[toSelect.value](inCm);
            }
        }
        
        result.textContent = convertedValue.toFixed(2);
    }
    
    // Weight conversion handler
    function convertWeight() {
        const input = document.getElementById('weight-input');
        const fromSelect = document.getElementById('weight-from');
        const toSelect = document.getElementById('weight-to');
        const result = document.getElementById('weight-result');
        
        if (!input || !fromSelect || !toSelect || !result) return;
        
        const value = parseFloat(input.value) || 0;
        let convertedValue;
        
        if (fromSelect.value === 'kg' && toSelect.value === 'pounds') {
            convertedValue = kgToPounds(value);
        } else if (fromSelect.value === 'pounds' && toSelect.value === 'kg') {
            convertedValue = poundsToKg(value);
        } else {
            convertedValue = value; // Same unit
        }
        
        result.textContent = convertedValue.toFixed(2);
    }

    // Initialize all converters
    setupConverter('temp', convertTemperature);
    setupConverter('length', convertLength);
    setupConverter('weight', convertWeight);

    // Add animation to converter boxes on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.converter-box').forEach(box => {
        box.style.opacity = 0;
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(box);
    });
});
