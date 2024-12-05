/*
 * @Author: Libra
 * @Date: 2024-12-02 14:35:01
 * @LastEditors: Libra
 * @Description: 
 */
type FetchOptions = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  headers?: Record<string, string>;
};

export async function fetchApi<T>({
  url,
  method = "GET",
  body,
  headers = {},
}: FetchOptions): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "请求失败");
  }

  return data;
}
