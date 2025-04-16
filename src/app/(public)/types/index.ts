/**
 * 认证页面组件属性接口
 */
interface AuthPageProps {
	/**
	 * 页面标题
	 */
	title: string
	/**
	 * 页面描述文本
	 */
	description: string
	/**
	 * 表单组件
	 */
	Form: React.ComponentType
	/**
	 * 页脚提示文本
	 */
	footerText: string
	/**
	 * 页脚链接配置
	 */
	footerLink: {
		/**
		 * 链接显示文本
		 */
		text: string
		/**
		 * 链接目标路径
		 */
		href: string
	}
}
