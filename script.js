const tabsDiv = document.getElementById('tabs');
const notepad = document.getElementById('notepad');
const tabs = [];
let selectedTabIndex = 0;

function selectTab(index) {
    selectedTabIndex = index;
    notepad.value = tabs[selectedTabIndex].content || '';
}

function renderTabs() {
    tabsDiv.innerHTML = '';
    tabs.forEach((content, index) => {
        const tabDiv = document.createElement('div');
        const tabButton = document.createElement('button');
        const closeButton = document.createElement('button');
        const renameInput = document.createElement('input');

        renameInput.type = 'text';
        renameInput.value = content.title || `Tab ${index + 1}`;
        renameInput.onchange = (event) => renameTab(index, event.target.value);

        tabButton.textContent = content.title || `Tab ${index + 1}`;
        closeButton.textContent = 'Close';

        tabButton.onclick = () => selectTab(index);
        closeButton.onclick = () => closeTab(index);

        tabDiv.appendChild(tabButton);
        tabDiv.appendChild(renameInput);
        tabDiv.appendChild(closeButton);
        tabsDiv.appendChild(tabDiv);
    });
}

function renameTab(index, title) {
    tabs[index].title = title;
    renderTabs();
}

function closeTab(index) {
    tabs.splice(index, 1);
    if (index === selectedTabIndex) {
        selectedTabIndex = Math.max(0, index - 1);
    }
    renderTabs();
    selectTab(selectedTabIndex);
}

function saveTabsToLocalStorage() {
    localStorage.setItem('tabs', JSON.stringify(tabs));
}

function loadTabsFromLocalStorage() {
    const savedTabs = localStorage.getItem('tabs');
    if (savedTabs) {
        tabs.push(...JSON.parse(savedTabs));
        renderTabs();
        selectTab(0);
    }
}

document.getElementById('new-tab').onclick = () => {
    tabs.push({ title: '', content: '' });
    renderTabs();
    selectTab(tabs.length - 1);
};

document.getElementById('save-tabs').onclick = () => {
    tabs[selectedTabIndex].content = notepad.value;
    saveTabsToLocalStorage();
};

document.getElementById('clear-tabs').onclick = () => {
    tabs.length = 0;
    selectedTabIndex = 0;
    notepad.value = '';
    renderTabs();
};

document.getElementById('print').addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print Notepad</title></head><body>');
    printWindow.document.write('<pre>' + notepad.value + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});

document.getElementById('download').addEventListener('click', () => {
    const title = tabs[selectedTabIndex].title || `Tab ${selectedTabIndex + 1}`;
    const content = notepad.value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});

notepad.onkeyup = () => {
    tabs[selectedTabIndex].content = notepad.value;
};

loadTabsFromLocalStorage();
