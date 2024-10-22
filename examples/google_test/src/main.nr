use noir_social_verify::google::verify_google;
use noir_social_verify::zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey, Sequence};

pub global MAX_EMAIL_HEADER_LENGTH: u32 = 576;

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    to_header_sequence: Sequence,
    to_address_sequence: Sequence
) -> pub BoundedVec<u8, 320> {
    let res = verify_google(
        header,
        pubkey,
        signature,
        from_header_sequence,
        from_address_sequence,
        to_header_sequence,
        to_address_sequence
    );
    res
}
