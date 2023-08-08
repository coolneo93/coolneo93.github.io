const notepad = document.getElementById('notepad');
const saveButton = document.getElementById('save');
const clearButton = document.getElementById('clear');

// Load saved text if available
if(localStorage.getItem('notepadText')) {
    notepad.value = localStorage.getItem('notepadText');
}

// Save the text to local storage
saveButton.addEventListener('click', () => {
    localStorage.setItem('notepadText', notepad.value);
    alert('Saved!');
});

// Clear the text and remove it from local storage
clearButton.addEventListener('click', () => {
    notepad.value = '';
    localStorage.removeItem('notepadText');
});

const titleInput = document.getElementById('title');
const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
    const title = titleInput.value.trim() || 'untitled';
    const content = notepad.value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    a.click();

    URL.revokeObjectURL(url);
});