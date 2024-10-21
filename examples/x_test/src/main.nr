use noir_social_verify::x::verify_x;

global EMAIL_HEADER_LENGTH: u32 = 576;
global EMAIL_BODY_LENGTH: u32 = 16384;

fn main(
    header: [u8; EMAIL_HEADER_LENGTH],
    header_length: u32,
    body_hash_index: u32,
    body: [u8; EMAIL_BODY_LENGTH],
    body_length: u32,
    pubkey: [Field; 18],
    pubkey_redc: [Field; 18],
    signature: [Field; 18]
) -> pub bool {
    let res: bool = verify_x(
        header,
        header_length,
        body_hash_index,
        body,
        body_length,
        pubkey,
        pubkey_redc,
        signature
    );

    assert(res);

    res
}
