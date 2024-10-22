import fs from 'fs';
import path from 'path';
import { ZKEmailProver } from '../src/prover';
import { generateEmailVerifierInputs, InputGenerationArgs } from '../src/index';

import twitterVerify from '../../examples/x_test/target/x_test.json';
import googleVerify from '../../examples/google_test/target/google_test.json';
import { getXUsername } from '../src/utils';
import { CompiledCircuit } from '@noir-lang/backend_barretenberg';

const emails = {
	x_valid: fs.readFileSync(path.join(__dirname, '../data/x-valid.eml')),
	google_valid: fs.readFileSync(
		path.join(__dirname, '../data/google-valid.eml')
	),
};
``;

// default header/ body lengths to use for input gen
const inputParams: Record<string, InputGenerationArgs> = {
	x_valid: { maxHeadersLength: 576, maxBodyLength: 16384, extractFrom: true },
	google_valid: {
		maxHeadersLength: 576,
		maxBodyLength: 16384,
		extractFrom: true,
		extractTo: true,
	},
};

describe('Social Verify Circuit Unit Tests', () => {
	let twitterProver: ZKEmailProver;
	let googleProver: ZKEmailProver;

	beforeAll(() => {
		//@ts-ignore
		twitterProver = new ZKEmailProver(twitterVerify, 'honk');
		googleProver = new ZKEmailProver(googleVerify as CompiledCircuit, 'honk');
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
			const now = Date.now();
			await twitterProver.simulateWitness(inputs);
			console.log('Time taken: ', (Date.now() - now) / 1000);
		});
		it('Valid Google Email', async () => {
			const i = await generateEmailVerifierInputs(
				emails.google_valid,
				inputParams.google_valid
			);

			let inputs = {
				header: i.header,
				pubkey: i.pubkey,
				signature: i.signature,
				from_header_sequence: i.from_header_sequence!,
				from_address_sequence: i.from_address_sequence!,
				to_header_sequence: i.to_header_sequence!,
				to_address_sequence: i.to_address_sequence!,
			};

			const now = Date.now();

			const res = await googleProver.simulateWitness(inputs);
			console.log('Time taken: ', (Date.now() - now) / 1000);
		});
	});
});
