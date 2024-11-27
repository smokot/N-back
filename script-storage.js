function getData(key){
    return localStorage.getItem(key) ?? [];
}

function setData(key, value){
    localStorage.setItem(key, value);
}