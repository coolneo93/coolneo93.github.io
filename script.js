const notepad = document.getElementById('notepad');
const saveButton = document.getElementById('save');
const clearButton = document.getElementById('clear');
const titleInput = document.getElementById('title');
const downloadButton = document.getElementById('download');
const printButton = document.getElementById('print');

// Load saved text if available
if (localStorage.getItem('notepadText')) {
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

// Download the text as a file with the given title
downloadButton.addEventListener('click', () => {
    const title = titleInput.value.trim() || 'untitled';
    const content = notepad.value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;

    // Append the anchor to the body
    document.body.appendChild(a);
    a.click();

    // Remove the anchor from the body
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});

printButton.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print Notepad</title></head><body>');
    printWindow.document.write('<pre>' + notepad.value + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});
