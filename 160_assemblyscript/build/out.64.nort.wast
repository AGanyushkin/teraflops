(module
 (type $iFi (func (param i32 f64) (result i32)))
 (memory $0 1)
 (export "add" (func $add))
 (export "memory" (memory $0))
 (func $add (type $iFi) (param $0 i32) (param $1 f64) (result i32)
  (return
   (i32.shr_s
    (i32.shl
     (i32.add
      (get_local $0)
      (i32.trunc_s/f64
       (get_local $1)
      )
     )
     (i32.const 16)
    )
    (i32.const 16)
   )
  )
 )
)
