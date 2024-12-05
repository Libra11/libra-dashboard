/*
 * @Author: Libra
 * @Date: 2024-11-29 16:59:28
 * @LastEditors: Libra
 * @Description:
 */
import type { NextConfig } from "next";
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
