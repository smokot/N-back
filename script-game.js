let data = {
    'positions'     : select('.block .tile', 'all'),
    'colors'        : ['#49e00c','#0132fff2','#ed2727','#41405c','#0094ff','#92af7d'],
    'tile-borders'  : ["solid", "dotted", "dashed", "double"],
    'intervalObj'   : null,
    'is_tile_locked': false,
    'result'        : {'percent':{}},
    'stimuli'       : {},
};

let settings = {
    'N'                      : 1,
    'highlightTileColor'     : '#616dea',
    'defaultTileColor'       : '#9cf',
    'defaultButtonColor'     : '#9faab5a1',
    'buttonColor'            : '#1f2224a1',
    'unHighlightTileInterval': 700,
    'ShowTimeInterval'       : 1500,
    'showQuantity'           : {"active": 20, "static": 20},
    'audioVolume'            : 0.4,
    'mathQuantity'           : 2
}

function eventAudio(audioElem) {
    let audio = new Audio('audios/'+audioElem);
    audio.volume = settings['audioVolume'];
    audio.play();
}

function eventColor(element, color){
    changeColor(element, color);
    setTimeout(() => { 
        changeColor(element,settings['defaultTileColor']);
    }, settings['ShowTimeInterval']);
}

function eventBorder(element, borderStyle){
    element.style['border'] = '13px';
    element.style['border-style'] = borderStyle;
    setTimeout(() => { 
        element.style['border'] = '';
        element.style['border-style'] = '';
    }, settings['ShowTimeInterval']);
}

function eventImage(element, image){
    element.style['background-image'] = 'url(pictures/objects/'+image+')';

    setTimeout(() => { 
        element.style['background-image'] = '';
    }, settings['ShowTimeInterval']);
}

function eventMath(element, example){
    let topElement  = element.parentNode.querySelector('.top');
    topElement.innerText = example;

    setTimeout(() => { 
       topElement.innerText = '';
    }, settings['ShowTimeInterval']);
}

function changeColor(element, color) {
    element.style['backgroundColor'] = color;
}

function compare(type, isAfk){
    let stimulVback   = settings['N'] - data['stimuli'][type]['v-back'];
    let resultCompare = data['stimuli'][type]['savedElements'][settings['N']] 
                        == 
                        data['stimuli'][type]['savedElements'][stimulVback];

    if(resultCompare && data['stimuli'][type]['element']['disabled'] == true){ 
        data['stimuli'][type]['result']['correct']++;
    }else if(!isAfk){
        data['stimuli'][type]['result']['incorrect']++;
    }

    if(isAfk && resultCompare){
        data['stimuli'][type]['result']['incorrect']++;
    }
}

function stimulReady(type){
    if(data['counter'] > settings['N']){
        if(type != 'afk' && !data['stimuli'][type]['element']['disabled']){
            data['stimuli'][type]['element']['disabled'] = true;
     
            changeColor(data['stimuli'][type]['element']['html'], settings['buttonColor']);
            compare(type, false);
        }else{
            select('.Stimules .button.choosed','all').forEach((item)=>{
                let stimulName = item.classList[1] + 's';
                if(data['stimuli'][stimulName]['element']['disabled'] == false){
                    compare(stimulName, true);
                }
            });
        }
    }
}

function handleKeyDown(event){
    if(data['is_tile_locked'] == false && select('.block.result').style['display'] == 'none')
    {
        let className       = (event.target.classList[2] ?? '');
        let isStimulReady   = className && event.button == 0;

        let isTile          = (event.target.classList[0] ?? '') == 'tile';
        let isButtonPressed = event.code == 'Space' || isTile;

        if(isStimulReady){
            stimulReady(className + 's');
        }
        else if(isButtonPressed){
            stimulReady('afk');
            step();
        }
    }
}

function eventButtons(){
    setTimeout(function(){
        select('body').removeEventListener('mousedown',handleKeyDown);
        select('body').addEventListener('mousedown',handleKeyDown);

        select('body').removeEventListener('keydown',handleKeyDown);
        select('body').addEventListener('keydown',handleKeyDown);
    }, 500);
}

function getLastElement(type){
    return data['stimuli'][type]['savedElements'][data['stimuli'][type]['savedElements'].length - 1] ?? '';
}

function getNextElement(type){
    let nextElement  = data['stimuli'][type]['data'][random_int(0, data['stimuli'][type]['data'].length - 1)];

    if(data['counter'] > settings['N']){
        let v_back_index   = (settings['N'] - data['stimuli'][type]['v-back']);
        let isRequiredShow = data['stimuli'][type]['requiredShow'][data['counter']] > 0;

        if(isRequiredShow){
            nextElement = data['stimuli'][type]['savedElements'][v_back_index] ?? nextElement;
        }
    }

    return nextElement;
}

function generateMathExample(size){
    let array = [];
    let sum = 0;

    for (let i = 0; i < size; i++) {
        let number = random_int(1, 15); 
        array.push(number); 
        sum += number;
    }

    let example = array.join(' + ');

    return {
        example: example,
        sum: sum
    };
}

function addNextElements(){
    let nextPosition = getNextElement('positions');

    select('.Stimules .button.choosed','all').forEach((item)=>{
        let className  = item.classList[1] + 's';
        let nextStimul = getNextElement(className);

        if(className == 'positions'){
            nextStimul = nextPosition;
        }

        if(className == 'math'){
            data['stimuli'][className]['savedElements'].push(nextStimul['sum']);
        }else{
            data['stimuli'][className]['savedElements'].push(nextStimul);
        }
        
        if(className == 'positions'){
            eventColor(nextPosition, settings['highlightTileColor']);
        }

        if(className == 'colors'){
            eventColor(nextPosition, nextStimul);
        }

        if(className == 'images'){
            eventImage(nextPosition, nextStimul)
        }

        if(className == 'audios'){
            eventAudio(nextStimul);
        }

        if(className == 'tile-borders'){
            eventBorder(nextPosition, nextStimul);
        }

        if(className = 'math'){
            eventMath(nextPosition, nextStimul['example']);
        }
    });
    data['counter']++;
    data['is_tile_locked'] = true;

    if(data['counter'] > settings['N']){
        for(buttonType in data['stimuli']){
            data['stimuli'][buttonType]['v-back'] = random_int(1, settings['N']);
            select('.game .v-label.'+buttonType).innerText = data['stimuli'][buttonType]['v-back'];
        }
    }

    setTimeout(()=>{
        data['is_tile_locked'] = false;
    }, settings['ShowTimeInterval']);
}

function getColorByScore(score){
    if(score < 40){
        return 'red';
    }

    if(score >= 40 && score < 80){
        return 'gray';
    }

    if(score >= 80){
        return 'yellow';
    }
    return '';
}

function shuffleButtons(){
    let arButtonsCells = select('.game .buttons .cell', 'all');
    
    arButtonsCells.forEach((item)=>{
        let randomCell = arButtonsCells[random_int(0, arButtonsCells.length - 1)];
        item.parentNode.insertBefore(item, randomCell);
    });
}

function setScore(element, score){
    if(isNaN(score)){
        score = 0;
    }
	
    score = parseInt(score);

    for(classColor of ['red', 'gray', 'yellow']){
        element.classList.remove(classColor);
    }

    element.classList.add(getColorByScore(score));
    element.innerText = score + '%';
}

function collectLastGames(value){
    let lastGames = getData('last-games');
    if(lastGames.length){
        lastGames = lastGames.split(',');
    }
    lastGames.push(value);

    if(lastGames.length == 21){
        lastGames = lastGames.slice(1, 20);
    }
    setData('last-games', lastGames);
}

function addLastGameRow(value, className){
    let lastGamesDiv        = select('.last-games');
    value                   = parseInt(value);
    lastGamesDiv.innerHTML += '<div class="'+className+' '+getColorByScore(value)+'">'+parseInt(value)+'%</div>\n';
}

function drawLastGamesRows(){
    let lastGames = getData('last-games');
    if(lastGames.length){
        lastGames = lastGames.split(',');
        let scoreSum = 0;
        lastGames.forEach((item)=>{
            scoreSum += parseInt(item);
            addLastGameRow(item,'score');
        });

        scoreSum = scoreSum / lastGames.length;
        addLastGameRow(scoreSum,'avg score');
    }
}

function loadStimuliData(strStimulName, strCategoryName, intMaxQuantity){
    let arExctentions = {'audios' : '.mp3', "images":".png"};
    let strExctention = arExctentions[strStimulName];
    for(let intCounter = 1; intCounter <= intMaxQuantity; intCounter++){
        data['stimuli'][strStimulName]['data'].push(strCategoryName + "_" + intCounter.toString() + strExctention);
    }
}

function calculatePercent(){
    let arResultData = {
        'correct_sum'  : 0,
        'incorrect_sum': 0,
        'all_shows'    : 0
    };

    for(stimulName in data['stimuli']){
        arResultData['correct_sum']   += data['stimuli'][stimulName]['result']['correct'];
        arResultData['incorrect_sum'] += data['stimuli'][stimulName]['result']['incorrect'];
    }

    arResultData['all_shows'] = arResultData['correct_sum'] + arResultData['incorrect_sum'];
    data['result']['percent'] = (arResultData['correct_sum'] > 0) ? ((arResultData['correct_sum'] / arResultData['all_shows']) * 100) : 0;
}

function showResult(){

    hideElement('.block.game');
    showElement('.block.result', 'flex');
    showElement('.go_home', 'flex');
}

function updateResultLabels(){
    setScore(select('.block.result .percent-score.final-score'), data['result']['percent']);

    select('.block.result .buttons .cell .v-label', 'all').forEach((item) => {
        let itemClassName = item.classList[1];
        scorePercent = 0;

        if(itemClassName == 'final-score'){
            scorePercent = data['result']['percent'];
        }else{
            let intCorrect    = data['stimuli'][itemClassName]['result']['correct'];
            let intIncorrect  = data['stimuli'][itemClassName]['result']['incorrect'];
            scorePercent      = parseInt((( intCorrect / (intCorrect + intIncorrect)) * 100));
        }
        
        setScore(item, scorePercent);
    });
}

function updateLevelByScoreColor(){
    let intFinalPercent = isNaN(data['result']['percent']) ? 0 : parseInt(data['result']['percent']);
    let scoreColor      = getColorByScore(intFinalPercent);

    if(scoreColor == "yellow"){
        settings['N']++;
    }

    if(scoreColor == "red" && settings['N'] != 1){
        settings['N']--;
    }

    let nLevel            = select('.block.result .repeat .level');
    nLevel.innerText      = "N = " + settings['N'];
    nLevel.style['color'] = scoreColor;
}

function unsetHandlers(){
    select('body').removeEventListener('keydown', handleKeyDown);

    select('.block.game .tile','all').forEach((element) => {
        element.removeEventListener('click', handleKeyDown);
    });
}

function end(){
    calculatePercent();
    showResult();

    updateResultLabels();
    updateLevelByScoreColor();

    unsetHandlers();

    data['counter'] = 0;
}

function isEnd(){
    if(settings['showQuantity']['active'] == 0){
        return true;
    }else{
        return false;
    }

}

function step(){
    if(data['counter'] > settings['N']){
        // FROM [a,b,c,d] TO [b,c,d]
        Object.keys(data['stimuli']).forEach((stimulType) => {
            data['stimuli'][stimulType]['savedElements'] = data['stimuli'][stimulType]['savedElements'].slice(1, settings['N'] + 1); 
        });  
    }

    for(buttonType in data['stimuli']){
        changeColor(data['stimuli'][buttonType]['element']['html'], settings['defaultButtonColor']);
        data['stimuli'][buttonType]['element']['disabled'] = false;
    }

    if(!isEnd()){
        addNextElements();
    }else{
        end();
    }
    
    settings['showQuantity']['active']--;
}

function start(){
    shuffleButtons();

    let arData = {
        'position':       data['positions'],
        'audio':          [],
        'color':          data['colors'],
        'image':          [],
        'tile-border':    data['tile-borders'],
        'math':           [],
    }

    data['counter'] = 0;

    for(buttonType in arData){
        let class_s = buttonType + 's';
        
        data['stimuli'][class_s] = {
            'element'       : {'disabled': true, 'html': select('.block.game .button.'+buttonType)},
            'requiredShow'  : generateRequiredShows(parseInt(settings['showQuantity']['static'] / 2), settings['showQuantity']['static']),
            'savedElements' : [],
            'data'          : arData[buttonType],
            'v-back'        : 0,
            'result'        : {
                'correct'   : 0,
                'incorrect' : 0
            }
        };
    }

    settings['showQuantity']['active']   = settings['showQuantity']['static'];
    data['stimuli']['positions']['data'] = data['positions'];

    loadStimuliData('audios', 'letter', 9);
    loadStimuliData('audios', 'double_word', 8);
    loadStimuliData('audios', 'word', 8);
    loadStimuliData('audios', 'piano', 7);

    loadStimuliData('images', 'animal', 5);
    loadStimuliData('images', 'chess', 5);
    loadStimuliData('images', 'eiroglif', 3);
    loadStimuliData('images', 'figure', 6);
    loadStimuliData('images', 'man', 5);
    loadStimuliData('images', 'smile', 5);
    loadStimuliData('images', 'weapon', 4);

    for(let intCounter = 1; intCounter <= 100; intCounter++){
        nextStimul = generateMathExample(settings['mathQuantity']);
        data['stimuli']['maths']['data'].push(nextStimul);
    }

    //if(data['intervalObj'] == null){

    select('.level').innerText = "N = "+settings['N'];
    eventButtons();

    hideElement('.play'); 
    hideElement('.go_home'); 
    hideElement('.button.settings'); 
    hideElement('.block.result'); 

    showElement('.block.game', 'flex');
    
        // data['intervalObj'] = setInterval(() => {
        //     //step();
        // }, settings['highlightTileInterval']); 
    //}
}
