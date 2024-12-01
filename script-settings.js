
select('.button.settings').addEventListener('click', function(){
    showElement('.block.settings');
});

select('.block.settings').addEventListener('mouseleave', function(){
    hideElement('.block.settings');
});

select('.block.settings .close').addEventListener('click', function(){
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
    select('.level').innerText = "N = "+settings['N'];
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

function showStimul(className){
    showElement('.block.game .'+className+'-stimul');
    showElement('.block.result .percent-score.'+className+'s');
    showElement('.block.result .button.'+className);
}

function hideStimul(className){
    hideElement('.block.game .'+className+'-stimul');
    hideElement('.block.result .percent-score.'+className+'s');
    hideElement('.block.result .button.'+className);
}

function arrayOfElementsHaveClass(arrayOfElements, className){
    let haveClass = false;

    arrayOfElements.forEach((element)=>{
        if(element.classList.contains(className)){
            haveClass = true;
        }
    });

    return haveClass;
}


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
            showStimul(element.classList[1]);

            if(element.classList[1] == 'image-category'){
                if(!arrayOfElementsHaveClass(all_buttons_choosed, 'image')){
                    showStimul('image');
                    select('.block.settings .Stimules .button.image').classList.toggle('choosed');
                }
            }

            if(element.classList[1] == 'audio-category'){
                if(!arrayOfElementsHaveClass(all_buttons_choosed, 'audio')){
                    showStimul('audio');
                    select('.block.settings .Stimules .button.audio').classList.toggle('choosed');
                }
            }

        }else{
            hideStimul(element.classList[1]);

            if(element.classList[1] == 'image'){
                if(arrayOfElementsHaveClass(all_buttons_choosed, 'image-category')){
                    hideStimul('image-category');
                    select('.block.settings .Stimules .button.image-category').classList.toggle('choosed');
                }
            }

            if(element.classList[1] == 'audio'){
                if(arrayOfElementsHaveClass(all_buttons_choosed, 'audio-category')){
                    hideStimul('audio-category');
                    select('.block.settings .Stimules .button.audio-category').classList.toggle('choosed');
                }
            }
        }
    });
});

///////////////





