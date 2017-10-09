int fibonacci(int n) {
  int a = 1;
  int b = 1;

  while (n-- > 1) {
    int t = a;
    a = b;
    b += t;
  }

  return b;
}

int fibonacciRec(int num) {
  if (num <= 1) return 1;

  return fibonacciRec(num - 1) + fibonacciRec(num - 2);
}

int memo[10000];

int fibonacciMemo(int n) {
  if (memo[n] != -1) return memo[n];

  if (n == 1 || n == 2) {
    return 1;
  } else {
    return memo[n] = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
  }
}

