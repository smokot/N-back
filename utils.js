function select(selector, flag) {
    return (flag=='all') ? document.querySelectorAll(selector) : document.querySelector(selector);
}
function hideElement(element) {
    select(element).style['display'] = 'none';
}

function showElement(element, showStyle) {
    select(element).style['display'] = showStyle;
}

function random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deleteIndexFromArray(paramIntIndex, paramArray){
    return paramArray.filter((_, index) => index !== paramIntIndex);
}

function generateRequiredShows(quantity, size){
    let array = Array(size).fill(0); 

    if(size >= quantity){
        while(quantity){
            let position = random_int(0, array.length - 1);
            if(array[position] == 0){
                array[position] = 1;
                quantity--;
            }
        }
    }

    return array;
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

function arrayFlip(array){
    array = Object.keys(array)                
    .reduce(function(obj, key) {                
            obj[array[key]] = key;
        return obj;
    }, {});  

    return array;
}

   