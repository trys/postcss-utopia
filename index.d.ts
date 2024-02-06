declare module 'utopia' {
	import { PluginCreator } from 'postcss';

	interface UtopiaOptions {
		/**
		 * Default minimum viewport
		 */
		minWidth?: number;

		/**
		 * Default maximum viewport
		 */
		maxWidth?: number;
	}

	const utopia: PluginCreator<UtopiaOptions>;

	export default utopia;
}
