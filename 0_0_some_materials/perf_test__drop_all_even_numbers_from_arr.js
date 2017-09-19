function attempt() {
  const arr = new Array(1000).fill(null).map(() => Math.round(Math.random() * 1000));
  
  console.time('time');

  var len = arr.length, pointer = 0;
  for (var i = 0; i < len; i++) 
    if (arr[i] % 2 !== 0) 
    	arr[pointer++] = arr[i];
  arr.length = pointer;

  console.timeEnd('time');
}

for (let i = 0; i < 1000; i++) {
	attempt();
}

# time: 0.138ms
# time: 0.114ms
# time: 0.100ms
# time: 0.115ms
# time: 0.142ms
# time: 0.104ms
# time: 0.110ms
# time: 0.104ms
# time: 0.114ms
# time: 0.109ms
# time: 0.101ms
# time: 0.035ms
# time: 0.040ms
# time: 0.032ms
# time: 0.031ms
# time: 0.034ms
# ...
# time: 0.013ms
# time: 0.014ms
# time: 0.013ms
# time: 0.014ms
# time: 0.013ms
# time: 0.014ms
# time: 0.013ms
