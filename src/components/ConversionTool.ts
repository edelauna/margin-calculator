// src/components/ConversionTool.ts
import type Alpine from "alpinejs";

interface ConverstionToolInterface {
    scenario: 'financing' | 'margin'
    toggleScenario: () => void;
}

export default function ConversionTool(): Alpine.AlpineComponent<ConverstionToolInterface> {
  return {
    get scenario() {
      return this.$store.app.scenario;
    },
    toggleScenario() {
      const newScenario = this.$store.app.scenario === 'financing' ? 'margin' : 'financing';
      this.$store.app.setScenario(newScenario); // Update the central store
    },
  };
}