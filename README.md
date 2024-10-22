# Noir Social Verify

Noir Social Verify is a library that provides a simple way to verify social accounts by proving the password reset email (or) OAuth Login Emails. This library is built using the [zkemail.nr](https://github.com/zkemail/zkemail.nr). Currently the library provides verification for the following social accounts:

- [x] Google: OAuth Login Email
- [x] X: Password Reset Email with username validation
- [x] GitHub: Password Reset Email
- [x] LinkedIn: Password Reset Email

## Installation

In your `Nargo.toml` file, add the version of this library you would like to install under dependency:

```toml
[dependencies]
noir_social_verify = { tag = "v0.0.1", git = "https://github.com/Envoy-VC/noir_social_verify", directory = "lib" }
```

## Usage

To generate inputs for the verification functions, `@zk-email/zkemail-nr` npm package. Install it by using the following command:

```bash
npm install @zk-email/zkemail-nr
```

Generating Inputs:

```ts
import { generateEmailVerifierInputs } from '@zk-email/zkemail-nr';

const zkEmailInputs = await generateEmailVerifierInputs(emailContent, {
	maxBodyLength: 16384,
	maxHeadersLength: 576,
	extractFrom: true,
});
```

Here are the Input Arguments for all services:

```ts
const inputParams = {
	x: { maxHeadersLength: 576, maxBodyLength: 16384, extractFrom: true },
	google: {
		maxHeadersLength: 576,
		maxBodyLength: 16384,
		extractFrom: true,
		extractTo: true,
	},
	linkedin: {
		maxHeadersLength: 768,
		maxBodyLength: 49152,
		extractFrom: true,
		extractTo: true,
	},
	github: {
		maxHeadersLength: 576,
		maxBodyLength: 49152,
		extractFrom: true,
		extractTo: true,
	},
};
```

Testing emails can be found in [js/data](./js/data/) directory, along with unit tests.

---

## Google Verification

```noir
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
    let email = verify_google(
        header,
        pubkey,
        signature,
        from_header_sequence,
        from_address_sequence,
        to_header_sequence,
        to_address_sequence
    );
    email
}

```

---

## X Verification

```noir
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
    let extracted_username = verify_x(
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
    extracted_username
}
```

---

## GitHub Verification

```noir
use noir_social_verify::github::verify_github;
use noir_social_verify::zkemail::{KEY_LIMBS_1024, dkim::RSAPubkey, Sequence};

pub global MAX_EMAIL_HEADER_LENGTH: u32 = 576;

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_1024>,
    signature: [Field; KEY_LIMBS_1024],
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    to_header_sequence: Sequence,
    to_address_sequence: Sequence
) -> pub BoundedVec<u8, 320> {
    let email = verify_github(
        header,
        pubkey,
        signature,
        from_header_sequence,
        from_address_sequence,
        to_header_sequence,
        to_address_sequence
    );
    email
}
```

> **Note**: Github Verification uses KEY_LIMBS_1024 for RSA Public Key.

---

## LinkedIn Verification

```noir
use noir_social_verify::linkedin::verify_linkedin;
use noir_social_verify::zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey, Sequence};

pub global MAX_EMAIL_HEADER_LENGTH: u32 = 768;

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    to_header_sequence: Sequence,
    to_address_sequence: Sequence
) -> pub BoundedVec<u8, 320> {
    let res = verify_linkedin(
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
```

---

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/Envoy-VC/noir_social_verify.git
```

Compile all the circuits by running the following command:

```bash
bash ./scripts/compile.sh
```

To run the tests, use the following command:

```bash
cd ./js && bun test
```

---
