const response = {
  send: <T = any>(data: T, props?: ResponseOptions) =>
    Response.json(data, props),
  error: <T = string>(message: T, props?: ResponseOptions) => {
    return Response.json(message, {
      status: props?.status ?? 500,
      statusText: props?.statusText ?? "Error!",
      headers: {},
    });
  },
};

export interface ResponseOptions {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
}

export default response;
