const valueDb = function (number) {

    if (typeof number === "number"){
        return number;
    } else {
        number = number.replace('.', '');
        number = number.replace('.', '');
        return number.replace(',', '.');
    }

};

export default valueDb;