use noir_social_verify::x::verify_x;
use noir_social_verify::zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey, Sequence};

pub global MAX_EMAIL_HEADER_LENGTH: u32 = 576;
pub global MAX_EMAIL_BODY_LENGTH: u32 = 16384;
pub global MAX_USERNAME_LENGTH: u32 = 64;

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    body: BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    body_hash_index: u32,
    dkim_header_sequence: Sequence,
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    username: BoundedVec<u8, MAX_USERNAME_LENGTH>
) -> pub BoundedVec<u8, MAX_USERNAME_LENGTH> {
    let res = verify_x(
        header,
        body,
        pubkey,
        signature,
        body_hash_index,
        dkim_header_sequence,
        from_header_sequence,
        from_address_sequence,
        username
    );
    res
}
