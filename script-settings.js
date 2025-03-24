
select('.button.settings').addEventListener('click', function(){
    showElement('.block.settings', 'inline-block');
});

select('.block.settings').addEventListener('mouseleave', function(){
    hideElement('.block.settings');
});

function calculateShowQuantity(){
    return (20 + 1) + (settings['N'] ** 2); 
}

function setShowQuantity(value){
    settings['showQuantity']['active'] = settings['showQuantity']['static'] = value;
}

function showStimul(className){
    showElement('.block.game .'+className+'-stimul','block');
    showElement('.block.result .'+className+'-stimul','block');
}

function hideStimul(className){
    hideElement('.block.game .'+className+'-stimul');
    hideElement('.block.result .'+className+'-stimul');
}

/**
 * Уровень
 */
select('.N-level .input-range input').addEventListener('change', function(){
    settings['N'] = this.value;
    setShowQuantity(calculateShowQuantity());
});

/**
 * Время показа
 */
select('.Show-time .input-range input').addEventListener('change', function(){
    settings['ShowTimeInterval'] = this.value;
});

/**
 * Математика
 */
select('.Math .input-range input').addEventListener('change', function(){
    settings['mathQuantity'] = this.value;
});

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
        }else{
            hideStimul(element.classList[1]);
        }
    });
});