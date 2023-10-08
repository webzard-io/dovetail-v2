interface Window {
  MonacoEnvironment: {
    getWorker: (_: unknown, label: string)=> unknown;
  };
}
