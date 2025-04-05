import {
  type InputGenerationArgs,
  generateEmailVerifierInputs,
} from '@zk-email/zkemail-nr';
import { type ProvingBackend, ZKEmailProver } from '../src';

import type { CompiledCircuit } from '@noir-lang/noir_js';
import type { CircuitInputMap, CircuitType } from './types';

export const circuitParams: Record<CircuitType, InputGenerationArgs> = {
  google_example: {
    maxHeadersLength: 576,
    maxBodyLength: 16384,
    extractFrom: true,
    extractTo: true,
  },
  x_example: {
    maxHeadersLength: 576,
    maxBodyLength: 16384,
    extractFrom: true,
    extractTo: true,
  },
};

export const createProver = (
  circuit: CompiledCircuit,
  backend: ProvingBackend
) => {
  const prover = new ZKEmailProver(circuit, backend);
  return prover;
};

export const generateCircuitInputs = async <T extends CircuitType>(
  emailContent: Buffer | string,
  circuitType: T
) => {
  const inputs = await generateEmailVerifierInputs(
    emailContent,
    circuitParams[circuitType]
  );

  return inputs as CircuitInputMap[T];
};
