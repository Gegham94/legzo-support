export type ErrorType<E> = {
  [P in keyof E]: string[];
};

export type RequestResult<L> = {
  success: boolean;
  data?: L;
  errors?: ErrorType<L>;
  message?: string;
  total?: number;
};

export type Performance = {
  past_7_days: number;
  satisfaction: number;
  satisfaction_past_7_days: number;
  total: number;
};
