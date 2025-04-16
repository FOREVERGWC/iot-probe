import styles from './loading.module.css'

export const LoadingIcon: React.FC = () => {
	return <div className={styles.loader}></div>
}

const Loading: React.FC = () => {
	return (
		<div className="flex w-full h-screen items-center justify-center">
			<LoadingIcon />
		</div>
	)
}

export default Loading
