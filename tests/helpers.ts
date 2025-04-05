import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import json2toml from 'json2toml';
import type { CircuitInputMap, CircuitType } from '../src/types';

export const exportCircuitInputs = <T extends CircuitType>(
  circuitType: T,
  inputs: CircuitInputMap[T]
) => {
  if (circuitType === 'google_example' || circuitType === 'x_example') {
    const json = {
      header: inputs.header,
      pubkey: inputs.pubkey,
      signature: inputs.signature,
      from_header_sequence: inputs.from_header_sequence,
      from_address_sequence: inputs.from_address_sequence,
      to_header_sequence: inputs.to_header_sequence,
      to_address_sequence: inputs.to_address_sequence,
    };

    const toml = json2toml(json, { indent: 0, newlineAfterSection: true });
    writeFileSync(
      join(__dirname, `../examples/${circuitType}/Prover.toml`),
      toml
    );
  }
};
