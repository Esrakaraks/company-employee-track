declare namespace google {
    namespace accounts {
      namespace id {
        function initialize(params: {
          client_id: string;
          callback: (response: any) => void;
        }): void;
        function prompt(): void;
      }
    }
  }
  