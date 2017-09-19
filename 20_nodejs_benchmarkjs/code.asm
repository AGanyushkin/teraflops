--- FUNCTION SOURCE (path.js:normalizeStringWin32) id{0,0} ---
(path, allowAboveRoot) {
  var res = '';
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47/*/*/ || code === 92/*\x5c*/)
      break;
    else
      code = 47/*/*/;
    if (code === 47/*/*/ || code === 92/*\x5c*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 ||
            res.charCodeAt(res.length - 1) !== 46/*.*/ ||
            res.charCodeAt(res.length - 2) !== 46/*.*/) {
          if (res.length > 2) {
            const start = res.length - 1;
            var j = start;
            for (; j >= 0; --j) {
              if (res.charCodeAt(j) === 92/*\x5c*/)
                break;
            }
            if (j !== start) {
              if (j === -1)
                res = '';
              else
                res = res.slice(0, j);
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '\x5c\x5c..';
          else
            res = '..';
        }
      } else {
        if (res.length > 0)
          res += '\x5c\x5c' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46/*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
--- END ---
--- Raw source ---
(path, allowAboveRoot) {
  var res = '';
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47/*/*/ || code === 92/*\x5c*/)
      break;
    else
      code = 47/*/*/;
    if (code === 47/*/*/ || code === 92/*\x5c*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 ||
            res.charCodeAt(res.length - 1) !== 46/*.*/ ||
            res.charCodeAt(res.length - 2) !== 46/*.*/) {
          if (res.length > 2) {
            const start = res.length - 1;
            var j = start;
            for (; j >= 0; --j) {
              if (res.charCodeAt(j) === 92/*\x5c*/)
                break;
            }
            if (j !== start) {
              if (j === -1)
                res = '';
              else
                res = res.slice(0, j);
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '\x5c\x5c..';
          else
            res = '..';
        }
      } else {
        if (res.length > 0)
          res += '\x5c\x5c' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46/*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}


--- Optimized code ---
optimization_id = 0
source_position = 355
kind = OPTIMIZED_FUNCTION
name = normalizeStringWin32
stack_slots = 12
compiler = crankshaft
Instructions (size = 2792)
0000013FD3443980     0  55             push rbp
0000013FD3443981     1  4889e5         REX.W movq rbp,rsp
0000013FD3443984     4  56             push rsi
0000013FD3443985     5  57             push rdi
0000013FD3443986     6  4883ec40       REX.W subq rsp,0x40
                  ;;; <@0,#0> -------------------- B0 --------------------
                  ;;; <@8,#5> prologue
                  ;;; Prologue begin
                  ;;; Prologue end
                  ;;; <@12,#7> -------------------- B1 --------------------
                  ;;; <@14,#8> context
0000013FD344398A    10  488b45f8       REX.W movq rax,[rbp-0x8]
                  ;;; <@15,#8> gap
0000013FD344398E    14  488945e8       REX.W movq [rbp-0x18],rax
                  ;;; <@18,#12> -------------------- B2 --------------------
                  ;;; <@19,#12> gap
0000013FD3443992    18  488bf0         REX.W movq rsi,rax
                  ;;; <@20,#14> stack-check
0000013FD3443995    21  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000013FD344399C    28  7305           jnc 35  (0000013FD34439A3)
0000013FD344399E    30  e89d49f4ff     call StackCheck  (0000013FD3388340)    ;; code: BUILTIN
                  ;;; <@22,#14> lazy-bailout
                  ;;; <@23,#14> gap
0000013FD34439A3    35  488b4518       REX.W movq rax,[rbp+0x18]
                  ;;; <@24,#39> check-non-smi
0000013FD34439A7    39  a801           test al,0x1
0000013FD34439A9    41  0f842e090000   jz 2397  (0000013FD34442DD)
                  ;;; <@26,#40> check-instance-type
0000013FD34439AF    47  4c8b50ff       REX.W movq r10,[rax-0x1]
0000013FD34439B3    51  41f6420b80     testb [r10+0xb],0x80
0000013FD34439B8    56  0f8524090000   jnz 2402  (0000013FD34442E2)
                  ;;; <@28,#67> check-maps
                  ;;; <@30,#35> gap
0000013FD34439BE    62  4c8b4510       REX.W movq r8,[rbp+0x10]
0000013FD34439C2    66  48bf0928b84d33010000 REX.W movq rdi,000001334DB82809    ;; object: 000001334DB82809 <String[0]: >
0000013FD34439CC    76  beffffffff     movl rsi,00000000FFFFFFFF
0000013FD34439D1    81  33c9           xorl rcx,rcx
0000013FD34439D3    83  48ba4122b84d33010000 REX.W movq rdx,000001334DB82241    ;; object: 000001334DB82241 <undefined>
0000013FD34439DD    93  33db           xorl rbx,rbx
                  ;;; <@32,#36> -------------------- B3 (loop header) --------------------
0000013FD34439DF    95  48897dd0       REX.W movq [rbp-0x30],rdi
0000013FD34439E3    99  48894dd8       REX.W movq [rbp-0x28],rcx
0000013FD34439E7   103  48895de0       REX.W movq [rbp-0x20],rbx
                  ;;; <@34,#41> load-named-field
0000013FD34439EB   107  448b4813       movl r9,[rax+0x13]
                  ;;; <@37,#42> compare-numeric-and-branch
0000013FD34439EF   111  413bd9         cmpl rbx,r9
0000013FD34439F2   114  0f8f44060000   jg 1724  (0000013FD344403C)
                  ;;; <@38,#43> -------------------- B4 (unreachable/replaced) --------------------
                  ;;; <@42,#49> -------------------- B5 --------------------
                  ;;; <@44,#51> stack-check
0000013FD34439F8   120  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000013FD34439FF   127  0f8242060000   jc 1735  (0000013FD3444047)
                  ;;; <@47,#56> compare-numeric-and-branch
0000013FD3443A05   133  413bd9         cmpl rbx,r9
0000013FD3443A08   136  0f8c30000000   jl 190  (0000013FD3443A3E)
                  ;;; <@48,#60> -------------------- B6 (unreachable/replaced) --------------------
                  ;;; <@52,#76> -------------------- B7 --------------------
                  ;;; <@53,#76> gap
0000013FD3443A0E   142  4c8bca         REX.W movq r9,rdx
                  ;;; <@54,#671> tagged-to-i
0000013FD3443A11   145  41f6c101       testb r9,0x1
0000013FD3443A15   149  0f8574060000   jnz 1807  (0000013FD344408F)
0000013FD3443A1B   155  49c1e920       REX.W shrq r9, 32
                  ;;; <@57,#79> compare-numeric-and-branch
0000013FD3443A1F   159  4183f92f       cmpl r9,0x2f
0000013FD3443A23   163  0f8413060000   jz 1724  (0000013FD344403C)
                  ;;; <@58,#83> -------------------- B8 (unreachable/replaced) --------------------
                  ;;; <@62,#86> -------------------- B9 --------------------
                  ;;; <@65,#89> compare-numeric-and-branch
0000013FD3443A29   169  4183f95c       cmpl r9,0x5c
0000013FD3443A2D   173  0f8409060000   jz 1724  (0000013FD344403C)
                  ;;; <@66,#93> -------------------- B10 (unreachable/replaced) --------------------
                  ;;; <@70,#99> -------------------- B11 --------------------
                  ;;; <@72,#105> gap
0000013FD3443A33   179  41b92f000000   movl r9,000000000000002F
                  ;;; <@73,#105> goto
0000013FD3443A39   185  e98d000000     jmp 331  (0000013FD3443ACB)
                  ;;; <@74,#57> -------------------- B12 (unreachable/replaced) --------------------
                  ;;; <@78,#63> -------------------- B13 --------------------
                  ;;; <@80,#72> load-named-field
0000013FD3443A3E   190  8b5013         movl rdx,[rax+0x13]
                  ;;; <@82,#73> bounds-check
0000013FD3443A41   193  3bd3           cmpl rdx,rbx
0000013FD3443A43   195  0f869e080000   jna 2407  (0000013FD34442E7)
                  ;;; <@83,#73> gap
0000013FD3443A49   201  4c8bc8         REX.W movq r9,rax
0000013FD3443A4C   204  488bd3         REX.W movq rdx,rbx
                  ;;; <@84,#74> string-char-code-at
0000013FD3443A4F   207  4d8b59ff       REX.W movq r11,[r9-0x1]
0000013FD3443A53   211  450fb65b0b     movzxbl r11,[r11+0xb]
0000013FD3443A58   216  41f6c301       testb r11,0x1
0000013FD3443A5C   220  742e           jz 268  (0000013FD3443A8C)
0000013FD3443A5E   222  41f6c302       testb r11,0x2
0000013FD3443A62   226  740d           jz 241  (0000013FD3443A71)
0000013FD3443A64   228  458b5923       movl r11,[r9+0x23]
0000013FD3443A68   232  4903d3         REX.W addq rdx,r11
0000013FD3443A6B   235  4d8b4917       REX.W movq r9,[r9+0x17]
0000013FD3443A6F   239  eb12           jmp 259  (0000013FD3443A83)
0000013FD3443A71   241  4d8b55c8       REX.W movq r10,[r13-0x38]
0000013FD3443A75   245  4d39511f       REX.W cmpq [r9+0x1f],r10
0000013FD3443A79   249  0f8548060000   jnz 1863  (0000013FD34440C7)
0000013FD3443A7F   255  4d8b4917       REX.W movq r9,[r9+0x17]
0000013FD3443A83   259  4d8b59ff       REX.W movq r11,[r9-0x1]
0000013FD3443A87   263  450fb65b0b     movzxbl r11,[r11+0xb]
0000013FD3443A8C   268  41f6c303       testb r11,0x3
0000013FD3443A90   272  7422           jz 308  (0000013FD3443AB4)
0000013FD3443A92   274  41f6c310       testb r11,0x10
0000013FD3443A96   278  0f852b060000   jnz 1863  (0000013FD34440C7)
0000013FD3443A9C   284  41f6c304       testb r11,0x4
0000013FD3443AA0   288  4d8b591f       REX.W movq r11,[r9+0x1f]
0000013FD3443AA4   292  7507           jnz 301  (0000013FD3443AAD)
0000013FD3443AA6   294  450fb71c53     movzxwl r11,[r11+rdx*2]
0000013FD3443AAB   299  eb1b           jmp 328  (0000013FD3443AC8)
0000013FD3443AAD   301  450fb61c13     movzxbl r11,[r11+rdx*1]
0000013FD3443AB2   306  eb14           jmp 328  (0000013FD3443AC8)
0000013FD3443AB4   308  41f6c304       testb r11,0x4
0000013FD3443AB8   312  7508           jnz 322  (0000013FD3443AC2)
0000013FD3443ABA   314  450fb75c5117   movzxwl r11,[r9+rdx*2+0x17]
0000013FD3443AC0   320  eb06           jmp 328  (0000013FD3443AC8)
0000013FD3443AC2   322  450fb65c1117   movzxbl r11,[r9+rdx*1+0x17]
                  ;;; <@86,#103> gap
0000013FD3443AC8   328  4d8bcb         REX.W movq r9,r11
                  ;;; <@88,#107> -------------------- B14 --------------------
0000013FD3443ACB   331  4c894dc8       REX.W movq [rbp-0x38],r9
                  ;;; <@91,#110> compare-numeric-and-branch
0000013FD3443ACF   335  4183f92f       cmpl r9,0x2f
0000013FD3443AD3   339  0f8441000000   jz 410  (0000013FD3443B1A)
                  ;;; <@92,#114> -------------------- B15 (unreachable/replaced) --------------------
                  ;;; <@96,#117> -------------------- B16 --------------------
                  ;;; <@99,#120> compare-numeric-and-branch
0000013FD3443AD9   345  4183f95c       cmpl r9,0x5c
0000013FD3443ADD   349  0f8437000000   jz 410  (0000013FD3443B1A)
                  ;;; <@100,#124> -------------------- B17 (unreachable/replaced) --------------------
                  ;;; <@104,#603> -------------------- B18 --------------------
                  ;;; <@107,#606> compare-numeric-and-branch
0000013FD3443AE3   355  4183f92e       cmpl r9,0x2e
0000013FD3443AE7   359  0f851a000000   jnz 391  (0000013FD3443B07)
                  ;;; <@108,#610> -------------------- B19 (unreachable/replaced) --------------------
                  ;;; <@112,#607> -------------------- B20 (unreachable/replaced) --------------------
                  ;;; <@116,#613> -------------------- B21 --------------------
                  ;;; <@119,#616> compare-numeric-and-branch
0000013FD3443AED   365  83f9ff         cmpl rcx,0xff
0000013FD3443AF0   368  0f8411000000   jz 391  (0000013FD3443B07)
                  ;;; <@120,#620> -------------------- B22 (unreachable/replaced) --------------------
                  ;;; <@124,#623> -------------------- B23 --------------------
                  ;;; <@125,#623> gap
0000013FD3443AF6   374  488bd1         REX.W movq rdx,rcx
                  ;;; <@126,#626> add-i
0000013FD3443AF9   377  83c201         addl rdx,0x1
0000013FD3443AFC   380  0f80ea070000   jo 2412  (0000013FD34442EC)
                  ;;; <@129,#632> goto
0000013FD3443B02   386  e905000000     jmp 396  (0000013FD3443B0C)
                  ;;; <@130,#617> -------------------- B24 (unreachable/replaced) --------------------
                  ;;; <@134,#628> -------------------- B25 --------------------
                  ;;; <@136,#634> gap
0000013FD3443B07   391  baffffffff     movl rdx,00000000FFFFFFFF
                  ;;; <@138,#638> -------------------- B26 --------------------
                  ;;; <@140,#640> gap
0000013FD3443B0C   396  488bc2         REX.W movq rax,rdx
0000013FD3443B0F   399  488bd7         REX.W movq rdx,rdi
0000013FD3443B12   402  488bde         REX.W movq rbx,rsi
                  ;;; <@141,#640> goto
0000013FD3443B15   405  e9f2040000     jmp 1676  (0000013FD344400C)
                  ;;; <@142,#121> -------------------- B27 (unreachable/replaced) --------------------
                  ;;; <@146,#111> -------------------- B28 (unreachable/replaced) --------------------
                  ;;; <@150,#127> -------------------- B29 --------------------
                  ;;; <@151,#127> gap
0000013FD3443B1A   410  488bd3         REX.W movq rdx,rbx
                  ;;; <@152,#131> sub-i
0000013FD3443B1D   413  83ea01         subl rdx,0x1
0000013FD3443B20   416  0f80cb070000   jo 2417  (0000013FD34442F1)
                  ;;; <@155,#133> compare-numeric-and-branch
0000013FD3443B26   422  3bf2           cmpl rsi,rdx
0000013FD3443B28   424  0f84d1040000   jz 1663  (0000013FD3443FFF)
                  ;;; <@156,#137> -------------------- B30 (unreachable/replaced) --------------------
                  ;;; <@160,#140> -------------------- B31 --------------------
                  ;;; <@163,#143> compare-numeric-and-branch
0000013FD3443B2E   430  83f901         cmpl rcx,0x1
0000013FD3443B31   433  0f84c8040000   jz 1663  (0000013FD3443FFF)
                  ;;; <@164,#147> -------------------- B32 (unreachable/replaced) --------------------
                  ;;; <@168,#150> -------------------- B33 --------------------
                  ;;; <@171,#156> compare-numeric-and-branch
0000013FD3443B37   439  3bf2           cmpl rsi,rdx
0000013FD3443B39   441  0f84c0030000   jz 1407  (0000013FD3443EFF)
                  ;;; <@172,#160> -------------------- B34 (unreachable/replaced) --------------------
                  ;;; <@176,#163> -------------------- B35 --------------------
                  ;;; <@179,#166> compare-numeric-and-branch
0000013FD3443B3F   447  83f902         cmpl rcx,0x2
0000013FD3443B42   450  0f8408000000   jz 464  (0000013FD3443B50)
                  ;;; <@180,#170> -------------------- B36 --------------------
                  ;;; <@182,#172> gap
0000013FD3443B48   456  498bc0         REX.W movq rax,r8
                  ;;; <@183,#172> goto
0000013FD3443B4B   459  e9b2030000     jmp 1410  (0000013FD3443F02)
                  ;;; <@184,#167> -------------------- B37 (unreachable/replaced) --------------------
                  ;;; <@188,#173> -------------------- B38 --------------------
                  ;;; <@189,#173> gap
0000013FD3443B50   464  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443B54   468  488bd7         REX.W movq rdx,rdi
                  ;;; <@190,#175> load-named-generic
0000013FD3443B57   471  48b99134b84d33010000 REX.W movq rcx,000001334DB83491    ;; object: 000001334DB83491 <String[6]: length>
0000013FD3443B61   481  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443B6B   491  48b80000000017000000 REX.W movq rax,0000001700000000
0000013FD3443B75   501  e846fbffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@192,#176> lazy-bailout
                  ;;; <@193,#176> gap
0000013FD3443B7A   506  488bd8         REX.W movq rbx,rax
                  ;;; <@194,#675> tagged-to-i
0000013FD3443B7D   509  f6c301         testb rbx,0x1
0000013FD3443B80   512  0f859f050000   jnz 1957  (0000013FD3444125)
0000013FD3443B86   518  48c1eb20       REX.W shrq rbx, 32
                  ;;; <@197,#178> compare-numeric-and-branch
0000013FD3443B8A   522  83fb02         cmpl rbx,0x2
0000013FD3443B8D   525  0f8cdd000000   jl 752  (0000013FD3443C70)
                  ;;; <@198,#182> -------------------- B39 (unreachable/replaced) --------------------
                  ;;; <@202,#185> -------------------- B40 --------------------
                  ;;; <@203,#185> gap
0000013FD3443B93   531  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443B97   535  488b55d0       REX.W movq rdx,[rbp-0x30]
                  ;;; <@204,#187> load-named-generic
0000013FD3443B9B   539  48b90178ba4d33010000 REX.W movq rcx,000001334DBA7801    ;; object: 000001334DBA7801 <String[10]: charCodeAt>
0000013FD3443BA5   549  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443BAF   559  48b8000000001c000000 REX.W movq rax,0000001C00000000
0000013FD3443BB9   569  e802fbffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@205,#187> gap
0000013FD3443BBE   574  488945c0       REX.W movq [rbp-0x40],rax
                  ;;; <@206,#188> lazy-bailout
                  ;;; <@207,#188> gap
0000013FD3443BC2   578  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443BC6   582  488b55d0       REX.W movq rdx,[rbp-0x30]
                  ;;; <@208,#190> load-named-generic
0000013FD3443BCA   586  0f1f440000     nop
0000013FD3443BCF   591  48b99134b84d33010000 REX.W movq rcx,000001334DB83491    ;; object: 000001334DB83491 <String[6]: length>
0000013FD3443BD9   601  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443BE3   611  48b8000000001e000000 REX.W movq rax,0000001E00000000
0000013FD3443BED   621  e8cefaffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@210,#191> lazy-bailout
                  ;;; <@211,#191> gap
0000013FD3443BF2   626  488bd8         REX.W movq rbx,rax
                  ;;; <@212,#676> tagged-to-i
0000013FD3443BF5   629  f6c301         testb rbx,0x1
0000013FD3443BF8   632  0f855e050000   jnz 2012  (0000013FD344415C)
0000013FD3443BFE   638  48c1eb20       REX.W shrq rbx, 32
                  ;;; <@214,#193> sub-i
0000013FD3443C02   642  83eb01         subl rbx,0x1
0000013FD3443C05   645  0f80eb060000   jo 2422  (0000013FD34442F6)
                  ;;; <@216,#677> smi-tag
0000013FD3443C0B   651  8bc3           movl rax,rbx
0000013FD3443C0D   653  48c1e020       REX.W shlq rax, 32
                  ;;; <@218,#197> push-argument
0000013FD3443C11   657  ff75d0         push [rbp-0x30]
                  ;;; <@220,#197> push-argument
0000013FD3443C14   660  50             push rax
                  ;;; <@222,#625> constant-i
0000013FD3443C15   661  b801000000     movl rax,0000000000000001
                  ;;; <@223,#625> gap
0000013FD3443C1A   666  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443C1E   670  488b7dc0       REX.W movq rdi,[rbp-0x40]
                  ;;; <@224,#198> call-with-descriptor
0000013FD3443C22   674  e8b92af4ff     call Call_ReceiverIsNotNullOrUndefined  (0000013FD33866E0)    ;; code: BUILTIN
                  ;;; <@226,#199> lazy-bailout
                  ;;; <@227,#199> gap
0000013FD3443C27   679  488bd8         REX.W movq rbx,rax
                  ;;; <@228,#678> tagged-to-i
0000013FD3443C2A   682  f6c301         testb rbx,0x1
0000013FD3443C2D   685  0f8560050000   jnz 2067  (0000013FD3444193)
0000013FD3443C33   691  48c1eb20       REX.W shrq rbx, 32
                  ;;; <@231,#201> compare-numeric-and-branch
0000013FD3443C37   695  83fb2e         cmpl rbx,0x2e
0000013FD3443C3A   698  0f8530000000   jnz 752  (0000013FD3443C70)
                  ;;; <@232,#205> -------------------- B41 (unreachable/replaced) --------------------
                  ;;; <@236,#202> -------------------- B42 (unreachable/replaced) --------------------
                  ;;; <@240,#208> -------------------- B43 --------------------
                  ;;; <@241,#208> gap
0000013FD3443C40   704  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443C44   708  488b55d0       REX.W movq rdx,[rbp-0x30]
                  ;;; <@242,#210> load-named-generic
0000013FD3443C48   712  48b90178ba4d33010000 REX.W movq rcx,000001334DBA7801    ;; object: 000001334DBA7801 <String[10]: charCodeAt>
0000013FD3443C52   722  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443C5C   732  48b80000000024000000 REX.W movq rax,0000002400000000
0000013FD3443C66   742  e855faffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@244,#211> lazy-bailout
                  ;;; <@247,#213> deoptimize
0000013FD3443C6B   747  e81204ecff     call 0000013FD3304082    ;; debug: deopt position '291840'
                                                             ;; debug: deopt reason 'Insufficient type feedback for generic named access'
                                                             ;; debug: deopt index 13
                                                             ;; soft deoptimization bailout 13
                  ;;; <@248,#214> -------------------- B44 (unreachable/replaced) --------------------
                  ;;; <@256,#219> -------------------- B45 (unreachable/replaced) --------------------
                  ;;; <@278,#229> -------------------- B46 (unreachable/replaced) --------------------
                  ;;; <@288,#236> -------------------- B47 (unreachable/replaced) --------------------
                  ;;; <@292,#233> -------------------- B48 (unreachable/replaced) --------------------
                  ;;; <@296,#444> -------------------- B49 (unreachable/replaced) --------------------
                  ;;; <@300,#179> -------------------- B50 (unreachable/replaced) --------------------
                  ;;; <@304,#239> -------------------- B51 --------------------
                  ;;; <@305,#239> gap
0000013FD3443C70   752  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443C74   756  488b55d0       REX.W movq rdx,[rbp-0x30]
                  ;;; <@306,#241> load-named-generic
0000013FD3443C78   760  48b99134b84d33010000 REX.W movq rcx,000001334DB83491    ;; object: 000001334DB83491 <String[6]: length>
0000013FD3443C82   770  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443C8C   780  48b8000000002a000000 REX.W movq rax,0000002A00000000
0000013FD3443C96   790  e825faffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@308,#242> lazy-bailout
                  ;;; <@309,#242> gap
0000013FD3443C9B   795  488bd8         REX.W movq rbx,rax
                  ;;; <@310,#681> tagged-to-i
0000013FD3443C9E   798  f6c301         testb rbx,0x1
0000013FD3443CA1   801  0f8523050000   jnz 2122  (0000013FD34441CA)
0000013FD3443CA7   807  48c1eb20       REX.W shrq rbx, 32
                  ;;; <@313,#244> compare-numeric-and-branch
0000013FD3443CAB   811  83fb02         cmpl rbx,0x2
0000013FD3443CAE   814  0f8f05000000   jg 825  (0000013FD3443CB9)
                  ;;; <@314,#248> -------------------- B52 (unreachable/replaced) --------------------
                  ;;; <@318,#368> -------------------- B53 --------------------
                  ;;; <@321,#370> deoptimize
0000013FD3443CB4   820  e8dd03ecff     call 0000013FD3304096    ;; debug: deopt position '551424'
                                                             ;; debug: deopt reason 'Insufficient type feedback for generic named access'
                                                             ;; debug: deopt index 15
                                                             ;; soft deoptimization bailout 15
                  ;;; <@322,#371> -------------------- B54 (unreachable/replaced) --------------------
                  ;;; <@330,#376> -------------------- B55 (unreachable/replaced) --------------------
                  ;;; <@340,#383> -------------------- B56 (unreachable/replaced) --------------------
                  ;;; <@344,#386> -------------------- B57 (unreachable/replaced) --------------------
                  ;;; <@348,#389> -------------------- B58 (unreachable/replaced) --------------------
                  ;;; <@356,#394> -------------------- B59 (unreachable/replaced) --------------------
                  ;;; <@366,#401> -------------------- B60 (unreachable/replaced) --------------------
                  ;;; <@370,#427> -------------------- B61 (unreachable/replaced) --------------------
                  ;;; <@374,#398> -------------------- B62 (unreachable/replaced) --------------------
                  ;;; <@378,#380> -------------------- B63 (unreachable/replaced) --------------------
                  ;;; <@382,#404> -------------------- B64 (unreachable/replaced) --------------------
                  ;;; <@386,#245> -------------------- B65 (unreachable/replaced) --------------------
                  ;;; <@390,#251> -------------------- B66 --------------------
                  ;;; <@391,#251> gap
0000013FD3443CB9   825  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443CBD   829  488b55d0       REX.W movq rdx,[rbp-0x30]
                  ;;; <@392,#254> load-named-generic
0000013FD3443CC1   833  48b99134b84d33010000 REX.W movq rcx,000001334DB83491    ;; object: 000001334DB83491 <String[6]: length>
0000013FD3443CCB   843  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443CD5   853  48b8000000002d000000 REX.W movq rax,0000002D00000000
0000013FD3443CDF   863  e8dcf9ffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@394,#255> lazy-bailout
                  ;;; <@395,#255> gap
0000013FD3443CE4   868  488bd8         REX.W movq rbx,rax
                  ;;; <@396,#684> tagged-to-i
0000013FD3443CE7   871  f6c301         testb rbx,0x1
0000013FD3443CEA   874  0f8511050000   jnz 2177  (0000013FD3444201)
0000013FD3443CF0   880  48c1eb20       REX.W shrq rbx, 32
                  ;;; <@398,#257> sub-i
0000013FD3443CF4   884  83eb01         subl rbx,0x1
0000013FD3443CF7   887  0f80fe050000   jo 2427  (0000013FD34442FB)
                  ;;; <@399,#257> gap
0000013FD3443CFD   893  48895db8       REX.W movq [rbp-0x48],rbx
0000013FD3443D01   897  488b45d0       REX.W movq rax,[rbp-0x30]
                  ;;; <@400,#289> check-non-smi
0000013FD3443D05   901  a801           test al,0x1
0000013FD3443D07   903  0f84f3050000   jz 2432  (0000013FD3444300)
                  ;;; <@402,#290> check-instance-type
0000013FD3443D0D   909  4c8b50ff       REX.W movq r10,[rax-0x1]
0000013FD3443D11   913  41f6420b80     testb [r10+0xb],0x80
0000013FD3443D16   918  0f85e9050000   jnz 2437  (0000013FD3444305)
                  ;;; <@404,#297> load-named-field
0000013FD3443D1C   924  8b5013         movl rdx,[rax+0x13]
                  ;;; <@406,#274> gap
0000013FD3443D1F   927  488bcb         REX.W movq rcx,rbx
                  ;;; <@408,#275> -------------------- B67 (loop header) --------------------
0000013FD3443D22   930  48894db0       REX.W movq [rbp-0x50],rcx
                  ;;; <@411,#278> compare-numeric-and-branch
0000013FD3443D26   934  83f900         cmpl rcx,0x0
0000013FD3443D29   937  0f8ca6000000   jl 1109  (0000013FD3443DD5)
                  ;;; <@412,#279> -------------------- B68 (unreachable/replaced) --------------------
                  ;;; <@416,#285> -------------------- B69 --------------------
                  ;;; <@418,#287> stack-check
0000013FD3443D2F   943  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000013FD3443D36   950  0f82fc040000   jc 2232  (0000013FD3444238)
                  ;;; <@420,#298> bounds-check
0000013FD3443D3C   956  3bd1           cmpl rdx,rcx
0000013FD3443D3E   958  0f86c6050000   jna 2442  (0000013FD344430A)
                  ;;; <@421,#298> gap
0000013FD3443D44   964  488bf8         REX.W movq rdi,rax
0000013FD3443D47   967  488bf1         REX.W movq rsi,rcx
                  ;;; <@422,#299> string-char-code-at
0000013FD3443D4A   970  4c8b47ff       REX.W movq r8,[rdi-0x1]
0000013FD3443D4E   974  450fb6400b     movzxbl r8,[r8+0xb]
0000013FD3443D53   979  41f6c001       testb r8,0x1
0000013FD3443D57   983  742e           jz 1031  (0000013FD3443D87)
0000013FD3443D59   985  41f6c002       testb r8,0x2
0000013FD3443D5D   989  740d           jz 1004  (0000013FD3443D6C)
0000013FD3443D5F   991  448b4723       movl r8,[rdi+0x23]
0000013FD3443D63   995  4903f0         REX.W addq rsi,r8
0000013FD3443D66   998  488b7f17       REX.W movq rdi,[rdi+0x17]
0000013FD3443D6A  1002  eb12           jmp 1022  (0000013FD3443D7E)
0000013FD3443D6C  1004  4d8b55c8       REX.W movq r10,[r13-0x38]
0000013FD3443D70  1008  4c39571f       REX.W cmpq [rdi+0x1f],r10
0000013FD3443D74  1012  0f8506050000   jnz 2304  (0000013FD3444280)
0000013FD3443D7A  1018  488b7f17       REX.W movq rdi,[rdi+0x17]
0000013FD3443D7E  1022  4c8b47ff       REX.W movq r8,[rdi-0x1]
0000013FD3443D82  1026  450fb6400b     movzxbl r8,[r8+0xb]
0000013FD3443D87  1031  41f6c003       testb r8,0x3
0000013FD3443D8B  1035  7422           jz 1071  (0000013FD3443DAF)
0000013FD3443D8D  1037  41f6c010       testb r8,0x10
0000013FD3443D91  1041  0f85e9040000   jnz 2304  (0000013FD3444280)
0000013FD3443D97  1047  41f6c004       testb r8,0x4
0000013FD3443D9B  1051  4c8b471f       REX.W movq r8,[rdi+0x1f]
0000013FD3443D9F  1055  7507           jnz 1064  (0000013FD3443DA8)
0000013FD3443DA1  1057  450fb70470     movzxwl r8,[r8+rsi*2]
0000013FD3443DA6  1062  eb1b           jmp 1091  (0000013FD3443DC3)
0000013FD3443DA8  1064  450fb60430     movzxbl r8,[r8+rsi*1]
0000013FD3443DAD  1069  eb14           jmp 1091  (0000013FD3443DC3)
0000013FD3443DAF  1071  41f6c004       testb r8,0x4
0000013FD3443DB3  1075  7508           jnz 1085  (0000013FD3443DBD)
0000013FD3443DB5  1077  440fb7447717   movzxwl r8,[rdi+rsi*2+0x17]
0000013FD3443DBB  1083  eb06           jmp 1091  (0000013FD3443DC3)
0000013FD3443DBD  1085  440fb6443717   movzxbl r8,[rdi+rsi*1+0x17]
                  ;;; <@425,#301> compare-numeric-and-branch
0000013FD3443DC3  1091  4183f85c       cmpl r8,0x5c
0000013FD3443DC7  1095  0f8408000000   jz 1109  (0000013FD3443DD5)
                  ;;; <@426,#305> -------------------- B70 (unreachable/replaced) --------------------
                  ;;; <@430,#311> -------------------- B71 --------------------
                  ;;; <@432,#314> add-i
0000013FD3443DCD  1101  83c1ff         addl rcx,0xff
                  ;;; <@435,#317> goto
0000013FD3443DD0  1104  e94dffffff     jmp 930  (0000013FD3443D22)
                  ;;; <@436,#302> -------------------- B72 (unreachable/replaced) --------------------
                  ;;; <@440,#308> -------------------- B73 (unreachable/replaced) --------------------
                  ;;; <@444,#282> -------------------- B74 (unreachable/replaced) --------------------
                  ;;; <@448,#318> -------------------- B75 (unreachable/replaced) --------------------
                  ;;; <@452,#321> -------------------- B76 --------------------
                  ;;; <@455,#324> compare-numeric-and-branch
0000013FD3443DD5  1109  3bcb           cmpl rcx,rbx
0000013FD3443DD7  1111  0f8474000000   jz 1233  (0000013FD3443E51)
                  ;;; <@456,#328> -------------------- B77 (unreachable/replaced) --------------------
                  ;;; <@460,#331> -------------------- B78 --------------------
                  ;;; <@463,#334> compare-numeric-and-branch
0000013FD3443DDD  1117  83f9ff         cmpl rcx,0xff
0000013FD3443DE0  1120  0f8453000000   jz 1209  (0000013FD3443E39)
                  ;;; <@464,#338> -------------------- B79 (unreachable/replaced) --------------------
                  ;;; <@468,#344> -------------------- B80 --------------------
                  ;;; <@469,#344> gap
0000013FD3443DE6  1126  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443DEA  1130  488bd0         REX.W movq rdx,rax
                  ;;; <@470,#346> load-named-generic
0000013FD3443DED  1133  48b9a161bc4d33010000 REX.W movq rcx,000001334DBC61A1    ;; object: 000001334DBC61A1 <String[5]: slice>
0000013FD3443DF7  1143  48bbb123f053ee030000 REX.W movq rbx,000003EE53F023B1    ;; object: 000003EE53F023B1 <FixedArray[95]>
0000013FD3443E01  1153  48b8000000003b000000 REX.W movq rax,0000003B00000000
0000013FD3443E0B  1163  e8b0f8ffff     call 0000013FD34436C0    ;; code: LOAD_IC
                  ;;; <@472,#347> lazy-bailout
                  ;;; <@473,#347> gap
0000013FD3443E10  1168  488b5db0       REX.W movq rbx,[rbp-0x50]
                  ;;; <@474,#685> smi-tag
0000013FD3443E14  1172  8bd3           movl rdx,rbx
0000013FD3443E16  1174  48c1e220       REX.W shlq rdx, 32
                  ;;; <@476,#352> push-argument
0000013FD3443E1A  1178  ff75d0         push [rbp-0x30]
                  ;;; <@478,#352> push-argument
0000013FD3443E1D  1181  6a00           push 0x0
                  ;;; <@480,#352> push-argument
0000013FD3443E1F  1183  52             push rdx
                  ;;; <@482,#165> constant-i
0000013FD3443E20  1184  bb02000000     movl rbx,0000000000000002
                  ;;; <@483,#165> gap
0000013FD3443E25  1189  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443E29  1193  488bf8         REX.W movq rdi,rax
0000013FD3443E2C  1196  488bc3         REX.W movq rax,rbx
                  ;;; <@484,#353> call-with-descriptor
0000013FD3443E2F  1199  e8ac28f4ff     call Call_ReceiverIsNotNullOrUndefined  (0000013FD33866E0)    ;; code: BUILTIN
                  ;;; <@486,#354> lazy-bailout
                  ;;; <@489,#359> goto
0000013FD3443E34  1204  e90a000000     jmp 1219  (0000013FD3443E43)
                  ;;; <@490,#335> -------------------- B81 (unreachable/replaced) --------------------
                  ;;; <@494,#341> -------------------- B82 --------------------
                  ;;; <@496,#357> gap
0000013FD3443E39  1209  48b80928b84d33010000 REX.W movq rax,000001334DB82809    ;; object: 000001334DB82809 <String[0]: >
                  ;;; <@498,#361> -------------------- B83 --------------------
                  ;;; <@500,#367> gap
0000013FD3443E43  1219  488bd0         REX.W movq rdx,rax
0000013FD3443E46  1222  488b5de0       REX.W movq rbx,[rbp-0x20]
0000013FD3443E4A  1226  33c0           xorl rax,rax
                  ;;; <@501,#367> goto
0000013FD3443E4C  1228  e9bb010000     jmp 1676  (0000013FD344400C)
                  ;;; <@502,#325> -------------------- B84 (unreachable/replaced) --------------------
                  ;;; <@506,#424> -------------------- B85 (unreachable/replaced) --------------------
                  ;;; <@510,#441> -------------------- B86 (unreachable/replaced) --------------------
                  ;;; <@514,#458> -------------------- B87 --------------------
                  ;;; <@516,#459> gap
0000013FD3443E51  1233  488b4510       REX.W movq rax,[rbp+0x10]
                  ;;; <@517,#459> branch
0000013FD3443E55  1237  493b45a0       REX.W cmpq rax,[r13-0x60]
0000013FD3443E59  1241  0f8492000000   jz 1393  (0000013FD3443EF1)
0000013FD3443E5F  1247  493b45b8       REX.W cmpq rax,[r13-0x48]
0000013FD3443E63  1251  0f8491000000   jz 1402  (0000013FD3443EFA)
0000013FD3443E69  1257  493b45c0       REX.W cmpq rax,[r13-0x40]
0000013FD3443E6D  1261  0f847e000000   jz 1393  (0000013FD3443EF1)
0000013FD3443E73  1267  493b45b0       REX.W cmpq rax,[r13-0x50]
0000013FD3443E77  1271  0f8474000000   jz 1393  (0000013FD3443EF1)
0000013FD3443E7D  1277  4885c0         REX.W testq rax,rax
0000013FD3443E80  1280  0f846b000000   jz 1393  (0000013FD3443EF1)
0000013FD3443E86  1286  a801           test al,0x1
0000013FD3443E88  1288  0f846c000000   jz 1402  (0000013FD3443EFA)
0000013FD3443E8E  1294  4c8b50ff       REX.W movq r10,[rax-0x1]
0000013FD3443E92  1298  41f6420c10     testb [r10+0xc],0x10
0000013FD3443E97  1303  0f8554000000   jnz 1393  (0000013FD3443EF1)
0000013FD3443E9D  1309  41807a0bb1     cmpb [r10+0xb],0xb1
0000013FD3443EA2  1314  0f8352000000   jnc 1402  (0000013FD3443EFA)
0000013FD3443EA8  1320  41807a0b80     cmpb [r10+0xb],0x80
0000013FD3443EAD  1325  7310           jnc 1343  (0000013FD3443EBF)
0000013FD3443EAF  1327  4883780f00     REX.W cmpq [rax+0xf],0x0
0000013FD3443EB4  1332  0f8540000000   jnz 1402  (0000013FD3443EFA)
0000013FD3443EBA  1338  e932000000     jmp 1393  (0000013FD3443EF1)
0000013FD3443EBF  1343  41807a0b80     cmpb [r10+0xb],0x80
0000013FD3443EC4  1348  0f8430000000   jz 1402  (0000013FD3443EFA)
0000013FD3443ECA  1354  41807a0b82     cmpb [r10+0xb],0x82
0000013FD3443ECF  1359  0f8425000000   jz 1402  (0000013FD3443EFA)
0000013FD3443ED5  1365  4d3b5560       REX.W cmpq r10,[r13+0x60]
0000013FD3443ED9  1369  7516           jnz 1393  (0000013FD3443EF1)
0000013FD3443EDB  1371  66450f57ff     xorpd xmm15,xmm15
0000013FD3443EE0  1376  66440f2e7807   ucomisd xmm15,[rax+0x7]
0000013FD3443EE6  1382  0f8405000000   jz 1393  (0000013FD3443EF1)
0000013FD3443EEC  1388  e909000000     jmp 1402  (0000013FD3443EFA)
                  ;;; <@518,#463> -------------------- B88 (unreachable/replaced) --------------------
                  ;;; <@522,#502> -------------------- B89 --------------------
                  ;;; <@524,#504> gap
0000013FD3443EF1  1393  488b5dd0       REX.W movq rbx,[rbp-0x30]
                  ;;; <@525,#504> goto
0000013FD3443EF5  1397  e9fd000000     jmp 1655  (0000013FD3443FF7)
                  ;;; <@526,#460> -------------------- B90 (unreachable/replaced) --------------------
                  ;;; <@530,#466> -------------------- B91 --------------------
                  ;;; <@533,#468> deoptimize
0000013FD3443EFA  1402  e8f101ecff     call 0000013FD33040F0    ;; debug: deopt position '653312'
                                                             ;; debug: deopt reason 'Insufficient type feedback for generic named access'
                                                             ;; debug: deopt index 24
                                                             ;; soft deoptimization bailout 24
                  ;;; <@534,#469> -------------------- B92 (unreachable/replaced) --------------------
                  ;;; <@542,#474> -------------------- B93 (unreachable/replaced) --------------------
                  ;;; <@552,#481> -------------------- B94 (unreachable/replaced) --------------------
                  ;;; <@556,#491> -------------------- B95 (unreachable/replaced) --------------------
                  ;;; <@560,#478> -------------------- B96 (unreachable/replaced) --------------------
                  ;;; <@564,#484> -------------------- B97 (unreachable/replaced) --------------------
                  ;;; <@578,#499> -------------------- B98 (unreachable/replaced) --------------------
                  ;;; <@582,#564> -------------------- B99 (unreachable/replaced) --------------------
                  ;;; <@586,#157> -------------------- B100 --------------------
0000013FD3443EFF  1407  498bc0         REX.W movq rax,r8
                  ;;; <@590,#506> -------------------- B101 --------------------
                  ;;; <@591,#506> gap
0000013FD3443F02  1410  488b5dd0       REX.W movq rbx,[rbp-0x30]
                  ;;; <@592,#508> check-non-smi
0000013FD3443F06  1414  f6c301         testb rbx,0x1
0000013FD3443F09  1417  0f8400040000   jz 2447  (0000013FD344430F)
                  ;;; <@594,#509> check-instance-type
0000013FD3443F0F  1423  4c8b53ff       REX.W movq r10,[rbx-0x1]
0000013FD3443F13  1427  41f6420b80     testb [r10+0xb],0x80
0000013FD3443F18  1432  0f85f6030000   jnz 2452  (0000013FD3444314)
                  ;;; <@596,#510> load-named-field
0000013FD3443F1E  1438  8b5313         movl rdx,[rbx+0x13]
                  ;;; <@599,#512> compare-numeric-and-branch
0000013FD3443F21  1441  83fa00         cmpl rdx,0x0
0000013FD3443F24  1444  0f8f44000000   jg 1518  (0000013FD3443F6E)
                  ;;; <@600,#516> -------------------- B102 (unreachable/replaced) --------------------
                  ;;; <@604,#543> -------------------- B103 --------------------
                  ;;; <@605,#543> gap
0000013FD3443F2A  1450  488bde         REX.W movq rbx,rsi
                  ;;; <@606,#551> add-i
0000013FD3443F2D  1453  83c301         addl rbx,0x1
0000013FD3443F30  1456  0f80e3030000   jo 2457  (0000013FD3444319)
                  ;;; <@607,#551> gap
0000013FD3443F36  1462  488b55e0       REX.W movq rdx,[rbp-0x20]
                  ;;; <@608,#672> smi-tag
0000013FD3443F3A  1466  8bca           movl rcx,rdx
0000013FD3443F3C  1468  48c1e120       REX.W shlq rcx, 32
                  ;;; <@610,#688> smi-tag
0000013FD3443F40  1472  8bf3           movl rsi,rbx
0000013FD3443F42  1474  48c1e620       REX.W shlq rsi, 32
                  ;;; <@612,#555> push-argument
0000013FD3443F46  1478  ff7518         push [rbp+0x18]
                  ;;; <@614,#555> push-argument
0000013FD3443F49  1481  56             push rsi
                  ;;; <@616,#555> push-argument
0000013FD3443F4A  1482  51             push rcx
                  ;;; <@618,#548> constant-t
0000013FD3443F4B  1483  48bf511ff553ee030000 REX.W movq rdi,000003EE53F51F51    ;; object: 000003EE53F51F51 <JS Function slice (SharedFunctionInfo 000001334DBD3349)>
                  ;;; <@619,#548> gap
0000013FD3443F55  1493  488b75e8       REX.W movq rsi,[rbp-0x18]
                  ;;; <@620,#556> invoke-function
0000013FD3443F59  1497  488b7727       REX.W movq rsi,[rdi+0x27]
0000013FD3443F5D  1501  498b55a0       REX.W movq rdx,[r13-0x60]
0000013FD3443F61  1505  b802000000     movl rax,0000000000000002
0000013FD3443F66  1510  ff5737         call [rdi+0x37]
                  ;;; <@622,#557> lazy-bailout
                  ;;; <@625,#562> goto
0000013FD3443F69  1513  e986000000     jmp 1652  (0000013FD3443FF4)
                  ;;; <@626,#513> -------------------- B104 (unreachable/replaced) --------------------
                  ;;; <@630,#519> -------------------- B105 --------------------
                  ;;; <@631,#519> gap
0000013FD3443F6E  1518  488bc6         REX.W movq rax,rsi
                  ;;; <@632,#529> add-i
0000013FD3443F71  1521  83c001         addl rax,0x1
0000013FD3443F74  1524  0f80a4030000   jo 2462  (0000013FD344431E)
                  ;;; <@633,#529> gap
0000013FD3443F7A  1530  488b55e0       REX.W movq rdx,[rbp-0x20]
                  ;;; <@634,#673> smi-tag
0000013FD3443F7E  1534  8bca           movl rcx,rdx
0000013FD3443F80  1536  48c1e120       REX.W shlq rcx, 32
                  ;;; <@636,#689> smi-tag
0000013FD3443F84  1540  8bf0           movl rsi,rax
0000013FD3443F86  1542  48c1e620       REX.W shlq rsi, 32
                  ;;; <@638,#533> push-argument
0000013FD3443F8A  1546  ff7518         push [rbp+0x18]
                  ;;; <@640,#533> push-argument
0000013FD3443F8D  1549  56             push rsi
                  ;;; <@642,#533> push-argument
0000013FD3443F8E  1550  51             push rcx
                  ;;; <@644,#548> constant-t
0000013FD3443F8F  1551  48bf511ff553ee030000 REX.W movq rdi,000003EE53F51F51    ;; object: 000003EE53F51F51 <JS Function slice (SharedFunctionInfo 000001334DBD3349)>
                  ;;; <@645,#548> gap
0000013FD3443F99  1561  488b75e8       REX.W movq rsi,[rbp-0x18]
                  ;;; <@646,#534> invoke-function
0000013FD3443F9D  1565  488b7727       REX.W movq rsi,[rdi+0x27]
0000013FD3443FA1  1569  498b55a0       REX.W movq rdx,[r13-0x60]
0000013FD3443FA5  1573  b802000000     movl rax,0000000000000002
0000013FD3443FAA  1578  ff5737         call [rdi+0x37]
                  ;;; <@647,#534> gap
0000013FD3443FAD  1581  488945b0       REX.W movq [rbp-0x50],rax
0000013FD3443FB1  1585  488bd8         REX.W movq rbx,rax
                  ;;; <@648,#535> lazy-bailout
                  ;;; <@650,#536> check-non-smi
0000013FD3443FB4  1588  f6c301         testb rbx,0x1
0000013FD3443FB7  1591  0f8466030000   jz 2467  (0000013FD3444323)
                  ;;; <@652,#537> check-instance-type
0000013FD3443FBD  1597  4c8b53ff       REX.W movq r10,[rbx-0x1]
0000013FD3443FC1  1601  41f6420b80     testb [r10+0xb],0x80
0000013FD3443FC6  1606  0f855c030000   jnz 2472  (0000013FD3444328)
                  ;;; <@654,#521> constant-t
0000013FD3443FCC  1612  48baa1d90240fa030000 REX.W movq rdx,000003FA4002D9A1    ;; object: 000003FA4002D9A1 <String[1]: \>
                  ;;; <@655,#521> gap
0000013FD3443FD6  1622  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443FDA  1626  488bc3         REX.W movq rax,rbx
                  ;;; <@656,#538> string-add
0000013FD3443FDD  1629  e8fe28f6ff     call 0000013FD33A68E0    ;; code: STUB, StringAddStub, minor: 0
                  ;;; <@658,#538> lazy-bailout
                  ;;; <@659,#538> gap
0000013FD3443FE2  1634  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD3443FE6  1638  488b55d0       REX.W movq rdx,[rbp-0x30]
                  ;;; <@660,#541> string-add
0000013FD3443FEA  1642  0f1f440000     nop
0000013FD3443FEF  1647  e8ec28f6ff     call 0000013FD33A68E0    ;; code: STUB, StringAddStub, minor: 0
                  ;;; <@662,#541> lazy-bailout
                  ;;; <@666,#567> -------------------- B106 --------------------
                  ;;; <@668,#569> gap
0000013FD3443FF4  1652  488bd8         REX.W movq rbx,rax
                  ;;; <@670,#584> -------------------- B107 --------------------
                  ;;; <@672,#586> gap
0000013FD3443FF7  1655  488bc3         REX.W movq rax,rbx
                  ;;; <@673,#586> goto
0000013FD3443FFA  1658  e904000000     jmp 1667  (0000013FD3444003)
                  ;;; <@674,#144> -------------------- B108 (unreachable/replaced) --------------------
                  ;;; <@678,#134> -------------------- B109 (unreachable/replaced) --------------------
                  ;;; <@682,#581> -------------------- B110 --------------------
                  ;;; <@684,#583> gap
0000013FD3443FFF  1663  488b45d0       REX.W movq rax,[rbp-0x30]
                  ;;; <@686,#598> -------------------- B111 --------------------
                  ;;; <@688,#637> gap
0000013FD3444003  1667  488bd0         REX.W movq rdx,rax
0000013FD3444006  1670  488b5de0       REX.W movq rbx,[rbp-0x20]
0000013FD344400A  1674  33c0           xorl rax,rax
                  ;;; <@690,#652> -------------------- B112 (unreachable/replaced) --------------------
                  ;;; <@694,#655> -------------------- B113 --------------------
                  ;;; <@695,#655> gap
0000013FD344400C  1676  488b4de0       REX.W movq rcx,[rbp-0x20]
                  ;;; <@696,#657> add-i
0000013FD3444010  1680  83c101         addl rcx,0x1
                  ;;; <@697,#657> gap
0000013FD3444013  1683  488b75c8       REX.W movq rsi,[rbp-0x38]
                  ;;; <@698,#674> smi-tag
0000013FD3444017  1687  8bfe           movl rdi,rsi
0000013FD3444019  1689  48c1e720       REX.W shlq rdi, 32
                  ;;; <@700,#660> gap
0000013FD344401D  1693  4c8bd7         REX.W movq r10,rdi
0000013FD3444020  1696  488bfa         REX.W movq rdi,rdx
0000013FD3444023  1699  498bd2         REX.W movq rdx,r10
0000013FD3444026  1702  488bf3         REX.W movq rsi,rbx
0000013FD3444029  1705  488bd9         REX.W movq rbx,rcx
0000013FD344402C  1708  488bc8         REX.W movq rcx,rax
0000013FD344402F  1711  488b4518       REX.W movq rax,[rbp+0x18]
0000013FD3444033  1715  4c8b4510       REX.W movq r8,[rbp+0x10]
                  ;;; <@701,#660> goto
0000013FD3444037  1719  e9a3f9ffff     jmp 95  (0000013FD34439DF)
                  ;;; <@702,#80> -------------------- B114 (unreachable/replaced) --------------------
                  ;;; <@706,#90> -------------------- B115 (unreachable/replaced) --------------------
                  ;;; <@710,#96> -------------------- B116 (unreachable/replaced) --------------------
                  ;;; <@714,#46> -------------------- B117 (unreachable/replaced) --------------------
                  ;;; <@718,#661> -------------------- B118 (unreachable/replaced) --------------------
                  ;;; <@722,#664> -------------------- B119 --------------------
                  ;;; <@723,#664> gap
0000013FD344403C  1724  488b45d0       REX.W movq rax,[rbp-0x30]
                  ;;; <@724,#667> return
0000013FD3444040  1728  488be5         REX.W movq rsp,rbp
0000013FD3444043  1731  5d             pop rbp
0000013FD3444044  1732  c21800         ret 0x18
                  ;;; <@44,#51> -------------------- Deferred stack-check --------------------
0000013FD3444047  1735  50             push rax
0000013FD3444048  1736  51             push rcx
0000013FD3444049  1737  52             push rdx
0000013FD344404A  1738  53             push rbx
0000013FD344404B  1739  56             push rsi
0000013FD344404C  1740  57             push rdi
0000013FD344404D  1741  4150           push r8
0000013FD344404F  1743  4151           push r9
0000013FD3444051  1745  4153           push r11
0000013FD3444053  1747  4154           push r12
0000013FD3444055  1749  4156           push r14
0000013FD3444057  1751  4157           push r15
0000013FD3444059  1753  488d6424e0     REX.W leaq rsp,[rsp-0x20]
0000013FD344405E  1758  488b75f8       REX.W movq rsi,[rbp-0x8]
0000013FD3444062  1762  33c0           xorl rax,rax
0000013FD3444064  1764  48bbb0117296f77f0000 REX.W movq rbx,00007FF7967211B0
0000013FD344406E  1774  e80dabf4ff     call 0000013FD338EB80    ;; code: STUB, CEntryStub, minor: 9
0000013FD3444073  1779  488d642420     REX.W leaq rsp,[rsp+0x20]
0000013FD3444078  1784  415f           pop r15
0000013FD344407A  1786  415e           pop r14
0000013FD344407C  1788  415c           pop r12
0000013FD344407E  1790  415b           pop r11
0000013FD3444080  1792  4159           pop r9
0000013FD3444082  1794  4158           pop r8
0000013FD3444084  1796  5f             pop rdi
0000013FD3444085  1797  5e             pop rsi
0000013FD3444086  1798  5b             pop rbx
0000013FD3444087  1799  5a             pop rdx
0000013FD3444088  1800  59             pop rcx
0000013FD3444089  1801  58             pop rax
0000013FD344408A  1802  e976f9ffff     jmp 133  (0000013FD3443A05)
                  ;;; <@54,#671> -------------------- Deferred tagged-to-i --------------------
0000013FD344408F  1807  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD3444093  1811  4d3951ff       REX.W cmpq [r9-0x1],r10
0000013FD3444097  1815  0f8590020000   jnz 2477  (0000013FD344432D)
0000013FD344409D  1821  f2450f107907   movsd xmm15,[r9+0x7]
0000013FD34440A3  1827  f2450f2ccf     cvttsd2sil r9,xmm15
0000013FD34440A8  1832  660f57c9       xorpd xmm1,xmm1
0000013FD34440AC  1836  f2410f2ac9     cvtsi2sd xmm1,r9
0000013FD34440B1  1841  66440f2ef9     ucomisd xmm15,xmm1
0000013FD34440B6  1846  0f8576020000   jnz 2482  (0000013FD3444332)
0000013FD34440BC  1852  0f8a75020000   jpe 2487  (0000013FD3444337)
0000013FD34440C2  1858  e958f9ffff     jmp 159  (0000013FD3443A1F)
                  ;;; <@84,#74> -------------------- Deferred string-char-code-at --------------------
0000013FD34440C7  1863  4533db         xorl r11,r11
0000013FD34440CA  1866  50             push rax
0000013FD34440CB  1867  51             push rcx
0000013FD34440CC  1868  52             push rdx
0000013FD34440CD  1869  53             push rbx
0000013FD34440CE  1870  56             push rsi
0000013FD34440CF  1871  57             push rdi
0000013FD34440D0  1872  4150           push r8
0000013FD34440D2  1874  4151           push r9
0000013FD34440D4  1876  4153           push r11
0000013FD34440D6  1878  4154           push r12
0000013FD34440D8  1880  4156           push r14
0000013FD34440DA  1882  4157           push r15
0000013FD34440DC  1884  488d6424e0     REX.W leaq rsp,[rsp-0x20]
0000013FD34440E1  1889  4151           push r9
0000013FD34440E3  1891  48c1e220       REX.W shlq rdx, 32
0000013FD34440E7  1895  52             push rdx
0000013FD34440E8  1896  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD34440EC  1900  b802000000     movl rax,0000000000000002
0000013FD34440F1  1905  48bb90138396f77f0000 REX.W movq rbx,00007FF796831390
0000013FD34440FB  1915  e880aaf4ff     call 0000013FD338EB80    ;; code: STUB, CEntryStub, minor: 9
0000013FD3444100  1920  48c1e820       REX.W shrq rax, 32
0000013FD3444104  1924  4889442438     REX.W movq [rsp+0x38],rax
0000013FD3444109  1929  488d642420     REX.W leaq rsp,[rsp+0x20]
0000013FD344410E  1934  415f           pop r15
0000013FD3444110  1936  415e           pop r14
0000013FD3444112  1938  415c           pop r12
0000013FD3444114  1940  415b           pop r11
0000013FD3444116  1942  4159           pop r9
0000013FD3444118  1944  4158           pop r8
0000013FD344411A  1946  5f             pop rdi
0000013FD344411B  1947  5e             pop rsi
0000013FD344411C  1948  5b             pop rbx
0000013FD344411D  1949  5a             pop rdx
0000013FD344411E  1950  59             pop rcx
0000013FD344411F  1951  58             pop rax
0000013FD3444120  1952  e9a3f9ffff     jmp 328  (0000013FD3443AC8)
                  ;;; <@194,#675> -------------------- Deferred tagged-to-i --------------------
0000013FD3444125  1957  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD3444129  1961  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000013FD344412D  1965  0f8509020000   jnz 2492  (0000013FD344433C)
0000013FD3444133  1971  f2440f107b07   movsd xmm15,[rbx+0x7]
0000013FD3444139  1977  f2410f2cdf     cvttsd2sil rbx,xmm15
0000013FD344413E  1982  660f57c9       xorpd xmm1,xmm1
0000013FD3444142  1986  f20f2acb       cvtsi2sd xmm1,rbx
0000013FD3444146  1990  66440f2ef9     ucomisd xmm15,xmm1
0000013FD344414B  1995  0f85f0010000   jnz 2497  (0000013FD3444341)
0000013FD3444151  2001  0f8aef010000   jpe 2502  (0000013FD3444346)
0000013FD3444157  2007  e92efaffff     jmp 522  (0000013FD3443B8A)
                  ;;; <@212,#676> -------------------- Deferred tagged-to-i --------------------
0000013FD344415C  2012  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD3444160  2016  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000013FD3444164  2020  0f85e1010000   jnz 2507  (0000013FD344434B)
0000013FD344416A  2026  f2440f107b07   movsd xmm15,[rbx+0x7]
0000013FD3444170  2032  f2410f2cdf     cvttsd2sil rbx,xmm15
0000013FD3444175  2037  660f57c9       xorpd xmm1,xmm1
0000013FD3444179  2041  f20f2acb       cvtsi2sd xmm1,rbx
0000013FD344417D  2045  66440f2ef9     ucomisd xmm15,xmm1
0000013FD3444182  2050  0f85c8010000   jnz 2512  (0000013FD3444350)
0000013FD3444188  2056  0f8ac7010000   jpe 2517  (0000013FD3444355)
0000013FD344418E  2062  e96ffaffff     jmp 642  (0000013FD3443C02)
                  ;;; <@228,#678> -------------------- Deferred tagged-to-i --------------------
0000013FD3444193  2067  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD3444197  2071  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000013FD344419B  2075  0f85b9010000   jnz 2522  (0000013FD344435A)
0000013FD34441A1  2081  f2440f107b07   movsd xmm15,[rbx+0x7]
0000013FD34441A7  2087  f2410f2cdf     cvttsd2sil rbx,xmm15
0000013FD34441AC  2092  660f57c9       xorpd xmm1,xmm1
0000013FD34441B0  2096  f20f2acb       cvtsi2sd xmm1,rbx
0000013FD34441B4  2100  66440f2ef9     ucomisd xmm15,xmm1
0000013FD34441B9  2105  0f85a0010000   jnz 2527  (0000013FD344435F)
0000013FD34441BF  2111  0f8a9f010000   jpe 2532  (0000013FD3444364)
0000013FD34441C5  2117  e96dfaffff     jmp 695  (0000013FD3443C37)
                  ;;; <@310,#681> -------------------- Deferred tagged-to-i --------------------
0000013FD34441CA  2122  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD34441CE  2126  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000013FD34441D2  2130  0f8591010000   jnz 2537  (0000013FD3444369)
0000013FD34441D8  2136  f2440f107b07   movsd xmm15,[rbx+0x7]
0000013FD34441DE  2142  f2410f2cdf     cvttsd2sil rbx,xmm15
0000013FD34441E3  2147  660f57c9       xorpd xmm1,xmm1
0000013FD34441E7  2151  f20f2acb       cvtsi2sd xmm1,rbx
0000013FD34441EB  2155  66440f2ef9     ucomisd xmm15,xmm1
0000013FD34441F0  2160  0f8578010000   jnz 2542  (0000013FD344436E)
0000013FD34441F6  2166  0f8a77010000   jpe 2547  (0000013FD3444373)
0000013FD34441FC  2172  e9aafaffff     jmp 811  (0000013FD3443CAB)
                  ;;; <@396,#684> -------------------- Deferred tagged-to-i --------------------
0000013FD3444201  2177  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD3444205  2181  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000013FD3444209  2185  0f8569010000   jnz 2552  (0000013FD3444378)
0000013FD344420F  2191  f2440f107b07   movsd xmm15,[rbx+0x7]
0000013FD3444215  2197  f2410f2cdf     cvttsd2sil rbx,xmm15
0000013FD344421A  2202  660f57c9       xorpd xmm1,xmm1
0000013FD344421E  2206  f20f2acb       cvtsi2sd xmm1,rbx
0000013FD3444222  2210  66440f2ef9     ucomisd xmm15,xmm1
0000013FD3444227  2215  0f8550010000   jnz 2557  (0000013FD344437D)
0000013FD344422D  2221  0f8a4f010000   jpe 2562  (0000013FD3444382)
0000013FD3444233  2227  e9bcfaffff     jmp 884  (0000013FD3443CF4)
                  ;;; <@418,#287> -------------------- Deferred stack-check --------------------
0000013FD3444238  2232  50             push rax
0000013FD3444239  2233  51             push rcx
0000013FD344423A  2234  52             push rdx
0000013FD344423B  2235  53             push rbx
0000013FD344423C  2236  56             push rsi
0000013FD344423D  2237  57             push rdi
0000013FD344423E  2238  4150           push r8
0000013FD3444240  2240  4151           push r9
0000013FD3444242  2242  4153           push r11
0000013FD3444244  2244  4154           push r12
0000013FD3444246  2246  4156           push r14
0000013FD3444248  2248  4157           push r15
0000013FD344424A  2250  488d6424e0     REX.W leaq rsp,[rsp-0x20]
0000013FD344424F  2255  488b75f8       REX.W movq rsi,[rbp-0x8]
0000013FD3444253  2259  33c0           xorl rax,rax
0000013FD3444255  2261  48bbb0117296f77f0000 REX.W movq rbx,00007FF7967211B0
0000013FD344425F  2271  e81ca9f4ff     call 0000013FD338EB80    ;; code: STUB, CEntryStub, minor: 9
0000013FD3444264  2276  488d642420     REX.W leaq rsp,[rsp+0x20]
0000013FD3444269  2281  415f           pop r15
0000013FD344426B  2283  415e           pop r14
0000013FD344426D  2285  415c           pop r12
0000013FD344426F  2287  415b           pop r11
0000013FD3444271  2289  4159           pop r9
0000013FD3444273  2291  4158           pop r8
0000013FD3444275  2293  5f             pop rdi
0000013FD3444276  2294  5e             pop rsi
0000013FD3444277  2295  5b             pop rbx
0000013FD3444278  2296  5a             pop rdx
0000013FD3444279  2297  59             pop rcx
0000013FD344427A  2298  58             pop rax
0000013FD344427B  2299  e9bcfaffff     jmp 956  (0000013FD3443D3C)
                  ;;; <@422,#299> -------------------- Deferred string-char-code-at --------------------
0000013FD3444280  2304  4533c0         xorl r8,r8
0000013FD3444283  2307  50             push rax
0000013FD3444284  2308  51             push rcx
0000013FD3444285  2309  52             push rdx
0000013FD3444286  2310  53             push rbx
0000013FD3444287  2311  56             push rsi
0000013FD3444288  2312  57             push rdi
0000013FD3444289  2313  4150           push r8
0000013FD344428B  2315  4151           push r9
0000013FD344428D  2317  4153           push r11
0000013FD344428F  2319  4154           push r12
0000013FD3444291  2321  4156           push r14
0000013FD3444293  2323  4157           push r15
0000013FD3444295  2325  488d6424e0     REX.W leaq rsp,[rsp-0x20]
0000013FD344429A  2330  57             push rdi
0000013FD344429B  2331  48c1e620       REX.W shlq rsi, 32
0000013FD344429F  2335  56             push rsi
0000013FD34442A0  2336  488b75e8       REX.W movq rsi,[rbp-0x18]
0000013FD34442A4  2340  b802000000     movl rax,0000000000000002
0000013FD34442A9  2345  48bb90138396f77f0000 REX.W movq rbx,00007FF796831390
0000013FD34442B3  2355  e8c8a8f4ff     call 0000013FD338EB80    ;; code: STUB, CEntryStub, minor: 9
0000013FD34442B8  2360  48c1e820       REX.W shrq rax, 32
0000013FD34442BC  2364  4889442448     REX.W movq [rsp+0x48],rax
0000013FD34442C1  2369  488d642420     REX.W leaq rsp,[rsp+0x20]
0000013FD34442C6  2374  415f           pop r15
0000013FD34442C8  2376  415e           pop r14
0000013FD34442CA  2378  415c           pop r12
0000013FD34442CC  2380  415b           pop r11
0000013FD34442CE  2382  4159           pop r9
0000013FD34442D0  2384  4158           pop r8
0000013FD34442D2  2386  5f             pop rdi
0000013FD34442D3  2387  5e             pop rsi
0000013FD34442D4  2388  5b             pop rbx
0000013FD34442D5  2389  5a             pop rdx
0000013FD34442D6  2390  59             pop rcx
0000013FD34442D7  2391  58             pop rax
0000013FD34442D8  2392  e9e6faffff     jmp 1091  (0000013FD3443DC3)
                  ;;; -------------------- Jump table --------------------
0000013FD34442DD  2397  e828fddbff     call 0000013FD320400A    ;; debug: deopt position '60416'
                                                             ;; debug: deopt reason 'Smi'
                                                             ;; debug: deopt index 1
                                                             ;; deoptimization bailout 1
0000013FD34442E2  2402  e82dfddbff     call 0000013FD3204014    ;; debug: deopt position '60416'
                                                             ;; debug: deopt reason 'wrong instance type'
                                                             ;; debug: deopt index 2
                                                             ;; deoptimization bailout 2
0000013FD34442E7  2407  e83cfddbff     call 0000013FD3204028    ;; debug: deopt position '90624'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 4
                                                             ;; deoptimization bailout 4
0000013FD34442EC  2412  e841fddbff     call 0000013FD3204032    ;; debug: deopt position '831488'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 5
                                                             ;; deoptimization bailout 5
0000013FD34442F1  2417  e846fddbff     call 0000013FD320403C    ;; debug: deopt position '184832'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 6
                                                             ;; deoptimization bailout 6
0000013FD34442F6  2422  e869fddbff     call 0000013FD3204064    ;; debug: deopt position '266240'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 10
                                                             ;; deoptimization bailout 10
0000013FD34442FB  2427  e8aafddbff     call 0000013FD32040AA    ;; debug: deopt position '341504'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 17
                                                             ;; deoptimization bailout 17
0000013FD3444300  2432  e8affddbff     call 0000013FD32040B4    ;; debug: deopt position '386560'
                                                             ;; debug: deopt reason 'Smi'
                                                             ;; debug: deopt index 18
                                                             ;; deoptimization bailout 18
0000013FD3444305  2437  e8b4fddbff     call 0000013FD32040BE    ;; debug: deopt position '386560'
                                                             ;; debug: deopt reason 'wrong instance type'
                                                             ;; debug: deopt index 19
                                                             ;; deoptimization bailout 19
0000013FD344430A  2442  e8c3fddbff     call 0000013FD32040D2    ;; debug: deopt position '386560'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 21
                                                             ;; deoptimization bailout 21
0000013FD344430F  2447  e8e6fddbff     call 0000013FD32040FA    ;; debug: deopt position '714240'
                                                             ;; debug: deopt reason 'Smi'
                                                             ;; debug: deopt index 25
                                                             ;; deoptimization bailout 25
0000013FD3444314  2452  e8ebfddbff     call 0000013FD3204104    ;; debug: deopt position '714240'
                                                             ;; debug: deopt reason 'wrong instance type'
                                                             ;; debug: deopt index 26
                                                             ;; deoptimization bailout 26
0000013FD3444319  2457  e8f0fddbff     call 0000013FD320410E    ;; debug: deopt position '774144'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 27
                                                             ;; deoptimization bailout 27
0000013FD344431E  2462  e8fffddbff     call 0000013FD3204122    ;; debug: deopt position '743936'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 29
                                                             ;; deoptimization bailout 29
0000013FD3444323  2467  e80efedbff     call 0000013FD3204136    ;; debug: deopt position '732160'
                                                             ;; debug: deopt reason 'Smi'
                                                             ;; debug: deopt index 31
                                                             ;; deoptimization bailout 31
0000013FD3444328  2472  e813fedbff     call 0000013FD3204140    ;; debug: deopt position '732160'
                                                             ;; debug: deopt reason 'wrong instance type'
                                                             ;; debug: deopt index 32
                                                             ;; deoptimization bailout 32
0000013FD344432D  2477  e82cfedbff     call 0000013FD320415E    ;; debug: deopt position '104960'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 35
                                                             ;; deoptimization bailout 35
0000013FD3444332  2482  e827fedbff     call 0000013FD320415E    ;; debug: deopt position '104960'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 35
                                                             ;; deoptimization bailout 35
0000013FD3444337  2487  e822fedbff     call 0000013FD320415E    ;; debug: deopt position '104960'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 35
                                                             ;; deoptimization bailout 35
0000013FD344433C  2492  e827fedbff     call 0000013FD3204168    ;; debug: deopt position '239104'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 36
                                                             ;; deoptimization bailout 36
0000013FD3444341  2497  e822fedbff     call 0000013FD3204168    ;; debug: deopt position '239104'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 36
                                                             ;; deoptimization bailout 36
0000013FD3444346  2502  e81dfedbff     call 0000013FD3204168    ;; debug: deopt position '239104'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 36
                                                             ;; deoptimization bailout 36
0000013FD344434B  2507  e822fedbff     call 0000013FD3204172    ;; debug: deopt position '262144'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 37
                                                             ;; deoptimization bailout 37
0000013FD3444350  2512  e81dfedbff     call 0000013FD3204172    ;; debug: deopt position '262144'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 37
                                                             ;; deoptimization bailout 37
0000013FD3444355  2517  e818fedbff     call 0000013FD3204172    ;; debug: deopt position '262144'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 37
                                                             ;; deoptimization bailout 37
0000013FD344435A  2522  e81dfedbff     call 0000013FD320417C    ;; debug: deopt position '254976'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 38
                                                             ;; deoptimization bailout 38
0000013FD344435F  2527  e818fedbff     call 0000013FD320417C    ;; debug: deopt position '254976'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 38
                                                             ;; deoptimization bailout 38
0000013FD3444364  2532  e813fedbff     call 0000013FD320417C    ;; debug: deopt position '254976'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 38
                                                             ;; deoptimization bailout 38
0000013FD3444369  2537  e818fedbff     call 0000013FD3204186    ;; debug: deopt position '314880'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 39
                                                             ;; deoptimization bailout 39
0000013FD344436E  2542  e813fedbff     call 0000013FD3204186    ;; debug: deopt position '314880'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 39
                                                             ;; deoptimization bailout 39
0000013FD3444373  2547  e80efedbff     call 0000013FD3204186    ;; debug: deopt position '314880'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 39
                                                             ;; deoptimization bailout 39
0000013FD3444378  2552  e813fedbff     call 0000013FD3204190    ;; debug: deopt position '337408'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 40
                                                             ;; deoptimization bailout 40
0000013FD344437D  2557  e80efedbff     call 0000013FD3204190    ;; debug: deopt position '337408'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 40
                                                             ;; deoptimization bailout 40
0000013FD3444382  2562  e809fedbff     call 0000013FD3204190    ;; debug: deopt position '337408'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 40
                                                             ;; deoptimization bailout 40
0000013FD3444387  2567  90             nop
                  ;;; Safepoint table.

Source positions:
 pc offset  position
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        10       355
        14       355
        18       355
        18       355
        18       355
        18       355
        21       355
        35       355
        35       355
        35       355
        39       473
        47       473
        47       473
        62       473
        62       532
        62       532
        62       448
        95       448
        95       464
       107       464
       107       473
       111       473
       111       466
       111       466
       120       448
       120       448
       120       448
       133       448
       133       499
       133       499
       142       560
       142       560
       145       560
       159       560
       159       565
       159       565
       169       580
       169       580
       169       585
       169       585
       179       633
       179       633
       179       493
       185       493
       190       532
       190       532
       190       532
       193       532
       193       532
       201       532
       207       532
       328       532
       328       493
       331       493
       331       650
       335       650
       335       655
       335       655
       345       670
       345       670
       345       675
       345       675
       355      1936
       355      1936
       355      1941
       355      1941
       365      1956
       365      1956
       365      1961
       365      1961
       374      1979
       374      1979
       377      1979
       386      1979
       386      1932
       386      1932
       391      2011
       391      2011
       391      1932
       396      1932
       396       646
       396       646
       396       646
       405       646
       410       700
       410       700
       413       716
       422       716
       422       710
       422       710
       430       723
       430       723
       430       728
       430       728
       439       770
       439       770
       439       780
       439       780
       447       793
       447       793
       447       798
       447       798
       456       798
       456       798
       456       798
       459       798
       464       819
       464       819
       471       822
       506       822
       506       822
       506       822
       509       822
       522       822
       522       830
       522       830
       531       849
       531       849
       539       853
       574       853
       578       853
       578       853
       591       867
       626       867
       626       867
       626       867
       629       867
       642       867
       642       875
       651       875
       651       853
       657       853
       657       853
       660       853
       660       853
       661       853
       661       355
       666       355
       674       853
       679       853
       679       853
       679       853
       682       853
       695       853
       695       880
       695       880
       704       907
       704       907
       712       911
       747       911
       747       911
       747       911
       747       925
       747       925
       752       967
       752       967
       760       970
       795       970
       795       970
       795       970
       798       970
       811       970
       811       978
       811       978
       820      1429
       820      1429
       820      1432
       820      1432
       825       963
       825       963
       833      1014
       868      1014
       868      1014
       868      1014
       871      1014
       884      1014
       884      1022
       893      1022
       901      1110
       909      1110
       909      1110
       924      1110
       924      1110
       927      1110
       927      1066
       930      1066
       930      1073
       934      1073
       934      1075
       934      1075
       943      1066
       943      1066
       943      1066
       956      1066
       956      1110
       964      1110
       970      1110
      1091      1110
      1091      1124
      1091      1124
      1101      1083
      1101      1083
      1101      1083
      1104      1083
      1104      1066
      1104      1066
      1109      1190
      1109      1190
      1109      1192
      1109      1192
      1117      1223
      1117      1223
      1117      1225
      1117      1225
      1126      1300
      1126      1300
      1133      1304
      1168      1304
      1168      1304
      1168      1304
      1172      1304
      1178      1304
      1178      1304
      1181      1304
      1181      1304
      1183      1304
      1183      1304
      1184      1304
      1184       802
      1189       802
      1199      1304
      1204      1304
      1204      1304
      1204      1304
      1204      1219
      1204      1219
      1209      1255
      1209      1255
      1209      1219
      1219      1219
      1219      1343
      1219      1343
      1219      1384
      1228      1384
      1233      1596
      1233      1596
      1233      1596
      1237      1596
      1393      1592
      1393      1592
      1393      1592
      1397      1592
      1402      1628
      1402      1628
      1402      1631
      1402      1631
      1407       780
      1410       780
      1410       780
      1410       780
      1410      1747
      1410      1747
      1414      1750
      1423      1750
      1423      1750
      1438      1750
      1438      1750
      1441      1750
      1441      1758
      1441      1758
      1450      1851
      1450      1851
      1453      1867
      1462      1867
      1466      1851
      1472      1851
      1472      1851
      1478      1851
      1478      1851
      1481      1851
      1481      1851
      1482      1851
      1482      1851
      1483      1851
      1483      1851
      1493      1851
      1497      1851
      1513      1851
      1513      1851
      1513      1851
      1513      1743
      1513      1743
      1518      1773
      1518      1773
      1521      1808
      1530      1808
      1534      1792
      1540      1792
      1540      1792
      1546      1792
      1546      1792
      1549      1792
      1549      1792
      1550      1792
      1550      1792
      1551      1792
      1551      1851
      1561      1851
      1565      1792
      1581      1792
      1588      1792
      1588      1792
      1588      1785
      1597      1785
      1597      1785
      1612      1785
      1612      1780
      1622      1780
      1629      1785
      1634      1785
      1634      1785
      1634      1785
      1647      1778
      1652      1778
      1652      1778
      1652      1778
      1652      1743
      1652      1743
      1652       766
      1652       766
      1652       766
      1655       766
      1655       696
      1655       696
      1655       696
      1658       696
      1663       696
      1663       696
      1663       696
      1667       696
      1667      1902
      1667      1902
      1667       646
      1676       646
      1676       484
      1676       484
      1680       484
      1683       484
      1687       464
      1693       464
      1693       448
      1719       448
      1724      2034
      1724      2034
      1728      2027
      1735      2027
      1735       448
      1807       560
      1863       532
      1957       822
      2012       867
      2067       853
      2122       970
      2177      1014
      2232      1066
      2304      1110

Inlined functions (count = 0)

Deoptimization Input Data (deopt points = 41)
 index  ast id    argc     pc
     0       4       0     35
     1      65       0     -1
     2      65       0     -1
     3      69       0    133
     4     111       0     -1
     5     894       0     -1
     6     189       0     -1
     7     304       0    506
     8     331       0    578
     9     342       0    626
    10     342       0     -1
    11     323       0    679
    12     372       0    747
    13     372       0     -1
    14     407       0    795
    15     403       0     -1
    16     439       0    868
    17     439       0     -1
    18     464       0     -1
    19     464       0     -1
    20     468       0    956
    21     468       0     -1
    22     573       0   1168
    23     565       0   1204
    24     677       0     -1
    25     253       0     -1
    26     253       0     -1
    27     738       0     -1
    28     845       0   1513
    29     737       0     -1
    30     810       0   1588
    31     810       0     -1
    32     810       0     -1
    33     810       0   1634
    34     810       0   1652
    35     112       0     -1
    36     304       0     -1
    37     342       0     -1
    38     323       0     -1
    39     407       0     -1
    40     439       0     -1

Safepoints (size = 224)
0000013FD34439A3    35  000000010000 (sp -> fp)       0
0000013FD3443B7A   506  000010010000 (sp -> fp)       7
0000013FD3443BBE   574  000010010000 (sp -> fp)       8
0000013FD3443BF2   626  001010010000 (sp -> fp)       9
0000013FD3443C27   679  000010010000 (sp -> fp)      11
0000013FD3443C6B   747  000010010000 (sp -> fp)      12
0000013FD3443C9B   795  000010010000 (sp -> fp)      14
0000013FD3443CE4   868  000010010000 (sp -> fp)      16
0000013FD3443E10  1168  000010010000 (sp -> fp)      22
0000013FD3443E34  1204  000000010000 (sp -> fp)      23
0000013FD3443F69  1513  000000010000 (sp -> fp)      28
0000013FD3443FAD  1581  000010010000 (sp -> fp)      30
0000013FD3443FE2  1634  100010010000 (sp -> fp)      33
0000013FD3443FF4  1652  100010010000 (sp -> fp)      34
0000013FD3444073  1779  000010010000 | rax | rdx | rdi | r8 (sp -> fp)       3
0000013FD3444100  1920  000010010000 | rax | rdi | r8 (sp -> fp)  <none> argc: 2
0000013FD3444264  2276  000010010000 | rax (sp -> fp)      20
0000013FD34442B8  2360  000010010000 | rax (sp -> fp)  <none> argc: 2

RelocInfo (size = 3734)
0000013FD344398A  comment  (;;; <@0,#0> -------------------- B0 --------------------)
0000013FD344398A  comment  (;;; <@8,#5> prologue)
0000013FD344398A  comment  (;;; Prologue begin)
0000013FD344398A  comment  (;;; Prologue end)
0000013FD344398A  comment  (;;; <@12,#7> -------------------- B1 --------------------)
0000013FD344398A  comment  (;;; <@14,#8> context)
0000013FD344398E  comment  (;;; <@15,#8> gap)
0000013FD3443992  comment  (;;; <@18,#12> -------------------- B2 --------------------)
0000013FD3443992  comment  (;;; <@19,#12> gap)
0000013FD3443995  comment  (;;; <@20,#14> stack-check)
0000013FD344399F  code target (BUILTIN)  (0000013FD3388340)
0000013FD34439A3  comment  (;;; <@22,#14> lazy-bailout)
0000013FD34439A3  comment  (;;; <@23,#14> gap)
0000013FD34439A7  comment  (;;; <@24,#39> check-non-smi)
0000013FD34439AF  comment  (;;; <@26,#40> check-instance-type)
0000013FD34439BE  comment  (;;; <@28,#67> check-maps)
0000013FD34439BE  comment  (;;; <@30,#35> gap)
0000013FD34439C4  embedded object  (000001334DB82809 <String[0]: >)
0000013FD34439D5  embedded object  (000001334DB82241 <undefined>)
0000013FD34439DF  comment  (;;; <@32,#36> -------------------- B3 (loop header) --------------------)
0000013FD34439EB  comment  (;;; <@34,#41> load-named-field)
0000013FD34439EF  comment  (;;; <@37,#42> compare-numeric-and-branch)
0000013FD34439F8  comment  (;;; <@38,#43> -------------------- B4 (unreachable/replaced) --------------------)
0000013FD34439F8  comment  (;;; <@42,#49> -------------------- B5 --------------------)
0000013FD34439F8  comment  (;;; <@44,#51> stack-check)
0000013FD3443A05  comment  (;;; <@47,#56> compare-numeric-and-branch)
0000013FD3443A0E  comment  (;;; <@48,#60> -------------------- B6 (unreachable/replaced) --------------------)
0000013FD3443A0E  comment  (;;; <@52,#76> -------------------- B7 --------------------)
0000013FD3443A0E  comment  (;;; <@53,#76> gap)
0000013FD3443A11  comment  (;;; <@54,#671> tagged-to-i)
0000013FD3443A1F  comment  (;;; <@57,#79> compare-numeric-and-branch)
0000013FD3443A29  comment  (;;; <@58,#83> -------------------- B8 (unreachable/replaced) --------------------)
0000013FD3443A29  comment  (;;; <@62,#86> -------------------- B9 --------------------)
0000013FD3443A29  comment  (;;; <@65,#89> compare-numeric-and-branch)
0000013FD3443A33  comment  (;;; <@66,#93> -------------------- B10 (unreachable/replaced) --------------------)
0000013FD3443A33  comment  (;;; <@70,#99> -------------------- B11 --------------------)
0000013FD3443A33  comment  (;;; <@72,#105> gap)
0000013FD3443A39  comment  (;;; <@73,#105> goto)
0000013FD3443A3E  comment  (;;; <@74,#57> -------------------- B12 (unreachable/replaced) --------------------)
0000013FD3443A3E  comment  (;;; <@78,#63> -------------------- B13 --------------------)
0000013FD3443A3E  comment  (;;; <@80,#72> load-named-field)
0000013FD3443A41  comment  (;;; <@82,#73> bounds-check)
0000013FD3443A49  comment  (;;; <@83,#73> gap)
0000013FD3443A4F  comment  (;;; <@84,#74> string-char-code-at)
0000013FD3443AC8  comment  (;;; <@86,#103> gap)
0000013FD3443ACB  comment  (;;; <@88,#107> -------------------- B14 --------------------)
0000013FD3443ACF  comment  (;;; <@91,#110> compare-numeric-and-branch)
0000013FD3443AD9  comment  (;;; <@92,#114> -------------------- B15 (unreachable/replaced) --------------------)
0000013FD3443AD9  comment  (;;; <@96,#117> -------------------- B16 --------------------)
0000013FD3443AD9  comment  (;;; <@99,#120> compare-numeric-and-branch)
0000013FD3443AE3  comment  (;;; <@100,#124> -------------------- B17 (unreachable/replaced) --------------------)
0000013FD3443AE3  comment  (;;; <@104,#603> -------------------- B18 --------------------)
0000013FD3443AE3  comment  (;;; <@107,#606> compare-numeric-and-branch)
0000013FD3443AED  comment  (;;; <@108,#610> -------------------- B19 (unreachable/replaced) --------------------)
0000013FD3443AED  comment  (;;; <@112,#607> -------------------- B20 (unreachable/replaced) --------------------)
0000013FD3443AED  comment  (;;; <@116,#613> -------------------- B21 --------------------)
0000013FD3443AED  comment  (;;; <@119,#616> compare-numeric-and-branch)
0000013FD3443AF6  comment  (;;; <@120,#620> -------------------- B22 (unreachable/replaced) --------------------)
0000013FD3443AF6  comment  (;;; <@124,#623> -------------------- B23 --------------------)
0000013FD3443AF6  comment  (;;; <@125,#623> gap)
0000013FD3443AF9  comment  (;;; <@126,#626> add-i)
0000013FD3443B02  comment  (;;; <@129,#632> goto)
0000013FD3443B07  comment  (;;; <@130,#617> -------------------- B24 (unreachable/replaced) --------------------)
0000013FD3443B07  comment  (;;; <@134,#628> -------------------- B25 --------------------)
0000013FD3443B07  comment  (;;; <@136,#634> gap)
0000013FD3443B0C  comment  (;;; <@138,#638> -------------------- B26 --------------------)
0000013FD3443B0C  comment  (;;; <@140,#640> gap)
0000013FD3443B15  comment  (;;; <@141,#640> goto)
0000013FD3443B1A  comment  (;;; <@142,#121> -------------------- B27 (unreachable/replaced) --------------------)
0000013FD3443B1A  comment  (;;; <@146,#111> -------------------- B28 (unreachable/replaced) --------------------)
0000013FD3443B1A  comment  (;;; <@150,#127> -------------------- B29 --------------------)
0000013FD3443B1A  comment  (;;; <@151,#127> gap)
0000013FD3443B1D  comment  (;;; <@152,#131> sub-i)
0000013FD3443B26  comment  (;;; <@155,#133> compare-numeric-and-branch)
0000013FD3443B2E  comment  (;;; <@156,#137> -------------------- B30 (unreachable/replaced) --------------------)
0000013FD3443B2E  comment  (;;; <@160,#140> -------------------- B31 --------------------)
0000013FD3443B2E  comment  (;;; <@163,#143> compare-numeric-and-branch)
0000013FD3443B37  comment  (;;; <@164,#147> -------------------- B32 (unreachable/replaced) --------------------)
0000013FD3443B37  comment  (;;; <@168,#150> -------------------- B33 --------------------)
0000013FD3443B37  comment  (;;; <@171,#156> compare-numeric-and-branch)
0000013FD3443B3F  comment  (;;; <@172,#160> -------------------- B34 (unreachable/replaced) --------------------)
0000013FD3443B3F  comment  (;;; <@176,#163> -------------------- B35 --------------------)
0000013FD3443B3F  comment  (;;; <@179,#166> compare-numeric-and-branch)
0000013FD3443B48  comment  (;;; <@180,#170> -------------------- B36 --------------------)
0000013FD3443B48  comment  (;;; <@182,#172> gap)
0000013FD3443B4B  comment  (;;; <@183,#172> goto)
0000013FD3443B50  comment  (;;; <@184,#167> -------------------- B37 (unreachable/replaced) --------------------)
0000013FD3443B50  comment  (;;; <@188,#173> -------------------- B38 --------------------)
0000013FD3443B50  comment  (;;; <@189,#173> gap)
0000013FD3443B57  comment  (;;; <@190,#175> load-named-generic)
0000013FD3443B59  embedded object  (000001334DB83491 <String[6]: length>)
0000013FD3443B63  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443B76  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443B7A  comment  (;;; <@192,#176> lazy-bailout)
0000013FD3443B7A  comment  (;;; <@193,#176> gap)
0000013FD3443B7D  comment  (;;; <@194,#675> tagged-to-i)
0000013FD3443B8A  comment  (;;; <@197,#178> compare-numeric-and-branch)
0000013FD3443B93  comment  (;;; <@198,#182> -------------------- B39 (unreachable/replaced) --------------------)
0000013FD3443B93  comment  (;;; <@202,#185> -------------------- B40 --------------------)
0000013FD3443B93  comment  (;;; <@203,#185> gap)
0000013FD3443B9B  comment  (;;; <@204,#187> load-named-generic)
0000013FD3443B9D  embedded object  (000001334DBA7801 <String[10]: charCodeAt>)
0000013FD3443BA7  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443BBA  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443BBE  comment  (;;; <@205,#187> gap)
0000013FD3443BC2  comment  (;;; <@206,#188> lazy-bailout)
0000013FD3443BC2  comment  (;;; <@207,#188> gap)
0000013FD3443BCA  comment  (;;; <@208,#190> load-named-generic)
0000013FD3443BD1  embedded object  (000001334DB83491 <String[6]: length>)
0000013FD3443BDB  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443BEE  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443BF2  comment  (;;; <@210,#191> lazy-bailout)
0000013FD3443BF2  comment  (;;; <@211,#191> gap)
0000013FD3443BF5  comment  (;;; <@212,#676> tagged-to-i)
0000013FD3443C02  comment  (;;; <@214,#193> sub-i)
0000013FD3443C0B  comment  (;;; <@216,#677> smi-tag)
0000013FD3443C11  comment  (;;; <@218,#197> push-argument)
0000013FD3443C14  comment  (;;; <@220,#197> push-argument)
0000013FD3443C15  comment  (;;; <@222,#625> constant-i)
0000013FD3443C1A  comment  (;;; <@223,#625> gap)
0000013FD3443C22  comment  (;;; <@224,#198> call-with-descriptor)
0000013FD3443C23  code target (BUILTIN)  (0000013FD33866E0)
0000013FD3443C27  comment  (;;; <@226,#199> lazy-bailout)
0000013FD3443C27  comment  (;;; <@227,#199> gap)
0000013FD3443C2A  comment  (;;; <@228,#678> tagged-to-i)
0000013FD3443C37  comment  (;;; <@231,#201> compare-numeric-and-branch)
0000013FD3443C40  comment  (;;; <@232,#205> -------------------- B41 (unreachable/replaced) --------------------)
0000013FD3443C40  comment  (;;; <@236,#202> -------------------- B42 (unreachable/replaced) --------------------)
0000013FD3443C40  comment  (;;; <@240,#208> -------------------- B43 --------------------)
0000013FD3443C40  comment  (;;; <@241,#208> gap)
0000013FD3443C48  comment  (;;; <@242,#210> load-named-generic)
0000013FD3443C4A  embedded object  (000001334DBA7801 <String[10]: charCodeAt>)
0000013FD3443C54  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443C67  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443C6B  comment  (;;; <@244,#211> lazy-bailout)
0000013FD3443C6B  comment  (;;; <@247,#213> deoptimize)
0000013FD3443C6B  deopt position  (291840)
0000013FD3443C6B  deopt reason  (Insufficient type feedback for generic named access)
0000013FD3443C6B  deopt index
0000013FD3443C6C  runtime entry
0000013FD3443C70  comment  (;;; <@248,#214> -------------------- B44 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@256,#219> -------------------- B45 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@278,#229> -------------------- B46 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@288,#236> -------------------- B47 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@292,#233> -------------------- B48 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@296,#444> -------------------- B49 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@300,#179> -------------------- B50 (unreachable/replaced) --------------------)
0000013FD3443C70  comment  (;;; <@304,#239> -------------------- B51 --------------------)
0000013FD3443C70  comment  (;;; <@305,#239> gap)
0000013FD3443C78  comment  (;;; <@306,#241> load-named-generic)
0000013FD3443C7A  embedded object  (000001334DB83491 <String[6]: length>)
0000013FD3443C84  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443C97  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443C9B  comment  (;;; <@308,#242> lazy-bailout)
0000013FD3443C9B  comment  (;;; <@309,#242> gap)
0000013FD3443C9E  comment  (;;; <@310,#681> tagged-to-i)
0000013FD3443CAB  comment  (;;; <@313,#244> compare-numeric-and-branch)
0000013FD3443CB4  comment  (;;; <@314,#248> -------------------- B52 (unreachable/replaced) --------------------)
0000013FD3443CB4  comment  (;;; <@318,#368> -------------------- B53 --------------------)
0000013FD3443CB4  comment  (;;; <@321,#370> deoptimize)
0000013FD3443CB4  deopt position  (551424)
0000013FD3443CB4  deopt reason  (Insufficient type feedback for generic named access)
0000013FD3443CB4  deopt index
0000013FD3443CB5  runtime entry
0000013FD3443CB9  comment  (;;; <@322,#371> -------------------- B54 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@330,#376> -------------------- B55 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@340,#383> -------------------- B56 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@344,#386> -------------------- B57 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@348,#389> -------------------- B58 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@356,#394> -------------------- B59 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@366,#401> -------------------- B60 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@370,#427> -------------------- B61 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@374,#398> -------------------- B62 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@378,#380> -------------------- B63 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@382,#404> -------------------- B64 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@386,#245> -------------------- B65 (unreachable/replaced) --------------------)
0000013FD3443CB9  comment  (;;; <@390,#251> -------------------- B66 --------------------)
0000013FD3443CB9  comment  (;;; <@391,#251> gap)
0000013FD3443CC1  comment  (;;; <@392,#254> load-named-generic)
0000013FD3443CC3  embedded object  (000001334DB83491 <String[6]: length>)
0000013FD3443CCD  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443CE0  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443CE4  comment  (;;; <@394,#255> lazy-bailout)
0000013FD3443CE4  comment  (;;; <@395,#255> gap)
0000013FD3443CE7  comment  (;;; <@396,#684> tagged-to-i)
0000013FD3443CF4  comment  (;;; <@398,#257> sub-i)
0000013FD3443CFD  comment  (;;; <@399,#257> gap)
0000013FD3443D05  comment  (;;; <@400,#289> check-non-smi)
0000013FD3443D0D  comment  (;;; <@402,#290> check-instance-type)
0000013FD3443D1C  comment  (;;; <@404,#297> load-named-field)
0000013FD3443D1F  comment  (;;; <@406,#274> gap)
0000013FD3443D22  comment  (;;; <@408,#275> -------------------- B67 (loop header) --------------------)
0000013FD3443D26  comment  (;;; <@411,#278> compare-numeric-and-branch)
0000013FD3443D2F  comment  (;;; <@412,#279> -------------------- B68 (unreachable/replaced) --------------------)
0000013FD3443D2F  comment  (;;; <@416,#285> -------------------- B69 --------------------)
0000013FD3443D2F  comment  (;;; <@418,#287> stack-check)
0000013FD3443D3C  comment  (;;; <@420,#298> bounds-check)
0000013FD3443D44  comment  (;;; <@421,#298> gap)
0000013FD3443D4A  comment  (;;; <@422,#299> string-char-code-at)
0000013FD3443DC3  comment  (;;; <@425,#301> compare-numeric-and-branch)
0000013FD3443DCD  comment  (;;; <@426,#305> -------------------- B70 (unreachable/replaced) --------------------)
0000013FD3443DCD  comment  (;;; <@430,#311> -------------------- B71 --------------------)
0000013FD3443DCD  comment  (;;; <@432,#314> add-i)
0000013FD3443DD0  comment  (;;; <@435,#317> goto)
0000013FD3443DD5  comment  (;;; <@436,#302> -------------------- B72 (unreachable/replaced) --------------------)
0000013FD3443DD5  comment  (;;; <@440,#308> -------------------- B73 (unreachable/replaced) --------------------)
0000013FD3443DD5  comment  (;;; <@444,#282> -------------------- B74 (unreachable/replaced) --------------------)
0000013FD3443DD5  comment  (;;; <@448,#318> -------------------- B75 (unreachable/replaced) --------------------)
0000013FD3443DD5  comment  (;;; <@452,#321> -------------------- B76 --------------------)
0000013FD3443DD5  comment  (;;; <@455,#324> compare-numeric-and-branch)
0000013FD3443DDD  comment  (;;; <@456,#328> -------------------- B77 (unreachable/replaced) --------------------)
0000013FD3443DDD  comment  (;;; <@460,#331> -------------------- B78 --------------------)
0000013FD3443DDD  comment  (;;; <@463,#334> compare-numeric-and-branch)
0000013FD3443DE6  comment  (;;; <@464,#338> -------------------- B79 (unreachable/replaced) --------------------)
0000013FD3443DE6  comment  (;;; <@468,#344> -------------------- B80 --------------------)
0000013FD3443DE6  comment  (;;; <@469,#344> gap)
0000013FD3443DED  comment  (;;; <@470,#346> load-named-generic)
0000013FD3443DEF  embedded object  (000001334DBC61A1 <String[5]: slice>)
0000013FD3443DF9  embedded object  (000003EE53F023B1 <FixedArray[95]>)
0000013FD3443E0C  code target (LOAD_IC)  (0000013FD34436C0)
0000013FD3443E10  comment  (;;; <@472,#347> lazy-bailout)
0000013FD3443E10  comment  (;;; <@473,#347> gap)
0000013FD3443E14  comment  (;;; <@474,#685> smi-tag)
0000013FD3443E1A  comment  (;;; <@476,#352> push-argument)
0000013FD3443E1D  comment  (;;; <@478,#352> push-argument)
0000013FD3443E1F  comment  (;;; <@480,#352> push-argument)
0000013FD3443E20  comment  (;;; <@482,#165> constant-i)
0000013FD3443E25  comment  (;;; <@483,#165> gap)
0000013FD3443E2F  comment  (;;; <@484,#353> call-with-descriptor)
0000013FD3443E30  code target (BUILTIN)  (0000013FD33866E0)
0000013FD3443E34  comment  (;;; <@486,#354> lazy-bailout)
0000013FD3443E34  comment  (;;; <@489,#359> goto)
0000013FD3443E39  comment  (;;; <@490,#335> -------------------- B81 (unreachable/replaced) --------------------)
0000013FD3443E39  comment  (;;; <@494,#341> -------------------- B82 --------------------)
0000013FD3443E39  comment  (;;; <@496,#357> gap)
0000013FD3443E3B  embedded object  (000001334DB82809 <String[0]: >)
0000013FD3443E43  comment  (;;; <@498,#361> -------------------- B83 --------------------)
0000013FD3443E43  comment  (;;; <@500,#367> gap)
0000013FD3443E4C  comment  (;;; <@501,#367> goto)
0000013FD3443E51  comment  (;;; <@502,#325> -------------------- B84 (unreachable/replaced) --------------------)
0000013FD3443E51  comment  (;;; <@506,#424> -------------------- B85 (unreachable/replaced) --------------------)
0000013FD3443E51  comment  (;;; <@510,#441> -------------------- B86 (unreachable/replaced) --------------------)
0000013FD3443E51  comment  (;;; <@514,#458> -------------------- B87 --------------------)
0000013FD3443E51  comment  (;;; <@516,#459> gap)
0000013FD3443E55  comment  (;;; <@517,#459> branch)
0000013FD3443EF1  comment  (;;; <@518,#463> -------------------- B88 (unreachable/replaced) --------------------)
0000013FD3443EF1  comment  (;;; <@522,#502> -------------------- B89 --------------------)
0000013FD3443EF1  comment  (;;; <@524,#504> gap)
0000013FD3443EF5  comment  (;;; <@525,#504> goto)
0000013FD3443EFA  comment  (;;; <@526,#460> -------------------- B90 (unreachable/replaced) --------------------)
0000013FD3443EFA  comment  (;;; <@530,#466> -------------------- B91 --------------------)
0000013FD3443EFA  comment  (;;; <@533,#468> deoptimize)
0000013FD3443EFA  deopt position  (653312)
0000013FD3443EFA  deopt reason  (Insufficient type feedback for generic named access)
0000013FD3443EFA  deopt index
0000013FD3443EFB  runtime entry
0000013FD3443EFF  comment  (;;; <@534,#469> -------------------- B92 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@542,#474> -------------------- B93 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@552,#481> -------------------- B94 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@556,#491> -------------------- B95 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@560,#478> -------------------- B96 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@564,#484> -------------------- B97 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@578,#499> -------------------- B98 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@582,#564> -------------------- B99 (unreachable/replaced) --------------------)
0000013FD3443EFF  comment  (;;; <@586,#157> -------------------- B100 --------------------)
0000013FD3443F02  comment  (;;; <@590,#506> -------------------- B101 --------------------)
0000013FD3443F02  comment  (;;; <@591,#506> gap)
0000013FD3443F06  comment  (;;; <@592,#508> check-non-smi)
0000013FD3443F0F  comment  (;;; <@594,#509> check-instance-type)
0000013FD3443F1E  comment  (;;; <@596,#510> load-named-field)
0000013FD3443F21  comment  (;;; <@599,#512> compare-numeric-and-branch)
0000013FD3443F2A  comment  (;;; <@600,#516> -------------------- B102 (unreachable/replaced) --------------------)
0000013FD3443F2A  comment  (;;; <@604,#543> -------------------- B103 --------------------)
0000013FD3443F2A  comment  (;;; <@605,#543> gap)
0000013FD3443F2D  comment  (;;; <@606,#551> add-i)
0000013FD3443F36  comment  (;;; <@607,#551> gap)
0000013FD3443F3A  comment  (;;; <@608,#672> smi-tag)
0000013FD3443F40  comment  (;;; <@610,#688> smi-tag)
0000013FD3443F46  comment  (;;; <@612,#555> push-argument)
0000013FD3443F49  comment  (;;; <@614,#555> push-argument)
0000013FD3443F4A  comment  (;;; <@616,#555> push-argument)
0000013FD3443F4B  comment  (;;; <@618,#548> constant-t)
0000013FD3443F4D  embedded object  (000003EE53F51F51 <JS Function slice (SharedFunctionInfo 000001334DBD3349)>)
0000013FD3443F55  comment  (;;; <@619,#548> gap)
0000013FD3443F59  comment  (;;; <@620,#556> invoke-function)
0000013FD3443F69  comment  (;;; <@622,#557> lazy-bailout)
0000013FD3443F69  comment  (;;; <@625,#562> goto)
0000013FD3443F6E  comment  (;;; <@626,#513> -------------------- B104 (unreachable/replaced) --------------------)
0000013FD3443F6E  comment  (;;; <@630,#519> -------------------- B105 --------------------)
0000013FD3443F6E  comment  (;;; <@631,#519> gap)
0000013FD3443F71  comment  (;;; <@632,#529> add-i)
0000013FD3443F7A  comment  (;;; <@633,#529> gap)
0000013FD3443F7E  comment  (;;; <@634,#673> smi-tag)
0000013FD3443F84  comment  (;;; <@636,#689> smi-tag)
0000013FD3443F8A  comment  (;;; <@638,#533> push-argument)
0000013FD3443F8D  comment  (;;; <@640,#533> push-argument)
0000013FD3443F8E  comment  (;;; <@642,#533> push-argument)
0000013FD3443F8F  comment  (;;; <@644,#548> constant-t)
0000013FD3443F91  embedded object  (000003EE53F51F51 <JS Function slice (SharedFunctionInfo 000001334DBD3349)>)
0000013FD3443F99  comment  (;;; <@645,#548> gap)
0000013FD3443F9D  comment  (;;; <@646,#534> invoke-function)
0000013FD3443FAD  comment  (;;; <@647,#534> gap)
0000013FD3443FB4  comment  (;;; <@648,#535> lazy-bailout)
0000013FD3443FB4  comment  (;;; <@650,#536> check-non-smi)
0000013FD3443FBD  comment  (;;; <@652,#537> check-instance-type)
0000013FD3443FCC  comment  (;;; <@654,#521> constant-t)
0000013FD3443FCE  embedded object  (000003FA4002D9A1 <String[1]: \>)
0000013FD3443FD6  comment  (;;; <@655,#521> gap)
0000013FD3443FDD  comment  (;;; <@656,#538> string-add)
0000013FD3443FDE  code target (STUB)  (0000013FD33A68E0)
0000013FD3443FE2  comment  (;;; <@658,#538> lazy-bailout)
0000013FD3443FE2  comment  (;;; <@659,#538> gap)
0000013FD3443FEA  comment  (;;; <@660,#541> string-add)
0000013FD3443FF0  code target (STUB)  (0000013FD33A68E0)
0000013FD3443FF4  comment  (;;; <@662,#541> lazy-bailout)
0000013FD3443FF4  comment  (;;; <@666,#567> -------------------- B106 --------------------)
0000013FD3443FF4  comment  (;;; <@668,#569> gap)
0000013FD3443FF7  comment  (;;; <@670,#584> -------------------- B107 --------------------)
0000013FD3443FF7  comment  (;;; <@672,#586> gap)
0000013FD3443FFA  comment  (;;; <@673,#586> goto)
0000013FD3443FFF  comment  (;;; <@674,#144> -------------------- B108 (unreachable/replaced) --------------------)
0000013FD3443FFF  comment  (;;; <@678,#134> -------------------- B109 (unreachable/replaced) --------------------)
0000013FD3443FFF  comment  (;;; <@682,#581> -------------------- B110 --------------------)
0000013FD3443FFF  comment  (;;; <@684,#583> gap)
0000013FD3444003  comment  (;;; <@686,#598> -------------------- B111 --------------------)
0000013FD3444003  comment  (;;; <@688,#637> gap)
0000013FD344400C  comment  (;;; <@690,#652> -------------------- B112 (unreachable/replaced) --------------------)
0000013FD344400C  comment  (;;; <@694,#655> -------------------- B113 --------------------)
0000013FD344400C  comment  (;;; <@695,#655> gap)
0000013FD3444010  comment  (;;; <@696,#657> add-i)
0000013FD3444013  comment  (;;; <@697,#657> gap)
0000013FD3444017  comment  (;;; <@698,#674> smi-tag)
0000013FD344401D  comment  (;;; <@700,#660> gap)
0000013FD3444037  comment  (;;; <@701,#660> goto)
0000013FD344403C  comment  (;;; <@702,#80> -------------------- B114 (unreachable/replaced) --------------------)
0000013FD344403C  comment  (;;; <@706,#90> -------------------- B115 (unreachable/replaced) --------------------)
0000013FD344403C  comment  (;;; <@710,#96> -------------------- B116 (unreachable/replaced) --------------------)
0000013FD344403C  comment  (;;; <@714,#46> -------------------- B117 (unreachable/replaced) --------------------)
0000013FD344403C  comment  (;;; <@718,#661> -------------------- B118 (unreachable/replaced) --------------------)
0000013FD344403C  comment  (;;; <@722,#664> -------------------- B119 --------------------)
0000013FD344403C  comment  (;;; <@723,#664> gap)
0000013FD3444040  comment  (;;; <@724,#667> return)
0000013FD3444047  comment  (;;; <@44,#51> -------------------- Deferred stack-check --------------------)
0000013FD344406F  code target (STUB)  (0000013FD338EB80)
0000013FD344408F  comment  (;;; <@54,#671> -------------------- Deferred tagged-to-i --------------------)
0000013FD34440C7  comment  (;;; <@84,#74> -------------------- Deferred string-char-code-at --------------------)
0000013FD34440FC  code target (STUB)  (0000013FD338EB80)
0000013FD3444125  comment  (;;; <@194,#675> -------------------- Deferred tagged-to-i --------------------)
0000013FD344415C  comment  (;;; <@212,#676> -------------------- Deferred tagged-to-i --------------------)
0000013FD3444193  comment  (;;; <@228,#678> -------------------- Deferred tagged-to-i --------------------)
0000013FD34441CA  comment  (;;; <@310,#681> -------------------- Deferred tagged-to-i --------------------)
0000013FD3444201  comment  (;;; <@396,#684> -------------------- Deferred tagged-to-i --------------------)
0000013FD3444238  comment  (;;; <@418,#287> -------------------- Deferred stack-check --------------------)
0000013FD3444260  code target (STUB)  (0000013FD338EB80)
0000013FD3444280  comment  (;;; <@422,#299> -------------------- Deferred string-char-code-at --------------------)
0000013FD34442B4  code target (STUB)  (0000013FD338EB80)
0000013FD34442DD  comment  (;;; -------------------- Jump table --------------------)
0000013FD34442DD  deopt position  (60416)
0000013FD34442DD  deopt reason  (Smi)
0000013FD34442DD  deopt index
0000013FD34442DE  runtime entry  (deoptimization bailout 1)
0000013FD34442E2  deopt position  (60416)
0000013FD34442E2  deopt reason  (wrong instance type)
0000013FD34442E2  deopt index
0000013FD34442E3  runtime entry  (deoptimization bailout 2)
0000013FD34442E7  deopt position  (90624)
0000013FD34442E7  deopt reason  (out of bounds)
0000013FD34442E7  deopt index
0000013FD34442E8  runtime entry  (deoptimization bailout 4)
0000013FD34442EC  deopt position  (831488)
0000013FD34442EC  deopt reason  (overflow)
0000013FD34442EC  deopt index
0000013FD34442ED  runtime entry  (deoptimization bailout 5)
0000013FD34442F1  deopt position  (184832)
0000013FD34442F1  deopt reason  (overflow)
0000013FD34442F1  deopt index
0000013FD34442F2  runtime entry  (deoptimization bailout 6)
0000013FD34442F6  deopt position  (266240)
0000013FD34442F6  deopt reason  (overflow)
0000013FD34442F6  deopt index
0000013FD34442F7  runtime entry  (deoptimization bailout 10)
0000013FD34442FB  deopt position  (341504)
0000013FD34442FB  deopt reason  (overflow)
0000013FD34442FB  deopt index
0000013FD34442FC  runtime entry  (deoptimization bailout 17)
0000013FD3444300  deopt position  (386560)
0000013FD3444300  deopt reason  (Smi)
0000013FD3444300  deopt index
0000013FD3444301  runtime entry  (deoptimization bailout 18)
0000013FD3444305  deopt position  (386560)
0000013FD3444305  deopt reason  (wrong instance type)
0000013FD3444305  deopt index
0000013FD3444306  runtime entry  (deoptimization bailout 19)
0000013FD344430A  deopt position  (386560)
0000013FD344430A  deopt reason  (out of bounds)
0000013FD344430A  deopt index
0000013FD344430B  runtime entry  (deoptimization bailout 21)
0000013FD344430F  deopt position  (714240)
0000013FD344430F  deopt reason  (Smi)
0000013FD344430F  deopt index
0000013FD3444310  runtime entry  (deoptimization bailout 25)
0000013FD3444314  deopt position  (714240)
0000013FD3444314  deopt reason  (wrong instance type)
0000013FD3444314  deopt index
0000013FD3444315  runtime entry  (deoptimization bailout 26)
0000013FD3444319  deopt position  (774144)
0000013FD3444319  deopt reason  (overflow)
0000013FD3444319  deopt index
0000013FD344431A  runtime entry  (deoptimization bailout 27)
0000013FD344431E  deopt position  (743936)
0000013FD344431E  deopt reason  (overflow)
0000013FD344431E  deopt index
0000013FD344431F  runtime entry  (deoptimization bailout 29)
0000013FD3444323  deopt position  (732160)
0000013FD3444323  deopt reason  (Smi)
0000013FD3444323  deopt index
0000013FD3444324  runtime entry  (deoptimization bailout 31)
0000013FD3444328  deopt position  (732160)
0000013FD3444328  deopt reason  (wrong instance type)
0000013FD3444328  deopt index
0000013FD3444329  runtime entry  (deoptimization bailout 32)
0000013FD344432D  deopt position  (104960)
0000013FD344432D  deopt reason  (not a heap number)
0000013FD344432D  deopt index
0000013FD344432E  runtime entry  (deoptimization bailout 35)
0000013FD3444332  deopt position  (104960)
0000013FD3444332  deopt reason  (lost precision)
0000013FD3444332  deopt index
0000013FD3444333  runtime entry  (deoptimization bailout 35)
0000013FD3444337  deopt position  (104960)
0000013FD3444337  deopt reason  (NaN)
0000013FD3444337  deopt index
0000013FD3444338  runtime entry  (deoptimization bailout 35)
0000013FD344433C  deopt position  (239104)
0000013FD344433C  deopt reason  (not a heap number)
0000013FD344433C  deopt index
0000013FD344433D  runtime entry  (deoptimization bailout 36)
0000013FD3444341  deopt position  (239104)
0000013FD3444341  deopt reason  (lost precision)
0000013FD3444341  deopt index
0000013FD3444342  runtime entry  (deoptimization bailout 36)
0000013FD3444346  deopt position  (239104)
0000013FD3444346  deopt reason  (NaN)
0000013FD3444346  deopt index
0000013FD3444347  runtime entry  (deoptimization bailout 36)
0000013FD344434B  deopt position  (262144)
0000013FD344434B  deopt reason  (not a heap number)
0000013FD344434B  deopt index
0000013FD344434C  runtime entry  (deoptimization bailout 37)
0000013FD3444350  deopt position  (262144)
0000013FD3444350  deopt reason  (lost precision)
0000013FD3444350  deopt index
0000013FD3444351  runtime entry  (deoptimization bailout 37)
0000013FD3444355  deopt position  (262144)
0000013FD3444355  deopt reason  (NaN)
0000013FD3444355  deopt index
0000013FD3444356  runtime entry  (deoptimization bailout 37)
0000013FD344435A  deopt position  (254976)
0000013FD344435A  deopt reason  (not a heap number)
0000013FD344435A  deopt index
0000013FD344435B  runtime entry  (deoptimization bailout 38)
0000013FD344435F  deopt position  (254976)
0000013FD344435F  deopt reason  (lost precision)
0000013FD344435F  deopt index
0000013FD3444360  runtime entry  (deoptimization bailout 38)
0000013FD3444364  deopt position  (254976)
0000013FD3444364  deopt reason  (NaN)
0000013FD3444364  deopt index
0000013FD3444365  runtime entry  (deoptimization bailout 38)
0000013FD3444369  deopt position  (314880)
0000013FD3444369  deopt reason  (not a heap number)
0000013FD3444369  deopt index
0000013FD344436A  runtime entry  (deoptimization bailout 39)
0000013FD344436E  deopt position  (314880)
0000013FD344436E  deopt reason  (lost precision)
0000013FD344436E  deopt index
0000013FD344436F  runtime entry  (deoptimization bailout 39)
0000013FD3444373  deopt position  (314880)
0000013FD3444373  deopt reason  (NaN)
0000013FD3444373  deopt index
0000013FD3444374  runtime entry  (deoptimization bailout 39)
0000013FD3444378  deopt position  (337408)
0000013FD3444378  deopt reason  (not a heap number)
0000013FD3444378  deopt index
0000013FD3444379  runtime entry  (deoptimization bailout 40)
0000013FD344437D  deopt position  (337408)
0000013FD344437D  deopt reason  (lost precision)
0000013FD344437D  deopt index
0000013FD344437E  runtime entry  (deoptimization bailout 40)
0000013FD3444382  deopt position  (337408)
0000013FD3444382  deopt reason  (NaN)
0000013FD3444382  deopt index
0000013FD3444383  runtime entry  (deoptimization bailout 40)
0000013FD3444388  comment  (;;; Safepoint table.)

--- End code ---
--- FUNCTION SOURCE (native math.js:random) id{1,0} ---
(){
if(e<=2){
f=%GenerateRandomNumbers(f);
if(%_IsTypedArray(f)){
e=%_TypedArrayGetLength(f);
}else{
e=f.length;
}
}
return f[--e];
}
--- END ---
--- Raw source ---
(){
if(e<=2){
f=%GenerateRandomNumbers(f);
if(%_IsTypedArray(f)){
e=%_TypedArrayGetLength(f);
}else{
e=f.length;
}
}
return f[--e];
}


--- Optimized code ---
optimization_id = 1
source_position = 178
kind = OPTIMIZED_FUNCTION
name = random
stack_slots = 5
compiler = crankshaft
Instructions (size = 725)
0000013FD34485E0     0  55             push rbp
0000013FD34485E1     1  4889e5         REX.W movq rbp,rsp
0000013FD34485E4     4  56             push rsi
0000013FD34485E5     5  57             push rdi
0000013FD34485E6     6  4883ec08       REX.W subq rsp,0x8
                  ;;; <@0,#0> -------------------- B0 --------------------
                  ;;; <@4,#3> prologue
                  ;;; Prologue begin
                  ;;; Prologue end
                  ;;; <@8,#5> -------------------- B1 --------------------
                  ;;; <@10,#6> context
0000013FD34485EA    10  488b45f8       REX.W movq rax,[rbp-0x8]
                  ;;; <@11,#6> gap
0000013FD34485EE    14  488945e8       REX.W movq [rbp-0x18],rax
                  ;;; <@14,#10> -------------------- B2 --------------------
                  ;;; <@15,#10> gap
0000013FD34485F2    18  488bf0         REX.W movq rsi,rax
                  ;;; <@16,#12> stack-check
0000013FD34485F5    21  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000013FD34485FC    28  7305           jnc 35  (0000013FD3448603)
0000013FD34485FE    30  e83dfdf3ff     call StackCheck  (0000013FD3388340)    ;; code: BUILTIN
                  ;;; <@18,#12> lazy-bailout
                  ;;; <@19,#12> gap
0000013FD3448603    35  488b45e8       REX.W movq rax,[rbp-0x18]
                  ;;; <@20,#13> load-context-slot
0000013FD3448607    39  488b582f       REX.W movq rbx,[rax+0x2f]
                  ;;; <@22,#93> tagged-to-i
0000013FD344860B    43  f6c301         testb rbx,0x1
0000013FD344860E    46  0f8582010000   jnz 438  (0000013FD3448796)
0000013FD3448614    52  48c1eb20       REX.W shrq rbx, 32
                  ;;; <@25,#15> compare-numeric-and-branch
0000013FD3448618    56  83fb02         cmpl rbx,0x2
0000013FD344861B    59  0f8e08000000   jle 73  (0000013FD3448629)
                  ;;; <@26,#19> -------------------- B3 (unreachable/replaced) --------------------
                  ;;; <@30,#69> -------------------- B4 --------------------
                  ;;; <@32,#71> gap
0000013FD3448621    65  488bd8         REX.W movq rbx,rax
                  ;;; <@33,#71> goto
0000013FD3448624    68  e9bf000000     jmp 264  (0000013FD34486E8)
                  ;;; <@34,#16> -------------------- B5 (unreachable/replaced) --------------------
                  ;;; <@38,#22> -------------------- B6 --------------------
                  ;;; <@40,#23> load-context-slot
0000013FD3448629    73  488b5837       REX.W movq rbx,[rax+0x37]
                  ;;; <@42,#24> push-argument
0000013FD344862D    77  53             push rbx
                  ;;; <@43,#24> gap
0000013FD344862E    78  488bf0         REX.W movq rsi,rax
                  ;;; <@44,#25> call-runtime
0000013FD3448631    81  b801000000     movl rax,0000000000000001
0000013FD3448636    86  48bbb0f69096f77f0000 REX.W movq rbx,00007FF79690F6B0
0000013FD3448640    96  e81bbaf3ff     call 0000013FD3384060    ;; code: STUB, CEntryStub, minor: 8
                  ;;; <@46,#26> lazy-bailout
                  ;;; <@47,#26> gap
0000013FD3448645   101  488b5de8       REX.W movq rbx,[rbp-0x18]
                  ;;; <@48,#27> store-context-slot
0000013FD3448649   105  48894337       REX.W movq [rbx+0x37],rax
0000013FD344864D   109  a801           test al,0x1
0000013FD344864F   111  0f8425000000   jz 154  (0000013FD344867A)
0000013FD3448655   117  488d5337       REX.W leaq rdx,[rbx+0x37]
0000013FD3448659   121  48250000f8ff   REX.W and rax,FFFFFFFFFFF80000
0000013FD344865F   127  f6400802       testb [rax+0x8],0x2
0000013FD3448663   131  7415           jz 154  (0000013FD344867A)
0000013FD3448665   133  48c7c00000f8ff REX.W movq rax,0xfff80000
0000013FD344866C   140  4823c3         REX.W andq rax,rbx
0000013FD344866F   143  f6400804       testb [rax+0x8],0x4
0000013FD3448673   147  7405           jz 154  (0000013FD344867A)
0000013FD3448675   149  e886f6ffff     call 0000013FD3447D00    ;; code: STUB, RecordWriteStub, minor: 8707
                  ;;; <@50,#29> load-context-slot
0000013FD344867A   154  488b4337       REX.W movq rax,[rbx+0x37]
                  ;;; <@53,#30> has-instance-type-and-branch
0000013FD344867E   158  a801           test al,0x1
0000013FD3448680   160  0f840f000000   jz 181  (0000013FD3448695)
0000013FD3448686   166  4c8b50ff       REX.W movq r10,[rax-0x1]
0000013FD344868A   170  41807a0bbf     cmpb [r10+0xb],0xbf
0000013FD344868F   175  0f8405000000   jz 186  (0000013FD344869A)
                  ;;; <@54,#34> -------------------- B7 (unreachable/replaced) --------------------
                  ;;; <@58,#54> -------------------- B8 --------------------
                  ;;; <@61,#56> deoptimize
0000013FD3448695   181  e87ab9ebff     call 0000013FD3304014    ;; debug: deopt position '53248'
                                                             ;; debug: deopt reason 'Insufficient type feedback for generic named access'
                                                             ;; debug: deopt index 2
                                                             ;; soft deoptimization bailout 2
                  ;;; <@62,#57> -------------------- B9 (unreachable/replaced) --------------------
                  ;;; <@74,#31> -------------------- B10 (unreachable/replaced) --------------------
                  ;;; <@78,#37> -------------------- B11 --------------------
                  ;;; <@80,#38> load-context-slot
0000013FD344869A   186  488b4337       REX.W movq rax,[rbx+0x37]
                  ;;; <@82,#39> load-named-field
0000013FD344869E   190  488b5017       REX.W movq rdx,[rax+0x17]
                  ;;; <@84,#40> load-named-field
0000013FD34486A2   194  488b4037       REX.W movq rax,[rax+0x37]
                  ;;; <@86,#41> load-named-field
0000013FD34486A6   198  8b5227         movl rdx,[rdx+0x27]
                  ;;; <@88,#43> bit-i
0000013FD34486A9   201  83e208         andl rdx,0x8
                  ;;; <@91,#45> compare-numeric-and-branch
0000013FD34486AC   204  83fa00         cmpl rdx,0x0
0000013FD34486AF   207  0f8402000000   jz 215  (0000013FD34486B7)
                  ;;; <@92,#46> -------------------- B12 (unreachable/replaced) --------------------
                  ;;; <@96,#48> -------------------- B13 --------------------
                  ;;; <@98,#49> gap
0000013FD34486B5   213  33c0           xorl rax,rax
                  ;;; <@100,#51> -------------------- B14 --------------------
                  ;;; <@102,#52> store-context-slot
0000013FD34486B7   215  4889432f       REX.W movq [rbx+0x2f],rax
0000013FD34486BB   219  a801           test al,0x1
0000013FD34486BD   221  0f8425000000   jz 264  (0000013FD34486E8)
0000013FD34486C3   227  488d532f       REX.W leaq rdx,[rbx+0x2f]
0000013FD34486C7   231  48250000f8ff   REX.W and rax,FFFFFFFFFFF80000
0000013FD34486CD   237  f6400802       testb [rax+0x8],0x2
0000013FD34486D1   241  7415           jz 264  (0000013FD34486E8)
0000013FD34486D3   243  48c7c00000f8ff REX.W movq rax,0xfff80000
0000013FD34486DA   250  4823c3         REX.W andq rax,rbx
0000013FD34486DD   253  f6400804       testb [rax+0x8],0x4
0000013FD34486E1   257  7405           jz 264  (0000013FD34486E8)
0000013FD34486E3   259  e818f6ffff     call 0000013FD3447D00    ;; code: STUB, RecordWriteStub, minor: 8707
                  ;;; <@106,#66> -------------------- B15 (unreachable/replaced) --------------------
                  ;;; <@110,#72> -------------------- B16 --------------------
                  ;;; <@112,#73> load-context-slot
0000013FD34486E8   264  488b4337       REX.W movq rax,[rbx+0x37]
                  ;;; <@114,#74> load-context-slot
0000013FD34486EC   268  488b532f       REX.W movq rdx,[rbx+0x2f]
                  ;;; <@116,#94> tagged-to-i
0000013FD34486F0   272  f6c201         testb rdx,0x1
0000013FD34486F3   275  0f85d4000000   jnz 493  (0000013FD34487CD)
0000013FD34486F9   281  48c1ea20       REX.W shrq rdx, 32
                  ;;; <@118,#76> add-i
0000013FD34486FD   285  83c2ff         addl rdx,0xff
0000013FD3448700   288  0f804c010000   jo 626  (0000013FD3448852)
                  ;;; <@120,#95> smi-tag
0000013FD3448706   294  8bca           movl rcx,rdx
0000013FD3448708   296  48c1e120       REX.W shlq rcx, 32
                  ;;; <@122,#77> store-context-slot
0000013FD344870C   300  48894b2f       REX.W movq [rbx+0x2f],rcx
                  ;;; <@124,#79> check-non-smi
0000013FD3448710   304  a801           test al,0x1
0000013FD3448712   306  0f843f010000   jz 631  (0000013FD3448857)
                  ;;; <@126,#80> check-maps
0000013FD3448718   312  49ba511ed1c537000000 REX.W movq r10,00000037C5D11E51    ;; object: 00000037C5D11E51 <Map(FLOAT64_ELEMENTS)>
0000013FD3448722   322  4c3950ff       REX.W cmpq [rax-0x1],r10
0000013FD3448726   326  0f8530010000   jnz 636  (0000013FD344885C)
                  ;;; <@128,#81> load-named-field
0000013FD344872C   332  488b480f       REX.W movq rcx,[rax+0xf]
                  ;;; <@130,#82> load-named-field
0000013FD3448730   336  8b710b         movl rsi,[rcx+0xb]
                  ;;; <@132,#83> check-array-buffer-not-neutered
0000013FD3448733   339  4c8b5017       REX.W movq r10,[rax+0x17]
0000013FD3448737   343  41f6422708     testb [r10+0x27],0x8
0000013FD344873C   348  0f851f010000   jnz 641  (0000013FD3448861)
                  ;;; <@134,#84> load-named-field
0000013FD3448742   354  488b7917       REX.W movq rdi,[rcx+0x17]
                  ;;; <@136,#85> load-named-field
0000013FD3448746   358  488b490f       REX.W movq rcx,[rcx+0xf]
                  ;;; <@138,#86> add-i
0000013FD344874A   362  4803f9         REX.W addq rdi,rcx
                  ;;; <@140,#87> bounds-check
0000013FD344874D   365  3bf2           cmpl rsi,rdx
0000013FD344874F   367  0f8611010000   jna 646  (0000013FD3448866)
                  ;;; <@142,#88> load-keyed
0000013FD3448755   373  f20f1004d7     movsd xmm0,[rdi+rdx*8]
                  ;;; <@144,#96> number-tag-d
0000013FD344875A   378  498b9da0570400 REX.W movq rbx,[r13+0x457a0]
0000013FD3448761   385  488bc3         REX.W movq rax,rbx
0000013FD3448764   388  4883c010       REX.W addq rax,0x10
0000013FD3448768   392  493b85a8570400 REX.W cmpq rax,[r13+0x457a8]
0000013FD344876F   399  0f878f000000   ja 548  (0000013FD3448804)
0000013FD3448775   405  498985a0570400 REX.W movq [r13+0x457a0],rax
0000013FD344877C   412  48ffc3         REX.W incq rbx
0000013FD344877F   415  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD3448783   419  4c8953ff       REX.W movq [rbx-0x1],r10
0000013FD3448787   423  f20f114307     movsd [rbx+0x7],xmm0
                  ;;; <@145,#96> gap
0000013FD344878C   428  488bc3         REX.W movq rax,rbx
                  ;;; <@146,#90> return
0000013FD344878F   431  488be5         REX.W movq rsp,rbp
0000013FD3448792   434  5d             pop rbp
0000013FD3448793   435  c20800         ret 0x8
                  ;;; <@22,#93> -------------------- Deferred tagged-to-i --------------------
0000013FD3448796   438  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD344879A   442  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000013FD344879E   446  0f85c7000000   jnz 651  (0000013FD344886B)
0000013FD34487A4   452  f2440f107b07   movsd xmm15,[rbx+0x7]
0000013FD34487AA   458  f2410f2cdf     cvttsd2sil rbx,xmm15
0000013FD34487AF   463  660f57c9       xorpd xmm1,xmm1
0000013FD34487B3   467  f20f2acb       cvtsi2sd xmm1,rbx
0000013FD34487B7   471  66440f2ef9     ucomisd xmm15,xmm1
0000013FD34487BC   476  0f85ae000000   jnz 656  (0000013FD3448870)
0000013FD34487C2   482  0f8aad000000   jpe 661  (0000013FD3448875)
0000013FD34487C8   488  e94bfeffff     jmp 56  (0000013FD3448618)
                  ;;; <@116,#94> -------------------- Deferred tagged-to-i --------------------
0000013FD34487CD   493  4d8b5560       REX.W movq r10,[r13+0x60]
0000013FD34487D1   497  4c3952ff       REX.W cmpq [rdx-0x1],r10
0000013FD34487D5   501  0f859f000000   jnz 666  (0000013FD344887A)
0000013FD34487DB   507  f2440f107a07   movsd xmm15,[rdx+0x7]
0000013FD34487E1   513  f2410f2cd7     cvttsd2sil rdx,xmm15
0000013FD34487E6   518  660f57c9       xorpd xmm1,xmm1
0000013FD34487EA   522  f20f2aca       cvtsi2sd xmm1,rdx
0000013FD34487EE   526  66440f2ef9     ucomisd xmm15,xmm1
0000013FD34487F3   531  0f8586000000   jnz 671  (0000013FD344887F)
0000013FD34487F9   537  0f8a85000000   jpe 676  (0000013FD3448884)
0000013FD34487FF   543  e9f9feffff     jmp 285  (0000013FD34486FD)
                  ;;; <@144,#96> -------------------- Deferred number-tag-d --------------------
0000013FD3448804   548  33db           xorl rbx,rbx
0000013FD3448806   550  50             push rax
0000013FD3448807   551  51             push rcx
0000013FD3448808   552  52             push rdx
0000013FD3448809   553  53             push rbx
0000013FD344880A   554  56             push rsi
0000013FD344880B   555  57             push rdi
0000013FD344880C   556  4150           push r8
0000013FD344880E   558  4151           push r9
0000013FD3448810   560  4153           push r11
0000013FD3448812   562  4154           push r12
0000013FD3448814   564  4156           push r14
0000013FD3448816   566  4157           push r15
0000013FD3448818   568  488d6424e0     REX.W leaq rsp,[rsp-0x20]
0000013FD344881D   573  33f6           xorl rsi,rsi
0000013FD344881F   575  33c0           xorl rax,rax
0000013FD3448821   577  48bb704cab96f77f0000 REX.W movq rbx,00007FF796AB4C70
0000013FD344882B   587  e85063f4ff     call 0000013FD338EB80    ;; code: STUB, CEntryStub, minor: 9
0000013FD3448830   592  4c8bd0         REX.W movq r10,rax
0000013FD3448833   595  488d642420     REX.W leaq rsp,[rsp+0x20]
0000013FD3448838   600  415f           pop r15
0000013FD344883A   602  415e           pop r14
0000013FD344883C   604  415c           pop r12
0000013FD344883E   606  415b           pop r11
0000013FD3448840   608  4159           pop r9
0000013FD3448842   610  4158           pop r8
0000013FD3448844   612  5f             pop rdi
0000013FD3448845   613  5e             pop rsi
0000013FD3448846   614  5b             pop rbx
0000013FD3448847   615  5a             pop rdx
0000013FD3448848   616  59             pop rcx
0000013FD3448849   617  58             pop rax
0000013FD344884A   618  498bda         REX.W movq rbx,r10
0000013FD344884D   621  e935ffffff     jmp 423  (0000013FD3448787)
                  ;;; -------------------- Jump table --------------------
0000013FD3448852   626  e8c7b7dbff     call 0000013FD320401E    ;; debug: deopt position '65536'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 3
                                                             ;; deoptimization bailout 3
0000013FD3448857   631  e8ccb7dbff     call 0000013FD3204028    ;; debug: deopt position '64000'
                                                             ;; debug: deopt reason 'Smi'
                                                             ;; debug: deopt index 4
                                                             ;; deoptimization bailout 4
0000013FD344885C   636  e8d1b7dbff     call 0000013FD3204032    ;; debug: deopt position '64000'
                                                             ;; debug: deopt reason 'wrong map'
                                                             ;; debug: deopt index 5
                                                             ;; deoptimization bailout 5
0000013FD3448861   641  e8d6b7dbff     call 0000013FD320403C    ;; debug: deopt position '64000'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 6
                                                             ;; deoptimization bailout 6
0000013FD3448866   646  e8dbb7dbff     call 0000013FD3204046    ;; debug: deopt position '64000'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 7
                                                             ;; deoptimization bailout 7
0000013FD344886B   651  e8e0b7dbff     call 0000013FD3204050    ;; debug: deopt position '3584'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 8
                                                             ;; deoptimization bailout 8
0000013FD3448870   656  e8dbb7dbff     call 0000013FD3204050    ;; debug: deopt position '3584'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 8
                                                             ;; deoptimization bailout 8
0000013FD3448875   661  e8d6b7dbff     call 0000013FD3204050    ;; debug: deopt position '3584'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 8
                                                             ;; deoptimization bailout 8
0000013FD344887A   666  e8dbb7dbff     call 0000013FD320405A    ;; debug: deopt position '65536'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 9
                                                             ;; deoptimization bailout 9
0000013FD344887F   671  e8d6b7dbff     call 0000013FD320405A    ;; debug: deopt position '65536'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 9
                                                             ;; deoptimization bailout 9
0000013FD3448884   676  e8d1b7dbff     call 0000013FD320405A    ;; debug: deopt position '65536'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 9
                                                             ;; deoptimization bailout 9
0000013FD3448889   681  0f1f00         nop
                  ;;; Safepoint table.

Inlined functions (count = 0)

Deoptimization Input Data (deopt points = 10)
 index  ast id    argc     pc
     0       4       0     35
     1      27       0    101
     2      35       0     -1
     3       5       0     -1
     4      82       0     -1
     5      82       0     -1
     6      82       0     -1
     7      82       0     -1
     8       4       0     -1
     9       5       0     -1

Safepoints (size = 41)
0000013FD3448603    35  10000 (sp -> fp)       0
0000013FD3448645   101  10000 (sp -> fp)       1
0000013FD3448830   592  00000 | rbx (sp -> fp)  <none>

RelocInfo (size = 928)
0000013FD34485EA  comment  (;;; <@0,#0> -------------------- B0 --------------------)
0000013FD34485EA  comment  (;;; <@4,#3> prologue)
0000013FD34485EA  comment  (;;; Prologue begin)
0000013FD34485EA  comment  (;;; Prologue end)
0000013FD34485EA  comment  (;;; <@8,#5> -------------------- B1 --------------------)
0000013FD34485EA  comment  (;;; <@10,#6> context)
0000013FD34485EE  comment  (;;; <@11,#6> gap)
0000013FD34485F2  comment  (;;; <@14,#10> -------------------- B2 --------------------)
0000013FD34485F2  comment  (;;; <@15,#10> gap)
0000013FD34485F5  comment  (;;; <@16,#12> stack-check)
0000013FD34485FF  code target (BUILTIN)  (0000013FD3388340)
0000013FD3448603  comment  (;;; <@18,#12> lazy-bailout)
0000013FD3448603  comment  (;;; <@19,#12> gap)
0000013FD3448607  comment  (;;; <@20,#13> load-context-slot)
0000013FD344860B  comment  (;;; <@22,#93> tagged-to-i)
0000013FD3448618  comment  (;;; <@25,#15> compare-numeric-and-branch)
0000013FD3448621  comment  (;;; <@26,#19> -------------------- B3 (unreachable/replaced) --------------------)
0000013FD3448621  comment  (;;; <@30,#69> -------------------- B4 --------------------)
0000013FD3448621  comment  (;;; <@32,#71> gap)
0000013FD3448624  comment  (;;; <@33,#71> goto)
0000013FD3448629  comment  (;;; <@34,#16> -------------------- B5 (unreachable/replaced) --------------------)
0000013FD3448629  comment  (;;; <@38,#22> -------------------- B6 --------------------)
0000013FD3448629  comment  (;;; <@40,#23> load-context-slot)
0000013FD344862D  comment  (;;; <@42,#24> push-argument)
0000013FD344862E  comment  (;;; <@43,#24> gap)
0000013FD3448631  comment  (;;; <@44,#25> call-runtime)
0000013FD3448641  code target (STUB)  (0000013FD3384060)
0000013FD3448645  comment  (;;; <@46,#26> lazy-bailout)
0000013FD3448645  comment  (;;; <@47,#26> gap)
0000013FD3448649  comment  (;;; <@48,#27> store-context-slot)
0000013FD3448676  code target (STUB)  (0000013FD3447D00)
0000013FD344867A  comment  (;;; <@50,#29> load-context-slot)
0000013FD344867E  comment  (;;; <@53,#30> has-instance-type-and-branch)
0000013FD3448695  comment  (;;; <@54,#34> -------------------- B7 (unreachable/replaced) --------------------)
0000013FD3448695  comment  (;;; <@58,#54> -------------------- B8 --------------------)
0000013FD3448695  comment  (;;; <@61,#56> deoptimize)
0000013FD3448695  deopt position  (53248)
0000013FD3448695  deopt reason  (Insufficient type feedback for generic named access)
0000013FD3448695  deopt index
0000013FD3448696  runtime entry
0000013FD344869A  comment  (;;; <@62,#57> -------------------- B9 (unreachable/replaced) --------------------)
0000013FD344869A  comment  (;;; <@74,#31> -------------------- B10 (unreachable/replaced) --------------------)
0000013FD344869A  comment  (;;; <@78,#37> -------------------- B11 --------------------)
0000013FD344869A  comment  (;;; <@80,#38> load-context-slot)
0000013FD344869E  comment  (;;; <@82,#39> load-named-field)
0000013FD34486A2  comment  (;;; <@84,#40> load-named-field)
0000013FD34486A6  comment  (;;; <@86,#41> load-named-field)
0000013FD34486A9  comment  (;;; <@88,#43> bit-i)
0000013FD34486AC  comment  (;;; <@91,#45> compare-numeric-and-branch)
0000013FD34486B5  comment  (;;; <@92,#46> -------------------- B12 (unreachable/replaced) --------------------)
0000013FD34486B5  comment  (;;; <@96,#48> -------------------- B13 --------------------)
0000013FD34486B5  comment  (;;; <@98,#49> gap)
0000013FD34486B7  comment  (;;; <@100,#51> -------------------- B14 --------------------)
0000013FD34486B7  comment  (;;; <@102,#52> store-context-slot)
0000013FD34486E4  code target (STUB)  (0000013FD3447D00)
0000013FD34486E8  comment  (;;; <@106,#66> -------------------- B15 (unreachable/replaced) --------------------)
0000013FD34486E8  comment  (;;; <@110,#72> -------------------- B16 --------------------)
0000013FD34486E8  comment  (;;; <@112,#73> load-context-slot)
0000013FD34486EC  comment  (;;; <@114,#74> load-context-slot)
0000013FD34486F0  comment  (;;; <@116,#94> tagged-to-i)
0000013FD34486FD  comment  (;;; <@118,#76> add-i)
0000013FD3448706  comment  (;;; <@120,#95> smi-tag)
0000013FD344870C  comment  (;;; <@122,#77> store-context-slot)
0000013FD3448710  comment  (;;; <@124,#79> check-non-smi)
0000013FD3448718  comment  (;;; <@126,#80> check-maps)
0000013FD344871A  embedded object  (00000037C5D11E51 <Map(FLOAT64_ELEMENTS)>)
0000013FD344872C  comment  (;;; <@128,#81> load-named-field)
0000013FD3448730  comment  (;;; <@130,#82> load-named-field)
0000013FD3448733  comment  (;;; <@132,#83> check-array-buffer-not-neutered)
0000013FD3448742  comment  (;;; <@134,#84> load-named-field)
0000013FD3448746  comment  (;;; <@136,#85> load-named-field)
0000013FD344874A  comment  (;;; <@138,#86> add-i)
0000013FD344874D  comment  (;;; <@140,#87> bounds-check)
0000013FD3448755  comment  (;;; <@142,#88> load-keyed)
0000013FD344875A  comment  (;;; <@144,#96> number-tag-d)
0000013FD344878C  comment  (;;; <@145,#96> gap)
0000013FD344878F  comment  (;;; <@146,#90> return)
0000013FD3448796  comment  (;;; <@22,#93> -------------------- Deferred tagged-to-i --------------------)
0000013FD34487CD  comment  (;;; <@116,#94> -------------------- Deferred tagged-to-i --------------------)
0000013FD3448804  comment  (;;; <@144,#96> -------------------- Deferred number-tag-d --------------------)
0000013FD344882C  code target (STUB)  (0000013FD338EB80)
0000013FD3448852  comment  (;;; -------------------- Jump table --------------------)
0000013FD3448852  deopt position  (65536)
0000013FD3448852  deopt reason  (overflow)
0000013FD3448852  deopt index
0000013FD3448853  runtime entry  (deoptimization bailout 3)
0000013FD3448857  deopt position  (64000)
0000013FD3448857  deopt reason  (Smi)
0000013FD3448857  deopt index
0000013FD3448858  runtime entry  (deoptimization bailout 4)
0000013FD344885C  deopt position  (64000)
0000013FD344885C  deopt reason  (wrong map)
0000013FD344885C  deopt index
0000013FD344885D  runtime entry  (deoptimization bailout 5)
0000013FD3448861  deopt position  (64000)
0000013FD3448861  deopt reason  (out of bounds)
0000013FD3448861  deopt index
0000013FD3448862  runtime entry  (deoptimization bailout 6)
0000013FD3448866  deopt position  (64000)
0000013FD3448866  deopt reason  (out of bounds)
0000013FD3448866  deopt index
0000013FD3448867  runtime entry  (deoptimization bailout 7)
0000013FD344886B  deopt position  (3584)
0000013FD344886B  deopt reason  (not a heap number)
0000013FD344886B  deopt index
0000013FD344886C  runtime entry  (deoptimization bailout 8)
0000013FD3448870  deopt position  (3584)
0000013FD3448870  deopt reason  (lost precision)
0000013FD3448870  deopt index
0000013FD3448871  runtime entry  (deoptimization bailout 8)
0000013FD3448875  deopt position  (3584)
0000013FD3448875  deopt reason  (NaN)
0000013FD3448875  deopt index
0000013FD3448876  runtime entry  (deoptimization bailout 8)
0000013FD344887A  deopt position  (65536)
0000013FD344887A  deopt reason  (not a heap number)
0000013FD344887A  deopt index
0000013FD344887B  runtime entry  (deoptimization bailout 9)
0000013FD344887F  deopt position  (65536)
0000013FD344887F  deopt reason  (lost precision)
0000013FD344887F  deopt index
0000013FD3448880  runtime entry  (deoptimization bailout 9)
0000013FD3448884  deopt position  (65536)
0000013FD3448884  deopt reason  (NaN)
0000013FD3448884  deopt index
0000013FD3448885  runtime entry  (deoptimization bailout 9)
0000013FD344888C  comment  (;;; Safepoint table.)

--- End code ---
--- FUNCTION SOURCE (D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:initModel) id{2,0} ---
() {
    const EARTH_MOON = 384403e3
    const X_MIN = -EARTH_MOON
    const X_MAX = EARTH_MOON
    const Y_MIN = -EARTH_MOON
    const Y_MAX = EARTH_MOON
    const Z_MIN = Y_MIN
    const Z_MAX = Y_MAX

    const M_MIN = 7.36e22
    const M_MAX = 5.9742e24

    let points = []
    for (let i = 0, tries = 0; i < POOL_SIZE; i++) {

        if (tries >= MAX_ATTEMPTS) { throw "ACHTUNG!!!" } else tries += 1

        let created = false
        while (!created) {

            let point = {
                x: Math.round(X_MIN + Math.random() * (X_MAX - X_MIN)),
                y: Math.round(Y_MIN + Math.random() * (Y_MAX - Y_MIN)),
                z: 0,
                vx: 0,
                vy: 0,
                vz: 0,
                m: M_MIN + Math.random() * (M_MAX - M_MIN)
            }
            // z: Math.round(Z_MIN + Math.random() * (Z_MAX - Z_MIN)),
            // m: Math.round(M_MIN + Math.random() * (M_MAX - M_MIN))

            let exists = false
            for (let j = 0; j < points.length; j++) {
                exists = (points[j].x === point.x) &&
                         (points[j].y === point.y)
                if (exists) break
            }
            if (!exists) {
                points.push(point)
                created = true
                tries = 0
            }
        }
    }

    let view = {
        width: Math.round( (X_MAX - X_MIN) * 2),
        height: Math.round( (Y_MAX - Y_MIN) * 2),
        x: 0,
        y: 0
    }
    return {
        origPoints: points,
        view
    }
}
--- END ---
--- FUNCTION SOURCE (D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:dvs) id{3,0} ---
(s, v, pointIndex, points, coord) {
    let sum = 0
    for (let i = 0; i < points.length; i++) {
        if (i !== pointIndex) {
            let R = Math.sqrt(
                (points[pointIndex].x - points[i].x) ** 2 +
                (points[pointIndex].y - points[i].y) ** 2 +
                (points[pointIndex].z - points[i].z) ** 2
            )
            let e = 1e8
            sum += G * points[i].m * ((points[i][coord] - s) / (R ** 2 + e ** 2) ** (3/2))
        }
    }
    return sum
}
--- END ---
--- FUNCTION SOURCE (D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:ds) id{4,0} ---
(s, v, pointIndex, points, coord) {
    return v
}
--- END ---
--- Raw source ---
(s, v, pointIndex, points, coord) {
    return v
}

--- Optimized code ---
optimization_id = 4
source_position = 2821
kind = OPTIMIZED_FUNCTION
name = ds
stack_slots = 5
compiler = crankshaft
Instructions (size = 67)
0000013FD344BCA0     0  55             push rbp
0000013FD344BCA1     1  4889e5         REX.W movq rbp,rsp
0000013FD344BCA4     4  56             push rsi
0000013FD344BCA5     5  57             push rdi
0000013FD344BCA6     6  4883ec08       REX.W subq rsp,0x8
                  ;;; <@0,#0> -------------------- B0 --------------------
                  ;;; <@14,#8> prologue
                  ;;; Prologue begin
                  ;;; Prologue end
                  ;;; <@18,#10> -------------------- B1 --------------------
                  ;;; <@20,#11> context
0000013FD344BCAA    10  488b45f8       REX.W movq rax,[rbp-0x8]
                  ;;; <@21,#11> gap
0000013FD344BCAE    14  488945e8       REX.W movq [rbp-0x18],rax
                  ;;; <@24,#15> -------------------- B2 --------------------
                  ;;; <@25,#15> gap
0000013FD344BCB2    18  488bf0         REX.W movq rsi,rax
                  ;;; <@26,#17> stack-check
0000013FD344BCB5    21  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000013FD344BCBC    28  7305           jnc 35  (0000013FD344BCC3)
0000013FD344BCBE    30  e87dc6f3ff     call StackCheck  (0000013FD3388340)    ;; code: BUILTIN
                  ;;; <@28,#17> lazy-bailout
                  ;;; <@29,#17> gap
0000013FD344BCC3    35  488b4528       REX.W movq rax,[rbp+0x28]
                  ;;; <@30,#20> return
0000013FD344BCC7    39  488be5         REX.W movq rsp,rbp
0000013FD344BCCA    42  5d             pop rbp
0000013FD344BCCB    43  c23000         ret 0x30
0000013FD344BCCE    46  6690           nop
                  ;;; Safepoint table.

Source positions:
 pc offset  position
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        10      2821
        14      2821
        18      2821
        18      2821
        18      2821
        18      2821
        21      2821
        35      2821
        35      2821
        35      2821
        39      2862
        46      2862

Inlined functions (count = 0)

Deoptimization Input Data (deopt points = 1)
 index  ast id    argc     pc
     0       4       0     35

Safepoints (size = 19)
0000013FD344BCC3    35  10000 (sp -> fp)       0

RelocInfo (size = 141)
0000013FD344BCAA  comment  (;;; <@0,#0> -------------------- B0 --------------------)
0000013FD344BCAA  comment  (;;; <@14,#8> prologue)
0000013FD344BCAA  comment  (;;; Prologue begin)
0000013FD344BCAA  comment  (;;; Prologue end)
0000013FD344BCAA  comment  (;;; <@18,#10> -------------------- B1 --------------------)
0000013FD344BCAA  comment  (;;; <@20,#11> context)
0000013FD344BCAE  comment  (;;; <@21,#11> gap)
0000013FD344BCB2  comment  (;;; <@24,#15> -------------------- B2 --------------------)
0000013FD344BCB2  comment  (;;; <@25,#15> gap)
0000013FD344BCB5  comment  (;;; <@26,#17> stack-check)
0000013FD344BCBF  code target (BUILTIN)  (0000013FD3388340)
0000013FD344BCC3  comment  (;;; <@28,#17> lazy-bailout)
0000013FD344BCC3  comment  (;;; <@29,#17> gap)
0000013FD344BCC7  comment  (;;; <@30,#20> return)
0000013FD344BCD0  comment  (;;; Safepoint table.)

--- End code ---
--- Raw source ---
(points, point, pointIndex, h, coord) {
    let vcoord = `v${coord}`
    let s = point[coord]
    let v = point[vcoord]

    let ks0 = ds(s, v, pointIndex, points, coord)
    let kv0 = dvs(s, v, pointIndex, points, coord)

    let ks1 = ds(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord)
    let kv1 = dvs(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord)

    let ks2 = ds(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord)
    let kv2 = dvs(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord)

    let ks3 = ds(s + h * ks2, v + h * kv2, pointIndex, points, coord)
    let kv3 = dvs(s + h * ks2, v + h * kv2, pointIndex, points, coord)

    return Object.assign({}, point, {
        [coord]: s + h / 6 * (ks0 + 2 * (ks1 + ks2) + ks3),
        [vcoord]: v + h / 6 * (kv0 + 2 * (kv1 + kv2) + kv3)
    })
}

--- Optimized code ---
optimization_id = 5
source_position = 3424
kind = OPTIMIZED_FUNCTION
name = RK4Step
stack_slots = 22
compiler = turbofan
Instructions (size = 2873)
                  -- B0 start (construct frame) --
0000013FD344CB60     0  55             push rbp
0000013FD344CB61     1  4889e5         REX.W movq rbp,rsp
0000013FD344CB64     4  56             push rsi
0000013FD344CB65     5  57             push rdi
0000013FD344CB66     6  4881ec90000000 REX.W subq rsp,0x90
0000013FD344CB6D    13  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000013FD344CB74    20  0f86e0070000   jna 2042  (0000013FD344D35A)
                  -- B2 start --
                  -- B3 start --
0000013FD344CB7A    26  488b4510       REX.W movq rax,[rbp+0x10]
0000013FD344CB7E    30  488b75f8       REX.W movq rsi,[rbp-0x8]
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:133:21 --
0000013FD344CB82    34  e89971f4ff     call ToString  (0000013FD3393D20)    ;; code: BUILTIN
0000013FD344CB87    39  48ba495dbb4d33010000 REX.W movq rdx,000001334DBB5D49    ;; object: 000001334DBB5D49 <String[1]: v>
0000013FD344CB91    49  488b75f8       REX.W movq rsi,[rbp-0x8]
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:133:17 --
0000013FD344CB95    53  e8469df5ff     call 0000013FD33A68E0    ;; code: STUB, StringAddStub, minor: 0
0000013FD344CB9A    58  488bd0         REX.W movq rdx,rax
0000013FD344CB9D    61  498b45c8       REX.W movq rax,[r13-0x38]
0000013FD344CBA1    65  488b75f8       REX.W movq rsi,[rbp-0x8]
0000013FD344CBA5    69  488bd8         REX.W movq rbx,rax
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:133:21 --
0000013FD344CBA8    72  e8339df5ff     call 0000013FD33A68E0    ;; code: STUB, StringAddStub, minor: 0
0000013FD344CBAD    77  488945d8       REX.W movq [rbp-0x28],rax
0000013FD344CBB1    81  488b7df0       REX.W movq rdi,[rbp-0x10]
0000013FD344CBB5    85  488b472f       REX.W movq rax,[rdi+0x2f]
0000013FD344CBB9    89  488b580f       REX.W movq rbx,[rax+0xf]
0000013FD344CBBD    93  48b80000000004000000 REX.W movq rax,0000000400000000
0000013FD344CBC7   103  488b5528       REX.W movq rdx,[rbp+0x28]
0000013FD344CBCB   107  488b4d10       REX.W movq rcx,[rbp+0x10]
0000013FD344CBCF   111  488b75f8       REX.W movq rsi,[rbp-0x8]
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:134:17 --
0000013FD344CBD3   115  e888f8ffff     call 0000013FD344C460    ;; code: KEYED_LOAD_IC
0000013FD344CBD8   120  48894580       REX.W movq [rbp-0x80],rax
0000013FD344CBDC   124  488b7df0       REX.W movq rdi,[rbp-0x10]
0000013FD344CBE0   128  488b472f       REX.W movq rax,[rdi+0x2f]
0000013FD344CBE4   132  488b580f       REX.W movq rbx,[rax+0xf]
0000013FD344CBE8   136  48b80000000006000000 REX.W movq rax,0000000600000000
0000013FD344CBF2   146  488b5528       REX.W movq rdx,[rbp+0x28]
0000013FD344CBF6   150  488b4dd8       REX.W movq rcx,[rbp-0x28]
0000013FD344CBFA   154  488b75f8       REX.W movq rsi,[rbp-0x8]
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:135:17 --
0000013FD344CBFE   158  e85df8ffff     call 0000013FD344C460    ;; code: KEYED_LOAD_IC
0000013FD344CC03   163  48894588       REX.W movq [rbp-0x78],rax
0000013FD344CC07   167  488b4df8       REX.W movq rcx,[rbp-0x8]
0000013FD344CC0B   171  48bb19951b9f6b000000 REX.W movq rbx,0000006B9F1B9519    ;; object: 0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>
0000013FD344CC15   181  4839594f       REX.W cmpq [rcx+0x4f],rbx
0000013FD344CC19   185  0f8509090000   jnz 2504  (0000013FD344D528)
0000013FD344CC1F   191  49b8d1df1a9f6b000000 REX.W movq r8,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344CC29   201  4c394157       REX.W cmpq [rcx+0x57],r8
0000013FD344CC2D   205  0f85fa080000   jnz 2509  (0000013FD344D52D)
0000013FD344CC33   211  498b7027       REX.W movq rsi,[r8+0x27]
0000013FD344CC37   215  488b4627       REX.W movq rax,[rsi+0x27]
0000013FD344CC3B   219  488b402f       REX.W movq rax,[rax+0x2f]
0000013FD344CC3F   223  50             push rax
0000013FD344CC40   224  4c8b4d80       REX.W movq r9,[rbp-0x80]
0000013FD344CC44   228  4151           push r9
0000013FD344CC46   230  4c8b5d88       REX.W movq r11,[rbp-0x78]
0000013FD344CC4A   234  4153           push r11
0000013FD344CC4C   236  4c8b6520       REX.W movq r12,[rbp+0x20]
0000013FD344CC50   240  4154           push r12
0000013FD344CC52   242  4c8b7530       REX.W movq r14,[rbp+0x30]
0000013FD344CC56   246  4156           push r14
0000013FD344CC58   248  4c8b7d10       REX.W movq r15,[rbp+0x10]
0000013FD344CC5C   252  4157           push r15
0000013FD344CC5E   254  498b55a0       REX.W movq rdx,[r13-0x60]
0000013FD344CC62   258  b805000000     movl rax,0000000000000005
0000013FD344CC67   263  498bf8         REX.W movq rdi,r8
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:138:14 --
0000013FD344CC6A   266  ff5737         call [rdi+0x37]
0000013FD344CC6D   269  488945a0       REX.W movq [rbp-0x60],rax
0000013FD344CC71   273  488b5df8       REX.W movq rbx,[rbp-0x8]
0000013FD344CC75   277  488b434f       REX.W movq rax,[rbx+0x4f]
0000013FD344CC79   281  488b4d18       REX.W movq rcx,[rbp+0x18]
0000013FD344CC7D   285  f6c101         testb rcx,0x1
0000013FD344CC80   288  0f842b000000   jz 337  (0000013FD344CCB1)
                  -- B4 start --
0000013FD344CC86   294  488b51ff       REX.W movq rdx,[rcx-0x1]
0000013FD344CC8A   298  4d8b4560       REX.W movq r8,[r13+0x60]
0000013FD344CC8E   302  493bd0         REX.W cmpq rdx,r8
0000013FD344CC91   305  0f8410000000   jz 327  (0000013FD344CCA7)
                  -- B5 start --
0000013FD344CC97   311  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344CC9B   315  81fa83000000   cmpl rdx,0x83
0000013FD344CCA1   321  0f858b080000   jnz 2514  (0000013FD344D532)
                  -- B6 start --
                  -- B7 start --
0000013FD344CCA7   327  f20f104107     movsd xmm0,[rcx+0x7]
0000013FD344CCAC   332  e913000000     jmp 356  (0000013FD344CCC4)
                  -- B8 start --
0000013FD344CCB1   337  488bd1         REX.W movq rdx,rcx
0000013FD344CCB4   340  48c1ea20       REX.W shrq rdx, 32
0000013FD344CCB8   344  660f57c0       xorpd xmm0,xmm0
0000013FD344CCBC   348  f20f2ac2       cvtsi2sd xmm0,rdx
0000013FD344CCC0   352  4d8b4560       REX.W movq r8,[r13+0x60]
                  -- B9 start --
0000013FD344CCC4   356  f20f1145c8     movsd [rbp-0x38],xmm0
0000013FD344CCC9   361  f6458801       testb [rbp-0x78],0x1
0000013FD344CCCD   365  0f842c000000   jz 415  (0000013FD344CCFF)
                  -- B10 start --
0000013FD344CCD3   371  4c8b4d88       REX.W movq r9,[rbp-0x78]
0000013FD344CCD7   375  498b51ff       REX.W movq rdx,[r9-0x1]
0000013FD344CCDB   379  493bd0         REX.W cmpq rdx,r8
0000013FD344CCDE   382  0f8410000000   jz 404  (0000013FD344CCF4)
                  -- B11 start --
0000013FD344CCE4   388  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344CCE8   392  81fa83000000   cmpl rdx,0x83
0000013FD344CCEE   398  0f8543080000   jnz 2519  (0000013FD344D537)
                  -- B12 start --
                  -- B13 start --
0000013FD344CCF4   404  f2410f104907   movsd xmm1,[r9+0x7]
0000013FD344CCFA   410  e914000000     jmp 435  (0000013FD344CD13)
                  -- B14 start --
0000013FD344CCFF   415  488b5588       REX.W movq rdx,[rbp-0x78]
0000013FD344CD03   419  48c1ea20       REX.W shrq rdx, 32
0000013FD344CD07   423  660f57c9       xorpd xmm1,xmm1
0000013FD344CD0B   427  f20f2aca       cvtsi2sd xmm1,rdx
0000013FD344CD0F   431  4c8b4d88       REX.W movq r9,[rbp-0x78]
                  -- B15 start --
0000013FD344CD13   435  f20f114dd0     movsd [rbp-0x30],xmm1
0000013FD344CD18   440  f6458001       testb [rbp-0x80],0x1
0000013FD344CD1C   444  0f842c000000   jz 494  (0000013FD344CD4E)
                  -- B16 start --
0000013FD344CD22   450  4c8b5d80       REX.W movq r11,[rbp-0x80]
0000013FD344CD26   454  498b53ff       REX.W movq rdx,[r11-0x1]
0000013FD344CD2A   458  493bd0         REX.W cmpq rdx,r8
0000013FD344CD2D   461  0f8410000000   jz 483  (0000013FD344CD43)
                  -- B17 start --
0000013FD344CD33   467  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344CD37   471  81fa83000000   cmpl rdx,0x83
0000013FD344CD3D   477  0f85f9070000   jnz 2524  (0000013FD344D53C)
                  -- B18 start --
                  -- B19 start --
0000013FD344CD43   483  f2410f105307   movsd xmm2,[r11+0x7]
0000013FD344CD49   489  e914000000     jmp 514  (0000013FD344CD62)
                  -- B20 start --
0000013FD344CD4E   494  488b5580       REX.W movq rdx,[rbp-0x80]
0000013FD344CD52   498  48c1ea20       REX.W shrq rdx, 32
0000013FD344CD56   502  660f57d2       xorpd xmm2,xmm2
0000013FD344CD5A   506  f20f2ad2       cvtsi2sd xmm2,rdx
0000013FD344CD5E   510  4c8b5d80       REX.W movq r11,[rbp-0x80]
                  -- B21 start --
0000013FD344CD62   514  4c8b65a0       REX.W movq r12,[rbp-0x60]
0000013FD344CD66   518  f20f119578ffffff movsd [rbp-0x88],xmm2
0000013FD344CD6E   526  41f6c401       testb r12,0x1
0000013FD344CD72   530  0f842a000000   jz 578  (0000013FD344CDA2)
                  -- B22 start --
0000013FD344CD78   536  498b5424ff     REX.W movq rdx,[r12-0x1]
0000013FD344CD7D   541  493bd0         REX.W cmpq rdx,r8
0000013FD344CD80   544  0f8410000000   jz 566  (0000013FD344CD96)
                  -- B23 start --
0000013FD344CD86   550  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344CD8A   554  81fa83000000   cmpl rdx,0x83
0000013FD344CD90   560  0f85ab070000   jnz 2529  (0000013FD344D541)
                  -- B24 start --
                  -- B25 start --
0000013FD344CD96   566  f2410f105c2407 movsd xmm3,[r12+0x7]
0000013FD344CD9D   573  e90f000000     jmp 593  (0000013FD344CDB1)
                  -- B26 start --
0000013FD344CDA2   578  4c89e2         REX.W movq rdx,r12
0000013FD344CDA5   581  48c1ea20       REX.W shrq rdx, 32
0000013FD344CDA9   585  660f57db       xorpd xmm3,xmm3
0000013FD344CDAD   589  f20f2ada       cvtsi2sd xmm3,rdx
                  -- B27 start --
0000013FD344CDB1   593  49be19951b9f6b000000 REX.W movq r14,0000006B9F1B9519    ;; object: 0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>
0000013FD344CDBB   603  493bc6         REX.W cmpq rax,r14
0000013FD344CDBE   606  0f8582070000   jnz 2534  (0000013FD344D546)
0000013FD344CDC4   612  49bfd1df1a9f6b000000 REX.W movq r15,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344CDCE   622  4c397b57       REX.W cmpq [rbx+0x57],r15
0000013FD344CDD2   626  0f8573070000   jnz 2539  (0000013FD344D54B)
0000013FD344CDD8   632  498b7727       REX.W movq rsi,[r15+0x27]
0000013FD344CDDC   636  488b4627       REX.W movq rax,[rsi+0x27]
0000013FD344CDE0   640  488b402f       REX.W movq rax,[rax+0x2f]
0000013FD344CDE4   644  498b95a0570400 REX.W movq rdx,[r13+0x457a0]
0000013FD344CDEB   651  488d7a20       REX.W leaq rdi,[rdx+0x20]
0000013FD344CDEF   655  f20f115db8     movsd [rbp-0x48],xmm3
0000013FD344CDF4   660  4939bda8570400 REX.W cmpq [r13+0x457a8],rdi
0000013FD344CDFB   667  0f8673050000   jna 2068  (0000013FD344D374)
                  -- B29 start --
                  -- B30 start --
0000013FD344CE01   673  488d7a10       REX.W leaq rdi,[rdx+0x10]
0000013FD344CE05   677  488d5201       REX.W leaq rdx,[rdx+0x1]
0000013FD344CE09   681  49ba000000000000e03f REX.W movq r10,3FE0000000000000
0000013FD344CE13   691  66490f6ee2     REX.W movq xmm4,r10
0000013FD344CE18   696  660f28e8       movapd xmm5,xmm0
0000013FD344CE1C   700  f20f59ec       mulsd xmm5,xmm4
0000013FD344CE20   704  4989bda0570400 REX.W movq [r13+0x457a0],rdi
0000013FD344CE27   711  660f28e5       movapd xmm4,xmm5
0000013FD344CE2B   715  f20f59e3       mulsd xmm4,xmm3
0000013FD344CE2F   719  4c8942ff       REX.W movq [rdx-0x1],r8
0000013FD344CE33   723  660f28f1       movapd xmm6,xmm1
0000013FD344CE37   727  f20f58f4       addsd xmm6,xmm4
0000013FD344CE3B   731  f20f117207     movsd [rdx+0x7],xmm6
0000013FD344CE40   736  488d5f10       REX.W leaq rbx,[rdi+0x10]
0000013FD344CE44   740  488d7f01       REX.W leaq rdi,[rdi+0x1]
0000013FD344CE48   744  49899da0570400 REX.W movq [r13+0x457a0],rbx
0000013FD344CE4F   751  660f28e5       movapd xmm4,xmm5
0000013FD344CE53   755  f20f59e1       mulsd xmm4,xmm1
0000013FD344CE57   759  4c8947ff       REX.W movq [rdi-0x1],r8
0000013FD344CE5B   763  660f28fa       movapd xmm7,xmm2
0000013FD344CE5F   767  f20f58fc       addsd xmm7,xmm4
0000013FD344CE63   771  f20f117f07     movsd [rdi+0x7],xmm7
0000013FD344CE68   776  50             push rax
0000013FD344CE69   777  57             push rdi
0000013FD344CE6A   778  52             push rdx
0000013FD344CE6B   779  ff7520         push [rbp+0x20]
0000013FD344CE6E   782  ff7530         push [rbp+0x30]
0000013FD344CE71   785  ff7510         push [rbp+0x10]
0000013FD344CE74   788  f20f116dc0     movsd [rbp-0x40],xmm5
0000013FD344CE79   793  f20f11b568ffffff movsd [rbp-0x98],xmm6
0000013FD344CE81   801  498bff         REX.W movq rdi,r15
0000013FD344CE84   804  498b55a0       REX.W movq rdx,[r13-0x60]
0000013FD344CE88   808  b805000000     movl rax,0000000000000005
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:141:14 --
0000013FD344CE8D   813  ff5737         call [rdi+0x37]
0000013FD344CE90   816  48894598       REX.W movq [rbp-0x68],rax
0000013FD344CE94   820  488b5df8       REX.W movq rbx,[rbp-0x8]
0000013FD344CE98   824  488b434f       REX.W movq rax,[rbx+0x4f]
0000013FD344CE9C   828  488b4d98       REX.W movq rcx,[rbp-0x68]
0000013FD344CEA0   832  f6c101         testb rcx,0x1
0000013FD344CEA3   835  0f842b000000   jz 884  (0000013FD344CED4)
                  -- B31 start --
0000013FD344CEA9   841  488b51ff       REX.W movq rdx,[rcx-0x1]
0000013FD344CEAD   845  4d8b4560       REX.W movq r8,[r13+0x60]
0000013FD344CEB1   849  493bd0         REX.W cmpq rdx,r8
0000013FD344CEB4   852  0f8410000000   jz 874  (0000013FD344CECA)
                  -- B32 start --
0000013FD344CEBA   858  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344CEBE   862  81fa83000000   cmpl rdx,0x83
0000013FD344CEC4   868  0f8586060000   jnz 2544  (0000013FD344D550)
                  -- B33 start --
                  -- B34 start --
0000013FD344CECA   874  f20f104107     movsd xmm0,[rcx+0x7]
0000013FD344CECF   879  e913000000     jmp 903  (0000013FD344CEE7)
                  -- B35 start --
0000013FD344CED4   884  488bd1         REX.W movq rdx,rcx
0000013FD344CED7   887  48c1ea20       REX.W shrq rdx, 32
0000013FD344CEDB   891  660f57c0       xorpd xmm0,xmm0
0000013FD344CEDF   895  f20f2ac2       cvtsi2sd xmm0,rdx
0000013FD344CEE3   899  4d8b4560       REX.W movq r8,[r13+0x60]
                  -- B36 start --
0000013FD344CEE7   903  49b919951b9f6b000000 REX.W movq r9,0000006B9F1B9519    ;; object: 0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>
0000013FD344CEF1   913  493bc1         REX.W cmpq rax,r9
0000013FD344CEF4   916  0f855b060000   jnz 2549  (0000013FD344D555)
0000013FD344CEFA   922  49bbd1df1a9f6b000000 REX.W movq r11,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344CF04   932  4c395b57       REX.W cmpq [rbx+0x57],r11
0000013FD344CF08   936  0f854c060000   jnz 2554  (0000013FD344D55A)
0000013FD344CF0E   942  498b7327       REX.W movq rsi,[r11+0x27]
0000013FD344CF12   946  488b4627       REX.W movq rax,[rsi+0x27]
0000013FD344CF16   950  488b402f       REX.W movq rax,[rax+0x2f]
0000013FD344CF1A   954  498b95a0570400 REX.W movq rdx,[r13+0x457a0]
0000013FD344CF21   961  488d7a20       REX.W leaq rdi,[rdx+0x20]
0000013FD344CF25   965  f20f1145b0     movsd [rbp-0x50],xmm0
0000013FD344CF2A   970  4939bda8570400 REX.W cmpq [r13+0x457a8],rdi
0000013FD344CF31   977  0f86d2040000   jna 2217  (0000013FD344D409)
                  -- B38 start --
                  -- B39 start --
0000013FD344CF37   983  488d7a10       REX.W leaq rdi,[rdx+0x10]
0000013FD344CF3B   987  488d5201       REX.W leaq rdx,[rdx+0x1]
0000013FD344CF3F   991  4989bda0570400 REX.W movq [r13+0x457a0],rdi
0000013FD344CF46   998  f20f104dc0     movsd xmm1,[rbp-0x40]
0000013FD344CF4B  1003  f20f59c8       mulsd xmm1,xmm0
0000013FD344CF4F  1007  4c8942ff       REX.W movq [rdx-0x1],r8
0000013FD344CF53  1011  f20f1055d0     movsd xmm2,[rbp-0x30]
0000013FD344CF58  1016  f20f58d1       addsd xmm2,xmm1
0000013FD344CF5C  1020  f20f115207     movsd [rdx+0x7],xmm2
0000013FD344CF61  1025  4c8d6710       REX.W leaq r12,[rdi+0x10]
0000013FD344CF65  1029  488d7f01       REX.W leaq rdi,[rdi+0x1]
0000013FD344CF69  1033  4d89a5a0570400 REX.W movq [r13+0x457a0],r12
0000013FD344CF70  1040  f20f104dc0     movsd xmm1,[rbp-0x40]
0000013FD344CF75  1045  f20f598d68ffffff mulsd xmm1,[rbp-0x98]
0000013FD344CF7D  1053  4c8947ff       REX.W movq [rdi-0x1],r8
0000013FD344CF81  1057  f20f109d78ffffff movsd xmm3,[rbp-0x88]
0000013FD344CF89  1065  f20f58d9       addsd xmm3,xmm1
0000013FD344CF8D  1069  f20f115f07     movsd [rdi+0x7],xmm3
0000013FD344CF92  1074  50             push rax
0000013FD344CF93  1075  57             push rdi
0000013FD344CF94  1076  52             push rdx
0000013FD344CF95  1077  ff7520         push [rbp+0x20]
0000013FD344CF98  1080  ff7530         push [rbp+0x30]
0000013FD344CF9B  1083  ff7510         push [rbp+0x10]
0000013FD344CF9E  1086  f20f119560ffffff movsd [rbp-0xa0],xmm2
0000013FD344CFA6  1094  498bfb         REX.W movq rdi,r11
0000013FD344CFA9  1097  498b55a0       REX.W movq rdx,[r13-0x60]
0000013FD344CFAD  1101  b805000000     movl rax,0000000000000005
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:144:14 --
0000013FD344CFB2  1106  ff5737         call [rdi+0x37]
0000013FD344CFB5  1109  48894590       REX.W movq [rbp-0x70],rax
0000013FD344CFB9  1113  488b5df8       REX.W movq rbx,[rbp-0x8]
0000013FD344CFBD  1117  488b434f       REX.W movq rax,[rbx+0x4f]
0000013FD344CFC1  1121  488b4d90       REX.W movq rcx,[rbp-0x70]
0000013FD344CFC5  1125  f6c101         testb rcx,0x1
0000013FD344CFC8  1128  0f842b000000   jz 1177  (0000013FD344CFF9)
                  -- B40 start --
0000013FD344CFCE  1134  488b51ff       REX.W movq rdx,[rcx-0x1]
0000013FD344CFD2  1138  4d8b4560       REX.W movq r8,[r13+0x60]
0000013FD344CFD6  1142  493bd0         REX.W cmpq rdx,r8
0000013FD344CFD9  1145  0f8410000000   jz 1167  (0000013FD344CFEF)
                  -- B41 start --
0000013FD344CFDF  1151  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344CFE3  1155  81fa83000000   cmpl rdx,0x83
0000013FD344CFE9  1161  0f8570050000   jnz 2559  (0000013FD344D55F)
                  -- B42 start --
                  -- B43 start --
0000013FD344CFEF  1167  f20f104107     movsd xmm0,[rcx+0x7]
0000013FD344CFF4  1172  e913000000     jmp 1196  (0000013FD344D00C)
                  -- B44 start --
0000013FD344CFF9  1177  488bd1         REX.W movq rdx,rcx
0000013FD344CFFC  1180  48c1ea20       REX.W shrq rdx, 32
0000013FD344D000  1184  660f57c0       xorpd xmm0,xmm0
0000013FD344D004  1188  f20f2ac2       cvtsi2sd xmm0,rdx
0000013FD344D008  1192  4d8b4560       REX.W movq r8,[r13+0x60]
                  -- B45 start --
0000013FD344D00C  1196  48ba19951b9f6b000000 REX.W movq rdx,0000006B9F1B9519    ;; object: 0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>
0000013FD344D016  1206  483bc2         REX.W cmpq rax,rdx
0000013FD344D019  1209  0f8545050000   jnz 2564  (0000013FD344D564)
0000013FD344D01F  1215  48bfd1df1a9f6b000000 REX.W movq rdi,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344D029  1225  48397b57       REX.W cmpq [rbx+0x57],rdi
0000013FD344D02D  1229  0f8536050000   jnz 2569  (0000013FD344D569)
0000013FD344D033  1235  488b7727       REX.W movq rsi,[rdi+0x27]
0000013FD344D037  1239  488b4627       REX.W movq rax,[rsi+0x27]
0000013FD344D03B  1243  488b402f       REX.W movq rax,[rax+0x2f]
0000013FD344D03F  1247  498b95a0570400 REX.W movq rdx,[r13+0x457a0]
0000013FD344D046  1254  4c8d4a20       REX.W leaq r9,[rdx+0x20]
0000013FD344D04A  1258  f20f1145a8     movsd [rbp-0x58],xmm0
0000013FD344D04F  1263  4d398da8570400 REX.W cmpq [r13+0x457a8],r9
0000013FD344D056  1270  0f860c040000   jna 2312  (0000013FD344D468)
                  -- B47 start --
                  -- B48 start --
0000013FD344D05C  1276  4c8d4a10       REX.W leaq r9,[rdx+0x10]
0000013FD344D060  1280  488d5201       REX.W leaq rdx,[rdx+0x1]
0000013FD344D064  1284  4d898da0570400 REX.W movq [r13+0x457a0],r9
0000013FD344D06B  1291  f20f104dc8     movsd xmm1,[rbp-0x38]
0000013FD344D070  1296  f20f59c8       mulsd xmm1,xmm0
0000013FD344D074  1300  4c8942ff       REX.W movq [rdx-0x1],r8
0000013FD344D078  1304  f20f1055d0     movsd xmm2,[rbp-0x30]
0000013FD344D07D  1309  f20f58d1       addsd xmm2,xmm1
0000013FD344D081  1313  f20f115207     movsd [rdx+0x7],xmm2
0000013FD344D086  1318  4d8d5910       REX.W leaq r11,[r9+0x10]
0000013FD344D08A  1322  4d8d4901       REX.W leaq r9,[r9+0x1]
0000013FD344D08E  1326  4d899da0570400 REX.W movq [r13+0x457a0],r11
0000013FD344D095  1333  f20f104dc8     movsd xmm1,[rbp-0x38]
0000013FD344D09A  1338  f20f598d60ffffff mulsd xmm1,[rbp-0xa0]
0000013FD344D0A2  1346  4d8941ff       REX.W movq [r9-0x1],r8
0000013FD344D0A6  1350  f20f109d78ffffff movsd xmm3,[rbp-0x88]
0000013FD344D0AE  1358  f20f58d9       addsd xmm3,xmm1
0000013FD344D0B2  1362  f2410f115907   movsd [r9+0x7],xmm3
0000013FD344D0B8  1368  50             push rax
0000013FD344D0B9  1369  4151           push r9
0000013FD344D0BB  1371  52             push rdx
0000013FD344D0BC  1372  ff7520         push [rbp+0x20]
0000013FD344D0BF  1375  ff7530         push [rbp+0x30]
0000013FD344D0C2  1378  ff7510         push [rbp+0x10]
0000013FD344D0C5  1381  f20f119570ffffff movsd [rbp-0x90],xmm2
0000013FD344D0CD  1389  498b55a0       REX.W movq rdx,[r13-0x60]
0000013FD344D0D1  1393  b805000000     movl rax,0000000000000005
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:147:14 --
0000013FD344D0D6  1398  ff5737         call [rdi+0x37]
0000013FD344D0D9  1401  488945c0       REX.W movq [rbp-0x40],rax
0000013FD344D0DD  1405  498b85a0570400 REX.W movq rax,[r13+0x457a0]
0000013FD344D0E4  1412  488d5870       REX.W leaq rbx,[rax+0x70]
0000013FD344D0E8  1416  49399da8570400 REX.W cmpq [r13+0x457a8],rbx
0000013FD344D0EF  1423  0f86c3030000   jna 2392  (0000013FD344D4B8)
                  -- B50 start --
                  -- B51 start --
0000013FD344D0F5  1429  488d5838       REX.W leaq rbx,[rax+0x38]
0000013FD344D0F9  1433  488d4001       REX.W leaq rax,[rax+0x1]
0000013FD344D0FD  1437  49899da0570400 REX.W movq [r13+0x457a0],rbx
0000013FD344D104  1444  488bd0         REX.W movq rdx,rax
0000013FD344D107  1447  48b83149d0c537000000 REX.W movq rax,00000037C5D04931    ;; object: 00000037C5D04931 <Map(FAST_HOLEY_ELEMENTS)>
0000013FD344D111  1457  488942ff       REX.W movq [rdx-0x1],rax
0000013FD344D115  1461  498b8d80000000 REX.W movq rcx,[r13+0x80]
0000013FD344D11C  1468  48894a07       REX.W movq [rdx+0x7],rcx
0000013FD344D120  1472  48894a0f       REX.W movq [rdx+0xf],rcx
0000013FD344D124  1476  498b7588       REX.W movq rsi,[r13-0x78]
0000013FD344D128  1480  48897217       REX.W movq [rdx+0x17],rsi
0000013FD344D12C  1484  4889721f       REX.W movq [rdx+0x1f],rsi
0000013FD344D130  1488  48897227       REX.W movq [rdx+0x27],rsi
0000013FD344D134  1492  4889722f       REX.W movq [rdx+0x2f],rsi
0000013FD344D138  1496  488d7b38       REX.W leaq rdi,[rbx+0x38]
0000013FD344D13C  1500  488d5b01       REX.W leaq rbx,[rbx+0x1]
0000013FD344D140  1504  4989bda0570400 REX.W movq [r13+0x457a0],rdi
0000013FD344D147  1511  488943ff       REX.W movq [rbx-0x1],rax
0000013FD344D14B  1515  48894b07       REX.W movq [rbx+0x7],rcx
0000013FD344D14F  1519  48894b0f       REX.W movq [rbx+0xf],rcx
0000013FD344D153  1523  48897317       REX.W movq [rbx+0x17],rsi
0000013FD344D157  1527  4889731f       REX.W movq [rbx+0x1f],rsi
0000013FD344D15B  1531  48897327       REX.W movq [rbx+0x27],rsi
0000013FD344D15F  1535  4889732f       REX.W movq [rbx+0x2f],rsi
0000013FD344D163  1539  488955e8       REX.W movq [rbp-0x18],rdx
0000013FD344D167  1543  48895de0       REX.W movq [rbp-0x20],rbx
0000013FD344D16B  1547  488b4510       REX.W movq rax,[rbp+0x10]
0000013FD344D16F  1551  488b75f8       REX.W movq rsi,[rbp-0x8]
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:149:36 --
0000013FD344D173  1555  e86867f4ff     call ToName  (0000013FD33938E0)    ;; code: BUILTIN
0000013FD344D178  1560  498b9da0570400 REX.W movq rbx,[r13+0x457a0]
0000013FD344D17F  1567  488d5310       REX.W leaq rdx,[rbx+0x10]
0000013FD344D183  1571  493995a8570400 REX.W cmpq [r13+0x457a8],rdx
0000013FD344D18A  1578  0f8647030000   jna 2423  (0000013FD344D4D7)
                  -- B53 start --
                  -- B54 start --
0000013FD344D190  1584  f20f108568ffffff movsd xmm0,[rbp-0x98]
0000013FD344D198  1592  f20f588560ffffff addsd xmm0,[rbp-0xa0]
0000013FD344D1A0  1600  660f28c8       movapd xmm1,xmm0
0000013FD344D1A4  1604  f20f58c8       addsd xmm1,xmm0
0000013FD344D1A8  1608  f20f1045d0     movsd xmm0,[rbp-0x30]
0000013FD344D1AD  1613  f20f58c1       addsd xmm0,xmm1
0000013FD344D1B1  1617  488d5310       REX.W leaq rdx,[rbx+0x10]
0000013FD344D1B5  1621  488d5b01       REX.W leaq rbx,[rbx+0x1]
0000013FD344D1B9  1625  f20f588570ffffff addsd xmm0,[rbp-0x90]
0000013FD344D1C1  1633  49ba0000000000001840 REX.W movq r10,4018000000000000
0000013FD344D1CB  1643  66490f6eca     REX.W movq xmm1,r10
0000013FD344D1D0  1648  f20f1055c8     movsd xmm2,[rbp-0x38]
0000013FD344D1D5  1653  f20f5ed1       divsd xmm2,xmm1
0000013FD344D1D9  1657  660f28d2       movapd xmm2,xmm2
0000013FD344D1DD  1661  498995a0570400 REX.W movq [r13+0x457a0],rdx
0000013FD344D1E4  1668  660f28ca       movapd xmm1,xmm2
0000013FD344D1E8  1672  f20f59c8       mulsd xmm1,xmm0
0000013FD344D1EC  1676  498b5560       REX.W movq rdx,[r13+0x60]
0000013FD344D1F0  1680  488953ff       REX.W movq [rbx-0x1],rdx
0000013FD344D1F4  1684  f20f108578ffffff movsd xmm0,[rbp-0x88]
0000013FD344D1FC  1692  f20f58c1       addsd xmm0,xmm1
0000013FD344D200  1696  f20f114307     movsd [rbx+0x7],xmm0
0000013FD344D205  1701  ff75e0         push [rbp-0x20]
0000013FD344D208  1704  50             push rax
0000013FD344D209  1705  53             push rbx
0000013FD344D20A  1706  6a00           push 0x0
0000013FD344D20C  1708  6a00           push 0x0
0000013FD344D20E  1710  f20f1155c8     movsd [rbp-0x38],xmm2
0000013FD344D213  1715  48b9b069ab96f77f0000 REX.W movq rcx,00007FF796AB69B0
0000013FD344D21D  1725  b805000000     movl rax,0000000000000005
0000013FD344D222  1730  488b75f8       REX.W movq rsi,[rbp-0x8]
0000013FD344D226  1734  488bd9         REX.W movq rbx,rcx
0000013FD344D229  1737  e8326ef3ff     call 0000013FD3384060    ;; code: STUB, CEntryStub, minor: 8
0000013FD344D22E  1742  488b45d8       REX.W movq rax,[rbp-0x28]
0000013FD344D232  1746  488b75f8       REX.W movq rsi,[rbp-0x8]
0000013FD344D236  1750  0f1f440000     nop
0000013FD344D23B  1755  e8a066f4ff     call ToName  (0000013FD33938E0)    ;; code: BUILTIN
0000013FD344D240  1760  488b5dc0       REX.W movq rbx,[rbp-0x40]
0000013FD344D244  1764  f6c301         testb rbx,0x1
0000013FD344D247  1767  0f842b000000   jz 1816  (0000013FD344D278)
                  -- B55 start --
0000013FD344D24D  1773  488b53ff       REX.W movq rdx,[rbx-0x1]
0000013FD344D251  1777  498b4d60       REX.W movq rcx,[r13+0x60]
0000013FD344D255  1781  483bd1         REX.W cmpq rdx,rcx
0000013FD344D258  1784  0f8410000000   jz 1806  (0000013FD344D26E)
                  -- B56 start --
0000013FD344D25E  1790  0fb6520b       movzxbl rdx,[rdx+0xb]
0000013FD344D262  1794  81fa83000000   cmpl rdx,0x83
0000013FD344D268  1800  0f8500030000   jnz 2574  (0000013FD344D56E)
                  -- B57 start --
                  -- B58 start --
0000013FD344D26E  1806  f20f104307     movsd xmm0,[rbx+0x7]
0000013FD344D273  1811  e910000000     jmp 1832  (0000013FD344D288)
                  -- B59 start --
0000013FD344D278  1816  48c1eb20       REX.W shrq rbx, 32
0000013FD344D27C  1820  660f57c0       xorpd xmm0,xmm0
0000013FD344D280  1824  f20f2ac3       cvtsi2sd xmm0,rbx
0000013FD344D284  1828  498b4d60       REX.W movq rcx,[r13+0x60]
                  -- B60 start --
0000013FD344D288  1832  498b9da0570400 REX.W movq rbx,[r13+0x457a0]
0000013FD344D28F  1839  488d5310       REX.W leaq rdx,[rbx+0x10]
0000013FD344D293  1843  493995a8570400 REX.W cmpq [r13+0x457a8],rdx
0000013FD344D29A  1850  0f865a020000   jna 2458  (0000013FD344D4FA)
                  -- B62 start --
                  -- B63 start (deconstruct frame) --
0000013FD344D2A0  1856  f20f104db0     movsd xmm1,[rbp-0x50]
0000013FD344D2A5  1861  f20f584da8     addsd xmm1,[rbp-0x58]
0000013FD344D2AA  1866  660f28d1       movapd xmm2,xmm1
0000013FD344D2AE  1870  f20f58d1       addsd xmm2,xmm1
0000013FD344D2B2  1874  f20f104db8     movsd xmm1,[rbp-0x48]
0000013FD344D2B7  1879  f20f58ca       addsd xmm1,xmm2
0000013FD344D2BB  1883  488d5310       REX.W leaq rdx,[rbx+0x10]
0000013FD344D2BF  1887  488d5b01       REX.W leaq rbx,[rbx+0x1]
0000013FD344D2C3  1891  f20f58c8       addsd xmm1,xmm0
0000013FD344D2C7  1895  498995a0570400 REX.W movq [r13+0x457a0],rdx
0000013FD344D2CE  1902  f20f1045c8     movsd xmm0,[rbp-0x38]
0000013FD344D2D3  1907  f20f59c1       mulsd xmm0,xmm1
0000013FD344D2D7  1911  48894bff       REX.W movq [rbx-0x1],rcx
0000013FD344D2DB  1915  f20f104dd0     movsd xmm1,[rbp-0x30]
0000013FD344D2E0  1920  f20f58c8       addsd xmm1,xmm0
0000013FD344D2E4  1924  f20f114b07     movsd [rbx+0x7],xmm1
0000013FD344D2E9  1929  ff75e0         push [rbp-0x20]
0000013FD344D2EC  1932  50             push rax
0000013FD344D2ED  1933  53             push rbx
0000013FD344D2EE  1934  6a00           push 0x0
0000013FD344D2F0  1936  6a00           push 0x0
0000013FD344D2F2  1938  48bbb069ab96f77f0000 REX.W movq rbx,00007FF796AB69B0
0000013FD344D2FC  1948  b805000000     movl rax,0000000000000005
0000013FD344D301  1953  488b75f8       REX.W movq rsi,[rbp-0x8]
0000013FD344D305  1957  e8566df3ff     call 0000013FD3384060    ;; code: STUB, CEntryStub, minor: 8
0000013FD344D30A  1962  48b83139ba4d33010000 REX.W movq rax,000001334DBA3931    ;; object: 000001334DBA3931 <JS Function assign (SharedFunctionInfo 000001334DBA3881)>
0000013FD344D314  1972  488b7027       REX.W movq rsi,[rax+0x27]
0000013FD344D318  1976  48bb3928ba4d33010000 REX.W movq rbx,000001334DBA2839    ;; object: 000001334DBA2839 <JS Function Object (SharedFunctionInfo 000001334DBA2789)>
0000013FD344D322  1986  53             push rbx
0000013FD344D323  1987  ff75e8         push [rbp-0x18]
0000013FD344D326  1990  488b5528       REX.W movq rdx,[rbp+0x28]
0000013FD344D32A  1994  52             push rdx
0000013FD344D32B  1995  ff75e0         push [rbp-0x20]
0000013FD344D32E  1998  48bb0000000007000000 REX.W movq rbx,0000000700000000
0000013FD344D338  2008  53             push rbx
0000013FD344D339  2009  50             push rax
0000013FD344D33A  2010  498b45a0       REX.W movq rax,[r13-0x60]
0000013FD344D33E  2014  50             push rax
0000013FD344D33F  2015  48bbe0096596f77f0000 REX.W movq rbx,00007FF7966509E0
0000013FD344D349  2025  b807000000     movl rax,0000000000000007
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:149:18 --
0000013FD344D34E  2030  e88dc6f4ff     call 0000013FD33999E0    ;; code: STUB, CEntryStub, minor: 12
0000013FD344D353  2035  488be5         REX.W movq rsp,rbp
0000013FD344D356  2038  5d             pop rbp
0000013FD344D357  2039  c23000         ret 0x30
                  -- B64 start (no frame) --
                  -- B1 start (deferred) --
0000013FD344D35A  2042  48bbb0117296f77f0000 REX.W movq rbx,00007FF7967211B0
0000013FD344D364  2052  33c0           xorl rax,rax
0000013FD344D366  2054  488b75f8       REX.W movq rsi,[rbp-0x8]
                  -- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:132:16 --
0000013FD344D36A  2058  e8f16cf3ff     call 0000013FD3384060    ;; code: STUB, CEntryStub, minor: 8
0000013FD344D36F  2063  e906f8ffff     jmp 26  (0000013FD344CB7A)
                  -- B28 start (deferred) --
0000013FD344D374  2068  66440f28fa     movapd xmm15,xmm2
0000013FD344D379  2073  660f28d1       movapd xmm2,xmm1
0000013FD344D37D  2077  66410f28cf     movapd xmm1,xmm15
0000013FD344D382  2082  66440f28fb     movapd xmm15,xmm3
0000013FD344D387  2087  660f28da       movapd xmm3,xmm2
0000013FD344D38B  2091  66410f28d7     movapd xmm2,xmm15
0000013FD344D390  2096  488bd8         REX.W movq rbx,rax
0000013FD344D393  2099  488945e8       REX.W movq [rbp-0x18],rax
0000013FD344D397  2103  488bc6         REX.W movq rax,rsi
0000013FD344D39A  2106  488975e0       REX.W movq [rbp-0x20],rsi
0000013FD344D39E  2110  4d89e0         REX.W movq r8,r12
0000013FD344D3A1  2113  498bf9         REX.W movq rdi,r9
0000013FD344D3A4  2116  488b75d8       REX.W movq rsi,[rbp-0x28]
0000013FD344D3A8  2120  498bcb         REX.W movq rcx,r11
0000013FD344D3AB  2123  ba20000000     movl rdx,0000000000000020
0000013FD344D3B0  2128  e8eb1ef4ff     call AllocateInNewSpace  (0000013FD338F2A0)    ;; code: BUILTIN
0000013FD344D3B5  2133  488d50ff       REX.W leaq rdx,[rax-0x1]
0000013FD344D3B9  2137  488b4d18       REX.W movq rcx,[rbp+0x18]
0000013FD344D3BD  2141  488b5df8       REX.W movq rbx,[rbp-0x8]
0000013FD344D3C1  2145  f20f104dd0     movsd xmm1,[rbp-0x30]
0000013FD344D3C6  2150  4d8b4560       REX.W movq r8,[r13+0x60]
0000013FD344D3CA  2154  f20f105db8     movsd xmm3,[rbp-0x48]
0000013FD344D3CF  2159  4c8b65a0       REX.W movq r12,[rbp-0x60]
0000013FD344D3D3  2163  4c8b4d88       REX.W movq r9,[rbp-0x78]
0000013FD344D3D7  2167  f20f109578ffffff movsd xmm2,[rbp-0x88]
0000013FD344D3DF  2175  f20f1045c8     movsd xmm0,[rbp-0x38]
0000013FD344D3E4  2180  4c8b5d80       REX.W movq r11,[rbp-0x80]
0000013FD344D3E8  2184  49bfd1df1a9f6b000000 REX.W movq r15,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344D3F2  2194  49be19951b9f6b000000 REX.W movq r14,0000006B9F1B9519    ;; object: 0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>
0000013FD344D3FC  2204  488b45e8       REX.W movq rax,[rbp-0x18]
0000013FD344D400  2208  488b75e0       REX.W movq rsi,[rbp-0x20]
0000013FD344D404  2212  e9f8f9ffff     jmp 673  (0000013FD344CE01)
                  -- B37 start (deferred) --
0000013FD344D409  2217  660f28d0       movapd xmm2,xmm0
0000013FD344D40D  2221  488bd8         REX.W movq rbx,rax
0000013FD344D410  2224  488945e8       REX.W movq [rbp-0x18],rax
0000013FD344D414  2228  f20f108d68ffffff movsd xmm1,[rbp-0x98]
0000013FD344D41C  2236  488bc6         REX.W movq rax,rsi
0000013FD344D41F  2239  f20f1045c0     movsd xmm0,[rbp-0x40]
0000013FD344D424  2244  488975e0       REX.W movq [rbp-0x20],rsi
0000013FD344D428  2248  ba20000000     movl rdx,0000000000000020
0000013FD344D42D  2253  e86e1ef4ff     call AllocateInNewSpace  (0000013FD338F2A0)    ;; code: BUILTIN
0000013FD344D432  2258  488d50ff       REX.W leaq rdx,[rax-0x1]
0000013FD344D436  2262  488b5df8       REX.W movq rbx,[rbp-0x8]
0000013FD344D43A  2266  4d8b4560       REX.W movq r8,[r13+0x60]
0000013FD344D43E  2270  f20f1045b0     movsd xmm0,[rbp-0x50]
0000013FD344D443  2275  488b4d98       REX.W movq rcx,[rbp-0x68]
0000013FD344D447  2279  49bbd1df1a9f6b000000 REX.W movq r11,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344D451  2289  49b919951b9f6b000000 REX.W movq r9,0000006B9F1B9519    ;; object: 0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>
0000013FD344D45B  2299  488b45e8       REX.W movq rax,[rbp-0x18]
0000013FD344D45F  2303  488b75e0       REX.W movq rsi,[rbp-0x20]
0000013FD344D463  2307  e9cffaffff     jmp 983  (0000013FD344CF37)
                  -- B46 start (deferred) --
0000013FD344D468  2312  660f28c8       movapd xmm1,xmm0
0000013FD344D46C  2316  488bd8         REX.W movq rbx,rax
0000013FD344D46F  2319  488945e8       REX.W movq [rbp-0x18],rax
0000013FD344D473  2323  f20f108560ffffff movsd xmm0,[rbp-0xa0]
0000013FD344D47B  2331  488bc6         REX.W movq rax,rsi
0000013FD344D47E  2334  488975e0       REX.W movq [rbp-0x20],rsi
0000013FD344D482  2338  ba20000000     movl rdx,0000000000000020
0000013FD344D487  2343  e8141ef4ff     call AllocateInNewSpace  (0000013FD338F2A0)    ;; code: BUILTIN
0000013FD344D48C  2348  488d50ff       REX.W leaq rdx,[rax-0x1]
0000013FD344D490  2352  488b5df8       REX.W movq rbx,[rbp-0x8]
0000013FD344D494  2356  4d8b4560       REX.W movq r8,[r13+0x60]
0000013FD344D498  2360  f20f1045a8     movsd xmm0,[rbp-0x58]
0000013FD344D49D  2365  488b4d90       REX.W movq rcx,[rbp-0x70]
0000013FD344D4A1  2369  48bfd1df1a9f6b000000 REX.W movq rdi,0000006B9F1ADFD1    ;; object: 0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>
0000013FD344D4AB  2379  488b45e8       REX.W movq rax,[rbp-0x18]
0000013FD344D4AF  2383  488b75e0       REX.W movq rsi,[rbp-0x20]
0000013FD344D4B3  2387  e9a4fbffff     jmp 1276  (0000013FD344D05C)
                  -- B49 start (deferred) --
0000013FD344D4B8  2392  488b45c0       REX.W movq rax,[rbp-0x40]
0000013FD344D4BC  2396  f20f108570ffffff movsd xmm0,[rbp-0x90]
0000013FD344D4C4  2404  ba70000000     movl rdx,0000000000000070
0000013FD344D4C9  2409  e8d21df4ff     call AllocateInNewSpace  (0000013FD338F2A0)    ;; code: BUILTIN
0000013FD344D4CE  2414  488d40ff       REX.W leaq rax,[rax-0x1]
0000013FD344D4D2  2418  e91efcffff     jmp 1429  (0000013FD344D0F5)
                  -- B52 start (deferred) --
0000013FD344D4D7  2423  488b4de8       REX.W movq rcx,[rbp-0x18]
0000013FD344D4DB  2427  488b5de0       REX.W movq rbx,[rbp-0x20]
0000013FD344D4DF  2431  48894580       REX.W movq [rbp-0x80],rax
0000013FD344D4E3  2435  ba10000000     movl rdx,0000000000000010
0000013FD344D4E8  2440  e8b31df4ff     call AllocateInNewSpace  (0000013FD338F2A0)    ;; code: BUILTIN
0000013FD344D4ED  2445  488d58ff       REX.W leaq rbx,[rax-0x1]
0000013FD344D4F1  2449  488b4580       REX.W movq rax,[rbp-0x80]
0000013FD344D4F5  2453  e996fcffff     jmp 1584  (0000013FD344D190)
                  -- B61 start (deferred) --
0000013FD344D4FA  2458  f20f104dc8     movsd xmm1,[rbp-0x38]
0000013FD344D4FF  2463  488945d8       REX.W movq [rbp-0x28],rax
0000013FD344D503  2467  f20f1145c0     movsd [rbp-0x40],xmm0
0000013FD344D508  2472  ba10000000     movl rdx,0000000000000010
0000013FD344D50D  2477  e88e1df4ff     call AllocateInNewSpace  (0000013FD338F2A0)    ;; code: BUILTIN
0000013FD344D512  2482  488d58ff       REX.W leaq rbx,[rax-0x1]
0000013FD344D516  2486  488b45d8       REX.W movq rax,[rbp-0x28]
0000013FD344D51A  2490  498b4d60       REX.W movq rcx,[r13+0x60]
0000013FD344D51E  2494  f20f1045c0     movsd xmm0,[rbp-0x40]
0000013FD344D523  2499  e978fdffff     jmp 1856  (0000013FD344D2A0)
0000013FD344D528  2504  e8376bdbff     call 0000013FD3204064    ;; debug: deopt position '3538'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 10
                                                             ;; deoptimization bailout 10
0000013FD344D52D  2509  e83c6bdbff     call 0000013FD320406E    ;; debug: deopt position '3538'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 11
                                                             ;; deoptimization bailout 11
0000013FD344D532  2514  e8556bdbff     call 0000013FD320408C    ;; debug: deopt position '3615'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 14
                                                             ;; deoptimization bailout 14
0000013FD344D537  2519  e85a6bdbff     call 0000013FD3204096    ;; debug: deopt position '3615'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 15
                                                             ;; deoptimization bailout 15
0000013FD344D53C  2524  e85f6bdbff     call 0000013FD32040A0    ;; debug: deopt position '3615'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 16
                                                             ;; deoptimization bailout 16
0000013FD344D541  2529  e8646bdbff     call 0000013FD32040AA    ;; debug: deopt position '3615'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 17
                                                             ;; deoptimization bailout 17
0000013FD344D546  2534  e8696bdbff     call 0000013FD32040B4    ;; debug: deopt position '3615'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 18
                                                             ;; deoptimization bailout 18
0000013FD344D54B  2539  e86e6bdbff     call 0000013FD32040BE    ;; debug: deopt position '3615'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 19
                                                             ;; deoptimization bailout 19
0000013FD344D550  2544  e8876bdbff     call 0000013FD32040DC    ;; debug: deopt position '3752'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 22
                                                             ;; deoptimization bailout 22
0000013FD344D555  2549  e88c6bdbff     call 0000013FD32040E6    ;; debug: deopt position '3752'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 23
                                                             ;; deoptimization bailout 23
0000013FD344D55A  2554  e8916bdbff     call 0000013FD32040F0    ;; debug: deopt position '3752'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 24
                                                             ;; deoptimization bailout 24
0000013FD344D55F  2559  e8aa6bdbff     call 0000013FD320410E    ;; debug: deopt position '3921'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 27
                                                             ;; deoptimization bailout 27
0000013FD344D564  2564  e8af6bdbff     call 0000013FD3204118    ;; debug: deopt position '3921'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 28
                                                             ;; deoptimization bailout 28
0000013FD344D569  2569  e8b46bdbff     call 0000013FD3204122    ;; debug: deopt position '3921'
                                                             ;; debug: deopt reason 'no reason'
                                                             ;; debug: deopt index 29
                                                             ;; deoptimization bailout 29
0000013FD344D56E  2574  e8ff6bdbff     call 0000013FD3204172    ;; debug: deopt position '4174'
                                                             ;; debug: deopt reason 'not a heap number/undefined/true/false'
                                                             ;; debug: deopt index 37
                                                             ;; deoptimization bailout 37
0000013FD344D573  2579  90             nop
0000013FD344D574  2580  90             nop
0000013FD344D575  2581  90             nop
0000013FD344D576  2582  90             nop
0000013FD344D577  2583  90             nop
0000013FD344D578  2584  90             nop
0000013FD344D579  2585  90             nop
0000013FD344D57A  2586  90             nop
0000013FD344D57B  2587  90             nop
0000013FD344D57C  2588  90             nop
0000013FD344D57D  2589  90             nop
0000013FD344D57E  2590  90             nop
0000013FD344D57F  2591  90             nop
                  ;;; Safepoint table.

Source positions:
 pc offset  position
        34      3486
        53      3482
        72      3486
       115      3512
       158      3538
       266      3615
       813      3752
      1106      3921
      1398      4078
      1555      4174
      2030      4156
      2058      3424

Inlined functions (count = 1)
 0000004977A57069 <SharedFunctionInfo ds>

Deoptimization Input Data (deopt points = 42)
 index  ast id    argc     pc
     0      59       0     39
     1      59       0     -1
     2      52       0     58
     3      52       0     -1
     4      48       0     77
     5      48       0     -1
     6      80       0    120
     7      80       0     -1
     8      99       0    163
     9      99       0     -1
    10      97       0     -1
    11      97       0     -1
    12     152       0    269
    13     152       0     -1
    14     150       0     -1
    15     150       0     -1
    16     150       0     -1
    17     150       0     -1
    18     150       0     -1
    19     150       0     -1
    20     262       0    816
    21     262       0     -1
    22     260       0     -1
    23     260       0     -1
    24     260       0     -1
    25     414       0   1109
    26     414       0     -1
    27     412       0     -1
    28     412       0     -1
    29     412       0     -1
    30     552       0   1401
    31     552       0     -1
    32     626       0   1560
    33     626       0     -1
    34     627       0   1742
    35     628       0   1760
    36     628       0     -1
    37     692       0     -1
    38     629       0   1962
    39     604       0   2035
    40     604       0     -1
    41       3       0   2063

Safepoints (size = 281)
0000013FD344CB87    39  0000000000000000000000 (sp -> fp)       1
0000013FD344CB9A    58  0000000000000000000000 (sp -> fp)       3
0000013FD344CBAD    77  0000000000000000000000 (sp -> fp)       5
0000013FD344CBD8   120  0000000000000001000000 (sp -> fp)       7
0000013FD344CC03   163  0000100000000001000000 (sp -> fp)       9
0000013FD344CC6D   269  0000110000000001000000 (sp -> fp)      13
0000013FD344CE90   816  0000110010000001000000 (sp -> fp)      21
0000013FD344CFB5  1109  0000110110000001000000 (sp -> fp)      26
0000013FD344D0D9  1401  0000111110000001000000 (sp -> fp)      31
0000013FD344D178  1560  0000111110001001110000 (sp -> fp)      33
0000013FD344D22E  1742  0000011110001001110000 (sp -> fp)      34
0000013FD344D240  1760  0000011110001000110000 (sp -> fp)      36
0000013FD344D30A  1962  0000000000000000110000 (sp -> fp)      38
0000013FD344D353  2035  0000000000000000000000 (sp -> fp)      40
0000013FD344D36F  2063  0000000000000000000000 (sp -> fp)      41
0000013FD344D3B5  2133  0000110010000001110000 (sp -> fp)  <none>
0000013FD344D432  2258  0000110110000001110000 (sp -> fp)  <none>
0000013FD344D48C  2348  0000111110000001110000 (sp -> fp)  <none>
0000013FD344D4CE  2414  0000111110001001000000 (sp -> fp)  <none>
0000013FD344D4ED  2445  0000111110001001110000 (sp -> fp)  <none>
0000013FD344D512  2482  0000000000000001110000 (sp -> fp)  <none>

RelocInfo (size = 1068)
0000013FD344CB60  comment  (-- B0 start (construct frame) --)
0000013FD344CB7A  comment  (-- B2 start --)
0000013FD344CB7A  comment  (-- B3 start --)
0000013FD344CB82  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:133:21 --)
0000013FD344CB83  code target (BUILTIN)  (0000013FD3393D20)
0000013FD344CB89  embedded object  (000001334DBB5D49 <String[1]: v>)
0000013FD344CB95  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:133:17 --)
0000013FD344CB96  code target (STUB)  (0000013FD33A68E0)
0000013FD344CBA8  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:133:21 --)
0000013FD344CBA9  code target (STUB)  (0000013FD33A68E0)
0000013FD344CBD3  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:134:17 --)
0000013FD344CBD4  code target (KEYED_LOAD_IC)  (0000013FD344C460)
0000013FD344CBFE  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:135:17 --)
0000013FD344CBFF  code target (KEYED_LOAD_IC)  (0000013FD344C460)
0000013FD344CC0D  embedded object  (0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>)
0000013FD344CC21  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344CC6A  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:138:14 --)
0000013FD344CC86  comment  (-- B4 start --)
0000013FD344CC97  comment  (-- B5 start --)
0000013FD344CCA7  comment  (-- B6 start --)
0000013FD344CCA7  comment  (-- B7 start --)
0000013FD344CCB1  comment  (-- B8 start --)
0000013FD344CCC4  comment  (-- B9 start --)
0000013FD344CCD3  comment  (-- B10 start --)
0000013FD344CCE4  comment  (-- B11 start --)
0000013FD344CCF4  comment  (-- B12 start --)
0000013FD344CCF4  comment  (-- B13 start --)
0000013FD344CCFF  comment  (-- B14 start --)
0000013FD344CD13  comment  (-- B15 start --)
0000013FD344CD22  comment  (-- B16 start --)
0000013FD344CD33  comment  (-- B17 start --)
0000013FD344CD43  comment  (-- B18 start --)
0000013FD344CD43  comment  (-- B19 start --)
0000013FD344CD4E  comment  (-- B20 start --)
0000013FD344CD62  comment  (-- B21 start --)
0000013FD344CD78  comment  (-- B22 start --)
0000013FD344CD86  comment  (-- B23 start --)
0000013FD344CD96  comment  (-- B24 start --)
0000013FD344CD96  comment  (-- B25 start --)
0000013FD344CDA2  comment  (-- B26 start --)
0000013FD344CDB1  comment  (-- B27 start --)
0000013FD344CDB3  embedded object  (0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>)
0000013FD344CDC6  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344CE01  comment  (-- B29 start --)
0000013FD344CE01  comment  (-- B30 start --)
0000013FD344CE8D  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:141:14 --)
0000013FD344CEA9  comment  (-- B31 start --)
0000013FD344CEBA  comment  (-- B32 start --)
0000013FD344CECA  comment  (-- B33 start --)
0000013FD344CECA  comment  (-- B34 start --)
0000013FD344CED4  comment  (-- B35 start --)
0000013FD344CEE7  comment  (-- B36 start --)
0000013FD344CEE9  embedded object  (0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>)
0000013FD344CEFC  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344CF37  comment  (-- B38 start --)
0000013FD344CF37  comment  (-- B39 start --)
0000013FD344CFB2  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:144:14 --)
0000013FD344CFCE  comment  (-- B40 start --)
0000013FD344CFDF  comment  (-- B41 start --)
0000013FD344CFEF  comment  (-- B42 start --)
0000013FD344CFEF  comment  (-- B43 start --)
0000013FD344CFF9  comment  (-- B44 start --)
0000013FD344D00C  comment  (-- B45 start --)
0000013FD344D00E  embedded object  (0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>)
0000013FD344D021  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344D05C  comment  (-- B47 start --)
0000013FD344D05C  comment  (-- B48 start --)
0000013FD344D0D6  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:147:14 --)
0000013FD344D0F5  comment  (-- B50 start --)
0000013FD344D0F5  comment  (-- B51 start --)
0000013FD344D109  embedded object  (00000037C5D04931 <Map(FAST_HOLEY_ELEMENTS)>)
0000013FD344D173  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:149:36 --)
0000013FD344D174  code target (BUILTIN)  (0000013FD33938E0)
0000013FD344D190  comment  (-- B53 start --)
0000013FD344D190  comment  (-- B54 start --)
0000013FD344D22A  code target (STUB)  (0000013FD3384060)
0000013FD344D23C  code target (BUILTIN)  (0000013FD33938E0)
0000013FD344D24D  comment  (-- B55 start --)
0000013FD344D25E  comment  (-- B56 start --)
0000013FD344D26E  comment  (-- B57 start --)
0000013FD344D26E  comment  (-- B58 start --)
0000013FD344D278  comment  (-- B59 start --)
0000013FD344D288  comment  (-- B60 start --)
0000013FD344D2A0  comment  (-- B62 start --)
0000013FD344D2A0  comment  (-- B63 start (deconstruct frame) --)
0000013FD344D306  code target (STUB)  (0000013FD3384060)
0000013FD344D30C  embedded object  (000001334DBA3931 <JS Function assign (SharedFunctionInfo 000001334DBA3881)>)
0000013FD344D31A  embedded object  (000001334DBA2839 <JS Function Object (SharedFunctionInfo 000001334DBA2789)>)
0000013FD344D34E  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:149:18 --)
0000013FD344D34F  code target (STUB)  (0000013FD33999E0)
0000013FD344D35A  comment  (-- B64 start (no frame) --)
0000013FD344D35A  comment  (-- B1 start (deferred) --)
0000013FD344D36A  comment  (-- D:\_timeline\13_CONFERENCE_js_perf_code_conference\20_nodejs_benchmarkjs\implMath.js:132:16 --)
0000013FD344D36B  code target (STUB)  (0000013FD3384060)
0000013FD344D374  comment  (-- B28 start (deferred) --)
0000013FD344D3B1  code target (BUILTIN)  (0000013FD338F2A0)
0000013FD344D3EA  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344D3F4  embedded object  (0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>)
0000013FD344D409  comment  (-- B37 start (deferred) --)
0000013FD344D42E  code target (BUILTIN)  (0000013FD338F2A0)
0000013FD344D449  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344D453  embedded object  (0000006B9F1B9519 <JS Function ds (SharedFunctionInfo 0000004977A57069)>)
0000013FD344D468  comment  (-- B46 start (deferred) --)
0000013FD344D488  code target (BUILTIN)  (0000013FD338F2A0)
0000013FD344D4A3  embedded object  (0000006B9F1ADFD1 <JS Function dvs (SharedFunctionInfo 0000004977A57131)>)
0000013FD344D4B8  comment  (-- B49 start (deferred) --)
0000013FD344D4CA  code target (BUILTIN)  (0000013FD338F2A0)
0000013FD344D4D7  comment  (-- B52 start (deferred) --)
0000013FD344D4E9  code target (BUILTIN)  (0000013FD338F2A0)
0000013FD344D4FA  comment  (-- B61 start (deferred) --)
0000013FD344D50E  code target (BUILTIN)  (0000013FD338F2A0)
0000013FD344D528  deopt position  (3538)
0000013FD344D528  deopt reason  (no reason)
0000013FD344D528  deopt index
0000013FD344D529  runtime entry  (deoptimization bailout 10)
0000013FD344D52D  deopt position  (3538)
0000013FD344D52D  deopt reason  (no reason)
0000013FD344D52D  deopt index
0000013FD344D52E  runtime entry  (deoptimization bailout 11)
0000013FD344D532  deopt position  (3615)
0000013FD344D532  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D532  deopt index
0000013FD344D533  runtime entry  (deoptimization bailout 14)
0000013FD344D537  deopt position  (3615)
0000013FD344D537  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D537  deopt index
0000013FD344D538  runtime entry  (deoptimization bailout 15)
0000013FD344D53C  deopt position  (3615)
0000013FD344D53C  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D53C  deopt index
0000013FD344D53D  runtime entry  (deoptimization bailout 16)
0000013FD344D541  deopt position  (3615)
0000013FD344D541  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D541  deopt index
0000013FD344D542  runtime entry  (deoptimization bailout 17)
0000013FD344D546  deopt position  (3615)
0000013FD344D546  deopt reason  (no reason)
0000013FD344D546  deopt index
0000013FD344D547  runtime entry  (deoptimization bailout 18)
0000013FD344D54B  deopt position  (3615)
0000013FD344D54B  deopt reason  (no reason)
0000013FD344D54B  deopt index
0000013FD344D54C  runtime entry  (deoptimization bailout 19)
0000013FD344D550  deopt position  (3752)
0000013FD344D550  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D550  deopt index
0000013FD344D551  runtime entry  (deoptimization bailout 22)
0000013FD344D555  deopt position  (3752)
0000013FD344D555  deopt reason  (no reason)
0000013FD344D555  deopt index
0000013FD344D556  runtime entry  (deoptimization bailout 23)
0000013FD344D55A  deopt position  (3752)
0000013FD344D55A  deopt reason  (no reason)
0000013FD344D55A  deopt index
0000013FD344D55B  runtime entry  (deoptimization bailout 24)
0000013FD344D55F  deopt position  (3921)
0000013FD344D55F  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D55F  deopt index
0000013FD344D560  runtime entry  (deoptimization bailout 27)
0000013FD344D564  deopt position  (3921)
0000013FD344D564  deopt reason  (no reason)
0000013FD344D564  deopt index
0000013FD344D565  runtime entry  (deoptimization bailout 28)
0000013FD344D569  deopt position  (3921)
0000013FD344D569  deopt reason  (no reason)
0000013FD344D569  deopt index
0000013FD344D56A  runtime entry  (deoptimization bailout 29)
0000013FD344D56E  deopt position  (4174)
0000013FD344D56E  deopt reason  (not a heap number/undefined/true/false)
0000013FD344D56E  deopt index
0000013FD344D56F  runtime entry  (deoptimization bailout 37)
0000013FD344D580  comment  (;;; Safepoint table.)

--- End code ---
