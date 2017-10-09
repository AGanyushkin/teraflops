extern crate rand;

use rand::Rng;
use std::thread;

struct ModelViewCfg {
    width: f64,
    height: f64,
    x: f64,
    y: f64
}

struct Model {
    view: ModelViewCfg,
    points: Vec<f64>
}

fn main() {
    println!("start");

    let model: Model = initModel();
    let mut points = model.points;

    printPoints(&points);

    loop {
        computeStep(&mut points);
        printPoints(&points);

        thread::sleep_ms(200);
    }

    println!("done");
}

fn printPoints(points: &Vec<f64>) {
    print!("{}[2J", 27 as char);
    for i in 0..POOL_SIZE {
        println!(
            "(x,y,z) = ({:30},{:30},{:30}); (vx,vy,vz) = ({:30},{:30},{:30}); m = {:30}",
            points[i * POINT_SIZE + POINT_X],
            points[i * POINT_SIZE + POINT_Y],
            points[i * POINT_SIZE + POINT_Z],
            points[i * POINT_SIZE + POINT_VX],
            points[i * POINT_SIZE + POINT_VY],
            points[i * POINT_SIZE + POINT_VZ],
            points[i * POINT_SIZE + POINT_M]
        )
    }
}

const G: f64 = 6.67408e-11;  // [м^3 * кг^-1 * с^-2]
const RK_DEF_H: f64 = 1e3; // [c]
const MAX_ATTEMPTS: i32 = 100;
const POOL_SIZE: usize = 50;
const POINT_X: usize = 0;
const POINT_Y: usize = 1;
const POINT_Z: usize = 2;
const POINT_VX: usize = 3;
const POINT_VY: usize = 4;
const POINT_VZ: usize = 5;
const POINT_M: usize = 6;
const POINT_SIZE: usize = 7;

fn initModel() -> Model {
    let EARTH_MOON = 384403e3;
    let X_MIN = -EARTH_MOON;
    let X_MAX = EARTH_MOON;
    let Y_MIN = -EARTH_MOON;
    let Y_MAX = EARTH_MOON;
    let Z_MIN = Y_MIN;
    let Z_MAX = Y_MAX;

    let M_MIN = 7.36e22;
    let M_MAX = 5.9742e24;

    let N: usize = 10;
    let mut points: Vec<f64> = vec![0.0f64; POOL_SIZE * POINT_SIZE];

    let mut rng = rand::thread_rng();

    let mut tries = 0;
    for i in 0..POOL_SIZE {
        if tries >= MAX_ATTEMPTS { println!("MAX_ATTEMPTS Error!"); } else { tries += 1 };

        let mut created = false;
        while !created {

            let x = (X_MIN + rng.gen::<f64>() * (X_MAX - X_MIN)).round();
            let y = (Y_MIN + rng.gen::<f64>() * (Y_MAX - Y_MIN)).round();
            let z = 0f64;
            let vx = 0f64;
            let vy = 0f64;
            let vz = 0f64;
            let m = M_MIN + rng.gen::<f64>() * (M_MAX - M_MIN);

            let mut exists = false;
            for j in 0..i {
                exists = (points[j * POINT_SIZE + POINT_X] == x) &&
                            (points[j * POINT_SIZE + POINT_Y] == y);
                if exists { break };
            }
            if !exists {
                points[i * POINT_SIZE + POINT_X] = x;
                points[i * POINT_SIZE + POINT_Y] = y;
                points[i * POINT_SIZE + POINT_Z] = z;
                points[i * POINT_SIZE + POINT_VX] = vx;
                points[i * POINT_SIZE + POINT_VY] = vy;
                points[i * POINT_SIZE + POINT_VZ] = vz;
                points[i * POINT_SIZE + POINT_M] = m;

                created = true;
                tries = 0
            }
        }
    }

    let view: ModelViewCfg = ModelViewCfg {
        width: ((X_MAX - X_MIN) * 2f64).round(),
        height: ((Y_MAX - Y_MIN) * 2f64).round(),
        x: 0f64,
        y: 0f64
    };

    let model = Model {
        points,
        view
    };

    return model;
}

fn computeStep(points: &mut Vec<f64>) {
    let h = RK_DEF_H;
    for i in 0..(points.len() / POINT_SIZE) {
        RK4Step(points, i, h, POINT_X);
        RK4Step(points, i, h, POINT_Y);
        RK4Step(points, i, h, POINT_Z);
    }
}

fn ds(s: f64, v: f64, pointIndex: usize, points: &[f64], coord: usize) -> f64 {
    v
}

fn dvs(s: f64, v: f64, pointIndex: usize, points: &[f64], coord: usize) -> f64 {
    let mut sum: f64 = 0f64;

    for i in 0..(points.len() / POINT_SIZE) {
        if i != pointIndex {
            let R: f64 = (
                (points[pointIndex * POINT_SIZE + POINT_X] - points[i * POINT_SIZE + POINT_X]).powi(2) +
                    (points[pointIndex * POINT_SIZE + POINT_Y] - points[i * POINT_SIZE + POINT_Y]).powi(2) +
                    (points[pointIndex * POINT_SIZE + POINT_Z] - points[i * POINT_SIZE + POINT_Z]).powi(2)
            ).sqrt() as f64;
            let e: f64 = 1e8;
            sum += G * points[i * POINT_SIZE + POINT_M] * ((points[i * POINT_SIZE + coord] - s) / (R.powi(2) + e.powi(2)).powf((3/2) as f64))
        }
    }
    return sum
}

fn RK4Step(points: &mut [f64], pointIndex: usize, h: f64, coord: usize) {
    let s = points[pointIndex * POINT_SIZE + coord];
    let v = points[pointIndex * POINT_SIZE + (coord + 3)];

    let ks0: f64 = ds(s, v, pointIndex, points, coord);
    let kv0: f64 = dvs(s, v, pointIndex, points, coord);

    let ks1: f64 = ds(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord);
    let kv1: f64 = dvs(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord);

    let ks2: f64 = ds(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord);
    let kv2: f64 = dvs(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord);

    let ks3: f64 = ds(s + h * ks2, v + h * kv2, pointIndex, points, coord);
    let kv3: f64 = dvs(s + h * ks2, v + h * kv2, pointIndex, points, coord);

    points[pointIndex * POINT_SIZE + coord] = s + h / 6f64 * (ks0 + 2f64 * (ks1 + ks2) + ks3);
    points[pointIndex * POINT_SIZE + (coord + 3)] = v + h / 6f64 * (kv0 + 2f64 * (kv1 + kv2) + kv3);
}
