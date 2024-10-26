use dep::string_search::{SubString, SubString128, StringBody16384, SubString64};
use dep::string_search::StringBody;

pub trait BoundedVecExtentions {
    fn is_eq<let M: u32>(self, array: [u8;M]) -> bool;
}

impl BoundedVecExtentions for BoundedVec<u8,320> {
    fn is_eq<let M: u32>(self, array: [u8; M]) -> bool {
        let mut res: bool = true;
        if (self.len() != M) {
            res = false;
        }
        for i in 0..self.len() {
            if {
                self.get_unchecked(i) != array[i]
            } {
                res = false;
            }
        }
        res
    }
}

pub fn find_x_username(
    data: [u8; 16384],
    data_length: u32,
    padded_username: [u8; 64],
    username_length: u32
) -> (bool, u32) {
    let needle_text_init = "If you requested a password reset for ".as_bytes();

    let needle_start: SubString64 = SubString::new(needle_text_init, needle_text_init.len());
    let needle_end: SubString128 = SubString::new(padded_username, username_length);
    // use concat_into because SubString128 > SubString32
    let needle = needle_start.concat_into(needle_end);

    let haystack: StringBody16384 = StringBody::new(data, data_length);
    let (result, match_position): (bool, u32) = haystack.substring_match(needle);

    (result, match_position)
}

#[test]
fn test_compare_bounded_vec_empty() {
    let data: BoundedVec<u8, 320> = BoundedVec::new();
    let array: [u8; 0] = [0; 0];

    assert(data.is_eq(array));
}

#[test]
fn test_compare_bounded_vec_full() {
    let data: BoundedVec<u8, 320> = BoundedVec::from([0; 320]);
    let array: [u8; 320] = [0; 320];

    assert(data.is_eq(array));
}

#[test]
fn test_compare_bounded_vec_non_empty() {
    let data: BoundedVec<u8, 320> = BoundedVec::from(
        [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 155
    ]
    );
    let array = [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 155
    ];

    assert(data.is_eq(array));
}

#[test(should_fail)]
fn test_compare_shorter_length() {
    let data: BoundedVec<u8, 320> = BoundedVec::from(
        [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 155
    ]
    );
    let array = [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99
    ];

    assert(data.is_eq(array));
}

#[test(should_fail)]
fn test_compare_longer_length() {
    let data: BoundedVec<u8, 320> = BoundedVec::from(
        [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 155
    ]
    );
    let array = [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 155, 166, 177, 188, 199, 210, 221, 232, 243, 254
    ];

    assert(data.is_eq(array));
}

#[test(should_fail)]
fn test_compare_bounded_vec_non_empty_fail() {
    let data: BoundedVec<u8, 320> = BoundedVec::from(
        [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 155
    ]
    );
    let array = [
        23, 34, 56, 78, 90, 101, 112, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133, 144, 100
    ];

    assert(data.is_eq(array));
}
