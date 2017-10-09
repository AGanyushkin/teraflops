/**
http://asquera.de/blog/2017-04-10/the-path-to-rust-on-the-web/
https://github.com/mrfr0g/rust-webassembly/blob/master/examples/array/index.html

https://github.com/kripken/emscripten/issues/4948
    ->
        The issue is that wasm has no support for JS arrays, including JS typed arrays. cwrap can copy the data into a temporary location in memory, and then C gets a pointer to it.
        As the code is written in your comment, func(arr, 6) will convert arr into an integer (since it receives a pointer as its first argument, which is an integer), 0.

    ->
        thanks! so most of the time we should use .js rather than .wasm?
    ->
        Yes. Using wasm by itself is still very experimental, see https://github.com/kripken/emscripten/wiki/WebAssembly-Standalone


more examples:
    https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab

    https://hackernoon.com/compiling-rust-to-webassembly-guide-411066a69fde

perf tests:

    https://habrahabr.ru/company/ruvds/blog/319834/

*/

use std::os::raw::c_char;
use std::ffi::CString;
use std::collections::HashMap;

#[no_mangle]
pub fn get_data() -> *mut c_char {
    let mut data = HashMap::new();
    data.insert("Alice", "send");
    data.insert("Bob", "recieve");
    data.insert("Carol", "intercept");

    let descriptions = data.iter()
        .map(|(p,a)| format!("{} likes to {} messages", p, a))
        .collect::<Vec<_>>();

    CString::new(descriptions.join(", "))
        .unwrap()
        .into_raw()
}

#[no_mangle]
pub fn get_f64() -> f64 {
    1.234f64
}

#[no_mangle]
pub fn mutate_array(data: *mut Vec<i32>, len: usize) {
    let mut user_data;

    unsafe {
        user_data = Vec::from_raw_parts(data as *mut u8, len, len);
    }

    for i in 0..len {
        user_data[i] += 1;
    }

    std::mem::forget(user_data);
}

#[no_mangle]
pub fn mutate_f64_array(data: *mut Vec<f64>, len: usize) {
    let mut user_data;

    unsafe {
        user_data = Vec::from_raw_parts(data as *mut f64, len, len);
    }

    for i in 0..len {
        println!("mutate: {}", user_data[i]);
        user_data[i] += 1.1f64;
    }

    std::mem::forget(user_data);
}

fn main() {
}
