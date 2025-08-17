import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

describe("Economic Counter Tests", () => {
  beforeEach(() => {
    simnet.setEpoch("3.0");
  });

  describe("Basic Functionality", () => {
    it("should create a new counter", () => {
      const { result } = simnet.callPublicFn("economiccounter", "create-counter", [], address1);
      expect(result).toBeOk(Cl.uint(1));
    });

    it("should get counter details", () => {
      simnet.callPublicFn("economiccounter", "create-counter", [], address1);
      
      const { result } = simnet.callReadOnlyFn("economiccounter", "get-counter", [Cl.uint(1)], address1);
      expect(result).toBeTruthy();
    });

    it("should increment counter", () => {
      simnet.callPublicFn("economiccounter", "create-counter", [], address1);
      
      const { result } = simnet.callPublicFn("economiccounter", "increment-counter", [Cl.uint(1)], address1);
      expect(result).toBeOk(Cl.uint(1));
    });

    it("should calculate increment costs correctly", () => {
      const { result: cost0 } = simnet.callReadOnlyFn("economiccounter", "calculate-increment-cost", [Cl.uint(0)], address1);
      const { result: cost1 } = simnet.callReadOnlyFn("economiccounter", "calculate-increment-cost", [Cl.uint(1)], address1);
      const { result: cost2 } = simnet.callReadOnlyFn("economiccounter", "calculate-increment-cost", [Cl.uint(2)], address1);
      
      expect(cost0).toEqual(Cl.uint(1000000)); // 1 STX
      expect(cost1).toEqual(Cl.uint(2000000)); // 2 STX  
      expect(cost2).toEqual(Cl.uint(5000000)); // 5 STX
    });

    it("should only allow owner to increment", () => {
      simnet.callPublicFn("economiccounter", "create-counter", [], address1);
      
      const { result } = simnet.callPublicFn("economiccounter", "increment-counter", [Cl.uint(1)], address2);
      expect(result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED
    });

    it("should list counter for sale", () => {
      simnet.callPublicFn("economiccounter", "create-counter", [], address1);
      
      const { result } = simnet.callPublicFn("economiccounter", "list-counter-for-sale", [Cl.uint(1), Cl.uint(5000000)], address1);
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should get next milestone", () => {
      const { result: next5 } = simnet.callReadOnlyFn("economiccounter", "get-next-milestone", [Cl.uint(5)], address1);
      const { result: next15 } = simnet.callReadOnlyFn("economiccounter", "get-next-milestone", [Cl.uint(15)], address1);
      
      expect(next5).toEqual(Cl.uint(10));
      expect(next15).toEqual(Cl.uint(50));
    });

    it("should get contract balance", () => {
      const { result } = simnet.callReadOnlyFn("economiccounter", "get-contract-balance", [], address1);
      expect(result).toEqual(Cl.uint(0));
    });
  });
});