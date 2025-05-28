interface Window {
  MonacoEnvironment: {
    getWorker: (_: unknown, label: string) => unknown;
  };
  _MonacoSchemaMap: Map<string, {
    uri: string;
    fileMatch: string[];
    schema: {
      oneOf: JSONSchema7[];
    };
  }>;
}
