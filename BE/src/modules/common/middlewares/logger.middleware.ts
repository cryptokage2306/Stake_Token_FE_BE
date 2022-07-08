import { RequestHandler } from 'express';
import { parse } from 'url';

export const loggerMiddleware: RequestHandler = (
  request: {
    url?: any;
    headers?: any;
    method?: any;
    query?: any;
    params?: any;
  },
  response: any,
  next: () => void,
) => {
  const { headers, method, query, params } = request;
  const date = new Date().toJSON();
  const time = date.replace('T', ' ').slice(0, -5);
  const route = parse(request.url).path;
  console.log(`${time} ~ ${method} ${route || '/'}`); // tslint:disable-line no-console
  next();
};