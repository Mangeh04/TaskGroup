import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	turbopack: {
		root: path.resolve(__dirname, "../../"),
	},
	productionBrowserSourceMaps: true, // esto desactivarlo
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
