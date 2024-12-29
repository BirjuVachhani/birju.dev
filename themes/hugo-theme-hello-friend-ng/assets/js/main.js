// Some code could be here ...
console.log("Main.js loaded");
document.querySelectorAll('pre').forEach(function (codeBlock) {
    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    var s = codeBlock.innerText;
    button.setAttribute('data-clipboard-text', s);
    codeBlock.classList.add('prettyprint');
    codeBlock.appendChild(button);
});

var clipboard = new ClipboardJS('.copy-code-button');

clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    e.trigger.textContent = 'Copiado';
    window.setTimeout(function () {
        e.trigger.textContent = 'Copiar';
    }, 2000);
    e.clearSelection();

});

clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    e.trigger.textContent = 'Erro ao Copiar';
    window.setTimeout(function () {
        e.trigger.textContent = 'Copiar';
    }, 2000);
    e.clearSelection();
});