const response = {
  send: <T = any>(data: T, props?: { status: number; statusText: string }) =>
    Response.json(data, { ...props }),
  error: <T = string>(message: T, props?: ResponseOptions) =>
    Response.json(message, {
      status: props?.status ?? 500,
      statusText:
        props?.statusText ?? (typeof message === "string" ? message : "Error!"),
    }),
};
export interface ResponseOptions {
  status?: number;
  statusText: string;
}

export default response;

response.send<{ message: string }>({ message: "asdfsdf" });
