
select('.button.settings').addEventListener('mousedown', function(){
    showElement('.block.settings');
});

select('.block.settings').addEventListener('mouseleave', function(){
    hideElement('.block.settings');
});

function showElement(element) {
    select(element).style['display'] = 'block';
}

function calculateShowQuantity(){
    return (20 + 1) + (settings['N'] ** 2); 
}

function setShowQuantity(value){
    settings['showQuantity']['static'] = value;
    settings['showQuantity']['active'] = value;
}

function changeLevel(type){
    let arTypes = {'down': {"max":1, "add": -1}, 'up': {"max":99, "add": 1}};
    let n_level_element = select('.N-level .num-value');
    let show_quantity_element = select('.Show-quantity .num-value');

    if(n_level_element.innerText != arTypes[type]['max']){
        let new_value = (parseInt(n_level_element.innerText));
        new_value = new_value + arTypes[type]['add'];
        n_level_element.innerText = new_value;
        settings['N'] = new_value;
    }
    let calculatedShowQuantity = calculateShowQuantity();
    setShowQuantity(calculatedShowQuantity);
    show_quantity_element.innerText = calculatedShowQuantity;
}

function changeShowQuantity(type){
    let arTypes = {
        'down': {"max":calculateShowQuantity(), "add": -5}, 
        'up': {"max":999, "add": 5}
    };
    let show_quantity_element = select('.Show-quantity .num-value');

    if((type == "down" && parseInt(show_quantity_element.innerText) > arTypes[type]['max']) ||
       (type == "up" && parseInt(show_quantity_element.innerText) < arTypes[type]['max']) )
    {
        let new_value = (parseInt(show_quantity_element.innerText));
        new_value = new_value + arTypes[type]['add'];
        show_quantity_element.innerText = new_value;

        setShowQuantity(new_value);
    }
}

function changeShowTime(type){
    let arTypes = {
        'down': {"max":300, "add": -100}, 
        'up': {"max":10000, "add": 100}
    };
    let show_time_element = select('.Show-time .num-value');

    if(show_time_element.innerText != arTypes[type]['max']){
        let new_value = (parseInt(show_time_element.innerText));
        new_value = new_value + arTypes[type]['add'];
        show_time_element.innerText = new_value;

        settings['ShowTimeInterval'] = new_value;
    }
}


/**
 * Уровень
 */
select('.N-level .arrow_left').addEventListener('mousedown', function(){
    changeLevel('down');
});

select('.N-level .arrow_right').addEventListener('mousedown', function(){
    changeLevel('up');
});

////////////////////////////////


/**
 * Кол-во показов
 */
select('.Show-quantity .arrow_left').addEventListener('mousedown', function(){
    changeShowQuantity('down');
});

select('.Show-quantity .arrow_right').addEventListener('mousedown', function(){
    changeShowQuantity('up');
});


///////////////////////////////////////////

/**
 * Время показа
 */
select('.Show-time .arrow_left').addEventListener('mousedown', function(){
    changeShowTime('down');
});

select('.Show-time .arrow_right').addEventListener('mousedown', function(){
    changeShowTime('up');
});

///////////////////////////////////////////




/**
 * Стимулы
 */
select('.block.settings .Stimules .button','all').forEach((element) => {
    element.addEventListener('mousedown', function(){
        let all_buttons_choosed = select('.block.settings .Stimules .button.choosed','all');

        if(all_buttons_choosed.length != 1 || !element.classList.contains('choosed')){
            element.classList.toggle('choosed');
        }
       
        if(element.classList.contains('choosed')){
            showElement('.block.game .'+element.classList[1]+'-stimul');
            showElement('.block.result .percent-score.'+element.classList[1]+'s');
            showElement('.block.result .button.'+element.classList[1]);
        }else{
            hideElement('.block.game .'+element.classList[1]+'-stimul');
            hideElement('.block.result .percent-score.'+element.classList[1]+'s');
            hideElement('.block.result .button.'+element.classList[1]);
        }
    });
});

///////////////





