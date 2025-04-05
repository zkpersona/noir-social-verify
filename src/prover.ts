import {
  type BackendOptions,
  type ProofData,
  UltraHonkBackend,
  UltraPlonkBackend,
} from '@aztec/bb.js';
import { type CompiledCircuit, type InputMap, Noir } from '@noir-lang/noir_js';
type InputValue = InputMap[string];

type CircuitOptions = {
  /** @description Whether to produce SNARK friendly proofs */
  recursive: boolean;
};

export type ProvingBackend = {
  type: 'honk' | 'plonk' | 'all';
  options?: BackendOptions;
  circuitOptions?: CircuitOptions;
};

export class ZKEmailProver {
  plonk?: UltraPlonkBackend;
  honk?: UltraHonkBackend;
  noir: Noir;
  provingBackend: ProvingBackend;

  constructor(circuit: CompiledCircuit, provingBackend: ProvingBackend) {
    const acirBytecode = circuit.bytecode;
    if (provingBackend.type === 'plonk' || provingBackend.type === 'all') {
      this.plonk = new UltraPlonkBackend(
        acirBytecode,
        provingBackend.options,
        provingBackend.circuitOptions
      );
    }
    if (provingBackend.type === 'honk' || provingBackend.type === 'all') {
      this.honk = new UltraHonkBackend(
        acirBytecode,
        provingBackend.options,
        provingBackend.circuitOptions
      );
    }
    this.provingBackend = provingBackend;
    this.noir = new Noir(circuit);
  }

  /**
   * Compute the witness for a given input to the circuit without generating a proof
   *
   * @param input - the input that should produce a satisfying witness for the circuit
   * @returns - the witness for the input and the output of the circuit if satisfiable
   */
  async simulateWitness(
    input: InputMap
  ): Promise<{ witness: Uint8Array; returnValue: InputValue }> {
    return await this.noir.execute(input);
  }

  /**
   * Generate a proof of a satisfying input to the circuit using a provided witness
   *
   * @param input - a satisfying witness for the circuit
   * @param provingBackend - optionally provided if the class was initialized with both proving schemes
   * @returns proof of valid execution of the circuit
   */
  async prove(
    witness: Uint8Array,
    provingBackend?: ProvingBackend
  ): Promise<ProofData> {
    const backend = this.getProvingBackend(provingBackend?.type);
    return await backend.generateProof(witness);
  }

  /**
   * Simulate the witness for a given input and generate a proof
   *
   * @param input - the input that should produce a satisfying witness for the circuit
   * @param provingBackend - optionally provided if the class was initialized with both proving schemes
   * @returns proof of valid execution of the circuit
   */
  async fullProve(
    input: InputMap,
    provingBackend?: ProvingBackend
  ): Promise<ProofData> {
    const { witness } = await this.simulateWitness(input);
    return this.prove(witness, provingBackend);
  }

  /**
   * Verify a proof of a satisfying input to the circuit for a given proving scheme
   *
   * @param proof - the proof to verify
   * @param provingBackend - optionally provided if the class was initialized with both proving schemes
   * @returns true if the proof is valid, false otherwise
   */
  async verify(
    proof: ProofData,
    provingBackend?: ProvingBackend
  ): Promise<boolean> {
    const backend = this.getProvingBackend(provingBackend?.type);
    return await backend.verifyProof(proof);
  }

  /**
   * End the prover wasm instance(s) and clean up resources
   */
  async destroy() {
    if (this.plonk) {
      await this.plonk.destroy();
    }
    if (this.honk) {
      await this.honk.destroy();
    }
  }

  private getProvingBackend(backendType?: ProvingBackend['type']) {
    let type: 'plonk' | 'honk';
    if (backendType === 'plonk' || this.provingBackend.type === 'plonk') {
      type = 'plonk';
    } else if (backendType === 'honk' || this.provingBackend.type === 'honk') {
      type = 'honk';
    } else {
      throw new Error(
        'Specify a proving backend from either "plonk" or "honk"'
      );
    }

    let backend: UltraPlonkBackend | UltraHonkBackend;
    if (type === 'plonk' && this.plonk) {
      backend = this.plonk;
    } else if (type === 'honk' && this.honk) {
      backend = this.honk;
    } else {
      throw new Error(`Proving backend ${type} not initialized`);
    }

    return backend;
  }
}
