--- FUNCTION SOURCE (C:\Users\aganyushkin\Desktop\gigaflops\tests\node_hydra_v8_optimizations_viewer\launcher.js:test2) id{0,0} ---
(s) {
    const buffer2 = new Float64Array(s)

    let i = s
    while (i--) {
        buffer2[i] = .7
    }
}
--- END ---
--- Raw source ---
(s) {
    const buffer2 = new Float64Array(s)

    let i = s
    while (i--) {
        buffer2[i] = .7
    }
}

--- Optimized code ---
optimization_id = 0
source_position = 277
kind = OPTIMIZED_FUNCTION
name = test2
stack_slots = 7
compiler = crankshaft
Instructions (size = 521)
0000023186F57300     0  55             push rbp
0000023186F57301     1  4889e5         REX.W movq rbp,rsp
0000023186F57304     4  56             push rsi
0000023186F57305     5  57             push rdi
0000023186F57306     6  4883ec18       REX.W subq rsp,0x18
                  ;;; <@0,#0> -------------------- B0 --------------------
                  ;;; <@6,#4> prologue
                  ;;; Prologue begin
                  ;;; Prologue end
                  ;;; <@10,#6> -------------------- B1 --------------------
                  ;;; <@12,#7> context
0000023186F5730A    10  488b45f8       REX.W movq rax,[rbp-0x8]
                  ;;; <@13,#7> gap
0000023186F5730E    14  488945d8       REX.W movq [rbp-0x28],rax
                  ;;; <@16,#12> -------------------- B2 --------------------
                  ;;; <@17,#12> gap
0000023186F57312    18  488bf0         REX.W movq rsi,rax
                  ;;; <@18,#14> stack-check
0000023186F57315    21  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000023186F5731C    28  7305           jnc 35  (0000023186F57323)
0000023186F5731E    30  e8ddcfefff     call StackCheck  (0000023186E54300)    ;; code: BUILTIN
                  ;;; <@20,#14> lazy-bailout
                  ;;; <@22,#18> push-argument
0000023186F57323    35  49ba31ab383136000000 REX.W movq r10,000000363138AB31    ;; object: 000000363138AB31 <JS Function Float64Array (SharedFunctionInfo 0000032B9209DB41)>
0000023186F5732D    45  4152           push r10
                  ;;; <@23,#18> gap
0000023186F5732F    47  488b5d10       REX.W movq rbx,[rbp+0x10]
                  ;;; <@24,#18> push-argument
0000023186F57333    51  53             push rbx
                  ;;; <@26,#15> constant-t
0000023186F57334    52  48ba31ab383136000000 REX.W movq rdx,000000363138AB31    ;; object: 000000363138AB31 <JS Function Float64Array (SharedFunctionInfo 0000032B9209DB41)>
                  ;;; <@28,#15> constant-t
0000023186F5733E    62  48ba31ab383136000000 REX.W movq rdx,000000363138AB31    ;; object: 000000363138AB31 <JS Function Float64Array (SharedFunctionInfo 0000032B9209DB41)>
                  ;;; <@30,#16> constant-i
0000023186F57348    72  b801000000     movl rax,0000000000000001
                  ;;; <@31,#16> gap
0000023186F5734D    77  488b75d8       REX.W movq rsi,[rbp-0x28]
0000023186F57351    81  488bfa         REX.W movq rdi,rdx
                  ;;; <@32,#19> call-with-descriptor
0000023186F57354    84  e82762eeff     call Construct  (0000023186E3D580)    ;; code: BUILTIN
                  ;;; <@34,#20> lazy-bailout
                  ;;; <@37,#24> goto
0000023186F57359    89  e91c000000     jmp 122  (0000023186F5737A)
                  ;;; <@38,#28> -------------------- B3 (OSR entry) --------------------
0000023186F5735E    94  4883ec08       REX.W subq rsp,0x8
                  ;;; <@52,#36> context
0000023186F57362    98  488b45f8       REX.W movq rax,[rbp-0x8]
                  ;;; <@54,#38> gap
0000023186F57366   102  488b4d18       REX.W movq rcx,[rbp+0x18]
0000023186F5736A   106  488bd0         REX.W movq rdx,rax
0000023186F5736D   109  488b5de8       REX.W movq rbx,[rbp-0x18]
0000023186F57371   113  488b45e0       REX.W movq rax,[rbp-0x20]
                  ;;; <@55,#38> goto
0000023186F57375   117  e90f000000     jmp 137  (0000023186F57389)
                  ;;; <@56,#25> -------------------- B4 --------------------
                  ;;; <@58,#27> gap
0000023186F5737A   122  488b4d18       REX.W movq rcx,[rbp+0x18]
0000023186F5737E   126  488b55d8       REX.W movq rdx,[rbp-0x28]
0000023186F57382   130  488bd8         REX.W movq rbx,rax
0000023186F57385   133  488b4510       REX.W movq rax,[rbp+0x10]
                  ;;; <@60,#49> -------------------- B5 --------------------
                  ;;; <@62,#70> constant-d
0000023186F57389   137  49ba666666666666e63f REX.W movq r10,3FE6666666666666
0000023186F57393   147  66490f6ec2     REX.W movq xmm0,r10
                  ;;; <@64,#71> check-non-smi
0000023186F57398   152  f6c301         testb rbx,0x1
0000023186F5739B   155  0f8415010000   jz 438  (0000023186F574B6)
                  ;;; <@66,#72> check-maps
0000023186F573A1   161  49ba5137786a36010000 REX.W movq r10,000001366A783751    ;; object: 000001366A783751 <Map(FLOAT64_ELEMENTS)>
0000023186F573AB   171  4c3953ff       REX.W cmpq [rbx-0x1],r10
0000023186F573AF   175  0f8506010000   jnz 443  (0000023186F574BB)
                  ;;; <@68,#74> check-maps
                  ;;; <@70,#76> check-maps
                  ;;; <@72,#78> check-maps
                  ;;; <@74,#79> load-named-field
0000023186F573B5   181  488b730f       REX.W movq rsi,[rbx+0xf]
                  ;;; <@76,#80> load-named-field
0000023186F573B9   185  8b7e0b         movl rdi,[rsi+0xb]
                  ;;; <@78,#81> check-array-buffer-not-neutered
0000023186F573BC   188  4c8b5317       REX.W movq r10,[rbx+0x17]
0000023186F573C0   192  41f6422708     testb [r10+0x27],0x8
0000023186F573C5   197  0f85f5000000   jnz 448  (0000023186F574C0)
                  ;;; <@80,#82> load-named-field
0000023186F573CB   203  4c8b4617       REX.W movq r8,[rsi+0x17]
                  ;;; <@82,#83> load-named-field
0000023186F573CF   207  488b760f       REX.W movq rsi,[rsi+0xf]
                  ;;; <@86,#52> -------------------- B6 (loop header) --------------------
                  ;;; <@87,#52> gap
0000023186F573D3   211  4c8bc8         REX.W movq r9,rax
                  ;;; <@88,#95> tagged-to-i
0000023186F573D6   214  41f6c101       testb r9,0x1
0000023186F573DA   218  0f8556000000   jnz 310  (0000023186F57436)
0000023186F573E0   224  49c1e920       REX.W shrq r9, 32
                  ;;; <@89,#95> gap
0000023186F573E4   228  4d8bd9         REX.W movq r11,r9
                  ;;; <@90,#56> add-i
0000023186F573E7   231  4183c3ff       addl r11,0xff
0000023186F573EB   235  0f80d4000000   jo 453  (0000023186F574C5)
                  ;;; <@93,#58> branch
0000023186F573F1   241  4585c9         testl r9,r9
0000023186F573F4   244  0f842b000000   jz 293  (0000023186F57425)
                  ;;; <@94,#59> -------------------- B7 (unreachable/replaced) --------------------
                  ;;; <@98,#65> -------------------- B8 --------------------
                  ;;; <@100,#67> stack-check
0000023186F573FA   250  493ba5180c0000 REX.W cmpq rsp,[r13+0xc18]
0000023186F57401   257  0f8267000000   jc 366  (0000023186F5746E)
                  ;;; <@101,#67> gap
0000023186F57407   263  498bc0         REX.W movq rax,r8
                  ;;; <@102,#84> add-i
0000023186F5740A   266  4803c6         REX.W addq rax,rsi
                  ;;; <@104,#85> bounds-check
0000023186F5740D   269  413bfb         cmpl rdi,r11
0000023186F57410   272  0f86b4000000   jna 458  (0000023186F574CA)
                  ;;; <@106,#86> store-keyed
0000023186F57416   278  f2420f1104d8   movsd [rax+r11*8],xmm0
                  ;;; <@108,#96> smi-tag
0000023186F5741C   284  418bc3         movl rax,r11
0000023186F5741F   287  48c1e020       REX.W shlq rax, 32
                  ;;; <@111,#89> goto
0000023186F57423   291  ebae           jmp 211  (0000023186F573D3)
                  ;;; <@112,#62> -------------------- B9 (unreachable/replaced) --------------------
                  ;;; <@116,#90> -------------------- B10 --------------------
                  ;;; <@118,#3> constant-t
0000023186F57425   293  48b8112308922b030000 REX.W movq rax,0000032B92082311    ;; object: 0000032B92082311 <undefined>
                  ;;; <@120,#92> return
0000023186F5742F   303  488be5         REX.W movq rsp,rbp
0000023186F57432   306  5d             pop rbp
0000023186F57433   307  c21000         ret 0x10
                  ;;; <@88,#95> -------------------- Deferred tagged-to-i --------------------
0000023186F57436   310  4d8b5560       REX.W movq r10,[r13+0x60]
0000023186F5743A   314  4d3951ff       REX.W cmpq [r9-0x1],r10
0000023186F5743E   318  0f858b000000   jnz 463  (0000023186F574CF)
0000023186F57444   324  f2450f107907   movsd xmm15,[r9+0x7]
0000023186F5744A   330  f2450f2ccf     cvttsd2sil r9,xmm15
0000023186F5744F   335  660f57c9       xorpd xmm1,xmm1
0000023186F57453   339  f2410f2ac9     cvtsi2sd xmm1,r9
0000023186F57458   344  66440f2ef9     ucomisd xmm15,xmm1
0000023186F5745D   349  0f8571000000   jnz 468  (0000023186F574D4)
0000023186F57463   355  0f8a70000000   jpe 473  (0000023186F574D9)
0000023186F57469   361  e976ffffff     jmp 228  (0000023186F573E4)
                  ;;; <@100,#67> -------------------- Deferred stack-check --------------------
0000023186F5746E   366  50             push rax
0000023186F5746F   367  51             push rcx
0000023186F57470   368  52             push rdx
0000023186F57471   369  53             push rbx
0000023186F57472   370  56             push rsi
0000023186F57473   371  57             push rdi
0000023186F57474   372  4150           push r8
0000023186F57476   374  4151           push r9
0000023186F57478   376  4153           push r11
0000023186F5747A   378  4154           push r12
0000023186F5747C   380  4156           push r14
0000023186F5747E   382  4157           push r15
0000023186F57480   384  488d6424e0     REX.W leaq rsp,[rsp-0x20]
0000023186F57485   389  488b75f8       REX.W movq rsi,[rbp-0x8]
0000023186F57489   393  33c0           xorl rax,rax
0000023186F5748B   395  48bbe037d43f01000000 REX.W movq rbx,000000013FD437E0
0000023186F57495   405  e80678ebff     call 0000023186E0ECA0    ;; code: STUB, CEntryStub, minor: 9
0000023186F5749A   410  488d642420     REX.W leaq rsp,[rsp+0x20]
0000023186F5749F   415  415f           pop r15
0000023186F574A1   417  415e           pop r14
0000023186F574A3   419  415c           pop r12
0000023186F574A5   421  415b           pop r11
0000023186F574A7   423  4159           pop r9
0000023186F574A9   425  4158           pop r8
0000023186F574AB   427  5f             pop rdi
0000023186F574AC   428  5e             pop rsi
0000023186F574AD   429  5b             pop rbx
0000023186F574AE   430  5a             pop rdx
0000023186F574AF   431  59             pop rcx
0000023186F574B0   432  58             pop rax
0000023186F574B1   433  e951ffffff     jmp 263  (0000023186F57407)
                  ;;; -------------------- Jump table --------------------
0000023186F574B6   438  e863cbd2ff     call 0000023186C8401E    ;; debug: deopt position '52736'
                                                             ;; debug: deopt reason 'Smi'
                                                             ;; debug: deopt index 3
                                                             ;; deoptimization bailout 3
0000023186F574BB   443  e868cbd2ff     call 0000023186C84028    ;; debug: deopt position '52736'
                                                             ;; debug: deopt reason 'wrong map'
                                                             ;; debug: deopt index 4
                                                             ;; deoptimization bailout 4
0000023186F574C0   448  e86dcbd2ff     call 0000023186C84032    ;; debug: deopt position '52736'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 5
                                                             ;; deoptimization bailout 5
0000023186F574C5   453  e872cbd2ff     call 0000023186C8403C    ;; debug: deopt position '39424'
                                                             ;; debug: deopt reason 'overflow'
                                                             ;; debug: deopt index 6
                                                             ;; deoptimization bailout 6
0000023186F574CA   458  e881cbd2ff     call 0000023186C84050    ;; debug: deopt position '52736'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 8
                                                             ;; deoptimization bailout 8
0000023186F574CF   463  e886cbd2ff     call 0000023186C8405A    ;; debug: deopt position '39424'
                                                             ;; debug: deopt reason 'not a heap number'
                                                             ;; debug: deopt index 9
                                                             ;; deoptimization bailout 9
0000023186F574D4   468  e881cbd2ff     call 0000023186C8405A    ;; debug: deopt position '39424'
                                                             ;; debug: deopt reason 'lost precision'
                                                             ;; debug: deopt index 9
                                                             ;; deoptimization bailout 9
0000023186F574D9   473  e87ccbd2ff     call 0000023186C8405A    ;; debug: deopt position '39424'
                                                             ;; debug: deopt reason 'NaN'
                                                             ;; debug: deopt index 9
                                                             ;; deoptimization bailout 9
0000023186F574DE   478  6690           nop
                  ;;; Safepoint table.

Source positions:
 pc offset  position
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        10       277
        14       277
        18       277
        18       277
        18       277
        18       277
        21       277
        35       277
        35       277
        35       277
        35       304
        47       304
        51       304
        52       304
        52       308
        62       308
        62       308
        72       308
        72       304
        77       304
        84       304
        89       304
        89       304
        89       304
        89       346
        89       346
        94       346
        94       346
        94       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
        98       346
       102       346
       102       346
       117       346
       122       346
       122       346
       122       346
       137       346
       137       346
       137       346
       137       382
       152       382
       152       380
       161       380
       161       380
       181       380
       181       380
       181       380
       181       380
       181       380
       181       380
       181       380
       181       380
       185       380
       185       380
       188       380
       188       380
       203       380
       203       380
       207       380
       207       380
       211       380
       211       346
       211       346
       211       353
       211       353
       214       354
       228       354
       231       354
       241       354
       241       354
       241       354
       250       346
       250       346
       250       346
       263       346
       266       380
       269       380
       269       380
       278       380
       278       380
       284       380
       284       353
       291       353
       291       346
       291       346
       293       277
       293       277
       293       277
       303       277
       303       277
       310       277
       310       354
       366       346

Inlined functions (count = 0)

Deoptimization Input Data (deopt points = 10)
 index  ast id    argc     pc
     0       4       0     35
     1      21       0     89
     2      45       0     -1
     3      43       0     -1
     4      43       0     -1
     5      43       0     -1
     6      43       0     -1
     7      46       0    263
     8      46       0     -1
     9      43       0     -1

Safepoints (size = 41)
0000023186F57323    35  1000000 (sp -> fp)       0
0000023186F57359    89  1000000 (sp -> fp)       1
0000023186F5749A   410  0000000 | rcx | rdx | rbx | rsi (sp -> fp)       7

RelocInfo (size = 756)
0000023186F5730A  comment  (;;; <@0,#0> -------------------- B0 --------------------)
0000023186F5730A  comment  (;;; <@6,#4> prologue)
0000023186F5730A  comment  (;;; Prologue begin)
0000023186F5730A  comment  (;;; Prologue end)
0000023186F5730A  comment  (;;; <@10,#6> -------------------- B1 --------------------)
0000023186F5730A  comment  (;;; <@12,#7> context)
0000023186F5730E  comment  (;;; <@13,#7> gap)
0000023186F57312  comment  (;;; <@16,#12> -------------------- B2 --------------------)
0000023186F57312  comment  (;;; <@17,#12> gap)
0000023186F57315  comment  (;;; <@18,#14> stack-check)
0000023186F5731F  code target (BUILTIN)  (0000023186E54300)
0000023186F57323  comment  (;;; <@20,#14> lazy-bailout)
0000023186F57323  comment  (;;; <@22,#18> push-argument)
0000023186F57325  embedded object  (000000363138AB31 <JS Function Float64Array (SharedFunctionInfo 0000032B9209DB41)>)
0000023186F5732F  comment  (;;; <@23,#18> gap)
0000023186F57333  comment  (;;; <@24,#18> push-argument)
0000023186F57334  comment  (;;; <@26,#15> constant-t)
0000023186F57336  embedded object  (000000363138AB31 <JS Function Float64Array (SharedFunctionInfo 0000032B9209DB41)>)
0000023186F5733E  comment  (;;; <@28,#15> constant-t)
0000023186F57340  embedded object  (000000363138AB31 <JS Function Float64Array (SharedFunctionInfo 0000032B9209DB41)>)
0000023186F57348  comment  (;;; <@30,#16> constant-i)
0000023186F5734D  comment  (;;; <@31,#16> gap)
0000023186F57354  comment  (;;; <@32,#19> call-with-descriptor)
0000023186F57355  code target (BUILTIN)  (0000023186E3D580)
0000023186F57359  comment  (;;; <@34,#20> lazy-bailout)
0000023186F57359  comment  (;;; <@37,#24> goto)
0000023186F5735E  comment  (;;; <@38,#28> -------------------- B3 (OSR entry) --------------------)
0000023186F57362  comment  (;;; <@52,#36> context)
0000023186F57366  comment  (;;; <@54,#38> gap)
0000023186F57375  comment  (;;; <@55,#38> goto)
0000023186F5737A  comment  (;;; <@56,#25> -------------------- B4 --------------------)
0000023186F5737A  comment  (;;; <@58,#27> gap)
0000023186F57389  comment  (;;; <@60,#49> -------------------- B5 --------------------)
0000023186F57389  comment  (;;; <@62,#70> constant-d)
0000023186F57398  comment  (;;; <@64,#71> check-non-smi)
0000023186F573A1  comment  (;;; <@66,#72> check-maps)
0000023186F573A3  embedded object  (000001366A783751 <Map(FLOAT64_ELEMENTS)>)
0000023186F573B5  comment  (;;; <@68,#74> check-maps)
0000023186F573B5  comment  (;;; <@70,#76> check-maps)
0000023186F573B5  comment  (;;; <@72,#78> check-maps)
0000023186F573B5  comment  (;;; <@74,#79> load-named-field)
0000023186F573B9  comment  (;;; <@76,#80> load-named-field)
0000023186F573BC  comment  (;;; <@78,#81> check-array-buffer-not-neutered)
0000023186F573CB  comment  (;;; <@80,#82> load-named-field)
0000023186F573CF  comment  (;;; <@82,#83> load-named-field)
0000023186F573D3  comment  (;;; <@86,#52> -------------------- B6 (loop header) --------------------)
0000023186F573D3  comment  (;;; <@87,#52> gap)
0000023186F573D6  comment  (;;; <@88,#95> tagged-to-i)
0000023186F573E4  comment  (;;; <@89,#95> gap)
0000023186F573E7  comment  (;;; <@90,#56> add-i)
0000023186F573F1  comment  (;;; <@93,#58> branch)
0000023186F573FA  comment  (;;; <@94,#59> -------------------- B7 (unreachable/replaced) --------------------)
0000023186F573FA  comment  (;;; <@98,#65> -------------------- B8 --------------------)
0000023186F573FA  comment  (;;; <@100,#67> stack-check)
0000023186F57407  comment  (;;; <@101,#67> gap)
0000023186F5740A  comment  (;;; <@102,#84> add-i)
0000023186F5740D  comment  (;;; <@104,#85> bounds-check)
0000023186F57416  comment  (;;; <@106,#86> store-keyed)
0000023186F5741C  comment  (;;; <@108,#96> smi-tag)
0000023186F57423  comment  (;;; <@111,#89> goto)
0000023186F57425  comment  (;;; <@112,#62> -------------------- B9 (unreachable/replaced) --------------------)
0000023186F57425  comment  (;;; <@116,#90> -------------------- B10 --------------------)
0000023186F57425  comment  (;;; <@118,#3> constant-t)
0000023186F57427  embedded object  (0000032B92082311 <undefined>)
0000023186F5742F  comment  (;;; <@120,#92> return)
0000023186F57436  comment  (;;; <@88,#95> -------------------- Deferred tagged-to-i --------------------)
0000023186F5746E  comment  (;;; <@100,#67> -------------------- Deferred stack-check --------------------)
0000023186F57496  code target (STUB)  (0000023186E0ECA0)
0000023186F574B6  comment  (;;; -------------------- Jump table --------------------)
0000023186F574B6  deopt position  (52736)
0000023186F574B6  deopt reason  (Smi)
0000023186F574B6  deopt index
0000023186F574B7  runtime entry  (deoptimization bailout 3)
0000023186F574BB  deopt position  (52736)
0000023186F574BB  deopt reason  (wrong map)
0000023186F574BB  deopt index
0000023186F574BC  runtime entry  (deoptimization bailout 4)
0000023186F574C0  deopt position  (52736)
0000023186F574C0  deopt reason  (out of bounds)
0000023186F574C0  deopt index
0000023186F574C1  runtime entry  (deoptimization bailout 5)
0000023186F574C5  deopt position  (39424)
0000023186F574C5  deopt reason  (overflow)
0000023186F574C5  deopt index
0000023186F574C6  runtime entry  (deoptimization bailout 6)
0000023186F574CA  deopt position  (52736)
0000023186F574CA  deopt reason  (out of bounds)
0000023186F574CA  deopt index
0000023186F574CB  runtime entry  (deoptimization bailout 8)
0000023186F574CF  deopt position  (39424)
0000023186F574CF  deopt reason  (not a heap number)
0000023186F574CF  deopt index
0000023186F574D0  runtime entry  (deoptimization bailout 9)
0000023186F574D4  deopt position  (39424)
0000023186F574D4  deopt reason  (lost precision)
0000023186F574D4  deopt index
0000023186F574D5  runtime entry  (deoptimization bailout 9)
0000023186F574D9  deopt position  (39424)
0000023186F574D9  deopt reason  (NaN)
0000023186F574D9  deopt index
0000023186F574DA  runtime entry  (deoptimization bailout 9)
0000023186F574E0  comment  (;;; Safepoint table.)

--- End code ---
