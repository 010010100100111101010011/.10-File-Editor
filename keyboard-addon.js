(function () {
    // 1. Detect if the device is a touch/mobile device
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isMobile) return; // Exit if desktop (uses standard physical computer keyboard)

    // 2. Inject Dark Theme Keyboard & Custom Scrollbar Styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-virtual-keyboard {
            background-color: #1e1e24;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            margin-bottom: 15px;
            user-select: none;
            -webkit-user-select: none;
        }

        .keyboard-row {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin-bottom: 8px;
        }

        .keyboard-row:last-child {
            margin-bottom: 0;
        }

        .kbd-btn {
            background-color: #2e2e38;
            color: #ffffff;
            border: 1px solid #444454;
            border-radius: 5px;
            padding: 10px 0;
            flex: 1;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            touch-action: manipulation;
            transition: background 0.15s ease;
        }

        .kbd-btn:active {
            background-color: #4f4f63;
        }

        /* Top row binary 1 and 0 */
        .kbd-binary {
            background-color: #8e44ad !important;
            color: #ffffff !important;
            border-color: #9b59b6 !important;
            font-size: 16px;
        }

        .kbd-binary:active {
            background-color: #6c3483 !important;
        }

        /* Action buttons layout sizing */
        .kbd-wide {
            flex: 1.5;
            background-color: #3a3a48;
        }

        .kbd-space {
            flex: 3;
            background-color: #2e2e38;
        }

        /* Hexagram Grid & Custom Scrollbar Styling */
        .hexagram-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 6px;
            max-height: 180px;
            overflow-y: auto;
            margin-bottom: 8px;
            padding: 6px;
            background: #141418;
            border-radius: 6px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }

        /* Dark Theme Purple Scrollbar */
        .hexagram-grid::-webkit-scrollbar {
            width: 8px;
        }

        .hexagram-grid::-webkit-scrollbar-track {
            background: #141418;
            border-radius: 4px;
        }

        .hexagram-grid::-webkit-scrollbar-thumb {
            background: #8e44ad;
            border-radius: 4px;
        }

        .hexagram-grid::-webkit-scrollbar-thumb:hover {
            background: #9b59b6;
        }

        .hexagram-btn {
            background-color: #2e2e38;
            color: #ffffff;
            border: 1px solid #444454;
            border-radius: 4px;
            font-size: 22px;
            padding: 6px 0;
            cursor: pointer;
            text-align: center;
        }

        .hexagram-btn:active {
            background-color: #8e44ad;
        }
    `;
    document.head.appendChild(style);

    // 3. Explicit Array of ALL 64 Hexagrams
    const hexagramsList = [
        '䷀', '䷁', '䷂', '䷃', '䷄', '䷅', '䷆', '䷇',
        '䷈', '䷉', '䷊', '䷋', '䷌', '䷍', '䷎', '䷏',
        '䷐', '䷑', '䷒', '䷓', '䷔', '䷕', '䷖', '䷗',
        '䷘', '䷙', '䷚', '䷛', '䷜', '䷝', '䷞', '䷟',
        '䷠', '䷡', '䷢', '䷣', '䷤', '䷥', '䷦', '䷧',
        '䷨', '䷩', '䷪', '䷫', '䷬', '䷭', '䷮', '䷯',
        '䷰', '䷱', '䷲', '䷳', '䷴', '䷵', '䷶', '䷷',
        '䷸', '䷹', '䷺', '䷻', '䷼', '䷽', '䷾', '䷿'
    ];

    // Keyboard Layout Configurations (Strictly NO 2-9 digits)
    const layoutAlpha = [
        ['1', '0'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
        ['SYM', 'ICHING', 'SPACE']
    ];

    const layoutSym = [
        ['1', '0'],
        ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
        ['-', '_', '=', '+', '[', ']', '{', '}', ';', ':'],
        ['ALPHA', '<', '>', '/', '?', ',', '.', '|', 'BACKSPACE'],
        ['SYM', 'ICHING', 'SPACE']
    ];

    let isUppercase = true;
    let currentMode = 'ALPHA'; // 'ALPHA', 'SYM', or 'ICHING'

    // 4. Create Keyboard Container
    const keyboardContainer = document.createElement('div');
    keyboardContainer.className = 'custom-virtual-keyboard';

    function renderKeyboard() {
        keyboardContainer.innerHTML = '';

        // Render Hexagram Grid Mode
        if (currentMode === 'ICHING') {
            const grid = document.createElement('div');
            grid.className = 'hexagram-grid';

            hexagramsList.forEach(hex => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'hexagram-btn';
                btn.textContent = hex;
                btn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    handleKeyPress(hex);
                });
                grid.appendChild(btn);
            });

            keyboardContainer.appendChild(grid);

            // Control bar for Hexagram mode
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';

            const backBtn = document.createElement('button');
            backBtn.type = 'button';
            backBtn.className = 'kbd-btn kbd-wide';
            backBtn.textContent = 'ABC';
            backBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                currentMode = 'ALPHA';
                renderKeyboard();
            });

            const backspaceBtn = document.createElement('button');
            backspaceBtn.type = 'button';
            backspaceBtn.className = 'kbd-btn kbd-wide';
            backspaceBtn.textContent = '⌫';
            backspaceBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                handleKeyPress('BACKSPACE');
            });

            rowDiv.appendChild(backBtn);
            rowDiv.appendChild(backspaceBtn);
            keyboardContainer.appendChild(rowDiv);
            return;
        }

        // Standard Keyboards
        const currentLayout = (currentMode === 'SYM') ? layoutSym : layoutAlpha;

        currentLayout.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';

            row.forEach(key => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'kbd-btn';

                if (rowIndex === 0) {
                    btn.classList.add('kbd-binary');
                }

                let displayKey = key;
                if (currentMode === 'ALPHA' && key.length === 1 && rowIndex > 0) {
                    displayKey = isUppercase ? key.toUpperCase() : key.toLowerCase();
                }

                if (key === 'SHIFT') {
                    displayKey = isUppercase ? '⇪' : '⇧';
                    btn.classList.add('kbd-wide');
                } else if (key === 'BACKSPACE') {
                    displayKey = '⌫';
                    btn.classList.add('kbd-wide');
                } else if (key === 'SYM') {
                    displayKey = currentMode === 'SYM' ? 'ABC' : '?123';
                    btn.classList.add('kbd-wide');
                } else if (key === 'ALPHA') {
                    displayKey = 'ABC';
                    btn.classList.add('kbd-wide');
                } else if (key === 'ICHING') {
                    displayKey = '☯'; // Strictly Yin Yang icon
                    btn.classList.add('kbd-wide');
                } else if (key === 'SPACE') {
                    displayKey = 'Space';
                    btn.classList.add('kbd-space');
                }

                btn.textContent = displayKey;

                btn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    handleKeyPress(key);
                });

                rowDiv.appendChild(btn);
            });

            keyboardContainer.appendChild(rowDiv);
        });
    }

    // 5. Handle Key Presses
    function handleKeyPress(key) {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const start = textInput.selectionStart;
        const end = textInput.selectionEnd;
        let currentValue = textInput.value;

        if (key === 'SHIFT') {
            isUppercase = !isUppercase;
            renderKeyboard();
            return;
        } else if (key === 'SYM') {
            currentMode = currentMode === 'SYM' ? 'ALPHA' : 'SYM';
            renderKeyboard();
            return;
        } else if (key === 'ALPHA') {
            currentMode = 'ALPHA';
            renderKeyboard();
            return;
        } else if (key === 'ICHING') {
            currentMode = 'ICHING';
            renderKeyboard();
            return;
        } else if (key === 'BACKSPACE') {
            if (start === end && start > 0) {
                const charCode = currentValue.codePointAt(start - 2);
                const isSurrogate = charCode && charCode > 0xFFFF;
                const offset = isSurrogate ? 2 : 1;

                textInput.value = currentValue.substring(0, start - offset) + currentValue.substring(end);
                textInput.setSelectionRange(start - offset, start - offset);
            } else if (start !== end) {
                textInput.value = currentValue.substring(0, start) + currentValue.substring(end);
                textInput.setSelectionRange(start, start);
            }
        } else if (key === 'SPACE') {
            textInput.value = currentValue.substring(0, start) + ' ' + currentValue.substring(end);
            textInput.setSelectionRange(start + 1, start + 1);
        } else {
            let charToInsert = key;
            if (currentMode === 'ALPHA' && key.length === 1 && key !== '1' && key !== '0') {
                charToInsert = isUppercase ? key.toUpperCase() : key.toLowerCase();
            }
            textInput.value = currentValue.substring(0, start) + charToInsert + currentValue.substring(end);
            
            const step = Array.from(charToInsert).length === 1 ? charToInsert.length : 2;
            textInput.setSelectionRange(start + step, start + step);
        }

        // Trigger input event to sync binary output box
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 6. Setup and Inject Keyboard on DOM Load
    window.addEventListener('DOMContentLoaded', () => {
        const textInput = document.getElementById('textInput');
        if (textInput && textInput.parentNode) {
            // Prevent default Android / iOS software keyboard from popping up
            textInput.setAttribute('inputmode', 'none');

            // Render and insert custom virtual keyboard
            renderKeyboard();
            textInput.parentNode.insertBefore(keyboardContainer, textInput);
        }
    });
})();
