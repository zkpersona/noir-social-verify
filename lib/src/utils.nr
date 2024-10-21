use dep::string_search::{SubString, SubString128, StringBody16384, SubString64};
use dep::string_search::StringBody;

pub trait BoundedVecExtentions {
    fn is_eq<let M: u32>(self, array: [u8;M]) -> bool;
}

impl BoundedVecExtentions for BoundedVec<u8,320> {
    fn is_eq<let M: u32>(self, array: [u8; M]) -> bool {
        if (self.len != M) {
            false
        }
        for i in 0..M {
            if {
                self.get_unchecked(i) != array[i]
            } {
                false
            }
        }
        true
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
