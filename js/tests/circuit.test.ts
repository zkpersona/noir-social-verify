import fs from 'fs';
import path from 'path';
import { ZKEmailProver } from '../src/prover';
import { generateEmailVerifierInputs } from '../src/index';

import twitterVerify from '../../examples/x_test/target/x_test.json';
import { getXUsername } from '../src/utils';

const emails = {
	x_valid: fs.readFileSync(path.join(__dirname, '../data/x-valid.eml')),
};
``;

// default header/ body lengths to use for input gen
const inputParams = {
	x_valid: { maxHeadersLength: 576, maxBodyLength: 16384, extractFrom: true },
};

describe('Social Verify Circuit Unit Tests', () => {
	let twitterProver: ZKEmailProver;

	beforeAll(() => {
		//@ts-ignore
		twitterProver = new ZKEmailProver(twitterVerify, 'honk');
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

			let inputs = {
				header: i.header,
				pubkey: i.pubkey,
				signature: i.signature,
				dkim_header_sequence: i.dkim_header_sequence,
				body: i.body!,
				body_hash_index: i.body_hash_index!,
				from_header_sequence: i.from_header_sequence!,
				from_address_sequence: i.from_address_sequence!,
				username: getXUsername('@dummy_testing_'),
			};

			await twitterProver.simulateWitness(inputs);
		});
	});
});
