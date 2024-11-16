function select(selector, flag) {
    return (flag=='all') ? document.querySelectorAll(selector) : document.querySelector(selector);
}

function hideElement(element) {
    select(element).style['display'] = 'none';
}

function showElement(element) {
    select(element).style['display'] = 'block';
}


select('.button.settings').addEventListener('mousedown', function(){
    showElement('.block.settings');
});

select('.block.settings').addEventListener('mouseleave', function(){
    hideElement('.block.settings');
});

function changeLevel(type){
    let arTypes = {'down': {"max":1, "add": -1}, 'up': {"max":99, "add": 1}};
    let n_level_element = select('.N-level .N-value');

    if(n_level_element.innerText != arTypes[type]['max']){
        let new_value = (parseInt(n_level_element.innerText));
        new_value = new_value + arTypes[type]['add'];
        n_level_element.innerText = new_value;
        settings['N'] = new_value;
    }
}


select('.N-level .arrow_left').addEventListener('mousedown', function(){
    changeLevel('down');
});

select('.N-level .arrow_right').addEventListener('mousedown', function(){
    changeLevel('up');
});