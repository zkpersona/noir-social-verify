import fs from 'fs';
import path from 'path';
import { ZKEmailProver } from '../src/prover';
import { generateEmailVerifierInputs } from '../src/index';

import twitterVerify from '../../examples/x_test/target/x_test.json';

const emails = {
	x_valid: fs.readFileSync(path.join(__dirname, '../data/x-valid.eml')),
};
``;

// default header/ body lengths to use for input gen
const inputParams = {
	x_valid: { maxHeadersLength: 576, maxBodyLength: 16384 },
};

describe('Social Verify Circuit Unit Tests', () => {
	let twitterProver: ZKEmailProver;

	beforeAll(() => {
		//@ts-ignore
		twitterProver = new ZKEmailProver(twitterVerify, 'all');
	});

	afterAll(async () => {
		await twitterProver.destroy();
	});

	describe('Successful Cases', () => {
		it('Valid Twitter Email', async () => {
			const i = await generateEmailVerifierInputs(
				emails.x_valid,
				inputParams.x_valid
			);

			const inputs = {
				header: i.header.storage,
				header_length: i.header.len,
				body_hash_index: i.body_hash_index!,
				body: i.body?.storage!,
				body_length: i.body?.len!,
				pubkey: i.pubkey.modulus,
				pubkey_redc: i.pubkey.redc,
				signature: i.signature,
			};

			const res = await twitterProver.simulateWitness(inputs);
			expect(res.returnValue === true);
		});
	});
});
