function select(selector, flag) {
    return (flag=='all') ? document.querySelectorAll(selector) : document.querySelector(selector);
}

function hideElement(element) {
    select(element).style['display'] = 'none';
}

function showElement(element) {
    select(element).style['display'] = 'inline-block';
}


select('.block.result .go_home').addEventListener('mousedown', function(){
    resetResults();
    
    showElement('.block.game');
    showElement('.play');
    showElement('.button.settings');
    hideElement('.block.result');
});

