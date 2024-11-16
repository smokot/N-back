
//1)Если не будет показа стимулов, статистика будет хериться (будет % = 0)

//2)Иногда бывает что при показе одного, и нажатии в этом время пробела,
// следующий может перекрыть предыдущий , заложил data['lockedForPick'] на будущее


let data = {};
data['positions']   = select('.block .tile', 'all');
data['buttons']     = {'positions':select('.button.position'), 'audios':select('.button.audio'), 'colors':select('.button.color'), 'images':select('.button.image')};
data['audios']      = [
    'a.mp3','b.mp3','c.mp3','d.mp3','f.mp3','g.mp3','h.mp3','j.mp3','k.mp3','l.mp3','m.mp3','n.mp3',
    'б.mp3','в.mp3','г.mp3','д.mp3','к.mp3','л.mp3','м.mp3','н.mp3','п.mp3','с.mp3','э.mp3',
    'word_1.mp3','word_2.mp3','word_3.mp3','word_4.mp3','word_5.mp3','word_6.mp3','word_7.mp3','word_8.mp3'
];
data['colors']      = ['#49e00c','#0132fff2','#ed2727','#41405c','#0094ff','#92af7d'];
data['images']      = ['chess_1.png','chess_2.png','chess_3.png','figure_1.png','figure_2.png','figure_3.png'];
data['intervalObj'] = null;
data['savedElements'] = {'audios':[], 'positions':[], 'colors':[], 'images':[] ,'counter':0};
data['counter']     = 0;
data['result']      = {'percent':{},'correct':{'audios':0,'positions':0,'colors':0,'images':0}, 'incorrect':{'audios':0,'positions':0,'colors':0,'images':0}};
data['v-back']      = {'audios':0, 'positions':0, 'colors':0, 'images':0};
data['tilesLocked'] = [];

let settings = {
    'N'                      : 1,
    'highlightTileColor'     : '#616dea',
    'defaultTileColor'       : '#9cf',
    'defaultButtonColor'     : '#9faab5a1',
    'buttonColor'            : '#1f2224a1',
    'unHighlightTileInterval': 700,
    'ShowTimeInterval'       : 1500,
    'showQuantity'           : {"active": 20, "static": 20},
    'audioVolume'            : 0.3
}

function select(selector, flag) {
    return (flag=='all') ? document.querySelectorAll(selector) : document.querySelector(selector);
}
function hideElement(element) {
    select(element).style['display'] = 'none';
}

function showElement(element) {
    select(element).style['display'] = 'block';
}

function random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeColor(element, color) {
    element.style.backgroundColor = color;
}

function eventPosition(element) {
    changeColor(element,settings['highlightTileColor']);
    setTimeout(() => { 
        changeColor(element,settings['defaultTileColor']);
    }, settings['ShowTimeInterval']);
}

function eventAudio(audioElem) {
    let audio = new Audio('letters/'+audioElem);
    audio.volume = settings['audioVolume'];
    audio.play();
}

function eventColor(element, color){
    changeColor(element, color);
    setTimeout(() => { 
        changeColor(element,settings['defaultTileColor']);
    }, settings['ShowTimeInterval']);
}

function eventImage(element, image){
    element.style['background-image']      = 'url(pictures/objects/'+image+')';
    element.style['background-size']       = '70%';
    element.style['background-repeat']     = 'no-repeat';
    element.style['background-position-x'] = 'center';
    element.style['background-position-y'] = 'center';

    setTimeout(() => { 
        element.style['background-image'] = '';
    }, settings['ShowTimeInterval']);
}

function compareLast(type, isAfk){
    let stimulVback   = settings['N'] - data['v-back'][type];
    let resultCompare = data['savedElements'][type][settings['N']] == 
                        data['savedElements'][type][stimulVback];

    if(resultCompare && data['buttons'][type]['disabled'] == true){ 
        data['result']['correct'][type]++;
    }else if(!isAfk){
        data['result']['incorrect'][type]++;
    }

    if(isAfk && resultCompare){
        data['result']['incorrect'][type]++;
    }
}


function stimulReady(type){

    if(data['savedElements']['counter'] >= settings['N'] + 1){
        if(type != 'afk' && !data['buttons'][type]['disabled']){
            data['buttons'][type]['disabled'] = true;
            changeColor(data['buttons'][type], settings['buttonColor']);
            compareLast(type, false);
        }else{
            for(buttonType in data['buttons']){
                if(data['buttons'][buttonType]['disabled'] == false){
                    compareLast(buttonType, true);
                }
            }
        }
    }
}

function resetResults(){
    data['savedElements'] = {'audios':[], 'positions':[], 'colors':[], 'images':[] ,'counter':0};
    data['counter']     = 0;
    data['result']      = {'percent':{},'correct':{'audios':0,'positions':0,'colors':0,'images':0}, 'incorrect':{'audios':0,'positions':0,'colors':0,'images':0}};
    data['v-back']      = {'audios':0, 'positions':0, 'colors':0, 'images':0};
    settings['showQuantity']['active'] = settings['showQuantity']['static'];
  
    for(buttonType in data['buttons']){
        select('.v-label.'+buttonType).innerText = data['v-back'][buttonType];
    }

    select('.block.result .percent-score', 'all').forEach((item) => {
        let arColors = ['red','gray','yellow'];
        let itemClassName = item.classList[2];

        if(arColors.includes(itemClassName)){
            item.classList.remove(itemClassName);
        }
    });
}

function handleKeyDown(event){
    let arKeyStimules = {
        'p': 'positions',
        's': 'audios',
        'c': 'colors',
        'i': 'images',
    };

    if(event.code == "Space" && 
        select('.block.result').style['display'] == 'none')
    {
        console.log(data['savedElements']);
        stimulReady('afk');
        step();
    }
    else if(event.code == "Space" && select('.block.result').style['display'] != 'none'){
        resetResults();
        start();
    }
    
    if(stimul = arKeyStimules[event.key.toLowerCase()]){
        stimulReady(stimul);
    }
}

function eventButtons(){
    select('body').removeEventListener('keydown',handleKeyDown);
    select('body').addEventListener('keydown',handleKeyDown);
}

function getNextElement(type){
    let nextElement  = data[type][random_int(0, data[type].length - 1)];

    if(data['savedElements']['counter'] > settings['N']){
        if(random_int(-1, 1) > 0){
            nextElement = data['savedElements'][type][0];
        }
    }

    return nextElement;
}

function addNextElements(){
    let lengthPositions = data['savedElements']['positions'].length - 1;
    let lastPosition    = data['savedElements']['positions'][lengthPositions];

    let nextAudio = getNextElement('audios');
    let nextPosition = getNextElement('positions');
    let nextColor = getNextElement('colors');
    let nextImage = getNextElement('images');

    while(data['tilesLocked'].includes(nextPosition)){
        nextPosition = getNextElement('positions');
    }

    data['savedElements']['positions'].push(nextPosition);
    data['savedElements']['audios'].push(nextAudio);
    data['savedElements']['colors'].push(nextColor);
    data['savedElements']['images'].push(nextImage);
    data['savedElements']['counter']++;
    
    eventPosition(nextPosition);
    eventColor(nextPosition, nextColor);
    eventImage(nextPosition, nextImage)
    eventAudio(nextAudio);

    data['tilesLocked'].push(nextPosition);

    setTimeout(()=>{
        data['tilesLocked'] = data['tilesLocked'].filter(val => val != nextPosition);

    }, settings['ShowTimeInterval']);

    if(data['savedElements']['counter'] > settings['N']){
        for(buttonType in data['buttons']){
            data['v-back'][buttonType] = random_int(1, settings['N']);
            select('.v-label.'+buttonType).innerText = data['v-back'][buttonType];
        }
    }
}

function array_sum(array){
    let sum = 0;
    array.forEach(function(num) { 
        sum += num; 
    });

    return sum;
}


function setScore(element, score){
    if(isNaN(score)){
        score = 0;
    }
	
    score = parseInt(score);


    if(score < 40){
        element.classList.add('red');
    }

    if(score >= 40 && score <= 80){
        element.classList.add('gray');
    }

    if(score >= 80){
        element.classList.add('yellow');
    }

    element.innerText = score + '%';

    //Нужно затирать старые цвета(классы)
}

function isEnd(){
    if(settings['showQuantity']['active'] == 0){
        let correct_sum = array_sum(Object.values(data['result']['correct']));
        let incorrect_sum = array_sum(Object.values(data['result']['incorrect']));
        let all_shows = incorrect_sum + correct_sum;
        
        data['result']['percent'] = (correct_sum > 0) ? ((correct_sum / all_shows) * 100) : 0;

        hideElement('.block.game');
        showElement('.block.result');

        select('.block.result .percent-score', 'all').forEach((item) => {
            let itemClassName = item.classList[1];
            scorePercent = 0;

            if(itemClassName == 'final-score'){
                scorePercent = data['result']['percent'];
            }else{
                let intCorrect    = data['result']['correct'][itemClassName];
                let intIncorrect  = data['result']['incorrect'][itemClassName];
                scorePercent  = parseInt((( intCorrect / (intCorrect + intIncorrect)) * 100));
            }
            
            setScore(item, scorePercent);
        });
    }
}

function step(){
    if(data['savedElements']['counter'] > settings['N']){

        // FROM [a,b,c,d] TO [b,c,d]
        Object.keys(data['buttons']).forEach((stimulType) => {
            data['savedElements'][stimulType] = data['savedElements'][stimulType].slice(1, settings['N'] + 1); 
        });  
    }

    for(buttonType in data['buttons']){
        changeColor(data['buttons'][buttonType], settings['defaultButtonColor']);
        data['buttons'][buttonType]['disabled'] = false;
    }
    
    addNextElements();
    isEnd();
    settings['showQuantity']['active']--;
}


function start(){
    //if(data['intervalObj'] == null){

    select('.v-label','all').forEach((item)=>{
        item.style['display'] = 'block';
    });

        select('.level').innerText = "N = "+settings['N'];
        eventButtons();
        select('.play').style['display'] = 'none';
        select('.button.settings').style['display'] = 'none';
        select('.block.result').style['display'] = 'none';
        select('.block.game').style['display'] = 'block';

        // data['intervalObj'] = setInterval(() => {
        //     //step();
        // }, settings['highlightTileInterval']); 
    //}
}
