pub struct VerifiedOutputs {
    pub pub_key_hash: Field,
    pub email_nullifier: Field,
    pub to_address: BoundedVec<u8, 320>,
}
