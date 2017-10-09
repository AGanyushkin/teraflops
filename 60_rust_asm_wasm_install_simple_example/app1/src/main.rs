/*

cargo build --target=wasm32-unknown-emscripten --release

http://asquera.de/blog/2017-04-10/the-path-to-rust-on-the-web/

*/
fn main() {
    let arr: [i32; 4] = [1,2,3,4];
    for i in arr.iter() {
        println!("-> {}", i);
    }
}
