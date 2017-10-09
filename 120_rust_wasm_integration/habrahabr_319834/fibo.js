function fiboJs(num){
    var a = 1, b = 0, temp;

    while (num >= 0){
        temp = a;
        a = a + b;
        b = temp;
        num--;
    }

    return b;
}

const fiboJsRec = (num) => {
    if (num <= 1) return 1;

    return fiboJsRec(num - 1) + fiboJsRec(num - 2);
}

const fiboJsMemo = (num, memo) => {
    memo = memo || {};

    if (memo[num]) return memo[num];
    if (num <= 1) return 1;

    return memo[num] = fiboJsMemo(num - 1, memo) + fiboJsMemo(num - 2, memo);
}

module.exports = {fiboJs, fiboJsRec, fiboJsMemo};
