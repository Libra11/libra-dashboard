/*
 * @Author: Libra
 * @Date: 2024-12-03 09:51:24
 * @LastEditors: Libra
 * @Description:
 */
import { getRequestConfig } from "next-intl/server";
import { locales } from ".";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  try {
    // 验证语言设置
    const locale = await requestLocale;
    const headersList = await headers();
    const currentLocale = headersList.get("X-NEXT-INTL-LOCALE") || locale;

    if (!locales.includes(currentLocale as any)) {
      notFound();
    }

    const messages = (await import(`../locales/${currentLocale}.json`)).default;
    return { messages };
  } catch (error) {
    notFound();
  }
});
