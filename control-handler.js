if(rangeElements = document.querySelectorAll('.input-range')){
    rangeElements.forEach(function(rangeElement){
        let label = rangeElement.querySelector('.input-range label.value');
        let range = rangeElement.querySelector('input[type=range]');

        if(range){
            range.addEventListener('mousemove', function(){
                if(label){
                    label.innerText = this.value;
                }
            });
        }
    });
}
