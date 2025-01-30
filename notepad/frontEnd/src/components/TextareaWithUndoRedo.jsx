import React, { useState, useEffect } from 'react';

const TextareaWithUndoRedo = () => {
    const [value, setValue] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        // Add the initial value to history on mount
        setHistory([value]);
        setHistoryIndex(0);
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;

        // If there's any redo history, clear it
        if (historyIndex + 1 !== history.length) {
            const newHistory = history.slice(0, historyIndex + 1);
            setHistory(newHistory);
        }

        // Add the current state to history and increment index
        setHistory([...history, newValue]);
        setHistoryIndex(historyIndex + 1);
        setValue(newValue);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setValue(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setValue(history[historyIndex + 1]);
        }
    };

    return (
        <div>
            <textarea
                value={value}
                onChange={handleInputChange}
                rows="10"
                cols="50"
            />
            <br />
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
        </div>
    );
};

export default TextareaWithUndoRedo;
