/*
// const G: f64 = 6.67408e-11;  // [м^3 * кг^-1 * с^-2]
const RK_DEF_H: f64 = 1e3; // [c]

// const MAX_ATTEMPTS: i32 = 100;
// const M_MAX: i32 = 3;
// const M_MIN: i32 = 1;
// const POOL_SIZE: i32 = 1000;

const POINT_X: i32 = 0;
const POINT_Y: i32 = 1;
const POINT_Z: i32 = 2;
// const POINT_VX: i32 = 3;
// const POINT_VY: i32 = 4;
// const POINT_VZ: i32 = 5;
// const POINT_M: i32 = 6;
// const POINT_SIZE: i32 = 7;

#[no_mangle]
pub extern "C" fn compute_step(points: *const f64, from: i64, count: i64) {
    let h = RK_DEF_H;
    for i in from..(from + count) {
        rk4_step(points, i, h, POINT_X);
        rk4_step(points, i, h, POINT_Y);
        rk4_step(points, i, h, POINT_Z);

    }
}

fn rk4_step(points: &mut[f64], i: i64, h: f64, coord: i32) {

}
*/

#[no_mangle]
pub extern "C" fn compute_step(points: *const f64, size: i32, from: i64, count: i64) {
    println!("from: {}, count: {}", from, count);

    println!("x");

    let ps = unsafe { std::slice::from_raw_parts(points, size as usize) };

    println!("y");

    _do(ps);
}

pub fn _do(ps: &[f64]) {
    println!("ps len {}", ps.len());

    println!("ps 1 {}", ps[1]);

    for p in ps.iter() {
        println!("*p = {}", p);
    }

    println!("_do done");
}
