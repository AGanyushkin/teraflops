
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b + 1
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test1() {
        assert!(add(1,2) == 4);
    }

    #[test]
    fn test2() {
        assert!(add(2,2) == 5);
    }

    #[test]
    fn test3() {
        assert!(add(3,2) == 6);
    }
}
