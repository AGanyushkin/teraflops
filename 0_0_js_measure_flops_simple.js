mean = function (distr) {
    var sum = 0;
    for (obs in distr) {
        sum += distr[obs];
    };
    return sum / distr.length;
};

stdev = function (distr,mean) {
    var diffsquares = 0;
    for (obs in distr) {
        diffsquares += Math.pow(distr[obs] - mean , 2);
    };
    return Math.sqrt((diffsquares / distr.length));
};


let OPs = 1e6

let results = []
for (let t = 0; t < 60; t++) {
    let start = window.performance.now()
    for(let i = 0.5; i < OPs; i++){
        i++
    }
    let took = (window.performance.now() - start) * 1e-3
    let FLOPS = (OPs / 2) / took
    results.push(FLOPS)
}

average = mean(results);
deviation = stdev(results,average);

console.log('Average: '+average+' FLOPS. Standart deviation: '+deviation+' FLOPS');
