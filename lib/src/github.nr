use dep::zkemail::{KEY_LIMBS_1024, dkim::RSAPubkey, Sequence, headers::email_address::get_email_address};

pub global MAX_EMAIL_HEADER_LENGTH: u32 = 576;
pub global FROM_EMAIL_LENGTH: u32 = 18;
pub global FROM_EMAIL: [u8; FROM_EMAIL_LENGTH] = "noreply@github.com".as_bytes();

pub fn verify_github(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_1024>,
    signature: [Field; KEY_LIMBS_1024],
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    to_header_sequence: Sequence,
    to_address_sequence: Sequence
) -> BoundedVec<u8, 320> {
    assert(header.len() <= MAX_EMAIL_HEADER_LENGTH);

    pubkey.verify_dkim_signature(header, signature);

    let from = comptime {
        "from".as_bytes()
    };

    let to = comptime {
        "to".as_bytes()
    };

    let from_address: BoundedVec<u8, 320> = get_email_address(header, from_header_sequence, from_address_sequence, from);

    assert(from_address.is_eq(FROM_EMAIL));

    let to_address: BoundedVec<u8, 320> = get_email_address(header, to_header_sequence, to_address_sequence, to);

    to_address
}
