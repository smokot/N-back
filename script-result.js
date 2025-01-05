select('.go_home').addEventListener('mousedown', function(){
    ['.block.game', '.button.settings'].forEach((element)=>{
        showElement(element, 'flex');
    });

    showElement('.play', 'inline-block');
    hideElement('.block.result');
    hideElement('.go_home');
});


select('.block.result .repeat').addEventListener('click', function(){
    start();
});

