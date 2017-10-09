// https://habrahabr.ru/post/268609/
// https://github.com/nbaksalyar/rust-chat
extern crate mio_websocket;
extern crate env_logger;
extern crate byteorder;
use std::io::Cursor;
use std::net::SocketAddr;
use mio_websocket::interface::*;
use byteorder::{ReadBytesExt, WriteBytesExt, BigEndian, LittleEndian};

fn main() {
    env_logger::init().unwrap();
    let mut ws = WebSocket::new("0.0.0.0:10000".parse::<SocketAddr>().unwrap());
    loop {
        match ws.next() {
            (tok, WebSocketEvent::Connect) => {
                println!("connected peer: {:?}", tok);
            },
            (tok, WebSocketEvent::TextMessage(msg)) => {
                println!("-> new msg: \"{}\"", msg);

                for peer in ws.get_connected().unwrap() {
                    println!("(peer / tok) = ({:?} / {:?})", peer, tok);
                    if peer != tok {
                        println!("-> relaying to peer {:?}", peer);
                        let response = WebSocketEvent::TextMessage(msg.clone());
                        ws.send((peer, response));
                    }
                }
            },
            (tok, WebSocketEvent::BinaryMessage(msg)) => {
                println!("msg from {:?}", tok);

                let size: usize = msg.len() / 8;
                println!("size = {}", size);

                let mut data: Vec<f64> = Vec::new();
                let mut rdr = Cursor::new(msg);
                for i in 0..(size) {
                    data.push(
                        rdr.read_f64::<LittleEndian>().unwrap()
                    )
                }

                for i in 0..size {
                    println!("i({}) = {}", i, data[i]);
                }

                // ---

                let respRaw: Vec<f64> = vec![7.51f64, 7.62f64, 7.73f64];
                let mut resp: Vec<u8> = vec![];

                for i in 0..(respRaw.len()) {
                    resp.write_f64::<LittleEndian>(respRaw[i]).unwrap()
                }

                let response = WebSocketEvent::BinaryMessage(resp);
                ws.send((tok, response));
            },
            _ => {}
        }
    }
}
